document.addEventListener("DOMContentLoaded", function () {
    const inputFields = document.getElementsByClassName("input-field");

    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].addEventListener("input", function () {
            if (this.value) {
                this.classList.add("not-empty");
            } else {
                this.classList.remove("not-empty");
            }
        });
    }
});
