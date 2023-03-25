document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const overlay = document.getElementById("overlay");

    form.addEventListener("submit", function () {
        overlay.style.display = "flex";
    });
});