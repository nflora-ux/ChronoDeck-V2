// root/script.js
const video = document.getElementById('bg-video');
const audioAdzan = new Audio('sound/adzan.mp3');
audioAdzan.volume = 1.0;
const audioAlarm = new Audio('sound/alarm.mp3');
audioAlarm.volume = 1.0;
const audioSapa = new Audio('sound/sapa.mp3');
audioSapa.volume = 1.0;

let musicPlaylist = [];
let shuffleQueue = [];
let currentQueueIndex = -1;
let musicAudio = new Audio();
let isMusicPlaying = false;
let loopMode = false;
let wasPlayingBeforeAdhan = false;
let adhanActive = false;
let alarmActive = false;
let sapaActive = false;
let alarmWasPlaying = false;
let adhanWasPlaying = false;
let sapaWasPlaying = false;
let alarmTimeouts = [];
let sapaTimeouts = [];
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
const locationSelect = document.getElementById('prayer-location-select');
const zoneBadgeWIB = document.getElementById('zoneBadgeWIB');
const zoneBadgeWITA = document.getElementById('zoneBadgeWITA');
const zoneBadgeWIT = document.getElementById('zoneBadgeWIT');
const locationCoords = document.getElementById('location-coords');

const contactWA = document.getElementById('contact-wa');
const contactGithub = document.getElementById('contact-github');
const contactIG = document.getElementById('contact-ig');
const contactTelegram = document.getElementById('contact-telegram');
const showLicenseBtn = document.getElementById('show-license');
const showPrivacyBtn = document.getElementById('show-privacy');
const infoModal = document.getElementById('info-modal');
const closeInfoModal = document.getElementById('close-info-modal');
const infoModalTitle = document.getElementById('info-modal-title');
const infoModalBody = document.getElementById('info-modal-body');

const LOCATIONS = [
    { name: 'Jakarta Pusat (WIB)', lat: -6.2088, lon: 106.8456, tz: 7, zone: 'WIB' },
    { name: 'Surabaya, Jatim (WIB)', lat: -7.2504, lon: 112.7688, tz: 7, zone: 'WIB' },
    { name: 'Bandung, Jabar (WIB)', lat: -6.9175, lon: 107.6191, tz: 7, zone: 'WIB' },
    { name: 'Banjarmasin, Kalsel (WITA)', lat: -3.3271, lon: 114.5945, tz: 8, zone: 'WITA' },
    { name: 'Denpasar, Bali (WITA)', lat: -8.6705, lon: 115.2126, tz: 8, zone: 'WITA' },
    { name: 'Makassar, Sulsel (WITA)', lat: -5.1477, lon: 119.4322, tz: 8, zone: 'WITA' },
    { name: 'Jayapura, Papua (WIT)', lat: -2.5309, lon: 140.7181, tz: 9, zone: 'WIT' },
    { name: 'Ambon, Maluku (WIT)', lat: -3.6964, lon: 128.1798, tz: 9, zone: 'WIT' },
    { name: 'Pekanbaru (WIB)', lat: 0.5071, lon: 101.4478, tz: 7, zone: 'WIB' },
    { name: 'Wonogiri, Jateng (WIB)', lat: -7.9797, lon: 110.8290, tz: 7, zone: 'WIB' },
    { name: 'Pontianak (WIB)', lat: -0.0263, lon: 109.3425, tz: 7, zone: 'WIB' },
    { name: 'Singaraja, Bali (WITA)', lat: -8.1126, lon: 115.0881, tz: 8, zone: 'WITA' },
    { name: 'Bima, NTB (WITA)', lat: -8.4665, lon: 118.7260, tz: 8, zone: 'WITA' },
    { name: 'Palangkaraya (WIB)', lat: -2.2161, lon: 113.9133, tz: 7, zone: 'WIB' },
    { name: 'Kendari, Sultra (WITA)', lat: -4.0235, lon: 122.5137, tz: 8, zone: 'WITA' },
    { name: 'Palopo, Sulsel (WITA)', lat: -3.0011, lon: 120.1964, tz: 8, zone: 'WITA' },
    { name: 'Balikpapan (WITA)', lat: -1.2698, lon: 116.8278, tz: 8, zone: 'WITA' },
    { name: 'Mamuju, Sulbar (WITA)', lat: -2.2126, lon: 117.9872, tz: 8, zone: 'WITA' },
    { name: 'Nabire, Papua (WIT)', lat: -3.3819, lon: 135.4713, tz: 9, zone: 'WIT' },
    { name: 'Passo, Maluku (WIT)', lat: -3.6554, lon: 128.1904, tz: 9, zone: 'WIT' }
];

let currentLocation = { ...LOCATIONS[0] };
let prayerTimings = {};
let prayerTimeouts = [];
let db = null;
let backgroundList = [];
let audioFiles = [];
let currentBackgroundUrl = null;

function initLocationDropdown() {
    LOCATIONS.forEach(loc => {
        const option = document.createElement('option');
        option.value = `${loc.lat},${loc.lon},${loc.tz},${loc.zone}`;
        option.textContent = loc.name;
        locationSelect.appendChild(option);
    });
    locationSelect.value = `${currentLocation.lat},${currentLocation.lon},${currentLocation.tz},${currentLocation.zone}`;
    updateZoneBadge(currentLocation.zone);
    locationCoords.textContent = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)} (${currentLocation.zone})`;
}

locationSelect.addEventListener('change', (e) => {
    try {
        const val = e.target.value;
        const parts = val.split(',');
        if (parts.length === 4) {
            currentLocation = {
                lat: parseFloat(parts[0]),
                lon: parseFloat(parts[1]),
                tz: parseInt(parts[2]),
                zone: parts[3]
            };
            updateZoneBadge(currentLocation.zone);
            locationCoords.textContent = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)} (${currentLocation.zone})`;
            fetchAndSchedule();
        }
    } catch (error) {
        console.error('Gagal mengubah lokasi:', error);
    }
});

function updateZoneBadge(zone) {
    zoneBadgeWIB.classList.remove('active');
    zoneBadgeWITA.classList.remove('active');
    zoneBadgeWIT.classList.remove('active');
    if (zone === 'WIB') zoneBadgeWIB.classList.add('active');
    else if (zone === 'WITA') zoneBadgeWITA.classList.add('active');
    else if (zone === 'WIT') zoneBadgeWIT.classList.add('active');
}

closeNotif.addEventListener('click', () => {
    try {
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
    } catch (error) {
        console.error('Gagal menutup notifikasi:', error);
    }
});

function showNotification(message) {
    try {
        notificationMsg.textContent = message;
        notificationCountdown.textContent = '';
        notificationBox.classList.remove('hidden');
    } catch (error) {
        console.error('Gagal menampilkan notifikasi:', error);
    }
}

function pauseMusic() {
    try {
        if (musicAudio && !musicAudio.paused) {
            musicAudio.pause();
            isMusicPlaying = false;
            playPauseIcon.className = 'fas fa-play';
        }
    } catch (error) {
        console.error('Gagal pause musik:', error);
    }
}

function resumeMusic() {
    try {
        if (musicAudio.src && currentQueueIndex !== -1 && !adhanActive && !alarmActive && !sapaActive) {
            musicAudio.play().catch(() => {});
            isMusicPlaying = true;
            playPauseIcon.className = 'fas fa-pause';
        }
    } catch (error) {
        console.error('Gagal resume musik:', error);
    }
}

function playCurrent() {
    try {
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
    } catch (error) {
        console.error('Gagal memutar lagu:', error);
    }
}

function playTrackByIndex(playlistIndex) {
    try {
        const pos = shuffleQueue.indexOf(playlistIndex);
        if (pos !== -1) {
            currentQueueIndex = pos;
            playCurrent();
        }
    } catch (error) {
        console.error('Gagal memutar track berdasarkan index:', error);
    }
}

function buildShuffleQueue() {
    try {
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
    } catch (error) {
        console.error('Gagal membangun shuffle queue:', error);
    }
}

musicAudio.addEventListener('ended', () => {
    try {
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
    } catch (error) {
        console.error('Gagal menangani akhir lagu:', error);
    }
});

playPauseBtn.addEventListener('click', () => {
    try {
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
    } catch (error) {
        console.error('Gagal toggle play/pause:', error);
    }
});

prevBtn.addEventListener('click', () => {
    try {
        if (currentQueueIndex > 0) {
            currentQueueIndex--;
            playCurrent();
        }
    } catch (error) {
        console.error('Gagal prev:', error);
    }
});

nextBtn.addEventListener('click', () => {
    try {
        if (currentQueueIndex + 1 < shuffleQueue.length) {
            currentQueueIndex++;
            playCurrent();
        }
    } catch (error) {
        console.error('Gagal next:', error);
    }
});

loopBtn.addEventListener('click', () => {
    try {
        loopMode = !loopMode;
        loopIcon.className = loopMode ? 'fas fa-repeat' : 'fas fa-repeat';
        loopBtn.classList.toggle('active', loopMode);
    } catch (error) {
        console.error('Gagal toggle loop:', error);
    }
});

uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    try {
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
    } catch (error) {
        console.error('Gagal upload audio:', error);
    }
});

function handleAlarm(prayerName, adzanTime) {
    try {
        if (adhanActive || alarmActive) return;
        if (sapaActive) {
            audioSapa.pause();
            audioSapa.currentTime = 0;
            sapaActive = false;
            sapaWasPlaying = false;
        }
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
            try {
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
            } catch (error) {
                console.error('Gagal update countdown:', error);
            }
        }, 1000);
    } catch (error) {
        console.error('Gagal handle alarm:', error);
    }
}

audioAlarm.addEventListener('ended', () => {
    try {
        if (alarmActive) {
            alarmActive = false;
            clearInterval(countdownInterval);
            countdownInterval = null;
            notificationBox.classList.add('hidden');
            if (!adhanActive && !sapaActive && alarmWasPlaying) resumeMusic();
            alarmWasPlaying = false;
        }
    } catch (error) {
        console.error('Gagal handle alarm ended:', error);
    }
});

function handleAdhan(prayerName) {
    try {
        if (adhanActive) return;
        if (alarmActive) {
            audioAlarm.pause();
            audioAlarm.currentTime = 0;
            alarmActive = false;
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        if (sapaActive) {
            audioSapa.pause();
            audioSapa.currentTime = 0;
            sapaActive = false;
            sapaWasPlaying = false;
        }
        adhanActive = true;
        adhanWasPlaying = isMusicPlaying;
        pauseMusic();
        audioAdzan.currentTime = 0;
        audioAdzan.volume = 1.0;
        audioAdzan.play().catch(() => {});
        showNotification(`waktu sholat • ${prayerName}`);
    } catch (error) {
        console.error('Gagal handle adhan:', error);
    }
}

audioAdzan.addEventListener('ended', () => {
    try {
        adhanActive = false;
        notificationBox.classList.add('hidden');
        if (!alarmActive && !sapaActive && adhanWasPlaying) resumeMusic();
        adhanWasPlaying = false;
    } catch (error) {
        console.error('Gagal handle adzan ended:', error);
    }
});

function handleSapa(prayerName) {
    try {
        if (sapaActive || adhanActive || alarmActive) return;
        sapaActive = true;
        sapaWasPlaying = isMusicPlaying;
        pauseMusic();

        audioSapa.currentTime = 0;
        audioSapa.play().catch(() => {});
    } catch (error) {
        console.error('Gagal handle sapa:', error);
    }
}

audioSapa.addEventListener('ended', () => {
    try {
        sapaActive = false;
        if (!adhanActive && !alarmActive && sapaWasPlaying) {
            resumeMusic();
        }
        sapaWasPlaying = false;
    } catch (error) {
        console.error('Gagal handle sapa ended:', error);
    }
});

function computePrayerTimes(lat, lon, tzOffset) {
    try {
        const pray = new PrayTime('MWL');
        pray.adjust({ fajr: 20, isha: 18 });
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const times = pray.getTimes([year, month, day], [lat, lon], tzOffset, 0, '24h');
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
    } catch (error) {
        console.error('Gagal menghitung waktu sholat:', error);
        return {};
    }
}

function schedulePrayerEvents(timings) {
    try {
        prayerTimeouts.forEach(clearTimeout);
        prayerTimeouts = [];
        alarmTimeouts.forEach(clearTimeout);
        alarmTimeouts = [];
        sapaTimeouts.forEach(clearTimeout);
        sapaTimeouts = [];

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

            const alarmDate = new Date(prayerDate.getTime() - 15 * 60000);
            const sapaDate = new Date(prayerDate.getTime() - 1 * 60000);
            const nowTime = now.getTime();
            const adzanTime = prayerDate.getTime();

            if (alarmDate > nowTime) {
                const timeoutId = setTimeout(() => {
                    handleAlarm(id, adzanTime);
                }, alarmDate - nowTime);
                alarmTimeouts.push(timeoutId);
            }

            if (sapaDate > nowTime) {
                const timeoutId = setTimeout(() => {
                    handleSapa(id);
                }, sapaDate - nowTime);
                sapaTimeouts.push(timeoutId);
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
    } catch (error) {
        console.error('Gagal menjadwalkan events:', error);
    }
}

function updatePrayerList(timings) {
    try {
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
        prayerLocation.textContent = `Lokasi: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)} (${currentLocation.zone})`;
    } catch (error) {
        console.error('Gagal update daftar sholat:', error);
    }
}

function fetchAndSchedule() {
    try {
        const timings = computePrayerTimes(currentLocation.lat, currentLocation.lon, currentLocation.tz);
        if (!timings.Fajr) {
            throw new Error('Invalid prayer times');
        }
        prayerTimings = timings;
        schedulePrayerEvents(timings);
        updatePrayerList(timings);
    } catch (error) {
        console.error('Gagal fetch dan jadwalkan:', error);
        prayerTimesList.innerHTML = '<li>Jadwal tidak tersedia</li>';
    }
}

function updateDateTimeDisplay() {
    try {
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
    } catch (error) {
        console.error('Gagal update jam:', error);
    }
}

setInterval(updateDateTimeDisplay, 1000);
updateDateTimeDisplay();

document.getElementById('open-settings-clock').addEventListener('click', () => {
    try {
        settingsModal.classList.remove('hidden');
        document.querySelector('.tab-btn[data-tab="time"]').click();
    } catch (error) {
        console.error('Gagal buka settings via jam:', error);
    }
});

settingsBtn.addEventListener('click', () => {
    try {
        settingsModal.classList.remove('hidden');
    } catch (error) {
        console.error('Gagal buka settings:', error);
    }
});

closeSettings.addEventListener('click', () => {
    try {
        settingsModal.classList.add('hidden');
    } catch (error) {
        console.error('Gagal tutup settings:', error);
    }
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        try {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        } catch (error) {
            console.error('Gagal ganti tab:', error);
        }
    });
});

window.addEventListener('click', (e) => {
    try {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    } catch (error) {
        console.error('Gagal tutup modal via klik luar:', error);
    }
});

contactWA.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://wa.me/628561765372', '_blank');
});

contactGithub.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/neveerlabs', '_blank');
});

contactIG.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://instagram.com/neveerlabs', '_blank');
});

contactTelegram.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://t.me/Neverlabs', '_blank');
});

function showInfoModal(title, content) {
    infoModalTitle.textContent = title;
    infoModalBody.innerHTML = content;
    infoModal.classList.remove('hidden');
}

closeInfoModal.addEventListener('click', () => {
    infoModal.classList.add('hidden');
});

showLicenseBtn.addEventListener('click', () => {
    showInfoModal('MIT License', `
        <pre style="white-space: pre-wrap; font-family: inherit;">
MIT License

Copyright (c) 2026 Neverlabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
        </pre>
    `);
});

showPrivacyBtn.addEventListener('click', () => {
    showInfoModal('Kebijakan Privasi', `
        <div style="text-align: left;">
            <p><strong>Kebijakan Privasi ChronoDeck</strong></p>
            <p>Terakhir diperbarui: 2026</p>
            <p>ChronoDeck menghargai privasi Anda. Aplikasi ini tidak mengumpulkan data pribadi apapun secara online. Semua data (audio, background) disimpan secara lokal di perangkat Anda menggunakan IndexedDB.</p>
            <p>Kami tidak menggunakan cookie atau pelacak pihak ketiga.</p>
            <p>Jika Anda memiliki pertanyaan, hubungi kami melalui email: userlinuxorg@gmail.com</p>
        </div>
    `);
});

async function initDB() {
    return new Promise((resolve, reject) => {
        try {
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
        } catch (error) {
            reject(error);
        }
    });
}

async function saveAudio(file, name) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target.result;
                    const tx = db.transaction('audio', 'readwrite');
                    const store = tx.objectStore('audio');
                    const request = store.add({ name, data });
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            reject(error);
        }
    });
}

async function getAllAudio() {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('audio', 'readonly');
            const store = tx.objectStore('audio');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
}

async function deleteAudio(id) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('audio', 'readwrite');
            const store = tx.objectStore('audio');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
}

async function saveBackground(file, name) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target.result;
                    const tx = db.transaction('background', 'readwrite');
                    const store = tx.objectStore('background');
                    const request = store.add({ name, data });
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            reject(error);
        }
    });
}

async function getAllBackground() {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('background', 'readonly');
            const store = tx.objectStore('background');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
}

async function deleteBackground(id) {
    return new Promise((resolve, reject) => {
        try {
            const tx = db.transaction('background', 'readwrite');
            const store = tx.objectStore('background');
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
}

async function loadAudioFromDB() {
    try {
        const items = await getAllAudio();
        musicPlaylist = [];
        items.forEach(item => {
            const blob = dataURLtoBlob(item.data);
            const url = URL.createObjectURL(blob);
            musicPlaylist.push({ id: item.id, name: item.name, url, data: item.data });
        });
        renderAudioList();
        buildShuffleQueue();
        if (musicPlaylist.length > 0) {
            currentQueueIndex = 0;
            playCurrent();
        }
    } catch (error) {
        console.error('Gagal load audio dari DB:', error);
    }
}

function dataURLtoBlob(dataURL) {
    try {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    } catch (error) {
        console.error('Gagal konversi dataURL ke Blob:', error);
        return new Blob();
    }
}

async function loadBackgroundFromDB() {
    try {
        const items = await getAllBackground();
        backgroundList = items;
        renderBackgroundList();
    } catch (error) {
        console.error('Gagal load background dari DB:', error);
    }
}

function renderAudioList() {
    try {
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
                try {
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
                } catch (error) {
                    console.error('Gagal hapus audio:', error);
                }
            });
        });
    } catch (error) {
        console.error('Gagal render audio list:', error);
    }
}

function renderBackgroundList() {
    try {
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
                try {
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
                } catch (error) {
                    console.error('Gagal set background:', error);
                }
            });
        });
        document.querySelectorAll('.delete-bg').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
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
                } catch (error) {
                    console.error('Gagal hapus background:', error);
                }
            });
        });
    } catch (error) {
        console.error('Gagal render background list:', error);
    }
}

uploadBackgroundBtn.addEventListener('click', () => backgroundInput.click());

backgroundInput.addEventListener('change', async (e) => {
    try {
        const file = e.target.files[0];
        if (file) {
            const id = await saveBackground(file, file.name);
            backgroundList.push({ id, name: file.name, data: await fileToDataURL(file) });
            renderBackgroundList();
        }
        backgroundInput.value = '';
    } catch (error) {
        console.error('Gagal upload background:', error);
    }
});

function fileToDataURL(file) {
    return new Promise((resolve) => {
        try {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Gagal konversi file ke dataURL:', error);
            resolve('');
        }
    });
}

video.addEventListener('error', () => {
    try {
        video.src = 'img/video.mp4';
        video.load();
    } catch (error) {
        console.error('Gagal handle error video:', error);
    }
});

(async () => {
    try {
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
        initLocationDropdown();
        fetchAndSchedule();
        setInterval(() => {
            try {
                if (prayerTimings) updatePrayerList(prayerTimings);
            } catch (error) {
                console.error('Gagal update daftar sholat periodik:', error);
            }
        }, 60000);
    } catch (error) {
        console.error('Gagal inisialisasi aplikasi:', error);
    }
})();
