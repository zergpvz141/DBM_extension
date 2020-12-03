window.processData=function(myObj) {
    console.log(myObj);

    /* Function to display the track name and the
    genre name from the received data. */
    var para = document.getElementById("title");
    para.innerHTML = para.innerHTML + myObj;
}
console.log("callback loaded");
