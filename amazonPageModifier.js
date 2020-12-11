


  function resultParse(str) {
    var str = str.replace(" ", "");
    var str_list = str.split(":");
    return str_list
  }
  function getDomList(){
    return DOMList;
  }
  function getImgList(){
    return odderImageLink;
  }
// if(document.getElementById("ap_container") !== null){
//   itemOwningStatus("no");
//   itemInfo();
// }
// i = "yes" ,"no","maybe"
  function itemOwningStatus(i,mode="",num=0) {

    if(mode==""){
      var titleElement = document.getElementById("title");
    }else{
      var titleElement = mode;
    }
    var breakLine = document.createElement("br");
    insertAfter(breakLine, titleElement);
    if (i == "yes") {
      t_border = "red";
      content = "Already Have It!! <img class='DBMNotFound' width=\"20\" height=\"20\">";
    } else {
      if (i == "no") {
        t_border = "green";
        content = "Not In Collection <img class='DBMNotFound' width=\"20px\" height=\"20px\">";

        var addButton = document.createElement("button");
        addButton.value = num;
        addButton.classList.add("DBM_button");
        addButton.style.backgroundColor='#FEBD69';
        addButton.style.border="1px";
        addButton.style.padding="5px 10px";
        addButton.style.color="white";
        addButton.innerHTML = "Add to Collection";
        addButton.onclick = function (e) {
          // var wnd = window.open("https://www-student.cse.buffalo.edu/dontbuyme/upload.php?UPC=222222");
          // e.preventDefault();
          if(mode ==""){
            infoList = checkDoc();
            if(document.querySelector("#productSubtitle")!=null){
              subtitle =document.querySelector("#productSubtitle").textContent;
              infoList.unshift(document.querySelector("#productTitle").textContent+" "+subtitle);
            }else{
              infoList.unshift(document.querySelector("#productTitle").textContent);
            }
            var port = chrome.runtime.connect({name: "upload"});
            port.postMessage({uploadList: infoList});
            port.onMessage.addListener(function (message, sender) {
              var upResultList=message.uploadResultMsg;
              var addButton_after = document.getElementsByClassName('DBM_button')[0];
              var label = document.getElementsByClassName("DBM_label")[0];
              if(upResultList[0]==true){
                label.innerHTML="Already Have It!!<img class='DBMNotFound' width=\"20px\" height=\"20px\">";
                label.style.color="red";
                addButton_after.disabled = true;
                addButton.innerHTML = "Successfully Added!";
                addButton_after.style.color = "white";
                document.getElementsByClassName("DBMNotFound")[num].src=chrome.extension.getURL("images/icon_logoRED.png");
              }else{
                addButton.innerHTML = "Adding failed";
                addButton_after.style.color = "red";
              }
            });
          }else{
            DOMList = getDomList();
            odderImageLink= getImgList();

            mode=DOMList[this.value];
            // console.log(odderImageLink);
          //  adding from order history page
            var port = chrome.runtime.connect({name: "orderHistoryUpload"});
            oUrl = "https://www.amazon.com" + mode.getAttribute('href');
            port.postMessage({orderUrl: oUrl,orderImage:odderImageLink[this.value]});
            port.onMessage.addListener(function (message, sender) {
              if(message.uploadResultMsg_invalid){
                addButton.disabled = true;
                addButton.innerHTML = "Invalid category";
                addButton.style.color = "red";
              }else{
                var upResultList=message.uploadResultMsg;
                // console.log(upResultList);
                // var addButton_after = document.getElementsByClassName('DBM_button')[num];
                if(upResultList[0]==true){
                  var label = document.getElementsByClassName("DBM_label")[num];
                  label.innerHTML="Already Have It!!<img class='DBMNotFound' width=\"20px\" height=\"20px\">";
                  label.style.color="red";
                  addButton.disabled = true;
                  addButton.innerHTML = "Successfully Added!";
                  addButton.style.color = "white";
                  document.getElementsByClassName("DBMNotFound")[num].src=chrome.extension.getURL("images/icon_logoRED.png");
                }else{
                  addButton.innerHTML = "Adding failed";
                  addButton.style.color = "red";
                }
              }

            });
          }

        }
        insertAfter(document.createElement("br"), titleElement);
        insertAfter(document.createElement("br"), titleElement);
        insertAfter(addButton, titleElement);
      } else if (i == "logout") {
        t_border = "black";
        content = "DBM logged out";
        var addButton = document.createElement("button");
        addButton.id = "DBM_button";
        addButton.innerHTML = "login";
        addButton.onclick=function(){window.open('https://www-student.cse.buffalo.edu/dontbuyme/login.php','_blank');}
        addButton.setAttribute('color','black');
        insertAfter(document.createElement("br"), titleElement);
        insertAfter(document.createElement("br"), titleElement);
        insertAfter(addButton, titleElement);
      } else if (i == "maybe") {
        t_border = "#B7950B";
        content = "Looks Similar";
        var para = document.createElement("Button");
        para.innerText = content;
        para.style.color = t_border;
        para.setAttribute("background-color", "white")
        var newLine = document.createElement("br");
        var breakLine = document.createElement("hr");
        insertAfter(para, titleElement);
        insertAfter(newLine, titleElement);
      }
    }
      // document.getElementById("title").style.border = t_border;

      if (i != "maybe") {
        var para = document.createElement("H2");
        para.innerHTML = content;
        para.classList.add("DBM_label");
        para.style.color = t_border;
        var newLine = document.createElement("br");
        var breakLine = document.createElement("hr");
        insertAfter(para, titleElement);
        insertAfter(newLine, titleElement);

        if(i=='yes'){
          document.getElementsByClassName("DBMNotFound")[num].src=chrome.extension.getURL("images/icon_logoRED.png");
        }
        else if(i=='no'){
          document.getElementsByClassName("DBMNotFound")[num].src=chrome.extension.getURL("images/icon_logoGREEN.png");
        }
      }
  }

  function insertAfter(newNode, referenceNode) {
    if (referenceNode != null) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }

// if (document.getElementById("buy-now-button")!=null){
//   document.getElementById("buy-now-button").addEventListener("click", () => {
//     alert("Was clicked!");
//   });
// }


  function checkDoc(doc="") {
    lookList = ["ASIN", "UPC", "ISBN-10", "ISBN-13"];
    if(doc==""){
      doc=document;
    }
    if (doc.getElementById("ap_container") !== null||doc.getElementById("productTitle")!== null) {
      for (var i = 0; i < lookList.length; i++) {
        rlist = item_Info(doc,lookList[i]);
        // console.log(rlist);
        if (rlist[0] == true){
          // console.log(rlist);
          return [rlist[1][0], rlist[1][1], rlist[2], rlist[3]];
        }
      }
    } else {
      // console.log("not product");
      return [];
    }
  }

  function item_Info(doc,t) {
    var list = doc.getElementsByClassName("a-list-item");
    for (var i = 0; i < list.length; i++) {
      var sList = list[i];
      if (sList.innerText.includes(t)) {
        // console.log(sList.innerText);
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

  function ASIN_from_Url(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
      var urlList = list[i].split('/');
      var ASIN = urlList[urlList.length - 2];
      result.push(ASIN);
    }
    return result;
  }


  // console.log(window.location.toString());
//order history adding
  if (window.location.toString().includes('order-history')) {
    var itemContent = document.getElementById("yourOrdersContent");
    var orders = itemContent.getElementsByClassName("a-fixed-left-grid-col a-col-right");
    var ordersImg = itemContent.getElementsByClassName("item-view-left-col-inner");
    if(ordersImg.length==0){
      ordersImg = itemContent.getElementsByClassName("a-col-left");
    }
    var orderLink = [];
    var odderImageLink=[];
    var DOMList=[];
    for (var i = 0; i < orders.length; i++) {
      var orderItems = orders[i].getElementsByClassName("a-link-normal")[0];
      var orderItemsImg=ordersImg[i].getElementsByTagName("img")[0].getAttribute('data-a-hires');
      odderImageLink.push(orderItemsImg);
      DOMList.push(orderItems);
      orderLink.push("https://www.amazon.com" + orderItems.getAttribute('href'));
    }
    // console.log(orderLink);
    var ASIN_list = ASIN_from_Url(orderLink)
    // console.log(ASIN_list);
    var port = chrome.runtime.connect({name: "ASINLookup"});
    port.postMessage({full_info: ASIN_list});
    port.onMessage.addListener(function (message, sender) {
      // console.log(message.loginStatus);
      if(message.loginStatus=="yes"){
        for(var j=0; j<DOMList.length;j++){
          if(message.ASINResult[j]==false){
            itemOwningStatus('no',DOMList[j],j);
          }else{
            itemOwningStatus('yes',DOMList[j],j);
          }
        }
      }else{
        itemOwningStatus('logout',document.getElementById('controlsContainer'));
      }
      // console.log(message.ASINResult);
    });
  } else {
    //normal product page
    infoList = checkDoc();
    // console.log(infoList);
    if(infoList!=null){
      if(infoList.length!=0){
        var port = chrome.runtime.connect({name: "lookup"});
        port.postMessage({login_check: "check", info: infoList});
        port.onMessage.addListener(function (message, sender) {
          // if(message.greeting === "hello"){
          // console.log(message.result);
          itemOwningStatus(message.result);
          // }
        });
      }
    }
  }


