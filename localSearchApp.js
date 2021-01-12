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

const navSlide = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links li");
  const section = document.querySelector(".section");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${
          index / 7 + 0.3
        }s`;
      }
    });

    burger.classList.toggle("toggle");
    nav.classList.add("transition");
    section.classList.toggle("shadow");
  });

  section.addEventListener("click", () => {
    if (burger.classList.contains("toggle")) {
      nav.classList.toggle("nav-active");
      navLinks.forEach((link, index) => {
        if (link.style.animation) {
          link.style.animation = "";
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`;
        }
      });
      burger.classList.toggle("toggle");
      nav.classList.add("transition");
      section.classList.toggle("shadow");
    }
  });
};

navSlide();

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

const successCallback = async (position) => {
  //   console.log(position.coords.latitude);
  //   console.log(position.coords.longitude);
  const lat1 = position.coords.latitude;
  const lon1 = position.coords.longitude;

  const stopList = document.querySelector(".stop-list");

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

  const getTimeData = async () => {
    const array = await getIdData();
    // console.log(array.sort());
    array.sort();

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
        times.push(delay[i].estimatedTime);
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

      const lineSpan = document.createElement("span");
      lineSpan.innerText = routeIds.join("\n");
      lineSpan.classList.add("line-span");
      scheduleDiv.appendChild(lineSpan);

      const timeSpan = document.createElement("span");
      if (times.length === 1) {
        scheduleDiv.style.paddingLeft = 0;
        timeSpan.innerText = "No courses available now.";
      } else {
        timeSpan.innerText = times.join("\n");
      }
      timeSpan.classList.add("time-span");
      scheduleDiv.appendChild(timeSpan);

      const dirSpan = document.createElement("span");
      dirSpan.innerText = headsigns.join("\n");
      dirSpan.classList.add("dir-span");
      scheduleDiv.appendChild(dirSpan);

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
};

const errorCallback = (error) => {
  console.log(error.message);
};

const app = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
};

app();
