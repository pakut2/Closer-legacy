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

    const { stops, stopId, stopName, stopLat, stopLon } = data;

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
    // console.log(array.sort(sortFunction));
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
        let date = new Date();
        let currentTime = date.toLocaleTimeString().slice(0, -3);

        let timeStart = new Date("01/01/2021 " + currentTime);
        let timeStop = new Date("01/01/2021 " + delay[i].estimatedTime);
        let difference = timeStop - timeStart;
        difference = difference / 60 / 1000;

        if (difference <= 0) {
          difference = 1;
        }

        times.push(`${difference} min`);
        routeIds.push(delay[i].routeId);
        headsigns.push(delay[i].headsign);
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
      stopNameSpan.innerText = array[i][2];
      stopNameSpan.classList.add("stop-name-span");
      stopNameDiv.appendChild(stopNameSpan);

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
        scheduleDiv.style.paddingLeft = 0;
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

      stopList.appendChild(cardDiv);
    }
  };

  getTimeData().catch((error) => {
    console.error();
  });
  // getTimeData();
};

const errorCallback = (error) => {
  console.log(error.message);
};

const app = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  let timer = setTimeout(() => {
    location.reload();
  }, 30000);
};

app();