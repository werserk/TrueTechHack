const videoPlayer = document.getElementById('videoPlayer');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');
const epilepsy = document.getElementById('epilepsy');
const colorBlind = document.getElementById('color-blind');

function updateFilter() {
    const brightnessValue = brightness.value;
    const contrastValue = contrast.value;
    const saturationValue = saturation.value;
    const hueRotateValue = hueRotate.value;

    videoPlayer.style.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) hue-rotate(${hueRotateValue}deg)`;
}

function toggleEpilepsyFilter() {
    if (epilepsy.checked) {
        videoPlayer.style.animation = 'none';
    } else {
        videoPlayer.style.animation = '';
    }
}

function toggleColorBlindMode() {
    if (colorBlind.checked) {
        document.body.classList.add('color-blind-mode');
    } else {
        document.body.classList.remove('color-blind-mode');
    }
}

// Set up event listeners for the input elements
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
epilepsy.addEventListener('change', toggleEpilepsyFilter);
colorBlind.addEventListener('change', toggleColorBlindMode);
