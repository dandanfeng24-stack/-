
const counts = document.querySelectorAll('.count');
const runCount = (el) => {
  const target = Number(el.dataset.target || 0);
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 32));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 35);
};
counts.forEach(runCount);

const card = document.getElementById('photoHomeCard');
if (card && window.innerWidth > 980) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * -6;
    card.style.transform = `perspective(1400px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  window.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1400px) rotateY(0deg) rotateX(0deg)';
  });
}
