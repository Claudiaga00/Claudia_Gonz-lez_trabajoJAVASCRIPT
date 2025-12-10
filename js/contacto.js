// contacto.js
document.addEventListener('DOMContentLoaded', ()=>{
  // Coordenadas ejemplo (Santander)
  const businessLatLng = [43.01115, -4.28712];

  const map = L.map('map').setView(businessLatLng, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const businessMarker = L.marker(businessLatLng).addTo(map).bindPopup('C.G.Programación Web)').openPopup();

  // Routing control (usando el router público de OSRM)
  let control = null;

  function addRouting(fromLatLng){
    if(control) map.removeControl(control);
    control = L.Routing.control({
      waypoints: [
        L.latLng(fromLatLng[0], fromLatLng[1]),
        L.latLng(businessLatLng[0], businessLatLng[1])
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      createMarker: function(i, wp, nWps){
        if(i === 0){
          return L.marker(wp.latLng).bindPopup('Tu posición aproximada');
        } else if (i === nWps - 1){
          return L.marker(wp.latLng).bindPopup('Destino: C.G.');
        } else {
          return L.marker(wp.latLng);
        }
      }
    }).addTo(map);
  }

  // Intentamos usar geolocalización
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos => {
      const latlng = [pos.coords.latitude, pos.coords.longitude];
      L.marker(latlng).addTo(map).bindPopup('Tu ubicación (aprox)').openPopup();
      map.setView(latlng, 13);
      addRouting(latlng);
    }, err => {
      console.warn('Geolocalización no disponible o denegada:', err);
      // permite al usuario hacer click en el mapa para elegir su ubicación
      map.on('click', function(e){
        addRouting([e.latlng.lat, e.latlng.lng]);
        alert('Origen establecido. Se ha calculado la ruta.');
      });
    });
  } else {
    map.on('click', function(e){
      addRouting([e.latlng.lat, e.latlng.lng]);
      alert('Origen establecido. Se ha calculado la ruta.');
    });
  }
});
