async function loadRoute() {
  try {
      const response = await fetch('https://map-application-production.up.railway.app/route');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.coordinates;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}


async function initMap() {
  console.log('initMap function called');
  const coordinates = await loadRoute();

  const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: coordinates[0],
  });

  const carPath = new google.maps.Polyline({
      path: coordinates.map(coord => ({ lat: coord.latitude, lng: coord.longitude })),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
  });
  carPath.setMap(map);

  const carIcon = {
      url: "https://img.icons8.com/ios-filled/50/000000/car.png",
      scaledSize: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 32),
  };

  const marker = new google.maps.Marker({
      position: coordinates[0],
      map: map,
      title: "Start Point",
      icon: carIcon,
  });

  let currentIndex = 0;

  const intervalId = setInterval(() => {
      if (currentIndex < coordinates.length) {
          let element = coordinates[currentIndex];
          const newPosition = { lat: element.latitude, lng: element.longitude };
          marker.setPosition(newPosition);
          map.setCenter(newPosition);
          console.log(newPosition);
          currentIndex++;
      } else {
          clearInterval(intervalId);
          console.log("All coordinates processed.");
      }
  }, 1000);
}

// Ensure initMap is globally accessible
window.initMap = initMap;
console.log('initMap function defined');
