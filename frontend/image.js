// Get the modal
var modal = document.getElementById('myModal');
 
// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

function clickZoom(element) {

    modal.style.display = "block";
    modalImg.src = element.src;
    modalImg.alt = element.dataset.alt;
    captionText.innerHTML = element.dataset.alt;
}

// When the user clicks on <span> (x), close the modal
modal.onclick = function() {

    img01.className += " out";
    setTimeout(function() {
       modal.style.display = "none";
       img01.className = "modal-content";
    }, 400);
}