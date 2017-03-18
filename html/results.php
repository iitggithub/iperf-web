<?php

$port_regex = '/[0-9]+/';

$docker  = false;
$prog    = (!empty($_REQUEST['prog'])) ? $_REQUEST['prog'] : NULL;
$version = (!empty($_REQUEST['version'])) ? $_REQUEST['version'] : 2;
$params  = (!empty($_REQUEST['params'])) ? escapeshellcmd($_REQUEST['params']) : NULL;
$target  = (!empty($_REQUEST['target'])) ? escapeshellcmd($_REQUEST['target']) : NULL;
$port    = (preg_match($port_regex,$_REQUEST['port'])) ? $_REQUEST['port'] : 5001;
$typeSW  = ($_REQUEST['type']=='udp') ? ' -u ' : ' ';

$descriptorspec = array(
   0 => array("pipe", "r"),   // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),   // stdout is a pipe that the child will write to
   2 => array("pipe", "w")    // stderr is a pipe that the child will write to
);

switch ($prog) {
  case 'Iperf':
    if ($version == 2) {
      $prog = 'iperf';
    } else {
      $prog = 'iperf3';
    }
  break;
  default:
    $docker = true;
    $prog   = 'sudo /usr/local/bin/run20.py';
  break;
}

if ($docker) {
  $args    = $typeSW . '-c ' . $target . ' -p ' . $port . ' ' . $params;
  $command = $prog . ' --commands="' . $args . '"';
} else {
  $args    = $typeSW . '-c ' . $target . ' -p ' . $port . ' ' . $params;
  $command = $prog . $args;
}

flush();
$proc = proc_open($command, $descriptorspec, $pipes, realpath('./'), array());
echo "<pre>";
if (is_resource($proc)) {
    while ($s = fgets($pipes[1])) {
        print $s;
        flush();
    }
}

echo "</pre>";

proc_close($proc);

?>
