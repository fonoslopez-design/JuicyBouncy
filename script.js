document.querySelectorAll('.year').forEach(e=>e.textContent=new Date().getFullYear());

(function(){
  var slides = document.querySelectorAll('.carousel .slide');
  if (!slides.length) return;
  var i = 0;
  setInterval(function(){
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 4000);
})();
