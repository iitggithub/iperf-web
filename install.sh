#! /bin/bash

SYSTEMCTL="`which systemctl`"
IPERF_VERSION="2.0.9"

if [ -n "`which yum`" ]
  then
  sudo yum -y install docker
elif [ -n "`which apt-get`" ]
  then
  sudo apt-get update
  sudo apt-get install docker
fi

if [ ! -f "/usr/local/bin/docker-compose" ]
  then
  curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` -o docker-compose
  sudo mv docker-compose /usr/local/bin/docker-compose
  sudo chmod 755 /usr/local/bin/docker-compose
fi

if [ ! -d "/data" ]
  then
  sudo mkdir /data
  sudo chown `whoami` /data
fi

for i in tcp udp
  do
  for p in `seq 5001 5005`
    do
    mkdir -p /data/iperf-server-${i}-${p}
    curl -o /data/iperf-server-${i}-${p}/docker-compose.yml https://raw.githubusercontent.com/iitggithub/iperf-server/master/docker-compose.yml.single
    sed -i -e "s/    - \".*/    - \"${p}:${p}\/${i}\"/" \
           -e "s/latest/${IPERF_VERSION}/" /data/iperf-server-${i}-${p}/docker-compose.yml
  done
done

mkdir /data/iperf-web
curl -o /data/iperf-web/docker-compose.yml https://raw.githubusercontent.com/iitggithub/iperf-web/master/docker-compose.yml

if [ -n "${SYSTEMCTL}" ]
  then
  sudo ${SYSTEMCTL} start docker
  sudo ${SYSTEMCTL} enable docker
  for i in tcp udp
    do
    for p in `seq 5001 5005`
      do
      sudo curl -o /usr/lib/systemd/system/docker-iperf-server-${i}-${p}.service https://raw.githubusercontent.com/iitggithub/iperf-server/${IPERF_VERSION}/docker-iperf-server.service
      sudo sed -i "s/iperf-server/iperf-server-${i}-${p}/" /usr/lib/systemd/system/docker-iperf-server-${i}-${p}.service
    done
  done

  sudo ${SYSTEMCTL} daemon-reload

  for i in tcp udp
    do
    for p in `seq 5001 5005`
      do
      sudo ${SYSTEMCTL} start docker-iperf-server-${i}-${p}
      sudo ${SYSTEMCTL} enable docker-iperf-server-${i}-${p}
    done
  done

  curl -o /usr/lib/systemd/system/docker-iperf-web.service https://raw.githubusercontent.com/iitggithub/iperf-web/master/docker-iperf-web.service
  sudo ${SYSTEMCTL} start docker-iperf-web
  sudo ${SYSTEMCTL} enable docker-iperf-web
else
  sudo /etc/init.d/docker start
  sudo chkconfig docker on
  echo "for i in tcp udp; do for p in `seq 5001 5005`; do cd /data/iperf-server-${i}-${p} && /usr/local/bin/docker-compose up -d; done; done" >>/etc/rc.local
  echo "cd /data/iperf-web && /usr/local/bin/docker-compose up -d" >>/etc/rc.local
  for i in tcp udp; do for p in `seq 5001 5005`; do cd /data/iperf-server-${i}-${p} && sudo /usr/local/bin/docker-compose up -d; done; done
  cd /data/iperf-web && sudo /usr/local/bin/docker-compose up -d
fi
