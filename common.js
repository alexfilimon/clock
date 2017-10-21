setTimeout(function() {
	setInterval(function() {
		$(".clock .dots").toggleClass("active");
	}, 500);
}, 500);

var digits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
var days = ["sun", "mon", "tue", "wen", "thu", "fri", "sat"];

function setAm() {
	$(".am").addClass("active");
	$(".pm").removeClass("active");
};

function setPm() {
	$(".pm").addClass("active");
	$(".am").removeClass("active");
};

function setTime(hours, minutes, seconds, countDays) {
	if (hours == 0) {
		hours = 12;
		setAm();
	}
	else if (hours > 12) {
		hours %= 12;
		setPm();
	} else {
		setAm();
	}

	//day of week
	clearDays();
	var curDay = days[countDays];
	$(".clock .display ."+curDay).addClass("active");

	$(".clock .hourLeft").addClass(digits[parseInt(hours/10)]);
	$(".clock .hourRight").addClass(digits[hours % 10]);

	$(".clock .minuteLeft").addClass(digits[parseInt(minutes/10)]);
	$(".clock .minuteRight").addClass(digits[minutes % 10]);

	$(".clock .secondLeft").addClass(digits[parseInt(seconds/10)]);
	$(".clock .secondRight").addClass(digits[seconds % 10]);
};

function clearClock() {
	$(".clock .digit").each(function() {
		$(this).removeClass(digits.join(' '));
	});
};
function clearDays() {
	$(".clock .display div").each(function() {
		$(this).removeClass("active");
	});
};

setInterval(function() {
	clearClock();
	var date = new Date();
	setTime(date.getHours(),date.getMinutes(),date.getSeconds(), date.getDay());
	//if (date.getHours() == 17 && date.getMinutes() == 55) alarm();
	//console.log(date.getHours(),date.getMinutes(),date.getSeconds());
}, 1000);

function resize() {
	var heightWindow = $(window).height();
    var heightClock = $(".clock").height();
    $(".clock").css("margin-top", (heightWindow/2-heightClock/2)+"px");
};
resize();

window.onresize = resize;



var audio = new Audio(); // Создаём новый элемент Audio
audio.src = 'music/alarm.mp3';

function alarm() {
	audio.pause();
	audio.play(); // Автоматически запускаем
};


function setWeatherMinus() {
	$(".clock .weather .sign").removeClass("plus");
	$(".clock .weather .sign").addClass("minus");
};
function setWeatherPlus() {
	$(".clock .weather .sign").removeClass("minus");
	$(".clock .weather .sign").addClass("plus");
};

function setWeatherTemperature(sign, temp) {
	clearTemp();
	$(".clock .weather .tempLeft").addClass(digits[parseInt(temp / 10)]);
	$(".clock .weather .tempRight").addClass(digits[temp % 10]);

	if (sign == "+") setWeatherPlus();
	else if (sign == "-") setWeatherMinus();
}; 

function clearTemp() {
	$(".clock .weather .digit-small").each(function() {
		$(this).removeClass(digits.join(' '));
	});
};
//setWeatherTemperature("+", 28);

function updateTemp() {
	$.ajax("http://api.openweathermap.org/data/2.5/weather?id=472045&units=metric&appid=60e7723469dd24ae66481fa2ece9470a",{
        dataType: "json",
        success: function(data){ // сoбытиe пoслe удaчнoгo oбрaщeния к сeрвeру и пoлучeния oтвeтa

            //

            if (!data) { // eсли oбрaбoтчик вeрнул oшибку
                console.log("Ошибка знака");
            } else { // eсли всe прoшлo oк
				console.log(data.main.temp);
				var temp = Math.round(data.main.temp);
				console.log(temp);
				if(temp >= 0) {
                    setWeatherTemperature("+", temp);
				} else {
                    setWeatherTemperature("-", temp);
				}
                // setWeatherTemperature(data['sign'], data['num']);
                // var date = new Date();
                // console.log(data['sign']+data['num']+" - updated: ", date);
            }


         }
	}).done(function(data) {
		/*setTimeout(function() {
			// Done Functions
		}, 4000); */
	});
};

updateTemp();

setInterval(updateTemp,10*60*1000);