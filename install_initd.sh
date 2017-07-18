#! /bin/bash

sudo yum -y install docker
sudo systemctl start docker
sudo systemctl enable docker
sudo curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` >/usr/local/bin/docker-compose
sudo chmod 755 /usr/local/bin/docker-compose
for i in tcp udp; do for p in `seq 5001 5005`; do mkdir -p /data/iperf-server-${i}-${p}; done; done
for i in tcp udp; do for p in `seq 5001 5005`; do cat | tee /data/iperf-server-${i}-${p}/docker-compose.yml <<EOF
x:
  image: iitgdocker/iperf-server:2.0.9
  ports:
    - "${p}:${p}/${i}"
EOF
done
done
echo "for i in tcp udp; do for p in `seq 5001 5005`; do cd /data/iperf-server-${i}-${p} && /usr/local/bin/docker-compose up -d; done; done" >>/etc/rc.local
mkdir /data/iperf-web
cat | sudo tee /data/iperf-web/docker-compose.yml <<EOF
server:
  image: iitgdocker/iperf-web:latest
  ports:
    - "80:80"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
EOF
echo "cd /data/iperf-web && /usr/local/bin/docker-compose up -d" >>/etc/rc.local
