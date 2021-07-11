<?php
$email='welcomin@yandex.ru';
define("CONTACT_FORM", $email);

$postContact = (!empty($_POST)) ? true : false;

if($postContact){
  $name = stripslashes($_POST['name']);
  $phone = stripslashes($_POST['phone']);
  $menu = stripslashes($_POST['menu']);
  $day = stripslashes($_POST['day']);
  $subject = 'Заявка';
  $error = '';
  $message = '
			<html>
					<head>
							<title>Заявка</title>
					</head>
					<body>
							<p>Имя: '.$name.'</p>
							<p>Телефон: '.$phone.'</p>
							<p>Меню: '.$menu.'</p>
							<p>Количество дней: '.$day.'</p>
					</body>
			</html>';

  // если в заголовках есть русские буквы - то их нужно кодировать, т.к.
  // в Content-Type задаётся только кодировка тела, которое может быть отослано в любой кодировке.
  // это необходимо для нормального отображения в OUTLOOK и THE BAT
  $name = '=?UTF-8?B?'.base64_encode($name).'?=';
  $subject = '=?UTF-8?B?'.base64_encode($subject).'?=';

  if(!$error){
    $mail = mail(CONTACT_FORM, $subject, $message,
      "From: ".$name." <".$email.">\r\n"
      ."Reply-To: ".$email."\r\n"
      ."Content-type: text/html; charset=utf-8 \r\n"
      ."X-Mailer: PHP/" . phpversion());

    if($mail){
      echo 'OK';
    }
  }else{
    echo '<div class="bg-danger">'.$error.'</div>';
  }

}
?>
