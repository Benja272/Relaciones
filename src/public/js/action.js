
function btnClick(e){
    let optio = document.getElementById("selec");
    let optionValue = optio.options[optio.selectedIndex].value;
    let name = document.getElementById("name").value;

    var link = "mailto:bm0130647@gmail.com"
             + "?cc=bm0130647@gmail.com"
             + "&subject=" + encodeURIComponent(name)
             + "&body=" + encodeURIComponent(optionValue)
    ;
    
    console.log("Llamo a la funcion vlcik")
    window.location.href = link;
    e.stopPropagation();
}
