<?php
	require ('libs/phpQuery.php'); //подключение парсера
	require ('functions.php'); //файл с функциями

	$file = file_get_contents('https://yandex.ru/pogoda/voronezh'); 
	$document = phpQuery::newDocument($file);

	$result = $document->find("body > div.content > div.content__top a.link.fact__basic .temp__value");
  	$result = pq($result)->html();

  	$sign = $result[0];
  	$result = mb_substr($result, 1);

  	$num = 0;

  	for ($i=0; $i<strlen($result); $i++) {
  		if ($result[$i] <= '9' && $result[$i] >= '0') {
  			$num = $num*10 + strval($result[$i]);
  		}
  	}
  	
  	

  	//vardump($sign);
  	//vardump($num);

	$out = array(); //вывод ошибок и сообщений

	if ($sign != "+" && $sign != "-") {
		$out['status'] = 500;
		$out['text'] = "Fail with sign";
	} else {
		$out['status'] = 200;
		$out['text'] = "All right";
		$out['num'] = $num;
		$out['sign'] = $sign;
	}

	echo json_encode($out);


?>