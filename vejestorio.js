
const envelope = document.getElementById('envelope');
let open = false;

envelope.addEventListener("click", () => {
  open = !open;

  if (open) {
    gsap.to(".flap", {
      rotateX: -180,
      duration: 2,
      transformOrigin: "top",
      ease: "power2.inOut"
    });

    gsap.to(".letter", {
      y: "-100%",   
      duration: 2,
      delay: 0.5,
      ease: "power2.out",
        onComplete: animateText
    });
  } else {
    gsap.to(".flap", {
      rotateX: 0,
      duration: 2,
      ease: "power2.in"
    });

    gsap.to(".letter", {
      y: "0%",
      duration: 2,
      ease: "power2.inOut"
    });
  }
});

function animateText() {
  const texto = "¡Feliz Cumpleaños! \neste es mi regalo para ti, lo he hecho con todo el cariño q t tengo.";
  const h2 = document.querySelector(".letter h2");
  
  // Crear los spans RESPETANDO espacios y saltos de línea
  h2.innerHTML = texto.split('').map(char => {
    if (char === '\n') return '<br>'; // Salto de línea
    if (char === ' ') return '<span class="char" style="opacity: 0; display: inline-block;">&nbsp;</span>'; // Espacio
    return `<span class="char" style="opacity: 0; display: inline-block;">${char}</span>`;
  }).join('');
 
  // Animar
  gsap.to(".char", {
    opacity: 1,
    duration: 0.3,
    stagger: 0.07,  // Más rápido para que no se tarde tanto
    ease: "power2.out"
  });

}

const songs = [
      {
        title: "Feel Special",
        artist: "Twice",
        description: "",
        cover: "hoyuelo.png",
        audio: "a.mpeg"
      },
      {
        title: "Eso Que Tú Me Das",
        artist: "Jarabe De Palo",
        description: "",
        cover: "mob.png",
        audio: "ja.mpeg"
      },
      {
        title: "My twin is a b",
        artist: "Laufey",
        description: "",
        cover: "re.png",
        audio: "bi.mpeg"
      },
      {
        title: "21:29",
        artist: "Twice",
        description: ".",
        cover: "no.png",
        audio: "21.mpeg"
      },
      {
        title: "Yo soy tu amigo fiel",
        artist: "asul",
        description: "",
        cover: "bro.png",
        audio: "amigo.mpeg"
      }
    ];

    // ELEMENTOS
    const audio = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const songDescription = document.getElementById('songDescription');
    const albumCover = document.getElementById('albumCover');
    const coverContainer = document.getElementById('coverContainer');
    const playlistItems = document.getElementById('playlistItems');

    let currentSongIndex = 0;
    let isPlaying = false;

    // CARGAR PLAYLIST
    function loadPlaylist() {
      playlistItems.innerHTML = songs.map((song, index) => `
        <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
          <div class="playlist-avatar" style="background-image: url('${song.cover}')"></div>
          <div class="playlist-info">
            <div class="playlist-song">${song.title}</div>
            <div class="playlist-creator">${song.artist}</div>
          </div>
        </div>
      `).join('');

      // Eventos de click en playlist
      document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
          const index = parseInt(item.dataset.index);
          loadSong(index);
          play();
        });
      });
    }

    // CARGAR CANCIÓN
    function loadSong(index) {
      currentSongIndex = index;
      const song = songs[index];

      songTitle.textContent = song.title;
      artistName.textContent = song.artist;
      songDescription.textContent = song.description;
      albumCover.src = song.cover;
      audio.src = song.audio;

      // Actualizar playlist activa
      document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    }

    // PLAY
    function play() {
      audio.play();
      isPlaying = true;
      playPauseBtn.textContent = '⏸';
      coverContainer.classList.add('playing');
    }

    // PAUSE
    function pause() {
      audio.pause();
      isPlaying = false;
      playPauseBtn.textContent = '▶';
      coverContainer.classList.remove('playing');
    }

    // TOGGLE PLAY/PAUSE
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    });

    // CANCIÓN ANTERIOR
    prevBtn.addEventListener('click', () => {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      loadSong(currentSongIndex);
      play();
    });

    // CANCIÓN SIGUIENTE
    nextBtn.addEventListener('click', () => {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      loadSong(currentSongIndex);
      play();
    });

    // ACTUALIZAR PROGRESO
    audio.addEventListener('timeupdate', () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // DURACIÓN
    audio.addEventListener('loadedmetadata', () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    // CLICK EN BARRA DE PROGRESO
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });

    // AUTO SIGUIENTE
    audio.addEventListener('ended', () => {
      nextBtn.click();
    });

    // FORMATEAR TIEMPO
    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // INICIALIZAR
    loadPlaylist();
    loadSong(0);



