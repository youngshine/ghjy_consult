<?php
/*log 选择知识点的教学教师
* 课程（学习知识点）排课
endlog */

header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$studentstudyID = $_REQUEST['studentstudyID'];
$teacherID = $_REQUEST['teacherID'];
$weekday = addslashes($_REQUEST['weekday']);
$timespan = addslashes($_REQUEST['timespan']);
$note = addslashes($_REQUEST['note']);

$query = "UPDATE `ghjy_student-study` SET  
	teach_weekday = '$weekday',
	teach_timespan = '$timespan',
	note = '$note',
	teacherID = $teacherID 
	Where studentstudyID = $studentstudyID ";

$result = mysql_query($query) 
	or die("Invalid query: updateStudy by Kcb" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "排课成功"
));

?>
