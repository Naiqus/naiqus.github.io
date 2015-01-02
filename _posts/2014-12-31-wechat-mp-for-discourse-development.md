---
layout: post
title: "Wechat MP for Discourse Forum"
modified:
categories: 
excerpt: "Recently I registered a Wechat MP for my Discourse forum [E1zone](www.e1zone.de) and developed some server-side functions to fetch users' information from the Discourse forum. This post includes the procedure of the implementation and some notes of technical details."
tags: []
comments: true
image:
  feature: lamp.jpg
date: 2014-12-31T13:35:25+01:00
---

Wechat is the most popular IM App nowadays in China. The Wechat MP could deliver various functions to Wechat users with its Developer API. 

Recently I registered a Wechat MP for my Discourse forum [E1zone](www.e1zone.de) and developed some server-side functions to fetch users' information from the Discourse forum. This post includes the procedure of the implementation and some notes of technical details.

---

**The implemented functions of the Wechat MP:**

- reply "?" to check usage.
- reply "最新" to get weekly highlights list 
- reply "绑定" to bind Discourse account to Wechat account
- reply "解除绑定" to unbind.
- reply "消息" to check recent forum notifications.



---
<section id="table-of-contents" class="toc">
  <header>
    <h3>Overview</h3>
  </header>
<div id="drawer" markdown="1">
*  Auto generated table of contents
{:toc}
</div>
</section>


## Binding Wechat OpenID to Discourse User Account

* Store Discourse user API key, identification code and username in a database.
* discourse user request for the API key**--->** 
* Administrators generate user API key **--->** 
* set a snippet of API key as wechat identification code **--->** 
* Insert the entry which contains information of api_key，Discourse username，and identification code.**--->** 
* Detect identification code from user reply **--->** 
* validate the code, update database, add user's wechat OpenID.

## Highlights of The Implementation.

### Discourse API called to fetch user notifications

`curl http://localhost:3000/notifications.json?api_key=test_d7fd0429940&api_username=test_user`

### Fetching and Analyse Json Data with PHP

{% highlight php %}
$json_url = "http://www.e1zone.de/top/weekly.json"; //weekly highlights 
    $json = file_get_contents($json_url);
    if ($json != null){
        $weekly = json_decode($json);
    } else{
        throw new Exception("Error Json Request", 1);
    }
{% endhighlight %}

### Function Overloading in PHP
Define a function with no parameter:
{% highlight PHP %}
function db_operation(){
	//--------------------------binding account
	if (func_get_arg(0) == "bind") { //check the first param
	    $apikey = func_get_arg(1);  //second
		$fromUsername = func_get_arg(2);  //third
				
				...
{% endhighlight %}

### Use sprintf() to get pre-defined string from template
{% highlight PHP %}
$textTpl = "<xml>
            <ToUserName><![CDATA[%s]]></ToUserName>
            <FromUserName><![CDATA[%s]]></FromUserName>
            <CreateTime>%s</CreateTime>
            <MsgType><![CDATA[%s]]></MsgType>
            <Content><![CDATA[%s]]></Content>
            <FuncFlag>0</FuncFlag>
            </xml>";
            
$resultStr .= sprintf($textTpl, $fromUsername, $toUsername, time(), $msgType, $text);
{% endhighlight %}

### Connect to MySQL in PHP
This is not a quite up-to-dated way:
{% highlight PHP %}
$connecTtion =mysql_connect($db_servername, $db_username, $db_password) OR DIE ("Unable to connect to database! Please try again later.");
if (!$connection){
	$output = "服务器异常，请稍后重试。";
}else{
	mysql_select_db("discourseUsers");
	// select operations
	//check if this user has already binded to an account
    $sql = "SELECT `openID`,`username` FROM `account_binding` WHERE `openID` = '".$fromUsername."';";
	$result = mysql_query($sql);
	if (mysql_num_rows($result) > 0) {  
		$record = mysql_fetch_array($result);
		$output = $record["username"];
		mysql_close($connection);
		return $output;
					
{% endhighlight %}
It is better to use mysqli() instead:
{% highlight php %}
$servername = "localhost";
$username = "username";
$password = "password";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";
{% endhighlight %}
> Note on the object-oriented example above: $connect_error was broken until PHP 5.2.9 and 5.3.0. If you need to ensure compatibility with PHP versions prior to 5.2.9 and 5.3.0, use the following code instead:
*// Check connection
if (mysqli_connect_error()) {
    die("Database connection failed: " . mysqli_connect_error());
}*


### Verify String's Format
Use function "**preg_match(pattern,variable)**"
` if (preg_match("/[A-Za-z0-9]+/", $form_Content) && strlen($form_Content) == 8) { ...} `
The example here checks whether the $form_Content contains only letters and numbers and the length of the string is exactly 8. 
It is used to detect the identification code. It is better to have user operation state stored in the server-side. However, taken the Chinese's input habit into account, it is feasible. It is really rare to have a reply which contains only letters and numbers from a Chinese user.

### Basic PHP form 

* Check user's input:

{% highlight PHP %}
// define variables and set to empty values
$username = $api = $userbindingkey = "";
$usernameErr = $apiErr = $userbindingkeyErr = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["username"])) {
  $usernameErr = "Username 是必填的";
  } else {
    $username = test_input($_POST["username"]);
  }
 
 ...
 
}
function test_input($data) {
    $data = trim($data);   //remove spaces
    $data = stripslashes($data); //remove slashes
    $data = htmlspecialchars($data); // translate special characters for security reason
    return $data;
}
{% endhighlight %}

The form is written as following:

{% highlight html %}
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"> 
        <input id="username" type="text" placeholder="输入用户名" class="input-xlarge">
            <span class="error">* <?php echo $usernameErr;?></span>
        <input id="api" name="api" type="text" placeholder="API_key" class="input-xlarge" onkeyup="keyupFunction()">
            <span class="error">* <?php echo $apiErr;?></span>
        <!-- Button -->
        <button id="confirm" name="confirm" class="btn btn-success" type="submit">确定</button>
</form>
{% endhighlight %}

* form submit to the page self, in order to show the info in the same page:
`<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>"> `

* When user release a key while input, call a function
`onkeyup="keyupFunction()"`
  Following is the function in JS:

{% highlight javascript %}
    function keyupFunction(){
    var api = document.getElementById("api").value;
    var apilast8 = api.slice(-8);  //last 8 letters
    document.getElementById("userbindingkey").value = apilast8;
    }
{% endhighlight %}