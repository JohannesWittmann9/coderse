/* eslint-env browser */

import { Observable, Event } from "../../../utils/Observable.js";

var iconLight,
    title,
    time,
    iconStart,
    iconStop,
    startTime,
    timerInterval,
    audioLength;

class Recorder extends Observable {

    constructor() {
        super();
        this.initUI();
    }

    initUI() {
        iconLight = document.querySelector(".recorder-icon-light");
        title = document.querySelector(".recorder-title");
        time = document.querySelector(".recorder-time");
        iconStart = document.querySelector(".recorder-icon-start");
        iconStop = document.querySelector(".recorder-icon-stop");
        this.iconSave = document.querySelector(".recorder-icon-save");
        this.iconSave.addEventListener("click", this.onSaveRecordingClicked.bind(this));
        iconStart.addEventListener("click", this.onStartRecording.bind(this));
        iconStop.addEventListener("click", this.onStopRecordingClicked.bind(this));
        this.iconTrash = document.querySelector(".recorder-icon-trash");
        this.iconTrash.addEventListener("click", this.onTrashClicked.bind(this));
    }
  
    onStopRecordingClicked() {
        this.showIconTrash();
        this.hideIconStop();
        clearInterval(timerInterval);
        let data = {
                title: title.value,
                time: audioLength,
            },
            event = new Event("stop-recording", data);
        this.notifyAll(event);
    }

    onTrashClicked() {
        this.hideIconSave();
        this.hideIconTrash();
        this.hideIconStop();
        this.showIconMic();
        stopTimer();
        this.notifyAll(new Event("delete-recording", "currentRec"));
    }

    onSaveRecordingClicked() {
        console.log("Recording stops");
        stopTimer();
        this.hideIconSave();
        this.hideIconTrash();
        this.showIconMic();

        // toggleIconLight();
        let data = {
                title: title.value,
                time: audioLength,
            },
            event = new Event("save-recording", data);
        this.notifyAll(event);
        title.value = "";
        audioLength = "00:00";
    }

    onStartRecording() {
        console.log("Recording starts");
        this.hideIconMic();
        this.showIconStop();
        startTimer();
        // toggleIconLight();
        let event = new Event("start-recording", "data");
        this.notifyAll(event);
    }

    getTitle() {
        return title.value;
    }

    getAudioTime() {
        return audioLength;
    }

    hideIconSave() {
        this.iconSave.classList.add("hidden");
    }

    showIconSave() {
        this.iconSave.classList.remove("hidden");
    }

    hideIconStop() {
        iconStop.classList.add("hidden");
    }

    showIconStop() {
        iconStop.classList.remove("hidden");
    }

    hideIconMic() {
        iconStart.classList.add("hidden");
    }

    showIconMic() {
        iconStart.classList.remove("hidden");
    }

    hideIconTrash() {
        this.iconTrash.classList.add("hidden");
    }

    showIconTrash() {
        this.iconTrash.classList.remove("hidden");
    }

    stopTimer() {
        stopTimer();
    }

}

//Starts the timer, stores the start time and shows the current length of the recording audio file
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        let currentTime = Date.now(),
            formatter = new Intl.NumberFormat('de-DE', { minimumIntegerDigits: 2 }),
            minutes,
            seconds;
        audioLength = Math.floor((currentTime - startTime) / 1000);
        minutes = formatter.format(Math.floor(audioLength / 60));
        seconds = formatter.format(audioLength % 60);
        audioLength = minutes + ":" + seconds;
        time.innerHTML = audioLength;
    }, 1000);
}

//Stops the timer and showing the time in the UI
function stopTimer() {
    clearInterval(timerInterval);
    time.innerHTML = "00:00";
}

//Turns the Lightbulb on
function turnLightOn(){
        iconLight.style.borderRadius = "999px";
        iconLight.style.background = "grey";
}
//Turns the Lightbulb off
function turnLightOff(){
    iconLight.style.background = "transparent";
}


export default Recorder;
