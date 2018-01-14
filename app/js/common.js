$(function() {
    //clock

    digits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

    var showWithSeconds = true;

    function getDigitClass(selectorToDigit) {
        var retVal = '';
        var classes = $(selectorToDigit).attr('class').split(' ');
        classes.forEach(function(item) {
            if (digits.indexOf(item) >= 0) retVal = item;
        });
        return retVal;
    }

    function setTime(hours, minutes, seconds) {
        //hours
        var curHoursLeft = digits.indexOf(getDigitClass('.js-digits-hours .digit-left'));
        var curHoursRight = digits.indexOf(getDigitClass('.js-digits-hours .digit-right'));

        if (Math.floor(hours/10) !== curHoursLeft) {
            $('.js-digits-hours .digit-left').removeClass(digits[curHoursLeft]).addClass(digits[Math.floor(hours/10)]);
        }
        if (hours % 10 !== curHoursRight) {
            $('.js-digits-hours .digit-right').removeClass(digits[curHoursRight]).addClass(digits[hours % 10]);
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

    var now = new Date();
    setTime(now.getHours(), now.getMinutes(), now.getSeconds());
    setInterval(function() {
        var now = new Date();
        if (showWithSeconds) {
            setTime(now.getHours(), now.getMinutes(), now.getSeconds());
        } else {
            if (now.getSeconds() === 0) {
                setTime(now.getHours(), now.getMinutes(), now.getSeconds());
            }
            $(".js-seconds-delete").css('display', 'none');
        }

    }, 1000);

    //setTime(23,32,12);


    var fullscreen = false;
    function launchFullScreen(element) {
        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
// Выход из полноэкранного режима
    function cancelFullscreen() {
        if(document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
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
        /*console.log("click");
        if (fullscreen) {
            cancelFullscreen();

            fullscreen = false;
        } else {
            document.documentElement.requestFullScreen();

            fullscreen = true;
        }*/
        toggleFullScreen();
    });

    setInterval(function() {
        $('.divider').toggleClass('active');
    }, 500)

});
