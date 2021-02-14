const prompt = document.querySelector(".offline");

window.addEventListener("load", () => {
  const handleConnection = () => {
    if (navigator.onLine) {
      prompt.classList.add("indicator");
    } else {
      prompt.classList.remove("indicator");
    }
  };

  window.addEventListener("offline", handleConnection);
  window.addEventListener("online", handleConnection);
});

const calDist = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

const successCallback = (position) => {
  //   console.log(position.coords.latitude);
  //   console.log(position.coords.longitude);
  const lat1 = position.coords.latitude;
  const lon1 = position.coords.longitude;

  const stopList = document.querySelector(".stop-list");
  const navBar = document.querySelector(".nav");
  const nav = document.querySelector(".nav-links");

  let sticky = navBar.offsetTop;
  window.onscroll = () => {
    if (window.pageYOffset > sticky) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const getIdData = async () => {
    let API_URL =
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
    const response = await fetch(API_URL);
    const data = await response.json();

    const { stops, stopId, stopName, stopLat, stopLon, stopCode } = data;

    let array = [];
    let dataArr = [];

    for (let i = 0; i < stops.length; i++) {
      const distance = calDist(lat1, lon1, stops[i].stopLat, stops[i].stopLon);
      if (distance <= 500) {
        let ID = stops[i].stopId;
        // dataArr = [ID, stops[i].stopName];
        dataArr.push(Math.round(distance));
        dataArr.push(ID);
        dataArr.push(stops[i].stopName);
        dataArr.push(stops[i].stopLon);
        dataArr.push(stops[i].stopLat);
        dataArr.push(stops[i].stopCode);
        array.push(dataArr);
        dataArr = [];
      }
    }
    return array;
  };

  const sortFunction = (a, b) => {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] < b[0] ? -1 : 1;
    }
  };

  const getTimeData = async () => {
    const array = await getIdData();
    //console.log(array.sort(sortFunction));
    array.sort(sortFunction);

    for (let i = 0; i < array.length - 1; i++) {
      let ID = array[i][1];
      //console.log(array[i][0]);

      let API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      const { delay, estimatedTime, routeId, headsign } = data;

      let times = [];
      let routeIds = [];
      let headsigns = [];
      for (let i = 0; i < delay.length; i++) {
        times.push(timeDifference(delay[i].estimatedTime));
        routeIds.push(delay[i].routeId);
        if (window.innerWidth <= 1024) {
          headsigns.push(short(delay[i].headsign));
        } else {
          headsigns.push(delay[i].headsign);
        }
      }
      routeIds.push(" ");
      times.push(" ");

      for (let i = 0; i < routeIds.length; i++) {
        let value = routeIds[i].toString();
        let value1 = value.charAt(0);
        if (value1 === "4" && value.length > 1) {
          value = value.slice(1);
          value1 = "N" + value;
          routeIds[i] = value1;
        }
      }

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");

      const stopNameDiv = document.createElement("div");
      stopNameDiv.classList.add("stop-name-div");
      cardDiv.appendChild(stopNameDiv);

      const stopNameSpan = document.createElement("span");
      stopNameSpan.innerText = `${array[i][2]} ${array[i][5]}`;
      stopNameSpan.classList.add("stop-name-span");
      stopNameDiv.appendChild(stopNameSpan);

      const mapShowButton = document.createElement("button");
      mapShowButton.classList.add("map-show-button");
      mapShowButton.innerHTML = "<i class='fas fa-map-marker-alt'></i>";
      stopNameDiv.appendChild(mapShowButton);

      const scheduleDiv = document.createElement("div");
      scheduleDiv.classList.add("schedule-div");
      cardDiv.appendChild(scheduleDiv);

      if (headsigns.length !== 0) {
        routeIds.unshift("Line");
        headsigns.unshift("Direction");
        times.unshift("Departure");
      }

      const lineSpan = document.createElement("span");
      lineSpan.innerText = routeIds.join("\n");
      lineSpan.classList.add("line-span");
      scheduleDiv.appendChild(lineSpan);

      const dirSpan = document.createElement("span");
      // dirSpan.innerText = headsigns.join("\n");
      if (headsigns.length === 0) {
        if (window.innerWidth <= 1024) {
          scheduleDiv.style.display = "flex";
          scheduleDiv.style.justifyContent = "center";
        }
        dirSpan.innerText = "No courses available now.";
      } else {
        dirSpan.innerText = headsigns.join("\n");
      }
      dirSpan.classList.add("dir-span");
      scheduleDiv.appendChild(dirSpan);

      const timeSpan = document.createElement("span");
      timeSpan.innerText = times.join("\n");
      timeSpan.classList.add("time-span");
      scheduleDiv.appendChild(timeSpan);

      const distanceDiv = document.createElement("div");
      distanceDiv.classList.add("distance-div");
      cardDiv.appendChild(distanceDiv);

      const distanceSpan = document.createElement("span");
      distanceSpan.innerText = `Distance: ${array[i][0]}m`;
      distanceSpan.classList.add("distance-span");
      distanceDiv.appendChild(distanceSpan);

      const coordsContainer = document.createElement("div");
      coordsContainer.classList.add("coords-container");
      cardDiv.appendChild(coordsContainer);

      const lonSpan = document.createElement("span");
      lonSpan.innerText = array[i][3];
      lonSpan.classList.add("lon-span");
      coordsContainer.appendChild(lonSpan);

      const latSpan = document.createElement("span");
      latSpan.innerText = array[i][4];
      latSpan.classList.add("lat-span");
      coordsContainer.appendChild(latSpan);

      const idSpan = document.createElement("span");
      idSpan.innerText = ID;
      idSpan.classList.add("id-span");
      coordsContainer.appendChild(idSpan);

      stopList.appendChild(cardDiv);
    }
  };

  getTimeData().catch((error) => {
    console.error();
  });
  // getTimeData();

  //get vehicle ids
  const getVehicleCodes = async (ID) => {
    const API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;
    const response = await fetch(API_URL);
    const data = await response.json();

    const { delay, vehicleCode } = data;

    let vehicleCodes = [];

    for (let i = 0; i < delay.length; i++) {
      vehicleCodes.push(delay[i].vehicleCode);
    }
    return vehicleCodes;
  };

  //get vehicle details for popup
  const getTripDetails = async (ID) => {
    const API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;
    const response = await fetch(API_URL);
    const data = await response.json();

    const { delay, headsign, routeId, estimatedTime } = data;

    let array = [];
    let details = [];

    for (let i = 0; i < delay.length; i++) {
      let value = delay[i].routeId.toString();
      let value1 = value.charAt(0);
      if (value1 === "4" && value.length > 1) {
        value = value.slice(1);
        value1 = "N" + value;
        details.push(value1);
      } else {
        details.push(delay[i].routeId);
      }
      details.push(delay[i].headsign);
      details.push(timeDifference(delay[i].estimatedTime));
      array.push(details);
      details = [];
    }
    return array;
  };

  const mapContainer = document.querySelector(".map-container");
  const removeMapButton = document.querySelector(".remove-map-button");
  const stopInfo = document.querySelector(".stop-info");

  mapboxgl.accessToken =
    "pk.eyJ1IjoicGFrdXQyIiwiYSI6ImNra3gxenFlcjAyYmgyb3AwbmdvYjg5cHoifQ.dEXAMvHoWip_DE7rJPoDhQ";

  stopList.addEventListener("click", async (e) => {
    const item = e.target;

    //get lat and lon of vehicles
    const getBusLocation = async (ID) => {
      const codes = await getVehicleCodes(ID);

      const API_URL = "https://ckan2.multimediagdansk.pl/gpsPositions";
      const response = await fetch(API_URL);
      const data = await response.json();

      const { Vehicles, VehicleCode, Lon, Lat } = data;

      let buses = [];
      let busCoords = [];

      for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < Vehicles.length; j++) {
          if (Vehicles[j].VehicleCode === codes[i].toString()) {
            buses.push(Vehicles[j].Lon);
            buses.push(Vehicles[j].Lat);
            busCoords.push(buses);
            buses = [];
          }
        }
      }

      return busCoords;
    };

    //display map
    if (item.classList[0] === "map-show-button") {
      const schedule = item.parentElement;
      const card = schedule.parentElement;
      const coordsContainer = card.children[3];
      const stopLon = coordsContainer.children[0].innerText;
      const stopLat = coordsContainer.children[1].innerText;
      const ID = coordsContainer.children[2].innerText;
      const stopName = schedule.children[0].innerText;

      const stopInfoSpan = document.querySelector(".stop-info-span");
      stopInfoSpan.innerText = stopName;

      const center = [stopLon, stopLat];

      removeMapButton.classList.remove("indicator");
      stopInfo.classList.remove("indicator");

      const mapDiv = document.createElement("div");
      mapDiv.id = "map";
      mapContainer.appendChild(mapDiv);

      let cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        card.classList.add("indicator");
      });

      //map setup
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v10",
        center: center,
        zoom: 13,
      });

      const stopMarker = new mapboxgl.Marker({
        color: "#f54538",
      })
        .setLngLat(center)
        .addTo(map);

      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav);

      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      //update bus icons
      const updateMap = async (coords) => {
        const details = await getTripDetails(ID);

        const geojson = {
          type: "FeatureCollection",
          features: [],
        };

        for (let i = 0; i < coords.length; i++) {
          let stop = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [coords[i][0], coords[i][1]],
            },
            properties: {
              title: details[i][0],
              description: details[i][1],
              time: details[i][2],
            },
          };

          geojson.features.push(stop);
        }

        const markers = document.querySelectorAll(".marker");

        markers.forEach((marker) => {
          marker.remove();
        });

        geojson.features.forEach(function (marker) {
          const element = document.createElement("div");
          element.innerHTML = '<i class="fas fa-bus"></i>';
          element.className = "marker";

          new mapboxgl.Marker(element)
            .setLngLat(marker.geometry.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>
                  ${marker.properties.title} 
                  </h3><p>
                  ${marker.properties.description}
                  </p><p>
                  ${marker.properties.time} 
                  </p>`
              )
            )
            .addTo(map);
        });
      };

      const coords = await getBusLocation(ID);
      updateMap(coords);

      const timer = setInterval(async () => {
        let coords = await getBusLocation(ID);
        updateMap(coords);
      }, 5000);

      //remove map
      removeMapButton.addEventListener("click", () => {
        removeMapButton.classList.add("indicator");
        stopInfo.classList.add("indicator");
        clearInterval(timer);

        const mapBox = document.getElementById("map");
        mapBox.remove();
        mapboxgl.clearStorage();

        let cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
          card.classList.remove("indicator");
          card.remove();
        });
        getTimeData();
      });
    }
  });

  // window.setInterval(() => {
  //   const cards = document.querySelectorAll(".card");

  //   if (cards[0].classList.contains("indicator") === false) {
  //     cards.forEach((card) => {
  //       card.remove();
  //     });

  //     getTimeData();
  //   } else {
  //     window.clearInterval();
  //   }
  // }, 30000);
};

const errorCallback = (error) => {
  console.log(error.message);
};

const app = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
    });
  }
};

app();
