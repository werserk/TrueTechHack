const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const saturation = document.getElementById('saturation');
const hueRotate = document.getElementById('hue-rotate');


function updateUserSettings(brightness, contrast, saturate, hueRotate) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/profile_settings_update`);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('User settings updated successfully');
        } else {
            console.error('Failed to update user settings');
        }
    };
    xhr.send(`brightness=${brightness}&contrast=${contrast}&saturate=${saturate}&hueRotate=${hueRotate}`);
}

function updateFilter() {
    updateUserSettings(brightness.value / 100, contrast.value / 100, saturation.value / 100, hueRotate.value);
}

updateFilter()

brightness.addEventListener('input', updateFilter);
contrast.addEventListener('input', updateFilter);
saturation.addEventListener('input', updateFilter);
hueRotate.addEventListener('input', updateFilter);
