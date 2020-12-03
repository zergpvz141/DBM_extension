
var sbtn = document.getElementById("searchBtn");
var extensionCheck =  document.getElementsByClassName("row");
for (var i =0; i<extensionCheck.length; i++){
    extensionCheck[i].style.display="flex";
}
document.getElementById("DBMCheck").style.display='none';
sbtn.onclick=function(){
    document.getElementById("ListBody").innerHTML="";
    var list=[]
    for (var i =1;i<6;i++){
        invalue = document.getElementById("input"+i).value;
        if(invalue!=""){
            list.push(invalue);
        }
    }
    if(list.length ==0){
        alert("Please enter at least one barcode before searching");
    }else{
        console.log(list);
        var port = chrome.runtime.connect({name: "lookupBarcode"});
        port.postMessage({BarcodeList: list});
        var defalt_result = "";
        port.onMessage.addListener(function(message,sender){
            console.log(message.result);
            if(message.result == "Captcha" && defalt_result!="Captcha"){
                defalt_result ="Captcha";
                alert("Please do the Captcha check in the opening page before your next search.");
                var importantStuff = window.open('', '_blank');
                importantStuff.location.href = "https://www.barcodespider.com/"+list[0];
            }else if(message.result == "Not Found"){
                console.log("Not Found!!");
                display_result("ListBody",message.list1);
            }else if(message.result == "limited"){
                alert(message.reason);
            }
            else{
                var list1=message.list1;
                console.log(list1);
                display_result("ListBody",list1);
                if(list1!=null){
                    //"ASIN", "UPC", "ISBN10", "ISBN13", "Title", "Category", "Image"
                    list1[2] =list1[2].replaceAll("\n","%20").replaceAll(" ","%20").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20");
                    list1[3] =list1[3].replaceAll("\n","%20").replaceAll(" ","%20").replaceAll("'","''").replace(/[\u2012\u2013\u2014\u2015]/g,"%20");
                    var v_l="Vinyl".toLowerCase();
                    var b_l = "Books".toLowerCase();
                    var br_l ="Blu-Ray".toLowerCase();
                    var h2_l = list1[2].toLowerCase();
                    var cate_l = list1[3].toLowerCase();
                    var m_l="Movies".toLowerCase();
                    if(h2_l.includes(v_l)){
                        list1[3]= "Vinyl";
                    }else if(cate_l.includes(v_l)){
                        list1[3]="CD";
                    }else if(cate_l==b_l){
                        list1[3]="Book";
                    }
                    else if (h2_l.includes(br_l)){
                        list1[3]="Blu-Ray";
                    }else if (cate_l.includes(m_l)){
                        list1[3]="DVD";
                    }
                    if(list1[3]=="Vinyl"||list1[3]=="CD"||list1[3]=="Book"||list1[3]=="Blu-Ray"||list1[3]=="DVD") {
                        console.log(list1[3]);
                        var in1 = document.getElementById("uploadLink1").innerText;
                        var in2 = document.getElementById("uploadLink2").innerText;
                        var in3 = document.getElementById("uploadLink3").innerText;
                        var in4 = document.getElementById("uploadLink4").innerText;
                        var in5 = document.getElementById("uploadLink5").innerText;
                        if (in1 == "") {
                            document.getElementById("uploadLink1").innerText = "ASIN=" + list1[4] + "&UPC=" + list1[0] + "&Title=" + list1[2] + "&Category=" + list1[3] + "&Image=" + list1[1];
                        } else if (in2 == "") {
                            document.getElementById("uploadLink2").innerText = "ASIN=" + list1[4] + "&UPC=" + list1[0] + "&Title=" + list1[2] + "&Category=" + list1[3] + "&Image=" + list1[1];
                        } else if (in3 == "") {
                            document.getElementById("uploadLink3").innerText = "ASIN=" + list1[4] + "&UPC=" + list1[0] + "&Title=" + list1[2] + "&Category=" + list1[3] + "&Image=" + list1[1];
                        } else if (in4 == "") {
                            document.getElementById("uploadLink4").innerText = "ASIN=" + list1[4] + "&UPC=" + list1[0] + "&Title=" + list1[2] + "&Category=" + list1[3] + "&Image=" + list1[1];
                        } else if (in5 == "") {
                            document.getElementById("uploadLink5").innerText = "ASIN=" + list1[4] + "&UPC=" + list1[0] + "&Title=" + list1[2] + "&Category=" + list1[3] + "&Image=" + list1[1];
                        }
                    }
                }

            }
        });
    }

}

function display_result(_name,list){
    var table = document.getElementById(_name);
    //[code,imgSrc,name,Category,ASIN]
    var survey = list;
    var row = table.insertRow();
    for(var i=0; i<survey.length; i++){
            var cell = row.insertCell();
        if(survey[3]=="Vinyl"||survey[3]=="CD"||survey[3]=="Book"||survey[3]=="Blu-Ray"||survey[3]=="DVD"){
            cell.style['background-color']="#82E0AA";
        }else{
            cell.style['background-color']="#F5B7B1";
        }
            if (i == 1){
                var img = document.createElement("img");
                img.src = survey[i];
                img.style.width = "80px";
                img.style.height = "100px";
                cell.appendChild(img);
            }else if(i==2){
                if(survey[i]=="Blu Ray"){
                    row.className += " " +"Blu-Ray";
                    var v = "Blu-Ray";
                }else{
                    row.className += " " +survey[i];
                    var v = survey[i];
                }
                var t = document.createTextNode(v);
                cell.appendChild(t);
            }
            else{
                var v = survey[i];
                if (v==null){
                    v="N/A";
                }
                var t = document.createTextNode(v);
                cell.appendChild(t);
            }
    }
}


