<?php
// 某个校区的班级列表
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();

	$arr = $req->params;
	//$consultID = $arr->consultID;//班级所属的咨询师
	$schoolID = $arr->schoolID;//班级所属的学校
	$schoolsubID = $arr->schoolsubID;//班级所属的分校区

	// left join 教师，因为可能还没有制定班级教师
	$query = " SELECT a.*,b.teacherName 
		From `ghjy_class` a 
		Left Join `ghjy_teacher` b On a.teacherID=b.teacherID 
		Where a.schoolsubID = $schoolsubID ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readClassList by schoolsub" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取班级classes成功";
	$res->data = $query_array;

	echo $_GET['callback']."(".$res->to_json().")";
?>