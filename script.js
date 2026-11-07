'use strict';

// PORTADA: anima la apertura del sobre y después muestra la segunda página.
const envelope = document.getElementById('openEnvelope');
const openLetter = document.getElementById('openLetter');
let isOpening = false;
function openBirthdayLetter(){
  if (isOpening || !envelope) return;
  isOpening = true;
  // Oculta suavemente los títulos para evitar que se crucen con la carta al subir.
  document.body.classList.add('envelope-opening');
  envelope.classList.add('opening');
  envelope.setAttribute('aria-disabled','true');
  if (openLetter) { openLetter.disabled = true; openLetter.textContent = 'Abriendo tu sorpresa…'; }
  // Tiempo total para contemplar la apertura de la carta (en milisegundos).
  // Puedes ajustar 2600: 2000 = 2 segundos, 3000 = 3 segundos.
  setTimeout(() => document.body.classList.add('page-leaving'), 2550);
  setTimeout(() => { window.location.href = 'felicitacion.html'; }, 3000);
}
envelope?.addEventListener('click', openBirthdayLetter);
openLetter?.addEventListener('click', openBirthdayLetter);

// MINI PIANO: sonidos generados en el navegador, sin archivos de audio.
let audioContext;
const frequencies = {C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25};
function playNote(note, key){
  const frequency=frequencies[note];
  if(!frequency) return;
  try{
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if(audioContext.state==='suspended') audioContext.resume();
    const osc=audioContext.createOscillator();
    const gain=audioContext.createGain();
    osc.type='triangle'; osc.frequency.value=frequency;
    const t=audioContext.currentTime;
    gain.gain.setValueAtTime(0.0001,t);
    gain.gain.exponentialRampToValueAtTime(0.18,t+.025);
    gain.gain.exponentialRampToValueAtTime(0.0001,t+.9);
    osc.connect(gain);gain.connect(audioContext.destination);
    osc.start(t);osc.stop(t+.95);
    key.classList.add('is-playing');
    setTimeout(()=>key.classList.remove('is-playing'),160);
  }catch(error){console.warn('El audio no está disponible en este navegador.',error)}
}
document.querySelectorAll('.piano-key').forEach(key=>key.addEventListener('click',()=>playNote(key.dataset.note,key)));

// CONFETI: al tocar el botón de celebración.
const canvas=document.getElementById('confetti');
const celebrate=document.getElementById('celebrate');
let confettiParticles=[],animationId=null;
function fireConfetti(){
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const dpr=Math.min(window.devicePixelRatio||1,2);
  canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const colors=['#f6ba67','#f4dbbc','#e78792','#92b8ca','#c8a2d0'];
  confettiParticles=Array.from({length:160},()=>({x:innerWidth/2+(Math.random()-.5)*170,y:innerHeight*.62,vx:(Math.random()-.5)*14,vy:-Math.random()*12-3,gravity:.20+Math.random()*.10,rot:Math.random()*Math.PI,size:3+Math.random()*6,color:colors[Math.floor(Math.random()*colors.length)],life:100+Math.random()*35}));
  cancelAnimationFrame(animationId);
  function frame(){ctx.clearRect(0,0,innerWidth,innerHeight);let active=false;
    for(const p of confettiParticles){if(p.life--<=0)continue;active=true;p.vy+=p.gravity;p.x+=p.vx;p.y+=p.vy;p.rot+=.09;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);ctx.restore()}
    if(active)animationId=requestAnimationFrame(frame);else ctx.clearRect(0,0,innerWidth,innerHeight);
  }frame();
}
celebrate?.addEventListener('click',fireConfetti);


// MÚSICA DE CUMPLEAÑOS
// Coloca tu archivo MP3 en la carpeta "musica" con el nombre
// "cumpleanos.mp3", o cambia el atributo src en felicitacion.html.
// El navegador intentará reproducirlo al entrar en la felicitación.
// Algunos navegadores (especialmente en móviles) bloquean el autoplay
// con sonido; en esos casos aparecerá un botón para iniciarlo manualmente.
const birthdayMusic = document.getElementById('birthdayMusic');
const musicToggle = document.getElementById('musicToggle');
const musicPrompt = document.getElementById('musicPrompt');
const musicStart = document.getElementById('musicStart');

if (birthdayMusic) {
  birthdayMusic.volume = 0.6; // Ajusta entre 0.0 y 1.0.
  birthdayMusic.loop = true;  // Cambia a false para reproducirla solo una vez.

  const syncMusicUI = () => {
    if (musicToggle) {
      musicToggle.textContent = birthdayMusic.paused ? '▶' : '❚❚';
      musicToggle.setAttribute('aria-pressed', String(!birthdayMusic.paused));
    }
    if (musicPrompt) musicPrompt.hidden = !birthdayMusic.paused;
  };

  const playMusic = async () => {
    try {
      await birthdayMusic.play();
    } catch (error) {
      // Bloqueo de autoplay o archivo de música todavía no agregado.
      console.info('Pulsa Reproducir música para iniciar el audio.', error);
    }
    syncMusicUI();
  };

  musicToggle?.addEventListener('click', () => {
    if (birthdayMusic.paused) playMusic();
    else { birthdayMusic.pause(); syncMusicUI(); }
  });
  musicStart?.addEventListener('click', playMusic);
  birthdayMusic.addEventListener('play', syncMusicUI);
  birthdayMusic.addEventListener('pause', syncMusicUI);
  birthdayMusic.addEventListener('error', () => {
    if (musicPrompt) musicPrompt.hidden = false;
    if (musicStart) musicStart.textContent = '♫ Agrega tu canción MP3';
  });
  syncMusicUI();
  // Se intenta al ingresar, sin retrasar la aparición de la página.
  playMusic();
}

/* Icono circular de reproducción y pausa */

const audioCumple = document.getElementById("birthdayMusic");
const botonMusica = document.getElementById("musicToggle");

if (audioCumple && botonMusica) {
    function actualizarIconoMusica() {
        const reproduciendo = !audioCumple.paused;

        botonMusica.textContent = reproduciendo ? "⏸" : "▶";
        botonMusica.setAttribute(
            "aria-label",
            reproduciendo ? "Pausar música" : "Reproducir música"
        );
        botonMusica.setAttribute("aria-pressed", String(reproduciendo));
        botonMusica.title = reproduciendo
            ? "Pausar música"
            : "Reproducir música";
    }

    audioCumple.addEventListener("play", actualizarIconoMusica);
    audioCumple.addEventListener("pause", actualizarIconoMusica);

    actualizarIconoMusica();
}
