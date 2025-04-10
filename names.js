var xhr;

if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
}else{
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
}

requestURL = "https://api.sheetbest.com/sheets/c1e0ead6-6df0-49f7-ace0-ec90562a8c3f"

xhr.readystatechange = function(){
    if (xhr.readyState == 4 && xhr.status == 200){
        document.getElementById("namearea").innerHTML = xhr.responseText;
    }
}

xhr.open("GET", requestURL, true);
xhr.send();