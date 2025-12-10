// galeria.js
document.addEventListener('DOMContentLoaded', ()=>{
  const gallery = document.getElementById('gallery');
  const images = [
    // Si no incluyes imágenes locales, these are placeholder URLs (picsum)
    {src: 'https://picsum.photos/800/600?random=1', thumb:'https://picsum.photos/300/200?random=1', caption:'Imagen 1'},
    {src: 'https://picsum.photos/800/600?random=2', thumb:'https://picsum.photos/300/200?random=2', caption:'Imagen 2'},
    {src: 'https://picsum.photos/800/600?random=3', thumb:'https://picsum.photos/300/200?random=3', caption:'Imagen 3'},
    {src: 'https://picsum.photos/800/600?random=4', thumb:'https://picsum.photos/300/200?random=4', caption:'Imagen 4'},
    {src: 'https://picsum.photos/800/600?random=5', thumb:'https://picsum.photos/300/200?random=5', caption:'Imagen 5'},
    {src: 'https://picsum.photos/800/600?random=6', thumb:'https://picsum.photos/300/200?random=6', caption:'Imagen 6'}
  ];

  images.forEach((img,i)=>{
    const el = document.createElement('img');
    el.src = img.thumb;
    el.alt = img.caption;
    el.dataset.src = img.src;
    el.dataset.caption = img.caption;
    el.tabIndex = 0;
    el.addEventListener('click', openLightbox);
    el.addEventListener('keypress', (e)=> { if(e.key==='Enter') openLightbox.call(el); });
    gallery.appendChild(el);
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');

  function openLightbox(){
    lbImg.src = this.dataset.src;
    lbCaption.textContent = this.dataset.caption;
    lb.setAttribute('aria-hidden','false');
  }
  function closeLightbox(){
    lb.setAttribute('aria-hidden','true');
    lbImg.src = '';
    lbCaption.textContent = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e)=> { if(e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeLightbox(); });
});
