document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("upload-form");
    const fileInput = document.getElementById("file-input");
    const progressBar = document.getElementById("progress-bar");
    const overlay = document.getElementById("overlay");

    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        overlay.style.display = "flex";

        // Create a new FormData object and append the file
        const formData = new FormData();
        formData.append("video", fileInput.files[0]);

        // Send the file using AJAX
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadForm.action, true);

        // Update the progress bar
        xhr.upload.addEventListener("progress", function (event) {
            if (event.lengthComputable) {
                progressBar.value = (event.loaded / event.total) * 100;
            }
        });

        // Hide the overlay when the upload is complete
        xhr.addEventListener("load", function () {
            overlay.style.display = "none";
            if (xhr.status === 200) {
                // Handle successful upload
                alert("File uploaded successfully.");
            } else {
                // Handle errors
                alert("An error occurred while uploading the file.");
            }
        });

        xhr.send(formData);
    });
});
