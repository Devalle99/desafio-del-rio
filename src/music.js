document.addEventListener("DOMContentLoaded", function () {
    const musicButton = document.getElementById("music-button");
    const music = new Audio("./audio/music.mp3");
    music.loop = true;

    // Play music by default
    // music.play();

    // Toggle music on button click
    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            musicButton.textContent = "🔈";
        } else {
            music.pause();
            musicButton.textContent = "🔇";
        }
    });
});
