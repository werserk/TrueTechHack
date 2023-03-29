const player = document.getElementById('videoPlayer');
const epilepsyToggle = document.getElementById('checkbox-epilepsy');
const clipToggle = document.getElementById('checkbox-clip');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');
const videoId = parseInt(player.dataset.videoId, 10);

let clipLabels = [];
let epilepsyLabels = [];
let isClipToggleActive = false;
let isEpilepsyToggleActive = false;
let isClipActive = false;
let isEpilepsyActive = false;

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
    if (isClipActive) {
        player.style.filter = player.style.filter + " blur(25px)";
    }
    updateVideoSettings(brightness.value / 100, contrast.value / 100, saturation.value / 100, hueRotate.value);
}

async function fetchLabels(videoId) {
    try {
        const response = await fetch(`/video/${videoId}/clip_labels`);
        clipLabels = await response.json();
    } catch (error) {
        console.error("Error fetching labels:", error);
    }
    try {
        const response = await fetch(`/video/${videoId}/epilepsy_labels`);
        epilepsyLabels = await response.json();
    } catch (error) {
        console.error("Error fetching labels:", error);
    }
}

fetchLabels(videoId).then(() => {
    requestAnimationFrame(checkFrameAndApplyBlur);
});

function checkFrameAndApplyBlur() {
    const currentFrame = Math.floor(player.currentTime / player.duration * clipLabels.length);
    if (isClipToggleActive) {
        if (clipLabels[currentFrame] === 1) {
            if (!isClipActive) {
                player.style.filter = `${player.style.filter} blur(25px)`;
                isClipActive = true;
            }
        } else {
            if (isClipActive) {
                player.style.filter = player.style.filter.replace("blur(25px)", "");
                isClipActive = false;
            }
        }
    } else {
        if (isClipActive) {
            player.style.filter = player.style.filter.replace("blur(25px)", "");
            isClipActive = false;
        }
    }

    if (isEpilepsyToggleActive) {
        if (epilepsyLabels[currentFrame] === 1) {
            if (!isEpilepsyActive) {
                player.style.filter = `${player.style.filter} blur(25px)`;
                isEpilepsyActive = true;
            }
        } else {
            if (isEpilepsyActive) {
                player.style.filter = player.style.filter.replace("blur(25px)", "");
                isEpilepsyActive = false;
            }
        }
    } else {
        if (isEpilepsyActive) {
            player.style.filter = player.style.filter.replace("blur(25px)", "");
            isEpilepsyActive = false;
        }
    }
    requestAnimationFrame(checkFrameAndApplyBlur);
}

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

window.player = new Plyr('video', {
    speed: {
        selected: 1,
        options: [0.5, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 2]
    }
});
requestAnimationFrame(checkFrameAndApplyBlur);
updateFilter();

// Set up event listeners for the input elements
clipToggle.addEventListener("click", toggleClipState);
epilepsyToggle.addEventListener("click", toggleEpilepsyState);
brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
