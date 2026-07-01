
document.querySelectorAll('.audio-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const audio = document.getElementById(btn.dataset.audio);

    if (audio.paused) {
      document.querySelectorAll('audio').forEach(a => {
        a.pause();
        a.currentTime = 0;
      });

      audio.play();
      btn.textContent = '⏸ Pausar Comentários';
    } else {
      audio.pause();
      btn.textContent = '▶ Comentários do Capítulo';
    }

    audio.onended = () => {
      btn.textContent = '▶ Comentários do Capítulo';
    };
  });
});
