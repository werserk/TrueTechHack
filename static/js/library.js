const link = document.getElementById("linkHolder")

document.addEventListener('DOMContentLoaded', function () {
    const videoContainers = document.querySelectorAll('.video-grid-item video');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        container.addEventListener('mouseenter', () => {
            video.play();
        });
        container.addEventListener('mouseleave', () => {
            video.pause();
        });
    });
});

function extractVideoId(link) {
    const regex = /v=([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])/;
    const match = link.match(regex);
    return match ? match[1] : null;
}

document.getElementById("inputButton").addEventListener("click", function () {
    console.log(link);
    const videoId = extractVideoId(link.value);
    if (videoId) {
        const url = "/youtube_player/" + videoId;
        window.location.href = url;
    } else {
        alert("Invalid YouTube link.");
    }
});