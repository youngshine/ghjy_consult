<?php
/*
 * 缴费（大小班、一对一课程）
 * 先主表，然后循环插入子表记录
*/
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Origin: *'); // 跨域问题
//header('Access-Control-Allow-Headers: X-Requested-With');

require_once('db/database_connection.php');

$accntType = addslashes($_REQUEST['accntType']);
$accntDate = $_REQUEST['accntDate'];
$studentID = $_REQUEST['studentID'];
$amount_ys = $_REQUEST['amount_ys'];
$amount = $_REQUEST['amount'];
$note = addslashes($_REQUEST['note']);
$payment = addslashes($_REQUEST['payment']);

$consultID = $_REQUEST['consultID']; //哪个咨询师操作缴费
$schoolID = $_REQUEST['schoolID'];

$arrList = $_REQUEST['arrList']; //报读的多个大小班
$arrList = json_decode($arrList); //转换成数组 decode($a,true)
//$arrClasses = explode(',',$arrClasses);
//echo is_array($arrClasses);

// 1. 收费主记录（大小班，一对一）	
$sql = "INSERT INTO `ghjy_accnt` 
	(accntType,accntDate,amount_ys,amount,note,payment,studentID,consultID,schoolID) 
	VALUES 
	('$accntType','$accntDate',$amount_ys,$amount,
		'$note','$payment',$studentID,$consultID,$schoolID)";
$result = mysql_query($sql) 
	or die("Invalid query: createAccntAndDetail" . mysql_error());

// 返回最新插入收费主记录id
$id = mysql_insert_id(); 

//$arrList = json_decode($arrList); //转换成数组 decode($a,true)
// 2.批量循环添加, not is_array
//if(is_object($arrList)){  
foreach($arrList as $rec){
	$title = $rec->title;
	$kclistID = $rec->kclistID;
	//$pricelistID = $rec->pricelistID;
	$unitprice = $rec->unitprice;
	$hour = $rec->hour;
	$amount = $rec->amount;
	$sql = "INSERT INTO `ghjy_accnt_detail`
		(accntID,title,kclistID,unitprice,hour,amount) 
		VALUES
		($id, '$title', $kclistID,$unitprice, $hour, $amount)";
	$result = mysql_query($sql) 
		or die("Invalid query: createAccntDetail" . mysql_error());
}
//}

echo json_encode(array(
    "success" => false,
    "message" => "缴费成功",
	"data"    =>  array("accntID" => $id)
));

?>