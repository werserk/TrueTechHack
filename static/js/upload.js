const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const filename = document.getElementById("filename");
const progressBar = document.getElementById("progress-bar");
const form = document.getElementById("upload-form");

dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("active");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("active");
});

dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    dropzone.classList.remove("active");

    handleFiles(files);
});

dropzone.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    if (validateFiles(fileInput.files)) {
        handleFiles(fileInput.files);
    } else {
        dropzone.classList.add("invalid");
    }
});

function validateFiles(files) {
    const allowedExtensions = ["mp4", "avi", "wmv", "mov"];
    const fileExtension = files[0].name.split(".").pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
}

function handleFiles(files) {
    if (validateFiles(files)) {
        const file = files[0];
        dropzone.classList.add("valid");

        // Display filename
        filename.textContent = file.name;
        filename.style.display = "inline-block";

        // Show progress bar
        progressBar.style.display = "block";

        // Upload file using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open("POST", form.action);
        xhr.upload.addEventListener("progress", (event) => {
            const percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
        });
        xhr.addEventListener("load", (event) => {
            // handle success or failure
        });
        xhr.send(new FormData(form));

    } else {
        dropzone.classList.add("invalid");
    }
}
