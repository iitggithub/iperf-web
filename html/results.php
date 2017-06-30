<?php

# Process the iperf-web form, spawn either a docker container 
# or just run the iperf command on the localhost. print output
# to stdout.

$type    = (!empty($_REQUEST['type'])) ? $_REQUEST['type'] : 0;

if ($type) {

  $prog    = (!empty($_REQUEST['prog'])) ? $_REQUEST['prog'] : 'Ping';
  $params  = (!empty($_REQUEST['params'])) ? escapeshellcmd($_REQUEST['params']) : NULL;

  if ($prog == 'Ping') {
    $prog    = '/bin/ping';
    $command = $prog . ' ' . $params . ' 2>&1';
  } else {
    $prog    = '/bin/traceroute';
    $command = $prog . ' ' . $params . ' 2>&1';
  }

} else {
  $port_regex = '/[0-9]+/';

  $prog    = (!empty($_REQUEST['prog'])) ? $_REQUEST['prog'] : 'Docker';
  $version = (!empty($_REQUEST['version'])) ? $_REQUEST['version'] : 2;
  $params  = (!empty($_REQUEST['params'])) ? escapeshellcmd($_REQUEST['params']) : NULL;
  $target  = (!empty($_REQUEST['target'])) ? escapeshellcmd($_REQUEST['target']) : NULL;
  $port    = (preg_match($port_regex,$_REQUEST['port'])) ? $_REQUEST['port'] : 5001;
  $typeSW  = ($_REQUEST['type']=='udp') ? ' -u ' : ' ';

  if ($prog == 'Docker') {
    $prog    = 'sudo /usr/local/bin/run20.py';
    $args    = ($version == 2) ? '' : '-t 3.1.3';
    $args   .= $typeSW . '-c ' . $target . ' -p ' . $port . ' ' . $params;
    $command = $prog . ' --commands="' . $args . '"';
  } else {
    $prog    = ($version == 2) ? 'iperf' : 'iperf3';
    $args    = $typeSW . '-c ' . $target . ' -p ' . $port . ' ' . $params;
    $command = $prog . $args;
  } 
}

// Not sure where i stole this code from... Once i remember, i'll link to it here

$descriptorspec = array(
   0 => array("pipe", "r"),   // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),   // stdout is a pipe that the child will write to
   2 => array("pipe", "w")    // stderr is a pipe that the child will write to
);

flush();
$proc = proc_open($command, $descriptorspec, $pipes, realpath('./'), array());
if (is_resource($proc)) {
    while ($s = fgets($pipes[1])) {
        print $s;
        flush();
    }
}

proc_close($proc);

?>
