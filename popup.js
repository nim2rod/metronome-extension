let intervalId;
let bpm

console.log('popup.js go!')

function start() {
    console.log('start')
    clearInterval(intervalId);
    bpm = parseInt(document.getElementById("bpm").value);
    intervalId = setInterval(playClick, (60 / bpm) * 1000);
    console.log('bpm', bpm)
}

function stop() {
    clearInterval(intervalId);
}

function playClick() {
    const audio = new Audio("./click.wav");
    audio.play();
}

function plus() {
    document.getElementById("bpm").value++
    start()
}

function minus() {
    document.getElementById("bpm").value--
    start()
}

document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('bpm').addEventListener('click', start);
document.getElementById('minus').addEventListener('click', minus);
document.getElementById('plus').addEventListener('click', plus);


