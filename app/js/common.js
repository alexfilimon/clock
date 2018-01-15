//clock

function consoleLogTime(string) {
    var now = new Date();
    console.log(now.getHours() + ':' + now.getMinutes() + ' - ' + string);
}

var settings = {
    //show with seconds
    showWithSeconds: true,
    editShowWithSeconds: function(val) {
        this.showWithSeconds = val;
    },

    //colors
    colors: {
        dayColor: '#fff',
        nightColor: '#000'
    },
    editColors: function(colorsObj) {
        this.colors = colorsObj;
    },

    //opacity
    opacity: 0.1,
    editOpacity: function(val) {
        this.opacity = val;
    },

    //ampm
    ampm: false,
    editAmpm: function(val) {
        this.ampm = val;
        if (val) {
            $(".wrap-weather-ampm .ampm").css('opacity', '1');
        } else {
            $(".wrap-weather-ampm .ampm").css('opacity', '0');
        }
    },

    //selector with day colors
    selectorCDayColors: "",
    selectorBgcDayColors: "",



    //inteval
    intervalWeatherId: null
};
settings.editAmpm(true);



function setDayColor() {
    $(settings.selectorCDayColors).css('color', settings.colors.dayColor);
    $(settings.selectorBgcDayColors).css('background-color', settings.colors.dayColor);
}


//---WORK WITH DIGITS---
    digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    function getDigitClass(selectorToDigit) {
        var retVal = '';
        var classes = $(selectorToDigit).attr('class').split(' ');
        classes.forEach(function(item) {
            if (digits.indexOf(item) >= 0) retVal = item;
        });
        return retVal;
    }
    function setTime(hours, minutes, seconds, ampm) {
        if (ampm) {
            //hours
            var curHoursLeft = digits.indexOf(getDigitClass('.js-digits-hours .digit-left'));
            var curHoursRight = digits.indexOf(getDigitClass('.js-digits-hours .digit-right'));

            if (Math.floor(hours/10) !== curHoursLeft || hours % 10 !== curHoursRight) {
                if (hours === 0) {
                    $('.js-digits-hours .digit-left').removeClass(digits[curHoursLeft]).addClass('one');
                    $('.js-digits-hours .digit-right').removeClass(digits[curHoursRight]).addClass('two');

                    $(".wrap-weather-ampm .ampm").text("PM");
                } else  if (hours > 12){
                    console.log('hours > 12');

                    $(".wrap-weather-ampm .ampm").text("PM");
                } else { //1...12
                    $('.js-digits-hours .digit-left').removeClass(digits[curHoursLeft]).addClass(digits[Math.floor(hours/10)]);
                    $('.js-digits-hours .digit-right').removeClass(digits[curHoursRight]).addClass(digits[hours % 10]);

                    $(".wrap-weather-ampm .ampm").text("AM");
                }
                /*$('.js-digits-hours .digit-left').removeClass(digits[curHoursLeft]).addClass(digits[Math.floor(hours/10)]);
                $('.js-digits-hours .digit-right').removeClass(digits[curHoursRight]).addClass(digits[hours % 10]);*/
            }
        } else {//if !ampm
            //hours
            var curHoursLeft = digits.indexOf(getDigitClass('.js-digits-hours .digit-left'));
            var curHoursRight = digits.indexOf(getDigitClass('.js-digits-hours .digit-right'));

            if (Math.floor(hours/10) !== curHoursLeft) {
                $('.js-digits-hours .digit-left').removeClass(digits[curHoursLeft]).addClass(digits[Math.floor(hours/10)]);
            }
            if (hours % 10 !== curHoursRight) {
                $('.js-digits-hours .digit-right').removeClass(digits[curHoursRight]).addClass(digits[hours % 10]);
            }
        }

        //minutes
        var curMinutesLeft = digits.indexOf(getDigitClass('.js-digits-minutes .digit-left'));
        var curMinutesRight = digits.indexOf(getDigitClass('.js-digits-minutes .digit-right'));

        if (Math.floor(minutes/10) !== curMinutesLeft) {
            $('.js-digits-minutes .digit-left').removeClass(digits[curMinutesLeft]).addClass(digits[Math.floor(minutes/10)]);
        }
        if (minutes % 10 !== curMinutesRight) {
            $('.js-digits-minutes .digit-right').removeClass(digits[curMinutesRight]).addClass(digits[minutes % 10]);
        }

        //seconds
        var curSecondsLeft = digits.indexOf(getDigitClass('.js-digits-seconds .digit-left'));
        var curSecondsRight = digits.indexOf(getDigitClass('.js-digits-seconds .digit-right'));

        if (Math.floor(seconds/10) !== curSecondsLeft) {
            $('.js-digits-seconds .digit-left').removeClass(digits[curSecondsLeft]).addClass(digits[Math.floor(seconds/10)]);
        }
        if (seconds % 10 !== curSecondsRight) {
            $('.js-digits-seconds .digit-right').removeClass(digits[curSecondsRight]).addClass(digits[seconds % 10]);
        }
    }


function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        $(".content").css('height', '100%').css('height', '100vh');
    }
}
$(".js-button-fullscreen").click(function() {
    toggleFullScreen();
});

setInterval(function() {
    $('.divider').toggleClass('active');
}, 500);




//---TIME---
    var timeObj = {
        time: 0, //unix timestamp in milliseconds
        tz: 0,
        diff: 0, //different local time and internet time(localTime-internetTime) (milliseconds)
        getSeconds: function() {
            var time = Math.floor(this.time / 1000) - Math.floor(this.diff/1000);
            var secondsToday = (time + this.tz*3600) % (3600*24);
            return secondsToday % 60;
        },
        getMinutes: function() {
            var time = Math.floor(this.time / 1000) - Math.floor(this.diff/1000);
            var secondsToday = (time + this.tz*3600) % (3600*24);
            var minutesToday = Math.floor(secondsToday/60);
            return minutesToday % 60;
        },
        getHours: function() {
            var time = Math.floor(this.time / 1000) - Math.floor(this.diff/1000);
            var secondsToday = (time + this.tz*3600) % (3600*24);
            return Math.floor(secondsToday/3600);
        }
    };

    function timeInit() {
        var now = new Date();
        timeObj.time = now.getTime();
        timeObj.tz = (-1) * now.getTimezoneOffset()/60;
        //timeObj.tz = 1;

        setTime(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds());
    }
    timeInit();


    //time
    setInterval(function() {
        timeObj.time = new Date().getTime();

        if (settings.showWithSeconds) {
            setTime(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds(), settings.ampm);
            $(".js-seconds-delete").css('display', 'inline-block');
        } else {
            if (timeObj.getSeconds() === 0) {
                setTime(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds(), settings.ampm);
            }
            $(".js-seconds-delete").css('display', 'none');
        }
    }, 1000);



//---GOOGLE API---
var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', updateWeatherTime);
}

function updateWeather(lat, lng, placeName) {
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&APPID=60e7723469dd24ae66481fa2ece9470a&units=metric",
        success: function(data){
            //console.log( "Прибыли данные о погоде: ", data, data.name,  );

            var temp = Math.round(data.main.temp);


            //console.log('Temperature in '+name+' has been updated at '++': ', temp);
            consoleLogTime('Temperature in '+placeName+' has been updated: ' + temp);

            if (temp >= 0) {
                temp = '+' + temp + '°';
            } else {
                temp = temp + '°';
            }


            //update weather
            $(".weather .weather-value").text(temp);
        },
        error: function(data){
            console.log('error with getting weather: ', data);
        }
    });
}

function updateWeatherTime() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    var lat = place.geometry.location.lat();
    var lng = place.geometry.location.lng();
    var name = place.address_components[0].long_name;
    //console.log('name: ', name);

    $(".place-name").text(name);

    //---WEATHER API---
    clearInterval(settings.intervalWeatherId);
    updateWeather(lat, lng, name);
    settings.intervalWeatherId = setInterval(function() {
        updateWeather(lat, lng, name);
    }, 1000*60*10);


    //--TIME API---
    $.ajax({
        url: "http://api.timezonedb.com/v2/get-time-zone?key=PTYA8KOMX46R&format=json&by=position&lat="+lat+"&lng="+lng,
        success: function(data){
            console.log( "Прибыли данные о времени: ", data, Math.floor(data.gmtOffset/3600), (data.timestamp-data.gmtOffset) );

            var timeZone = data.gmtOffset/3600;
            var diff = timeObj.time - (data.timestamp-data.gmtOffset)*1000;
            //console.log('tz: ', timeZone);
            //update time
            timeObj.diff = diff;
            timeObj.tz = timeZone
        },
        error: function(data){
            console.log('error with getting time: ', data);
        }
    });
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }

}
