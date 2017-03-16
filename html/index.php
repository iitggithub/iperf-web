<?php

$ppattern = '/500[1-5]/';

$prog    = (!empty($_REQUEST['prog'])) ? $_REQUEST['prog'] : 'docker run -it iitgdocker/iperf:2.0.9';
$params  = (!empty($_REQUEST['params'])) ? $_REQUEST['params'] : NULL;
$target  = (!empty($_REQUEST['target'])) ? $_REQUEST['target'] : NULL;
$port    = (preg_match($ppattern,$_REQUEST['port'])) ? $_REQUEST['port'] : 5001;
$type    = ($_REQUEST['type']=='udp') ? ' -u ' : '';
$logType = ($type=='udp') ? 'udp' : 'tcp';
$logFile = 'results/' . $logType . '_' . $port . '.log';

if ($params) {

  $command = $prog . ' -c ' . $target . $type . ' ' . $params . ' --output ' . $logFile . ' &';
  proc_close(proc_open("$command", Array (), $foo));

  echo 'DONE!';

}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Iperf Web</title>
  <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
  <img id="logo" src="images/logo.png">
  <h1>Iperf Speed Testing Web Interface</h1>
  <div id="form_container">
    <form id="myform"  method="post" action="?<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
      <p>
        <div class="tooltip">
          Iperf Command <span class="tooltiptext">Either the path to the iperf binary or docker run command</span>
        </div>
        <div>
          <input name="prog" type="text" size="30" maxlength="255" value="docker run -it iitgdocker/iperf:2.0.9"/>
        </div>
      </p>
      <p>
        <div class="tooltip">
          Iperf Server <span class="tooltiptext">The DNS name or IP Address of the Iperf server you're connecting to</span>
        </div>
        <div>
          <input name="target" type="text" maxlength="255" value=""/>
        </div>
      </p>
      <p>
        <div class="tooltip">
          Port <span class="tooltiptext">The type of iperf test to be performed against the iperf server</span>
        </div>
        <div>
          <select name="port">
            <option value="5001" selected="selected">5001</option>
            <option value="5002" >5002</option>
            <option value="5003" >5003</option>
            <option value="5004" >5004</option>
            <option value="5005" >5005</option>
          </select>
        </div>
      </p>
      <p>
        <div class="tooltip">
          Connection Type <span class="tooltiptext">The type of iperf test to be performed against the iperf server. Prior to iperf3, the order of the command line args mattered.</span>
        </div>
        <div>
          <select name="type">
            <option value="tcp" selected="selected">TCP</option>
            <option value="udp" >UDP</option>
          </select>
        </div>
      </p>
      <p>
        <div class="tooltip">
          Parameters<span class="tooltiptext">command line arguments to be passed to the iperf command</span>
        </div>
        <div>
          <input name="params" type="text" maxlength="255" value="-d -m"/>
        </div>
      </p>
      <p>
        <div>
          <input type="submit" name="submit" value="Submit" />
      </p>
    </form>
    <p>
    Iperf 2 Documentation: <a href="https://iperf.fr/iperf-doc.php#2doc" target="_new">iPerf 2</a>
    </p>
    <p>
    Iperf 3 Documentation: <a href="https://iperf.fr/iperf-doc.php#3doc" target="_new">iPerf 3</a>
    </p>
  </div>
</body>
</html>
