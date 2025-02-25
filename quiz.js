// THEME BUTTON
const toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", () => {
    document.body.classList.add("fade-transition");
    document.body.classList.toggle("dark-mode");
    
    setTimeout(() => {
        document.body.classList.remove("fade-transition"); 
    }, 500);
    
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};

// AUDIO BUTTON
var audio = document.getElementById("customAudio");
        var isPaused = false; 
    
        function playAudio() {
            isPaused = false; 
            audio.play();
        }
    
        function pauseAudio() {
            isPaused = true; 
            audio.pause();
        }
    
        audio.addEventListener("ended", function () {
            if (!isPaused) {
                this.currentTime = 0;
                this.play(); 
            }
        });
