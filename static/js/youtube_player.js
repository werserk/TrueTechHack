const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');

function updateFilter() {
    video.style.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hueRotate.value}deg)`;
}

const player = new Plyr('#videoPlayer', {
    speed: {
        selected: 1,
        options: [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]
    }
});

window.player = player;
const video = document.getElementsByClassName("plyr__video-wrapper plyr__video-embed")[0];
console.log(video)
updateFilter();

// Set up event listeners for the input elements
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
