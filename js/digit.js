var digitString = "";
for (var i = 1; i <= 8; i++) {
    digitString += "<div class='d" + i + "'></div>"
}
$(".digit").html(digitString);
$(".digit-small").html(digitString);