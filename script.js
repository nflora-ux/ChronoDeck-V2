const video = document.getElementById('bg-video');
const audioAdzan = new Audio('sound/adzan.mp3');
audioAdzan.volume = 1.0;
const audioAlarm = new Audio('sound/alarm.mp3');
audioAlarm.volume = 1.0;

let musicPlaylist = [];
let shuffleQueue = [];
let currentQueueIndex = -1;
let musicAudio = new Audio();
let isMusicPlaying = false;
let loopMode = false;
let wasPlayingBeforeAdhan = false;
let adhanActive = false;
let alarmActive = false;
let alarmWasPlaying = false;
let adhanWasPlaying = false;
let alarmTimeouts = [];
let countdownInterval = null;
let currentAdhanTime = null;

const trackNameEl = document.getElementById('track-name');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loopBtn = document.getElementById('loop-btn');
const loopIcon = loopBtn.querySelector('i');
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const notificationBox = document.getElementById('notification-box');
const notificationMsg = document.getElementById('notification-message');
const notificationCountdown = document.getElementById('notification-countdown');
const closeNotif = document.getElementById('close-notification');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const openSettingsClock = document.getElementById('open-settings-clock');
const tabBtns = document.querySelectorAll('.tab-btn');
const audioListEl = document.getElementById('audio-list');
const backgroundListEl = document.getElementById('background-list');
const uploadBackgroundBtn = document.getElementById('upload-background-btn');
const backgroundInput = document.getElementById('background-input');
const liveClock = document.getElementById('live-clock');
const liveDate = document.getElementById('live-date');
const prayerTimesList = document.getElementById('prayer-times-list');
const prayerLocation = document.getElementById('prayer-location');
const currentDatetimeEl = document.getElementById('current-datetime');

let currentLocation = { lat: -6.2088, lon: 106.8456 };
let prayerTimings = {};
let prayerTimeouts = [];
let db = null;
let backgroundList = [];
let audioFiles = [];
let currentBackgroundUrl = null;

closeNotif.addEventListener('click', () => {
    if (alarmActive) {
        audioAlarm.pause();
        audioAlarm.currentTime = 0;
        alarmActive = false;
        clearInterval(countdownInterval);
        countdownInterval = null;
        if (!adhanActive && alarmWasPlaying) resumeMusic();
        alarmWasPlaying = false;
    } else if (adhanActive) {
        audioAdzan.pause();
        audioAdzan.currentTime = 0;
        adhanActive = false;
        if (!alarmActive && adhanWasPlaying) resumeMusic();
        adhanWasPlaying = false;
    }
    notificationBox.classList.add('hidden');
});

function showNotification(message) {
    notificationMsg.textContent = message;
    notificationCountdown.textContent = '';
    notificationBox.classList.remove('hidden');
}

function pauseMusic() {
    if (musicAudio && !musicAudio.paused) {
        musicAudio.pause();
        isMusicPlaying = false;
        playPauseIcon.className = 'fas fa-play';
    }
}

function resumeMusic() {
    if (musicAudio.src && currentQueueIndex !== -1 && !adhanActive && !alarmActive) {
        musicAudio.play().catch(() => {});
        isMusicPlaying = true;
        playPauseIcon.className = 'fas fa-pause';
    }
}

function playCurrent() {
    if (currentQueueIndex === -1 || shuffleQueue.length === 0) return;
    const idx = shuffleQueue[currentQueueIndex];
    const item = musicPlaylist[idx];
    if (!item) return;
    musicAudio.src = item.url;
    musicAudio.load();
    musicAudio.play().then(() => {
        isMusicPlaying = true;
        playPauseIcon.className = 'fas fa-pause';
        trackNameEl.textContent = item.name;
    }).catch(() => {});
}

function playTrackByIndex(playlistIndex) {
    const pos = shuffleQueue.indexOf(playlistIndex);
    if (pos !== -1) {
        currentQueueIndex = pos;
        playCurrent();
    }
}

function buildShuffleQueue() {
    const n = musicPlaylist.length;
    shuffleQueue = Array.from({ length: n }, (_, i) => i);
    for (let i = shuffleQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffleQueue[i], shuffleQueue[j]] = [shuffleQueue[j], shuffleQueue[i]];
    }
    if (currentQueueIndex !== -1) {
        const currentTrack = musicPlaylist[currentQueueIndex]?.id;
        if (currentTrack) {
            const newPos = musicPlaylist.findIndex(item => item.id === currentTrack);
            if (newPos !== -1) {
                currentQueueIndex = shuffleQueue.indexOf(newPos);
            } else {
                currentQueueIndex = -1;
                musicAudio.src = '';
                trackNameEl.textContent = '—  tidak ada musik  —';
                isMusicPlaying = false;
                playPauseIcon.className = 'fas fa-play';
            }
        }
    }
}

musicAudio.addEventListener('ended', () => {
    if (loopMode) {
        playCurrent();
    } else {
        if (currentQueueIndex + 1 < shuffleQueue.length) {
            currentQueueIndex++;
            playCurrent();
        } else {
            currentQueueIndex = -1;
            musicAudio.src = '';
            trackNameEl.textContent = '—  selesai  —';
            isMusicPlaying = false;
            playPauseIcon.className = 'fas fa-play';
        }
    }
});

playPauseBtn.addEventListener('click', () => {
    if (!musicPlaylist.length) return;
    if (isMusicPlaying) {
        musicAudio.pause();
        isMusicPlaying = false;
        playPauseIcon.className = 'fas fa-play';
    } else {
        if (musicAudio.src && currentQueueIndex !== -1) {
            musicAudio.play().catch(() => {});
            isMusicPlaying = true;
            playPauseIcon.className = 'fas fa-pause';
        } else if (musicPlaylist.length) {
            buildShuffleQueue();
            currentQueueIndex = 0;
            playCurrent();
        }
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQueueIndex > 0) {
        currentQueueIndex--;
        playCurrent();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentQueueIndex + 1 < shuffleQueue.length) {
        currentQueueIndex++;
        playCurrent();
    }
});

loopBtn.addEventListener('click', () => {
    loopMode = !loopMode;
    loopIcon.className = loopMode ? 'fas fa-repeat' : 'fas fa-repeat';
    loopBtn.classList.toggle('active', loopMode);
});

uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
        const id = await saveAudio(file, file.name);
        const url = URL.createObjectURL(file);
        musicPlaylist.push({ id, name: file.name, url, data: await fileToDataURL(file) });
    }
    renderAudioList();
    buildShuffleQueue();
    if (!isMusicPlaying && !musicAudio.src && musicPlaylist.length > 0) {
        currentQueueIndex = 0;
        playCurrent();
    }
});

function handleAlarm(prayerName, adzanTime) {
    if (adhanActive || alarmActive) return;
    alarmActive = true;
    alarmWasPlaying = isMusicPlaying;
    pauseMusic();

    audioAlarm.currentTime = 0;
    audioAlarm.play().catch(() => {});

    notificationMsg.textContent = `SIAP SIAP! Sebentar lagi adzan ${prayerName}!`;
    notificationCountdown.textContent = '';
    notificationBox.classList.remove('hidden');

    currentAdhanTime = adzanTime;

    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = Date.now();
        const diff = adzanTime - now;
        if (diff <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
            return;
        }
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        notificationCountdown.textContent = `${minutes}:${seconds.toString().padStart(2,'0')}`;
    }, 1000);
}

audioAlarm.addEventListener('ended', () => {
    if (alarmActive) {
        alarmActive = false;
        clearInterval(countdownInterval);
        countdownInterval = null;
        notificationBox.classList.add('hidden');
        if (!adhanActive && alarmWasPlaying) resumeMusic();
        alarmWasPlaying = false;
    }
});

function handleAdhan(prayerName) {
    if (adhanActive) return;
    if (alarmActive) {
        audioAlarm.pause();
        audioAlarm.currentTime = 0;
        alarmActive = false;
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    adhanActive = true;
    adhanWasPlaying = isMusicPlaying;
    pauseMusic();
    audioAdzan.currentTime = 0;
    audioAdzan.volume = 1.0;
    audioAdzan.play().catch(() => {});
    showNotification(`waktu sholat • ${prayerName}`);
}

audioAdzan.addEventListener('ended', () => {
    adhanActive = false;
    notificationBox.classList.add('hidden');
    if (!alarmActive && adhanWasPlaying) resumeMusic();
    adhanWasPlaying = false;
});

function computePrayerTimes(lat, lon) {
    const prayTimes = window.prayTimes;
    if (!prayTimes) return {};
    prayTimes.setMethod('MWL');
    prayTimes.tune({ imsak: 2, fajr: 2, dhuhr: 2, asr: 2, maghrib: 2, isha: 2 });
    const date = new Date();
    const times = prayTimes.getTimes(date, [lat, lon], 'auto', 'auto', '24h');
    if (!times) return {};
    return {
        Fajr: times.fajr,
        Dhuhr: times.dhuhr,
        Asr: times.asr,
        Maghrib: times.maghrib,
        Isha: times.isha,
        Imsak: times.imsak,
        Sunrise: times.sunrise,
        Sunset: times.sunset
    };
}

function schedulePrayerEvents(timings) {
    prayerTimeouts.forEach(clearTimeout);
    prayerTimeouts = [];
    alarmTimeouts.forEach(clearTimeout);
    alarmTimeouts = [];

    const now = new Date();
    const prayerMap = {
        'Fajr': 'Subuh',
        'Dhuhr': 'Zuhur',
        'Asr': 'Ashar',
        'Maghrib': 'Maghrib',
        'Isha': 'Isya'
    };

    Object.entries(prayerMap).forEach(([en, id]) => {
        const timeStr = timings[en];
        if (!timeStr) return;
        const [h, m] = timeStr.split(':').map(Number);
        const prayerDate = new Date(now);
        prayerDate.setHours(h, m, 0, 0);
        if (prayerDate < now) prayerDate.setDate(prayerDate.getDate() + 1);

        const alarmDate = new Date(prayerDate.getTime() - 10 * 60000);
        const nowTime = now.getTime();
        const adzanTime = prayerDate.getTime();

        if (alarmDate > nowTime) {
            const timeoutId = setTimeout(() => {
                handleAlarm(id, adzanTime);
            }, alarmDate - nowTime);
            alarmTimeouts.push(timeoutId);
        }

        if (adzanTime > nowTime) {
            const timeoutId = setTimeout(() => {
                handleAdhan(id);
            }, adzanTime - nowTime);
            prayerTimeouts.push(timeoutId);
        }
    });

    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const timeoutId = setTimeout(() => {
        fetchAndSchedule();
    }, midnight.getTime() - now.getTime());
    prayerTimeouts.push(timeoutId);
}

function updatePrayerList(timings) {
    if (!timings) return;
    const prayerMap = {
        'Fajr': 'Subuh',
        'Dhuhr': 'Zuhur',
        'Asr': 'Ashar',
        'Maghrib': 'Maghrib',
        'Isha': 'Isya'
    };
    let html = '';
    Object.entries(prayerMap).forEach(([en, id]) => {
        if (timings[en]) {
            html += `<li><span>${id}</span><span>${timings[en]}</span></li>`;
        }
    });
    prayerTimesList.innerHTML = html;
    prayerLocation.textContent = `Lokasi: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)}`;
}

function fetchAndSchedule() {
    try {
        const timings = computePrayerTimes(currentLocation.lat, currentLocation.lon);
        if (!timings.Fajr) {
            throw new Error('Invalid prayer times');
        }
        prayerTimings = timings;
        schedulePrayerEvents(timings);
        updatePrayerList(timings);
    } catch {
        prayerTimesList.innerHTML = '<li>Jadwal tidak tersedia</li>';
    }
}

function getLocationAndFetch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude };
                fetchAndSchedule();
            },
            () => {
                fetch('https://ipapi.co/json/')
                    .then(r => r.json())
                    .then(d => {
                        if (d.latitude && d.longitude) {
                            currentLocation = { lat: d.latitude, lon: d.longitude };
                            fetchAndSchedule();
                        } else fetchAndSchedule();
                    })
                    .catch(() => fetchAndSchedule());
            }
        );
    } else fetchAndSchedule();
}

function updateDateTimeDisplay() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dayName = days[now.getDay()];
    const day = now.getDate().toString().padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentDatetimeEl.textContent = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    liveClock.textContent = `${hours}:${minutes}:${seconds}`;
    liveDate.textContent = `${dayName}, ${day} ${month} ${year}`;
}

setInterval(updateDateTimeDisplay, 1000);
updateDateTimeDisplay();

document.getElementById('open-settings-clock').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    document.querySelector('.tab-btn[data-tab="time"]').click();
});

settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
});

window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ChronoDeckDB', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('audio')) {
                db.createObjectStore('audio', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('background')) {
                db.createObjectStore('background', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

async function saveAudio(file, name) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const tx = db.transaction('audio', 'readwrite');
            const store = tx.objectStore('audio');
            const request = store.add({ name, data });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        };
        reader.readAsDataURL(file);
    });
}

async function getAllAudio() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('audio', 'readonly');
        const store = tx.objectStore('audio');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteAudio(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('audio', 'readwrite');
        const store = tx.objectStore('audio');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function saveBackground(file, name) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target.result;
            const tx = db.transaction('background', 'readwrite');
            const store = tx.objectStore('background');
            const request = store.add({ name, data });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        };
        reader.readAsDataURL(file);
    });
}

async function getAllBackground() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('background', 'readonly');
        const store = tx.objectStore('background');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteBackground(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction('background', 'readwrite');
        const store = tx.objectStore('background');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function loadAudioFromDB() {
    const items = await getAllAudio();
    musicPlaylist = [];
    items.forEach(item => {
        const blob = dataURLtoBlob(item.data);
        const url = URL.createObjectURL(blob);
        musicPlaylist.push({ id: item.id, name: item.name, url, data: item.data });
    });
    buildShuffleQueue();
    if (musicPlaylist.length > 0) {
        currentQueueIndex = 0;
        playCurrent();
    }
}

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

async function loadBackgroundFromDB() {
    const items = await getAllBackground();
    backgroundList = items;
    renderBackgroundList();
}

function renderAudioList() {
    audioListEl.innerHTML = '';
    musicPlaylist.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span>
            <button class="delete-audio" data-id="${item.id}"><i class="fas fa-trash"></i></button>`;
        audioListEl.appendChild(li);
    });
    document.querySelectorAll('.delete-audio').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            await deleteAudio(id);
            const index = musicPlaylist.findIndex(a => a.id === id);
            if (index !== -1) {
                URL.revokeObjectURL(musicPlaylist[index].url);
                musicPlaylist.splice(index, 1);
                buildShuffleQueue();
                if (musicPlaylist.length === 0) {
                    currentQueueIndex = -1;
                    musicAudio.src = '';
                    trackNameEl.textContent = '—  tidak ada musik  —';
                    isMusicPlaying = false;
                    playPauseIcon.className = 'fas fa-play';
                } else if (currentQueueIndex >= musicPlaylist.length) {
                    currentQueueIndex = 0;
                    playCurrent();
                }
            }
            renderAudioList();
        });
    });
}

function renderBackgroundList() {
    backgroundListEl.innerHTML = '';
    backgroundList.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span>
            <button class="set-bg" data-id="${item.id}"><i class="fas fa-image"></i></button>
            <button class="delete-bg" data-id="${item.id}"><i class="fas fa-trash"></i></button>`;
        backgroundListEl.appendChild(li);
    });
    document.querySelectorAll('.set-bg').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = Number(btn.dataset.id);
            const bg = backgroundList.find(b => b.id === id);
            if (bg) {
                if (currentBackgroundUrl) URL.revokeObjectURL(currentBackgroundUrl);
                const blob = dataURLtoBlob(bg.data);
                const url = URL.createObjectURL(blob);
                currentBackgroundUrl = url;
                video.src = url;
                video.load();
                video.play().catch(() => {});
                localStorage.setItem('currentBackgroundId', id);
            }
        });
    });
    document.querySelectorAll('.delete-bg').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            await deleteBackground(id);
            backgroundList = backgroundList.filter(b => b.id !== id);
            renderBackgroundList();
            if (localStorage.getItem('currentBackgroundId') == id) {
                if (currentBackgroundUrl) URL.revokeObjectURL(currentBackgroundUrl);
                video.src = 'img/video.mp4';
                video.load();
                localStorage.removeItem('currentBackgroundId');
                currentBackgroundUrl = null;
            }
        });
    });
}

uploadBackgroundBtn.addEventListener('click', () => backgroundInput.click());
backgroundInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const id = await saveBackground(file, file.name);
        backgroundList.push({ id, name: file.name, data: await fileToDataURL(file) });
        renderBackgroundList();
    }
    backgroundInput.value = '';
});

function fileToDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

video.addEventListener('error', () => {
    video.src = 'img/video.mp4';
    video.load();
});

(async () => {
    await initDB();
    await loadAudioFromDB();
    await loadBackgroundFromDB();
    const savedBgId = localStorage.getItem('currentBackgroundId');
    if (savedBgId) {
        const bg = backgroundList.find(b => b.id == savedBgId);
        if (bg) {
            const blob = dataURLtoBlob(bg.data);
            const url = URL.createObjectURL(blob);
            currentBackgroundUrl = url;
            video.src = url;
        }
    }
})();

getLocationAndFetch();
setInterval(() => {
    if (prayerTimings) updatePrayerList(prayerTimings);
}, 60000);
