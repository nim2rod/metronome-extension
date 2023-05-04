let intervalId;
let volume = 1
let primaryClick = "./sound/digit.wav"
let seconderyClick = "./sound/digit-up.wav"

let playIsOn = false;
let GlobalSong = { songName: null, bpm: null }
let songsFromStorage = []
let division = 1
let beatCount = 1
let holdFirstBeat = true

document.addEventListener('keydown', function (event) {
    console.log('event.code: ', event.code)
    if (event.code === 'Space') {
        let trackName = document.getElementById("input-song").value
        if (trackName) return
        if (playIsOn) {
            stop();
            playIsOn = false;
        } else {
            start();
            playIsOn = true;
        }
        event.preventDefault(); // prevent default space key behavior (scrolling)
    }
    if (event.code === 'Enter') addSong()
    if (event.code === 'ArrowUp') volumeChange('up')
    if (event.code === 'ArrowDown') volumeChange('down')
    if (event.code === 'ArrowRight') bpmChange('plus')
    if (event.code === 'ArrowLeft') bpmChange('minus')
});

init()
function init() {
    const data = getFromLocal()
    if (data && data.length) {
        songsFromStorage = data
        renderSongs(songsFromStorage)
    }
}

function start() {
    beatCount = 1
    const bpmInit = document.getElementById("bpm").value
    document.querySelector('.bpm-show').innerHTML = bpmInit
    clearInterval(intervalId);
    bpm = parseInt(bpmInit);
    bpm = bpm * division
    intervalId = setInterval(playClick, (60 / bpm) * 1000);
    playIsOn = true
}

function stop() {
    clearInterval(intervalId);
    playIsOn = false
    beatCount = 1
}

function playClick() {
    let audio = null
    if (division === 1 || beatCount === 1) { //primary
        audio = new Audio(primaryClick)
    } else {                                   // secondery
        audio = new Audio(seconderyClick);
    }
    audio.volume = volume
    audio.play();
    beatCount++
    if (beatCount === division + 1) beatCount = 1
}

function moveBpmRange() {
    const bpmChange = document.getElementById("bpm").value
    if (GlobalSong.songName) {
        GlobalSong.bpm = bpmChange
        update()
    }
    start()
}

function bpmChange(ev) {
    let val = null
    if (ev === 'plus') val = 'plus'
    else if (ev === 'minus') val = 'minus'
    else val = ev.target.value
    if (val === 'plus') {
        document.getElementById("bpm").value++
        if (GlobalSong.songName) GlobalSong.bpm++
    }
    if (val === 'minus') {
        document.getElementById("bpm").value--
        if (GlobalSong.songName) GlobalSong.bpm--
    }
    if (GlobalSong.songName) {
        update()
    }
    start()
}

function volumeChange(ev) {
    let val = null
    if (ev === 'up') val = 'up'
    else if (ev === 'down') val = 'down'
    else val = ev.target.dataset.value
    if (val === 'up') {
        if (volume >= 1) return
        else volume += 0.1
    }
    if (val === 'down') {
        if (volume <= 0.3) return
        else volume -= 0.1
    }
}

function soundChange(ev) {
    const sound = ev.target.dataset.value;
    if (sound === 'stick') {
        primaryClick = './sound/stick.wav'
        seconderyClick = './sound/stick-up.wav'
    }
    if (sound === 'cowbell') {
        primaryClick = './sound/bell.wav'
        seconderyClick = './sound/bell-up.wav'
    }
    if (sound === 'met') {
        primaryClick = './sound/met.wav'
        seconderyClick = './sound/met-up.wav'
    }
    if (sound === 'pulse') {
        primaryClick = './sound/digit.wav'
        seconderyClick = './sound/digit-up.wav'
    }
    beatCount = 1
}

function addSong() {
    let bpm = document.getElementById("bpm").value
    let trackName = document.getElementById("input-song").value
    if (!trackName) return
    const checkIfUniq = songsFromStorage.find((song) => song.songName === trackName)
    if (checkIfUniq) {
        document.querySelector('.input-song').value = ``
        return
    }

    const newSong = { songName: trackName, bpm: bpm }
    GlobalSong = { ...newSong }
    copyGlobal = { ...newSong }
    songsFromStorage.push(copyGlobal)
    setToLocal(songsFromStorage)
    renderSongs(songsFromStorage)

    document.querySelector('.input-song').value = ``
}

function pickNewSong(bpm, trackName) {
    GlobalSong = { songName: trackName, bpm: bpm }
    document.getElementById("bpm").value = bpm
    document.querySelector('.bpm-show').innerHTML = bpm
    stop()
    // start()
}

function renderSongs(songs) {
    document.querySelector('.list').innerHTML = ``
    songs.forEach((song) => {
        document.querySelector('.list').innerHTML += `
        <div id="song-line" class="song-line btn">
        <span id="song-name" class="song-name">${song.songName}</span>
        <span class="song-line-right"><span id="song-bpm" class="song-bpm">${song.bpm}</span> 
        <img id="delete-song" class="delete-song btn" src="./icons/x-mark.png" alt="" data-value="stick">
        </span></div>
        `
    })

    const songLines = document.querySelectorAll('#song-line');
    songLines.forEach(songLine => {
        const lineBpm = songLine.querySelector('.song-bpm').textContent;
        const lineTrackName = songLine.querySelector('.song-name').textContent;
        songLine.addEventListener('click', function () {
            pickNewSong(lineBpm, lineTrackName);
            songLines.forEach(line => {
                line.classList.remove('selected')
            });

            this.classList.add('selected')
        });
        if (lineTrackName === GlobalSong.songName) songLine.classList.add('selected')

        const deleteBtn = songLine.querySelector('.delete-song')
        const songToDelete = { songName: lineTrackName, bpm: lineBpm }
        deleteBtn.addEventListener('click', function () {
            remove(songToDelete)
        })
    });
}

function getFromLocal() {
    // let res
    // chrome.storage.local.get("songsList", function (result) {
    //     res = JSON.parse(result.songsList)
    // })
    // return res
    let data = localStorage.getItem('songsList')
    return JSON.parse(data)
}

function setToLocal(songs) {
    localStorage.setItem('songsList', JSON.stringify(songs))
}

function update() {
    let songToReplace = { ...GlobalSong }
    const index = songsFromStorage.findIndex((song) => {
        return song.songName === songToReplace.songName
    })
    songsFromStorage.splice(index, 1, songToReplace)

    setToLocal(songsFromStorage)
    renderSongs(songsFromStorage)
}

function remove(songToDelete) {
    const index = songsFromStorage.findIndex((song) => {
        return song.songName === songToDelete.songName
    })
    songsFromStorage.splice(index, 1)
    setToLocal(songsFromStorage)
    renderSongs(songsFromStorage)
}

document.getElementById('start').addEventListener('click', start);
document.getElementById('stop').addEventListener('click', stop);
document.getElementById('bpm').addEventListener('input', moveBpmRange);
document.getElementById('minus').addEventListener('click', bpmChange);
document.getElementById('plus').addEventListener('click', bpmChange);
document.getElementById('volumeUp').addEventListener('click', volumeChange);
document.getElementById('volumeDown').addEventListener('click', volumeChange);
document.getElementById('add-song').addEventListener('click', addSong);
const sounds = document.querySelectorAll('.sound');
sounds.forEach(sound => {
    sound.addEventListener('click', soundChange);
});
document.querySelector('.bpm-show').innerHTML = document.getElementById("bpm").value

const tapTempoButton = document.getElementById('tap-tempo');
let tapTempoTimes = [];
let lastTimeClicked = 0;

tapTempoButton.addEventListener('click', function () {
    let tempo
    const now = performance.now();
    if (lastTimeClicked !== 0) {
        const timeDiff = now - lastTimeClicked;
        if (lastTimeClicked !== 0 && timeDiff > 2500) tapTempoTimes = []
        else tapTempoTimes.push(timeDiff);
        if (tapTempoTimes.length > 4) {
            tapTempoTimes.shift();
        }
        const averageTime = tapTempoTimes.reduce((a, b) => a + b, 0) / tapTempoTimes.length;
        tempo = Math.round(60000 / averageTime);
    }
    lastTimeClicked = now;
    if (tapTempoTimes.length > 1) {
        document.getElementById("bpm").value = tempo
        if (GlobalSong.songName) {
            GlobalSong.bpm = tempo
            update()
        }
        start()
    }

});

const bpmDivides = document.querySelectorAll('.divide-box span');
bpmDivides.forEach((divide) => {
    divide.addEventListener('click', (ev) => {
        division = +ev.target.dataset.value
        start()
        bpmDivides.forEach((divide) => divide.classList.remove('active'));
        divide.classList.add('active');
    });
    bpmDivides[0].classList.add('active');
});






