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

var videos = document.getElementsByTagName("video");
for (var i = 0; i < videos.length; i++) {
    videos[i].addEventListener("canplaythrough", function () {
        // Video has been preloaded, can now be played
    });
    videos[i].load();
}