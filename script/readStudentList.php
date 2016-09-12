<?php
/*
  * 读取某个校区咨询师的报名学生?? 全校所有学生？某个分校所有学生，方便16-09-09
  * 来自公众号的学生，没有归属咨询师怎么办？
*/
	require_once 'db/response.php';
	require_once 'db/request.php';
	require_once('db/database_connection.php');

	$req = new Request(array());
	$res = new Response();
	
	$arr = $req->params;

	$consultID = $arr->consultID;
	$schoolID = $arr->schoolID;
	$schoolsubID = $arr->schoolsubID;

	$query = "SELECT * From `ghjy_student`  
		Where schoolsubID=$schoolsubID 
		Order By created Desc ";
    
    $result = mysql_query($query) 
		or die("Invalid query: readStudentListByConsult" . mysql_error());

	$query_array = array();
	$i = 0;
	//Iterate all Select
	while($row = mysql_fetch_array($result))
	{
		array_push($query_array,$row);
		$i++;
	}
		
	$res->success = true;
	$res->message = "读取报名学生student成功";
	$res->data = $query_array;


	echo $_GET['callback']."(".$res->to_json().")";
	
?>