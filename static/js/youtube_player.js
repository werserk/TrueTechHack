const epilepsyToggle = document.getElementById('checkbox-epilepsy');
const clipToggle = document.getElementById('checkbox-clip');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');

let clipLabels = [];
let epilepsyLabels = [];
let isClipToggleActive = false;
let isEpilepsyToggleActive = false;
let isClipActive = false;
let isEpilepsyActive = false;

function updateFilter() {
    video.style.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hueRotate.value}deg)`;
    if (isClipActive) {
        video.style.filter = video.style.filter + " blur(25px)";
    }
}

const player = new Plyr('#videoPlayer', {
    speed: {
        selected: 1,
        options: [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2]
    }
})
window.player = player;
const video = document.getElementsByClassName("plyr__video-wrapper plyr__video-embed")[0];
console.log(video)
updateFilter();

function toggleClipState() {
    isClipToggleActive = !isClipToggleActive;
    if (isClipToggleActive) {
        clipToggle.classList.add("checked");
    } else {
        clipToggle.classList.remove("checked");
    }
}

function toggleEpilepsyState() {
    isEpilepsyToggleActive = !isEpilepsyToggleActive;
    if (isEpilepsyToggleActive) {
        epilepsyToggle.classList.add("checked");
    } else {
        epilepsyToggle.classList.remove("checked");
    }
}

// Set up event listeners for the input elements
clipToggle.addEventListener("click", toggleClipState);
epilepsyToggle.addEventListener("click", toggleEpilepsyState);
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
