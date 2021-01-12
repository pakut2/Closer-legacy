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

const app = () => {
  const searchButton = document.querySelector(".submit-button");
  const stopInput = document.querySelector(".stop-input");
  const stopNameSpan = document.querySelector(".stop-name-span");
  const lineSpan = document.querySelector(".line-span");
  const timeSpan = document.querySelector(".time-span");
  const dirSpan = document.querySelector(".dir-span");
  const cardContainer = document.querySelector(".stop-container");

  const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  stopInput.addEventListener("mouseover", () => {
    stopInput.focus();
  });

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();

    const getIdData = async () => {
      let direct;
      if (localStorage.getItem("direct") === null) {
        direct = [];
      } else {
        direct = JSON.parse(localStorage.getItem("direct"));
      }

      let API_URL =
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
      const response = await fetch(API_URL);
      const data = await response.json();

      const { stops, stopId, stopName, stopCode, zoneId } = data;

      let input = stopInput.value.split(" ").map(capitalise).join(" ");

      if (input !== direct[0]) {
        saveLocalDirectStop(input);
      }

      let words = input.split(" ");
      let code = words[words.length - 1];
      input = "";

      for (let i = 0; i < words.length - 1; i++) {
        input += words[i];
        input += " ";
      }
      input = input.slice(0, -1);

      for (let i = 0; i < stops.length; i++) {
        if (
          stops[i].stopName === input &&
          stops[i].stopCode === code &&
          stops[i].zoneId === 1
        ) {
          let ID = stops[i].stopId;
          let dataArr = [ID, stops[i].stopName];
          return dataArr;
        }
      }
    };

    const getTimeData = async () => {
      let arr = await getIdData();

      let ID = arr[0];

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

      cardContainer.classList.add("revealed");
      stopNameSpan.innerText = arr[1];

      if (headsigns.length !== 0) {
        routeIds.unshift("Line");
        headsigns.unshift("Direction");
        times.unshift("Departure");
      }

      lineSpan.innerText = routeIds.join("\n");

      if (headsigns.length === 0) {
        dirSpan.parentElement.style.paddingLeft = 0;
        dirSpan.style.width = "100%";
        dirSpan.innerText = "No courses available now.";
      } else {
        dirSpan.innerText = headsigns.join("\n");
        dirSpan.parentElement.style.paddingLeft = "7%";
        dirSpan.style.width = "auto";
      }

      timeSpan.innerText = times.join("\n");
    };

    getTimeData();
  });

  //save to local
  const saveLocalDirectStop = (stop) => {
    let direct;
    if (localStorage.getItem("direct") === null) {
      direct = [];
    } else {
      direct = JSON.parse(localStorage.getItem("direct"));
    }

    direct[0] = stop;
    localStorage.setItem("direct", JSON.stringify(direct));
  };

  //add from local to ui
  const getDirectStop = async () => {
    let direct;
    if (localStorage.getItem("direct") === null) {
      direct = [];
    } else {
      direct = JSON.parse(localStorage.getItem("direct"));
    }

    let stop = direct[0];

    let API_URL =
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
    let response = await fetch(API_URL);
    let data = await response.json();

    const { stops, stopId, stopName, stopCode, zoneId } = data;

    let input = stop;
    let words = input.split(" ");
    let code = words[words.length - 1];
    input = "";

    for (let i = 0; i < words.length - 1; i++) {
      input += words[i];
      input += " ";
    }
    input = input.slice(0, -1);
    let ID;
    let dataArr = [];

    for (let i = 0; i < stops.length; i++) {
      if (
        stops[i].stopName === input &&
        stops[i].stopCode === code &&
        stops[i].zoneId === 1
      ) {
        ID = stops[i].stopId;

        dataArr = [ID, stops[i].stopName];
      }
    }

    API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;

    response = await fetch(API_URL);
    data = await response.json();

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

    cardContainer.classList.add("revealed");

    for (let i = 0; i < routeIds.length; i++) {
      let value = routeIds[i].toString();
      let value1 = value.charAt(0);
      if (value1 === "4" && value.length > 1) {
        value = value.slice(1);
        value1 = "N" + value;
        routeIds[i] = value1;
      }
    }

    stopNameSpan.innerText = input;

    if (headsigns.length !== 0) {
      routeIds.unshift("Line");
      headsigns.unshift("Direction");
      times.unshift("Departure");
    }

    lineSpan.innerText = routeIds.join("\n");

    if (headsigns.length === 0) {
      dirSpan.parentElement.style.paddingLeft = 0;
      dirSpan.innerText = "No courses available now.";
    } else {
      dirSpan.innerText = headsigns.join("\n");
      dirSpan.parentElement.style.paddingLeft = "7%";
    }

    timeSpan.innerText = times.join("\n");
  };
  document.addEventListener("DOMContentLoaded", getDirectStop);
};

app();
