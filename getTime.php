<?php

// Constants
$ini = array (
  'timestamp_filename' => "video_start.txt"
);

if ($_GET['a']) {
  switch ($_GET['a']) {
    case 'getOffsetTime': $offsetTime = getOffsetTime(); sendResponse(array("offsetTime" => $offsetTime)); break;
    case 'setStart': setStart(); break;
  }
}
exit;

// return the elapsed time number of seconds the start of playback
function getOffsetTime() {
  global $ini;
  $time_start = file_get_contents($ini['timestamp_filename']);
  if (! $time_start) {
    // Kill playback!
    return -1;
  }
  $elapsed = time() - $time_start;
  return $elapsed;
}

function sendResponse($arr) {
  echo json_encode($arr);
}

// set file with timestamp start timte
function setStart() {
  global $ini;
  $t = time();
  file_put_contents($ini['timestamp_filename'], $t);
}

?>
