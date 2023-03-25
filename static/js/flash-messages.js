function deleteFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-messages li');
    flashMessages.forEach((message) => {
        const progressBar = message.querySelector('.progress-bar');
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', deleteFlashMessages);