<?php

$port_regex = '/[0-9]+/';

$docker  = false;
$prog    = (!empty($_REQUEST['prog'])) ? $_REQUEST['prog'] : NULL;
$version = (!empty($_REQUEST['version'])) ? $_REQUEST['version'] : 2;
$params  = (!empty($_REQUEST['params'])) ? escapeshellcmd($_REQUEST['params']) : NULL;
$target  = (!empty($_REQUEST['target'])) ? escapeshellcmd($_REQUEST['target']) : NULL;
$port    = (preg_match($port_regex,$_REQUEST['port'])) ? $_REQUEST['port'] : 5001;
$typeSW  = ($_REQUEST['type']=='udp') ? ' -u ' : ' ';
$logType = (empty($type)) ? 'tcp' : 'udp';
$logFile = '/var/www/html/results/' . $logType . '_' . $port . '.log';

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
    $prog   = 'sudo /usr/local/bin/run-container.py';
  break;
}

if ($docker) {
  $args    = $typeSW . '-c ' . $target . ' -p ' . $port . ' -o ' . $logFile . ' ' . $params;
  $command = $prog . ' --commands="' . $args . '"';
} else {
  $args    = $typeSW . '-c ' . $target . ' -p ' . $port . ' -o ' . $logFile . ' ' . $params;
  $command = $prog . $args;
}

proc_close(proc_open("$command", Array (), $foo));

?>
