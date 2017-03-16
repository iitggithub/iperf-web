<?php

$ppattern = '/500[1-5]/';

$prog    = 'docker run -it iitgdocker/iperf:2.0.9'
$params  = (!empty($_REQUEST['params'])) ? $_REQUEST['params'] : NULL;
$target  = (!empty($_REQUEST['target'])) ? $_REQUEST['target'];
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
  <h1>Iperf Web Interface</h1>
  <div>
    <p>Iperf server testing form</p>
  </div>						
  <div id="form_container">
    <form id="myform"  method="post" action="?<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
      <ul >
        <li >
          <div>
            <a href="#">Iperf Server<p>The DNS name or IP Address of the Iperf server you're connecting to</p></a>&nbsp;
            <input name="target" class="element text small" type="text" maxlength="255" value=""/>
          </div>
	</li>
        <li >
          <div>
            <a href="#">Port <p>The type of iperf test to be performed against the iperf server.</p></a>&nbsp;
            <select name="port"> 
              <option value="5001" selected="selected">5001</option>
              <option value="5002" >5002</option>
              <option value="5003" >5003</option>
              <option value="5004" >5004</option>
              <option value="5005" >5005</option>
            </select>
          </div>
        </li>
        <li >
          <div>
            <a href="#">Connection Type <p>The type of iperf test to be performed against the iperf server.</p></a>&nbsp;
            <select name="type"> 
              <option value="tcp" selected="selected">TCP</option>
              <option value="udp" >UDP</option>
            </select>
          </div>
        </li>
        <li >
          <div>
            <a href="#">Parameters <p>The type of iperf test to be performed against the iperf server.</p></a>&nbsp;
            <input name="params" type="text" maxlength="255" value="-d -m"/>
          </div>
        </li>	
        <li >
          <input type="submit" name="submit" value="Submit" />
        </li>
      </ul>
    </form>	
  </div>
</body>
</html>
