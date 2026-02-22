<div align="center">
<h1>ChronoDeck | v1.1.0</h1>
<p style="font-size: 1.2rem; color: #cbd5e0;">3D interaktif · alarm adzan · musik lokal · bulan fotorealistik</p>
  
![Static Badge](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white)
![Static Badge](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Static Badge](https://img.shields.io/badge/Spotify-1ED760?style=flat-square&logo=spotify&logoColor=white)
</div>

<h2>Tentang Proyek</h2>
<p>
ChronoDeck adalah website 3D interaktif dengan visual bulan fotorealistik dan bintang berkedip alami, dilengkapi sistem alarm otomatis untuk waktu sholat. Dirancang sebagai teman ngoding, istirahat, dan ibadah — tanpa meninggalkan suasana tenang.
</p>

<div align="center">

![Static Badge](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js)
![Static Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Static Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5)
![Static Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-orange?style=flat-square)
</div>

<h2>Fitur Utama</h2>
<ul>
  <li>Bulan 3D + ribuan bintang dengan shader autentik</li>
  <li>OrbitControls — bebas memutar dan zoom</li>
  <li>Music player lokal — upload file audio sendiri</li>
  <li>Playlist berurutan dengan auto-next</li>
  <li>Nama lagu berjalan (marquee effect)</li>
  <li>Alarm otomatis 10 menit sebelum waktu adzan</li>
  <li>Adzan otomatis tepat waktu</li>
  <li>Notifikasi berkedip layar penuh saat alarm/adzan</li>
  <li>Volume otomatis maksimal saat alarm/adzan</li>
  <li>Waktu sholat realtime berdasarkan lokasi</li>
  <li>Countdown ke sholat berikutnya</li>
  <li>Refresh lokasi manual</li>
  <li>Desain glassmorphism</li>
  <li>Responsif untuk semua perangkat</li>
</ul>

<h2>Demo</h2>
<p>
<a href="https://neveerlabs.github.io/ChronoDeck/">https://neveerlabs.github.io/ChronoDeck/</a><br>
Atau jalankan secara lokal dengan membuka <code>index.html</code>.
</p>

<h2>Teknologi yang Digunakan</h2>
<ul>
  <li>HTML5</li>
  <li>CSS3 — backdrop-filter, glassmorphism, animasi</li>
  <li>JavaScript ES6 Modules</li>
  <li>Three.js — bulan, bintang, shader, orbit controls</li>
  <li>Web Audio API — kontrol musik dan playlist</li>
  <li>Aladhan Prayer API — jadwal sholat global</li>
  <li>Font Awesome 6 — ikon minimalis</li>
  <li>Geolocation API — deteksi lokasi otomatis</li>
</ul>

<h2>Cara Menggunakan</h2>
<ol>
  <li>Buka <code>index.html</code> di browser modern (Chrome, Edge, Firefox)</li>
  <li>Upload musik melalui tombol <code>upload</code></li>
  <li>Kontrol player: Play/Pause, Previous/Next</li>
  <li>Izinkan akses lokasi untuk jadwal sholat akurat</li>
  <li>Website otomatis:
    <ul>
      <li>Menentukan jadwal sholat hari ini</li>
      <li>Menghitung alarm 10 menit sebelum adzan</li>
      <li>Memunculkan notifikasi berkedip + suara alarm/adzan</li>
    </ul>
  </li>
  <li>Klik ikon lokasi untuk memperbarui koordinat</li>
</ol>
<p>
<strong>Semua file audio hanya diproses secara lokal di browser, tidak dikirim ke server manapun.</strong>
</p>

<h2>Struktur File</h2>
<pre><code>ChronoDeck/
│
├── index.html          # halaman utama
├── style.css           # UI glassmorphism dan animasi
├── script.js           # Three.js, prayer API, audio engine
│
├── sound/              # folder suara (isi manual)
│   ├── alarm.mp3       # suara 10 menit sebelum adzan
│   └── adzan.mp3       # suara adzan
└── favicon.png</code></pre>

<h2>Catatan Penting</h2>
<ul>
  <li>Browser membutuhkan interaksi pengguna pertama kali sebelum audio dapat diputar (kebijakan autoplay).</li>
  <li>Jika tidak memberikan izin lokasi, fallback ke koordinat Jakarta atau deteksi berbasis IP via ipapi.co.</li>
  <li>API Adzan menggunakan method 2 (ISNA) — dapat diubah di script.js.</li>
  <li>Folder <code>sound/</code> tidak disertakan dalam repository. Silakan masukkan file <code>alarm.mp3</code> dan <code>adzan.mp3</code> secara manual.</li>
  <li>Untuk pengalaman terbaik, gunakan headphone dan redupkan cahaya ruangan.</li>
</ul>

<h2>Rencana Pengembangan</h2>
<ul>
  <li>Progressive Web App — install ke home screen</li>
  <li>Tema lunar eclipse</li>
  <li>Efek hujan meteor</li>
  <li>Alarm kustom</li>
  <li>Visualizer bintang bereaksi ke musik</li>
  <li>Penyimpanan playlist via IndexedDB</li>
  <li>Widget jadwal sholat mingguan</li>
</ul>

<h2>Lisensi</h2>
<p>
MIT License<br>
Copyright (c) 2026 Neverlabs
</p>
<p>
Diizinkan untuk digunakan, dimodifikasi, dan didistribusikan secara bebas untuk keperluan pribadi maupun pembelajaran.
</p>

<div class="footer">
  <p>Dibuat dengan niat untuk teman ngoding dan siapa pun yang ingin tetap ingat waktu di tengah layar.</p>
  <p style="font-size: 1.1rem; color: #ffdcaa; margin-top: 1rem;">Neverlabs · 2026</p>
  <p style="font-style: italic; color: #a0b3c5;">Langit bukan batas, tapi pengingat.</p>
</div>

</div>
</body>
</html>
