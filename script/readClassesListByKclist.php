<?php
// 某个课程开办的班级（可能多个，上课时间也可能不同）
require_once 'db/response.php';
require_once 'db/request.php';
require_once('db/database_connection.php');

$req = new Request(array());
$res = new Response();

$arr = $req->params;

$kclistID = $arr->kclistID;

$query = " SELECT a.*,b.fullname 
	From `ghjy_class` a 
	Join `ghjy_school_sub` b On a.schoolsubID=b.schoolsubID 
	Where a.kclistID = $kclistID ";

$result = mysql_query($query) 
	or die("Invalid query: readClassList by kclist" . mysql_error());

$query_array = array();
$i = 0;
//Iterate all Select
while($row = mysql_fetch_array($result))
{
	array_push($query_array,$row);
	$i++;
}
	
$res->success = true;
$res->message = "读取某个课程的班级classes成功";
$res->data = $query_array;

echo $_GET['callback']."(".$res->to_json().")";

?>