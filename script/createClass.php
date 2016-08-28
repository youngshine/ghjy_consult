<?php
/*
 * 咨询师新增班级（属于某个分校区）
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$title = addslashes($_REQUEST['title']);
$kclistID = $_REQUEST['kclistID']; //隶属某个课程
$beginDate = $_REQUEST['beginDate'];
$persons = $_REQUEST['persons'];
$teacherID = $_REQUEST['teacherID'];
$consultID = $_REQUEST['consultID']; //所属咨询师，分校区

// 上课周期列表，数组字符串转为json对象
$timely_list = $_REQUEST['timely_list'];
//$timely_list = json_decode($timely_list); //转换成数组 decode($a,true)

$query = "INSERT INTO `ghjy_class` 
	(title,kclistID,beginDate,persons,timely_list,teacherID,consultID) 
	VALUES
	('$title',$kclistID,'$beginDate',$persons,'$timely_list',$teacherID,$consultID)";
$result = mysql_query($query) 
	or die("Invalid query: createClass" . mysql_error());

echo json_encode(array(
    "success" => true,
    "message" => "创建班级成功",
	"data"    =>  array("classID" => $id)
));

?>
