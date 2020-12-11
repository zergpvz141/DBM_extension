// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.runtime.onInstalled.addListener(function() {
      chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.contentScriptQuery == 'queryInfo') {
            var url = 'https://www-student.cse.buffalo.edu/dontbuyme/profileJSON.php'
            fetch(url)
                .then(response => response.text())
                .then(text => text)
                .then(price => sendResponse(price))
                .catch(error => console.log(error));
            return true;  // Will respond asynchronously.
        }
    });


// background-script.js

// browser.runtime.onMessage.addListener(handleMessage);
// chrome.browserAction.onClicked.addListener(function (tab) {
//     // for the current tab, inject the "inject.js" file & execute it
//     chrome.tabs.executeScript(tab.ib, {
//         file: 'popup.js'
//     });
// });
// chrome.runtime.onMessage.addListener(
//     function(message, callback) {
//             chrome.tabs.executeScript({
//                 file: 'callback.js'
//             });
//     });
// window.processData=function(myObj) {
//     console.log(myObj);
//
//     /* Function to display the track name and the
//     genre name from the received data. */
//     var para = document.getElementById("title");
//     para.innerHTML = para.innerHTML + myObj;
// }


chrome.runtime.onConnect.addListener(function(port){
    if (port.name =="lookup"){
    //     console.assert(port.name == "lookup");
        port.onMessage.addListener(function(msg) {
            var infoList = msg.info;
            console.log(infoList);
            var xhr = new XMLHttpRequest();
            var myObj = null;
            var url = "https://www-student.cse.buffalo.edu/dontbuyme/lookup.php";
            // if(infoList!=null){
                if (infoList[0] != "" && infoList[1] != "") {
                    url = "https://www-student.cse.buffalo.edu/dontbuyme/lookup.php?" + infoList[0] + "=" + infoList[1];
                }
            // }
            console.log(url);
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    // innerText does not let the attacker inject HTML elements.
                    myObj = JSON.parse(this.responseText);
                    console.log(myObj.result);
                    if(myObj.result!=null){
                        if(myObj.result.length==0){
                            port.postMessage({result:"no"});
                        }else{
                            port.postMessage({result:"yes"});
                        }
                    }else{
                        port.postMessage({result:"logout"});
                    }

                }
            }
            xhr.send();

        });
    }
    if (port.name =="lookupBarcode"){
        port.onMessage.addListener(function(msg) {
            var infoList = msg.BarcodeList;
            console.log(infoList);
            for (var y =0; y<infoList.length;y++){
                setTimeout(getBarcodeInfo, 2000+y*1000,infoList[y],port);
            }
        });
    }
    if (port.name =="upload"){
        port.onMessage.addListener(function(msg) {
            var infoList = msg.uploadList;
            console.log(infoList);
                uploadResult(port,infoList[0],infoList[1],infoList[2],infoList[3],infoList[4]);

        });
    }
    if (port.name =="ASINLookup"){
        port.onMessage.addListener(function(msg) {
            var ASIN_list = msg.full_info;
            console.log(ASIN_list);
            var xhr = new XMLHttpRequest();
            var myObj = null;
            var url = "https://www-student.cse.buffalo.edu/dontbuyme/lookup.php?full=1";
            console.log(url);
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    // innerText does not let the attacker inject HTML elements.
                    myObj = JSON.parse(this.responseText);
                    console.log(myObj.result);
                    if(myObj.result!=null){
                        var matchList=[];
                        for(var i=0;i<ASIN_list.length;i++){
                            var check=false;
                            var item = ASIN_list[i];
                            for(var j=0;j<myObj.result.length;j++){
                                var ownItem = myObj.result[j]['ASIN'];
                                if(item==ownItem){
                                    check=true;
                                    break;
                                }
                            }
                            if(check){
                                matchList.push(true);
                            }else{
                                matchList.push(false);
                            }
                        }
                            port.postMessage({loginStatus:"yes",ASINResult:matchList});
                        }else{
                        port.postMessage({loginStatus:"logout"});
                    }
                }
            }
            xhr.send();
        });
    }
    if (port.name =="orderHistoryUpload"){
        port.onMessage.addListener(function(msg) {
            var oUrl = msg.orderUrl;
            window.img = msg.orderImage;
            console.log(oUrl);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", oUrl, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
                    console.log(doc);
                    var infoList=checkDoc(doc);
                    console.log(infoList);
                    if(infoList!=null){
                        if(infoList.length>=2){
                            if(document.querySelector("#productSubtitle")!=null){
                                infoList.unshift(doc.querySelector("#productTitle").textContent+" "+doc.querySelector("#productSubtitle").textContent);
                            }else{
                                infoList.unshift(doc.querySelector("#productTitle").textContent);
                            }
                            if(infoList[3].includes("data:image")){
                                infoList[3]=getImg();
                            }
                            console.log(infoList);
                            uploadResult(port,infoList[0],infoList[1],infoList[2],infoList[3],infoList[4]);
                        }
                    }
                    else{
                        port.postMessage({uploadResultMsg_invalid: true});
                    }
                }
            }
            xhr.send();
        });
    }
});

window.img ="";

function getImg(){
    return window.img;
}
function getBarcodeInfo(code,port){
    var url = "https://www.barcodespider.com/";
    url = url+code.replaceAll(" ","");
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 2000;
    xhr.responseType = "document";
    // xhr.onerror = function () {
    //     port.postMessage({result: "Error"});
    // };
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var doc = xhr.responseXML;
            if(doc!=null){
                var title = doc.title;
                console.log(title);
                if(title.includes("Captcha")){
                    port.postMessage({result: "Captcha"});
                }else if(title.includes("Not Found")){
                    port.postMessage({result: "Not Found",list1:[code,"","N/A","N/A","N/A"]});
                }else if(doc.body.innerText.includes("have exceeded daily limit")){
                    port.postMessage({result: "limited",reason:doc.body.innerText});
                }
                else{
                    var name = doc.getElementsByClassName("detailtitle")[0].getElementsByTagName("h2")[0].innerText;
                    console.log(name);
                    var imgSrc = doc.getElementsByClassName("thumb-image")[0].getElementsByTagName("img")[0].src;
                    var ASIN = "";
                    var Category = "";
                    var tableRow = doc.getElementsByClassName("barcode-detail-container")[0].getElementsByTagName("tr");
                    for (var j =0;j<tableRow.length;j++){
                        var c_row = tableRow[j];
                        if(c_row.getElementsByTagName("td")[0].innerText.includes("ASIN")){
                            ASIN = c_row.getElementsByTagName("td")[1].innerText;
                        }
                        if(c_row.getElementsByTagName("td")[0].innerText.includes("Category")){
                            Category = c_row.getElementsByTagName("td")[1].innerText;
                            if(Category.includes("Book")){
                                Category="Book";
                            }else if(Category.includes("CD")){
                                 if(name.toLowerCase().includes("vinyl")){
                                        Category="Vinyl";
                                    }else{
                                     Category="CD";
                                 }
                            }else if(Category.includes("DVD")){
                                if(name.toLowerCase().includes("blu-ray")||name.toLowerCase().includes("blu ray")){
                                    Category="Blu-ray";
                                }else{
                                    Category="DVD";
                                }
                            }else{
                                Category=Category.split("»")[0].replaceAll("&", "and");
                            }
                        }
                    }
                    var resultList = [code,imgSrc,name,Category,ASIN];
                    console.log(resultList);

                    port.postMessage({result: "Success",list1:resultList});
                }
            }else{
                port.postMessage({result: "Not Found",list1:[code,"","N/A","N/A","N/A"]});
            }
        }
        // else{
        //     console.log("Captcha here!");
        //     port.postMessage({result: "Captcha"});
        // }
    }
    xhr.send();


}
function uploadResult(port,title="",c="",t="",i="",cate=""){
    if(title!=""&&c!=""&& t!=""&& i!=""&& cate!=""){

        var title =title.replaceAll("\n","%20").replaceAll(" ","%20").replaceAll("&"," and ").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20");
        var Category =cate.replaceAll("\n","%20").replaceAll(" ","%20").replaceAll("&"," and ").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20");

        var v_l="Vinyl".toLowerCase();
        var b_l = "Books".toLowerCase();
        var br_l ="Blu-Ray".toLowerCase();
        var h2_l = title.toLowerCase();
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
            Category="Blu-Ray";
        }else if (cate_l.includes(m_l)){
            Category="DVD";
        }
        var url = "https://www-student.cse.buffalo.edu/dontbuyme/upload.php?"+"ASIN="+t+"&"+c+"="+t+"&"+"Title="+title+"&Category="+Category+"&Image="+i;
        console.log(url);
        var xhrn = new XMLHttpRequest();
        xhrn.open("GET", url, true);
        xhrn.onreadystatechange = function () {
            if (xhrn.readyState == 4) {
                // innerText does not let the attacker inject HTML elements.
                var myObj = JSON.parse(this.responseText);
                console.log(myObj);
                var uploadResultList=[];
                if(myObj!=null){
                    var objKeys =Object.keys(myObj);
                    for(var k=0;k<objKeys.length;k++){
                        uploadResultList.push(myObj[objKeys[k]]);
                    }
                    console.log(uploadResultList);
                    port.postMessage({uploadResultMsg:uploadResultList});
                }
                else{
                        port.postMessage({uploadResultMsg:"logout"});
                }
            }
        }
        xhrn.send();
    }

}
function checkDoc(doc="") {
    var lookList = ["ASIN", "UPC", "ISBN-10", "ISBN-13"];
    if(doc==""){
        doc=document;
    }
    if (doc.getElementById("ap_container") !== null||doc.getElementById("productTitle")!== null) {
        for (var i = 0; i < lookList.length; i++) {
            var rlist = item_Info(doc,lookList[i]);
            console.log(rlist);
            if (rlist[0] == true){
                console.log(rlist);
                return [rlist[1][0], rlist[1][1], rlist[2], rlist[3]];
            }
        }
    } else {
        console.log("not product");
        return [];
    }
}

function item_Info(doc,t) {
    var list = doc.getElementsByClassName("a-list-item");
    for (var i = 0; i < list.length; i++) {
        var sList = list[i];
        if (sList.innerText.includes(t)) {
            console.log(sList.innerText);
            if (doc.getElementById("landingImage") != null) {
                var imgLink = doc.getElementById("landingImage").src;
            } else if (doc.getElementById("imgBlkFront") != null) {
                var imgLink = doc.getElementById("imgBlkFront").src;
            }else if (doc.getElementById("ebooksSitbLogo") != null){
                // var imgLink = doc.getElementById("ebooks-img-canvas").getElementsByTagName("img")[1].src;
                return [false, [], "", ""];
            }
            var cate = doc.querySelectorAll('[selected="selected"]')[0].innerText;
            if (cate.includes("CD")||cate.includes("Books")||cate.includes("Movies")){
                return [true, result_Parse(sList.innerText), imgLink, cate];
            }
            cate=doc.getElementById("nav-subnav").getAttribute("data-category");
            if(cate.includes("music")||cate.includes("books")||cate.includes("movies")){
                if(cate.includes("music")){
                    cate = "CDs & Vinyl";
                }
                return [true, result_Parse(sList.innerText), imgLink, cate];
            }
        }
    }
    return [false, [], "", ""];
}

function result_Parse(str) {
    var str = str.replaceAll(" ", "");
    str = str.replaceAll("\n", "");
    var str_list = str.split(":");
    return str_list;
}
