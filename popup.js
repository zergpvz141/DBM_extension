// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
//     else return '';
// }
function lookupResult(c="",t="",i="",cate=""){
    var xhr = new XMLHttpRequest();
    var myObj=null;
// xhr.open("GET", "https://www-student.cse.buffalo.edu/dontbuyme/profileJSON.php", true);
    var url = "https://www-student.cse.buffalo.edu/dontbuyme/lookup.php";
    if(c!=""&& t!=""){
        var url = "https://www-student.cse.buffalo.edu/dontbuyme/lookup.php?"+c+"="+t;
        console.log(url);
    }
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // innerText does not let the attacker inject HTML elements.
            myObj = JSON.parse(this.responseText);
            console.log(myObj);
            if(myObj.name !=" "){
                document.getElementById("gl").style.display = "none";
                document.getElementById("info").style.display = "block";
                document.getElementById("info").innerHTML = "User: "+myObj.email+'<hr>';
                document.getElementById("cp").style.display = "block";
                document.getElementById("lo").style.display = "block";
                document.getElementById("id1").style.display = "none";
//                 if(myObj.result[0]!="NA"){
//                     var category = categoryFunction(c,t,i,cate);
//                     if(!category.toLowerCase().includes("vinyl")&& !category.toLowerCase().includes("cd") &&
//                         !category.toLowerCase().includes("book")&& !category.toLowerCase().includes("blu ray")&& !category.toLowerCase().includes("dvd")){
//                         return;
//                     }
//                     else if(myObj.result !=""){
//                         var myItem = document.getElementById("id1");
//                         myItem.innerHTML+=myObj.result[0].Title+"<br> <h2 id ='Result'>In collection!</h2>";
//                         myItem.style.display = "block";
//                     }else{
//                         var myItem = document.getElementById("id1");
//                         myItem.innerHTML+=window.h1+"<br> <h2 id ='Result'>Not In collection!</h2>";
//                         myItem.style.display = "block";
//
//                         var addbtn = document.createElement("BUTTON");
//                         addbtn.innerText = "Add to Collection!";
//                         addbtn.id="DBM_button";
//                         addbtn.style.color = "green";
//                         addbtn.setAttribute("background-color","white");
//
//                         addbtn.onclick = function(e){
//                             console.log(c);
//                             console.log(t);
//                             console.log(i);console.log(cate);
//
//                             // var wnd = window.open("https://www-student.cse.buffalo.edu/dontbuyme/upload.php?UPC=222222");
//                             // e.preventDefault();
// // xhr.open("GET", "https://www-student.cse.buffalo.edu/dontbuyme/profileJSON.php", true);
//                             if(c!=""&& t!=""&& i!=""&& cate!=""){
//
//                                 var h2 =h1.replaceAll("\n","%20").replaceAll(" ","%20").replaceAll("&"," and ").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20");
//                                 Category =cate;
//
//                                 var v_l="Vinyl".toLowerCase();
//                                 var b_l = "Books".toLowerCase();
//                                 var br_l ="Blu-Ray".toLowerCase();
//                                 var h2_l = h2.toLowerCase();
//                                 var cate_l = cate.toLowerCase();
//                                 var m_l="Movies".toLowerCase();
//                                 if(h2_l.includes(v_l)){
//                                     Category= "Vinyl";
//                                 }else if(cate_l.includes(v_l)){
//                                     Category="CD";
//                                 }else if(cate_l==b_l){
//                                     Category="Book";
//                                 }
//
//                                 else if (h2_l.includes(br_l)){
//                                     Category="Blu-Ray";
//                                 }else if (cate_l.includes(m_l)){
//                                     Category="DVD";
//                                 }
//
//                                 var url = "https://www-student.cse.buffalo.edu/dontbuyme/upload.php?"+c+"="+t+"&"+"Title="+h2+"&Category="+Category+"&Image="+i;
//                                 console.log(url);
//                             }
//                             var xhrn = new XMLHttpRequest();
//                             xhrn.open("GET", url, true);
//                             xhrn.send();
//                             addButton_after = document.getElementById("DBM_button");
//                             addButton_after.disabled = true;
//                             addButton_after.innerHTML = "Successfully Added!";
//                             addButton_after.style.color = "green";
//                             document.getElementById("Result").innerHTML="In collection!";
//                         }
//                         myItem.appendChild(addbtn);
//                     }
//                 }
            }
            else{
                document.getElementById("gl").style.display = "block";
                document.getElementById("info").style.display = "none";
                document.getElementById("cp").style.display = "none";
                document.getElementById("lo").style.display = "none";
                document.getElementById("id1").style.display = "none";
            }
        }
    }
    xhr.send();
}
function checkFunction(doc){
    lookList = ["ASIN","UPC","ISBN-10","ISBN-13"];
    if(doc.getElementById("ap_container") !== null) {
        for(i= 0;i<lookList.length;i++){
            rlist = itemInfo(lookList[i],doc);
            if(rlist[0]==true){
                console.log(rlist);
                lookupResult(rlist[1][0],rlist[1][1],rlist[2],rlist[3]);
                break;
            }
        }
    }else{
        lookupResult();
    }
}

function itemInfo(t,doc){
    var list =doc.getElementsByClassName("a-list-item");
    for (var i =0; i<list.length;i++){
        var sList = list[i];
        if (sList.innerText.includes(t)){
            console.log(sList.innerText);
            if(doc.getElementById("landingImage")!=null){
                var imgLink =doc.getElementById("landingImage").src;
            }else if (doc.getElementById("imgBlkFront")!=null){
                var imgLink =doc.getElementById("imgBlkFront").src;
            }

            var cate = doc.querySelectorAll('[selected="selected"]')[0].innerText;
            return [true,resultParse(sList.innerText),imgLink,cate];
        }
    }return [false,[],"",""];
}
function resultParse(str){
    var str=str.replaceAll(" ","");
    str=str.replaceAll("\n","");
    var str_list=str.split(":");
    return str_list;
}
function categoryFunction(c,t,i,cate){
    if(c!=""&& t!=""&& i!=""&& cate!=""){

        var h2 =h1.replaceAll("\n","%20").replaceAll("&"," and ").replaceAll(" ","%20").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20").replaceAll("-","%20");
        Category =cate;

        var v_l="Vinyl".toLowerCase();
        var b_l = "Books".toLowerCase();
        var br_l ="Blu Ray".toLowerCase();
        var h2_l = h2.toLowerCase();
        var cate_l = cate.toLowerCase();
        var m_l="Movies".toLowerCase();
        if(h2_l.includes(v_l)){
            Category= "Vinyl";
        }else if(cate_l.includes(v_l)){
            Category="CD";
        }else if(cate_l==b_l){
            Category="Book";
        }

        else if (h2_l.includes(br_l)){
            Category="Blu Ray";
        }else if (cate_l.includes(m_l)){
            Category="DVD";
        }
        return Category;
    }
}

var h1 ="";
var Category="";
function display_item (results){
    console.log(typeof results);
    var list =results.toString().split("||||");
    h1= list[0].replaceAll("\n","");
    var hdom = list[1];
    var doc = new DOMParser().parseFromString(hdom, "text/html");
    checkFunction(doc);
    // document.querySelector("#id1").innerHTML = "<hr><p>tab title: " + tab_title + "</p><p>dom h111111: " + h1 + "</p>";
}
    lookupResult();
    var tab_title = '';
    chrome.tabs.query({active: true,status:'loading' ,lastFocusedWindow: true}, function(tabs) {
        var tab = tabs[0];
        if (tab !=undefined){

            tab_title = tab.title;
            if(tab_title.includes("Amazon")){
                chrome.tabs.executeScript(tab.id, {
                    file: 'tabExecute.js'
                }, display_item);
            }
        }
    });
    chrome.tabs.query({active: true,status:'complete' ,lastFocusedWindow: true}, function(tabs) {
    var tab = tabs[0];
        if (tab !=undefined) {
            tab_title = tab.title;
            if (tab_title.includes("Amazon")) {
                chrome.tabs.executeScript(tab.id, {
                    file: 'tabExecute.js'
                }, display_item);
            }
        }
});
function refreshFunction(){
    var d1 = document.createElement("div");
    d1.innerHTML='<meta http-equiv="refresh" content="0.2; url=https://www-student.cse.buffalo.edu/dontbuyme/popup.php">';
    document.body.appendChild(d1);
}
