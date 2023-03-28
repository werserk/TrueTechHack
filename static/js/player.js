const player = document.getElementById('videoPlayer');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');
const epilepsy = document.getElementById('epilepsy');
const colorBlind = document.getElementById('color-blind');
const videoId = parseInt(player.dataset.videoId, 10);


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
    updateVideoSettings(brightness.value / 100, contrast.value / 100, saturation.value / 100, hueRotate.value / 100);
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

const frameRate = 30;
const timePerFrame = 1 / frameRate;

function checkFrameAndApplyBlur() {
    const currentFrame = Math.floor(player.currentTime * timePerFrame);
    const currentFilter = player.style.filter;
    if (labels[currentFrame] === 1) {
        player.style.filter = `${currentFilter} blur(25px)`;
    } else {
        player.style.filter = currentFilter.replace(/blur\(25px\)/g, "").trim();
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
