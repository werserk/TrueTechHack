const player = document.getElementById('videoPlayer');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');
const epilepsy = document.getElementById('epilepsy');
const colorBlind = document.getElementById('color-blind');
const videoId = parseInt(player.dataset.videoId, 10);


function updateVideoSettings(brightness, contrast) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/update_video_settings/${videoId}`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Video settings updated successfully');
        } else {
            console.error('Failed to update video settings');
        }
    };
    xhr.send(`brightness=${brightness}&contrast=${contrast}`);
}

function updateFilter() {
    const brightnessValue = brightness.value;
    const contrastValue = contrast.value;
    const saturationValue = saturation.value;
    const hueRotateValue = hueRotate.value;

    player.style.filter = `brightness(${brightnessValue}%) contrast(${contrastValue}%) saturate(${saturationValue}%) hue-rotate(${hueRotateValue}deg)`;
    updateVideoSettings(brightnessValue / 100, contrastValue / 100);
}

function toggleEpilepsyFilter() {
    if (epilepsy.checked) {
        player.style.animation = 'none';
    } else {
        player.style.animation = '';
    }
}

function toggleColorBlindMode() {
    if (colorBlind.checked) {
        document.body.classList.add('color-blind-mode');
    } else {
        document.body.classList.remove('color-blind-mode');
    }
}

window.player = new Plyr('video', {});

// Set up event listeners for the input elements
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
epilepsy.addEventListener('change', toggleEpilepsyFilter);
colorBlind.addEventListener('change', toggleColorBlindMode);
