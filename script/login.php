<?php 

require_once('db/request.php');
require_once('db/response.php');
require_once('db/database_connection.php');
//require_once ('../lib/global_function.php');

$req = new Request(array());
$res = new Response();

//下面两行代码是为了对登录传过来的数据进行特殊处理
//$dataJson = str_replace("\\","",$_REQUEST['data']);//去json字符串中的反斜线		
//$request->params = (isset($_REQUEST['data'])) ? json_decode($dataJson) : null;//将json格式的数据转换成数组

	$arr = $req->params;
	
	$username = addslashes($arr->username);
	$psw = addslashes($arr->psw);
	$school = addslashes($arr->school);

	$query = "SELECT a.*,b.schoolName  
		From `ghjy_consult` a 
		Join `ghjy_school` b On a.schoolID = b.schoolID 
		Where a.consultName='$username' And a.psw='$psw' And b.schoolName='$schoolName' ";
	$result = mysql_query($query);
	//if(!$result)
		//ErrorOutput();
	if(mysql_num_rows($result)>0){
		$row = mysql_fetch_assoc($result); 
		$res->success = true;
		$res->message = '咨询师登录成功';
		//$res->total = 1;
		$res->data = $row;
	}else{
		//ErrorOutput(10002,'账号或密码错误');
		$res->success = false;
    	$res->message = "登录信息错误";
		$res->data = array();
	}


//CorrectOutput($res);
//echo $_GET['callback'].'('.$res->to_json().')';
//$res->data = array();
echo $_GET['callback']."(".$res->to_json().")";

?>