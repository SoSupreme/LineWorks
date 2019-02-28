
setTimeout(function() {
    var IDT =  document.getElementsByClassName("userInfo")[0].id
    var url ="http://localhost:443/getMail?folderSN=-1&page=1&firstPage=1&IDT=" + IDT;
    sendAjaxGetMenu(url,"List");
}, 5000);

var backToMenu = document.getElementsByClassName("linkText");
backToMenu[0].addEventListener('click', function(event){
var url = "http://localhost:443"+event.target.id
sendAjaxGetMenu(url,"List");
});

backToMenu[1].addEventListener('click', function(event){
var url = "http://localhost:443"+event.target.id
sendAjaxGetMenu(url,"Write");
});