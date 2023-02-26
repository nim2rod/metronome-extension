let intervalId;
let bpm
let volume = 1
let click = "./sound/click.wav"

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
    const audio = new Audio(click);
    audio.volume = volume
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

function volumeChange(ev) {
    const val = ev.target.value
    console.log('val', val)
    if (val === 'plus') {
        console.log('up');
        if (volume >= 1) return
        else volume += 0.1
        console.log('volume', volume)
    }
    if (val === 'minus') {
        if (volume <= 0.3) return
        else volume -= 0.1
        console.log('volume', volume)
    }
}

function soundChange(ev) {
    const sound = ev.target.value;
    console.log(sound);
    if (sound === 'drum') click = './sound/click1.mp3'
    if (sound === 'cowbell') click = './sound/click2.mp3'
    if (sound === 'wood') click = './sound/click.wav'
}


document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('bpm').addEventListener('change', start);
document.getElementById('minus').addEventListener('click', minus);
document.getElementById('plus').addEventListener('click', plus);
document.getElementById('volumeUp').addEventListener('click', volumeChange);
document.getElementById('volumeDown').addEventListener('click', volumeChange);
document.getElementById('sound1').addEventListener('click', soundChange);
document.getElementById('sound2').addEventListener('click', soundChange);
document.getElementById('sound3').addEventListener('click', soundChange);





