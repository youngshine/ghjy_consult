<?php
/*
 * 大小班级添加学生，非一对一
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$studentID = $_REQUEST['studentID'];
$classID = $_REQUEST['classID'];

$sql = "INSERT INTO `ghjy_class_student` (studentID,classID) 
	VALUES($studentID,$classID)";
$result = mysql_query($sql) 
	or die("Invalid query: create class student" . mysql_error());
	
if($result){
	$id = mysql_insert_id(); //返回刚插入的id
	echo json_encode(array(
        "success" => true,
        "message" => "班级加入学生成功",
		"id"      => $id
    ));
}else{
	echo json_encode(array(
        "success" => false,
        "message" => "班级加入学生失败"
    ));
}

?>
