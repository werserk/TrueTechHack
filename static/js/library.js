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