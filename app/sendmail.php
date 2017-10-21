<?php

require ("functions.php"); //функции подключаем

function generateMessage($name, $phone, $price, $place, $project_name) { //генерируем сообщение для отправки по почте
	$adminLink = "/index.php?admin=1&sum=$price";
	foreach ($place as  $value) {
		$adminLink .= "&placeget[]=".$value;
	}

	$message = "";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Проект</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$project_name</td>
			</tr>
			";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Имя</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$name</td>
			</tr>
			";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Телефон</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$phone</td>
			</tr>
			";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Сумма</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$price</td>
			</tr>
			";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Места на таблице</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><a href='http://".$_SERVER['SERVER_NAME'].$adminLink."'>Посмотреть</a></td>
			</tr>
			";
	$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'> </td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'> </td>
			</tr>
			";

	foreach ($place as $key => $value) {
		$message .= "
			" . '<tr style="background-color: #f8f8f8;">' . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>Место - ".($key+1)."</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>".intval(substr($value,0,2))." ряд, ".intval(substr($value,2,2))." место ($value)</td>
			</tr>
			";
	}
	$message = "<table style='width: 100%;'>$message</table>";
	return $message;
}

function adopt($text) { //адоптирует кодировку
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}



//принятие данных
$name = $_POST['name'];
$phone = $_POST['phone'];
$price = $_POST['price'];
$place = $_POST['place'];
$place = json_decode($place);

//константы
$from_email  = "info@studsovet-vsuet.ru"; //от кого
$to_email  = "as_filimon@mail.ru"; //кому
$to_email2  = "suhanov1996@yandex.ru"; //кому
$project_name = $_POST['project']; //имя проекта - поле "от кого"
$form_subject = "Бронирование билетов(".(count($place))." шт - $price руб.)"; //тема письма

//масиив вывода
$out = array(); //вывод ошибок и сообщений

if (!empty($name) && !empty($phone)) { //если не пустые поля
	$message = generateMessage($name, $phone, $price, $place, $project_name); //генерируем таблицу
	//формирование описания письма
	$headers = "MIME-Version: 1.0" . PHP_EOL .
	"Content-Type: text/html; charset=utf-8" . PHP_EOL .
	'From: '.adopt($project_name).' <'.$from_email.'>' . PHP_EOL .
	'Reply-To: '.$from_email.'' . PHP_EOL;
	//отправка письма
	mail($to_email, adopt($form_subject), $message, $headers );
	mail($to_email2, adopt($form_subject), $message, $headers );

	//массив вывода: без ошибок
	$out['status'] = 0;
	$out['text'] = "Сообщение отправлено! В ближайшее время вам перезвонят.";
} else { //если одно из полей пусто
	if (empty($name)) { //пусто "имя"
		$out['status'] = 1;
		$out['text'] = "Введите ваше имя";
	} else if (empty($phone)) { //пусто "телефон"
		$out['status'] = 2;
		$out['text'] = "Введите ваш телефон";
	} else { //другая ошибка
		$out['status'] = 3;
		$out['text'] = "Ошибка";
	}

}

//передача js массива с ошибками
echo json_encode($out);