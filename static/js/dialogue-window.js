// Get the modal
const modal = document.querySelector("#editModal");

// Get the button that opens the modal
const btn = document.querySelector("#editButton");

// Get the button element that closes the modal
const closeButton = document.querySelector(".close-button");

// When the user clicks the button, open the modal
btn.addEventListener("click", function () {
    modal.style.display = "block";
});

// When the user clicks the close button, close the modal
closeButton.addEventListener("click", function () {
    modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});