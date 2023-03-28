const player = document.getElementById('videoPlayer');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');
const epilepsy = document.getElementById('epilepsy');
const colorBlind = document.getElementById('color-blind');
const videoId = parseInt(player.dataset.videoId, 10);
const blurToggle = document.getElementById('blur-toggle');


function updateVideoSettings(brightness, contrast, saturate, hueRotate) {
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
    xhr.send(`brightness=${brightness}&contrast=${contrast}&saturate=${saturate}&hueRotate=${hueRotate}`);
}

function updateFilter() {
    player.style.filter = `brightness(${brightness.value}%) contrast(${contrast.value}%) saturate(${saturation.value}%) hue-rotate(${hueRotate.value}deg)`;
    updateVideoSettings(brightness.value / 100, contrast.value / 100, saturation.value / 100, hueRotate.value);
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

let labels = [];
let isBlurred = false;

async function fetchLabels(videoId) {
    try {
        const response = await fetch(`/video/${videoId}/labels`);
        labels = await response.json();
    } catch (error) {
        console.error("Error fetching labels:", error);
    }
}

fetchLabels(videoId).then(() => {
    requestAnimationFrame(checkFrameAndApplyBlur);
});

function checkFrameAndApplyBlur() {
    const currentFrame = Math.floor(player.currentTime / player.duration * labels.length);
    if (!blurToggle.checked) {
        if (labels[currentFrame] === 1) {
            if (!isBlurred) {
                player.style.filter = `${player.style.filter} blur(25px)`;
                isBlurred = true;
            }
        } else {
            if (isBlurred) {
                player.style.filter = player.style.filter.replace("blur(25px)", "");
                isBlurred = false;
            }
        }
    } else {
        if (isBlurred) {
            player.style.filter = player.style.filter.replace("blur(25px)", "");
            isBlurred = false;
        }
    }
    requestAnimationFrame(checkFrameAndApplyBlur);
}

requestAnimationFrame(checkFrameAndApplyBlur);


window.player = new Plyr('video');

// Set up event listeners for the input elements
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
epilepsy.addEventListener('change', toggleEpilepsyFilter);
colorBlind.addEventListener('change', toggleColorBlindMode);
