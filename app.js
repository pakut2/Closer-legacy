if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

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
    }
  });
};

navSlide();

const dragAndDrop = () => {
  let draggables = document.querySelectorAll(".card");
  const container = document.querySelector(".stop-list");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });

    let timer;
    let touchDuration = 1000;
    draggable.addEventListener("touchstart", () => {
      timer = setTimeout(() => {
        if (window.innerWidth <= 768) {
          draggable.setAttribute("draggable", "true");
          draggable.classList.add("dragging");
        }
      }, touchDuration);
      draggable.addEventListener("touchend", () => {
        if (timer) {
          clearTimeout(timer);
          draggable.setAttribute("draggable", "false");
          draggable.classList.remove("dragging");
        }
      });
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    container.appendChild(draggable);
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });

  const getDragAfterElement = (container, y) => {
    const draggableElements = [
      ...container.querySelectorAll(".card:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  };

  container.addEventListener("dragend", (e) => {
    draggables = document.querySelectorAll(".card");
    e.preventDefault();
    terminus = [];
    directions = [];

    draggables.forEach((draggable) => {
      let stop = draggable.children;

      terminus.push(stop[0].innerText);
      directions.push(stop[3].innerText);

      localStorage.setItem("terminus", JSON.stringify(terminus));
      localStorage.setItem("directions", JSON.stringify(directions));
    });
  });
};

const app = () => {
  const searchButton = document.querySelector(".submit-button");
  const stopInput = document.querySelector(".stop-input");
  const stopList = document.querySelector(".stop-list");
  // const dragButton = document.querySelector(".drag-drop");
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

  // dragButton.addEventListener("click", (e) => {
  //   e.preventDefault();
  //   const cards = document.querySelectorAll(".card");

  //   cards.forEach((card) => {
  //     if (card.getAttribute("draggable") === "true") {
  //       card.setAttribute("draggable", "false");
  //       card.style.cursor = "auto";
  //       dragButton.style.color = "white";
  //       dragButton.style.background = "#f54538";
  //     } else {
  //       card.setAttribute("draggable", "true");
  //       card.style.cursor = "move";
  //       dragButton.style.background = "white";
  //       dragButton.style.color = "#f54538";
  //     }
  //   });
  // });

  const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  stopInput.addEventListener("mouseover", () => {
    stopInput.focus();
  });

  searchButton.addEventListener("click", (e) => {
    e.preventDefault();

    const getIdData = async () => {
      let API_URL =
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
      const response = await fetch(API_URL);
      const data = await response.json();

      const { stops, stopId, stopName, stopCode, zoneId } = data;

      let terminus;
      if (localStorage.getItem("terminus") === null) {
        terminus = [];
      } else {
        terminus = JSON.parse(localStorage.getItem("terminus"));
      }

      let input = stopInput.value.split(" ").map(capitalise).join(" ");
      const isDuplicate = terminus.some((n) => n === input);
      stopInput.value = "";

      if (isDuplicate) {
        console.log("Do not repeat values!");
        return;
      }

      for (let i = 0; i < stops.length; i++) {
        if (
          stops[i].stopName === input &&
          stops[i].stopCode === "01" &&
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
      // console.log(arr[1]);

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
      if (window.innerWidth <= 768) {
        cardDiv.setAttribute("draggable", "false");
        cardDiv.style.cursor = "auto";
      } else {
        cardDiv.setAttribute("draggable", "true");
      }

      const stopNameDiv = document.createElement("div");
      stopNameDiv.classList.add("stop-name-div");
      cardDiv.appendChild(stopNameDiv);

      const stopNameSpan = document.createElement("span");
      stopNameSpan.innerText = arr[1];
      stopNameSpan.classList.add("stop-name-span");
      stopNameDiv.appendChild(stopNameSpan);

      saveLocalTerminus(arr[1]);

      const scheduleDiv = document.createElement("div");
      scheduleDiv.classList.add("schedule-div");
      cardDiv.appendChild(scheduleDiv);

      const lineSpan = document.createElement("span");
      lineSpan.innerText = routeIds.join("\n");
      lineSpan.classList.add("line-span");
      scheduleDiv.appendChild(lineSpan);

      const timeSpan = document.createElement("span");
      timeSpan.innerText = times.join("\n");
      timeSpan.classList.add("time-span");
      scheduleDiv.appendChild(timeSpan);

      const dirSpan = document.createElement("span");
      dirSpan.innerText = headsigns.join("\n");
      dirSpan.classList.add("dir-span");
      scheduleDiv.appendChild(dirSpan);

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons-div");
      cardDiv.appendChild(buttonsDiv);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-button");
      buttonsDiv.appendChild(deleteButton);

      const dirButton = document.createElement("button");
      dirButton.innerHTML = '<i class="fas fa-retweet"></i>';
      dirButton.classList.add("reverse-button");
      buttonsDiv.appendChild(dirButton);

      const zoneIdContainer = document.createElement("div");
      zoneIdContainer.classList.add("zone-id-contaier");
      cardDiv.appendChild(zoneIdContainer);

      const zoneIdSpan = document.createElement("span");
      zoneIdSpan.innerText = "01";
      zoneIdSpan.classList.add("zone-id-span");
      zoneIdContainer.appendChild(zoneIdSpan);

      saveLocalDirections(zoneIdSpan.innerText);

      stopList.appendChild(cardDiv);
      dragAndDrop();
    };

    getTimeData().catch((error) => {
      console.error();
    });
  });

  //remove line
  stopList.addEventListener("click", (e) => {
    const item = e.target;

    if (item.classList[0] === "delete-button") {
      const card1 = item.parentElement;
      const card = card1.parentElement;
      const stop1 = card.children;
      let directionId = stop1[3].innerText;
      card.classList.add("fall");
      removeLocalTerminus(card);
      removeLocalDirections(directionId);
      card.addEventListener("transitionend", () => {
        card.remove();
      });
    }
  });

  //reverse direction
  stopList.addEventListener("click", async (e) => {
    const item = e.target;

    if (item.classList[0] === "reverse-button") {
      const card1 = item.parentElement;
      const card = card1.parentElement;
      const stop1 = card.children;
      const stop = stop1[0].innerText;

      let API_URL =
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
      let response = await fetch(API_URL);
      let data = await response.json();

      const { stops, stopId, stopName, stopCode, zoneId } = data;

      let input = stop;
      let ID;
      let directionId = stop1[3].innerText;

      let directions;

      if (localStorage.getItem("directions") === null) {
        directions = [];
      } else {
        directions = JSON.parse(localStorage.getItem("directions"));
      }

      let terminus;
      if (localStorage.getItem("terminus") === null) {
        terminus = [];
      } else {
        terminus = JSON.parse(localStorage.getItem("terminus"));
      }

      if (directionId === "01") {
        for (let i = 0; i < stops.length; i++) {
          if (
            stops[i].stopName === input &&
            stops[i].stopCode === "02" &&
            stops[i].zoneId === 1
          ) {
            ID = stops[i].stopId;

            dataArr = [ID, stops[i].stopName];
            stop1[3].innerText = "02";
            stop1[3].classList.add("hidden");
            directionId = stop1[3].innerText;
            directions[terminus.indexOf(stop)] = directionId;

            localStorage.setItem("directions", JSON.stringify(directions));
          }
        }
      } else if (directionId === "02") {
        for (let i = 0; i < stops.length; i++) {
          if (
            stops[i].stopName === input &&
            stops[i].stopCode === "01" &&
            stops[i].zoneId === 1
          ) {
            ID = stops[i].stopId;

            dataArr = [ID, stops[i].stopName];
            stop1[3].innerText = "01";
            stop1[3].classList.add("hidden");
            directionId = stop1[3].innerText;
            directions[terminus.indexOf(stop)] = directionId;

            localStorage.setItem("directions", JSON.stringify(directions));
          }
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

      const reverseSchedule = stop1[1].children;

      for (let i = 0; i < routeIds.length; i++) {
        let value = routeIds[i].toString();
        let value1 = value.charAt(0);
        if (value1 === "4" && value.length > 1) {
          value = value.slice(1);
          value1 = "N" + value;
          routeIds[i] = value1;
        }
      }

      reverseSchedule[0].innerText = routeIds.join("\n");
      reverseSchedule[1].innerText = times.join("\n");
      reverseSchedule[2].innerText = headsigns.join("\n");
    }
  });

  //save to local storage
  const saveLocalTerminus = (stop) => {
    let terminus;
    if (localStorage.getItem("terminus") === null) {
      terminus = [];
    } else {
      terminus = JSON.parse(localStorage.getItem("terminus"));
    }

    terminus.push(stop);
    localStorage.setItem("terminus", JSON.stringify(terminus));
  };

  const saveLocalDirections = (stop) => {
    let directions;
    if (localStorage.getItem("directions") === null) {
      directions = [];
    } else {
      directions = JSON.parse(localStorage.getItem("directions"));
    }

    directions.push(stop);
    localStorage.setItem("directions", JSON.stringify(directions));
  };

  //add from local to ui
  const getTerminus = () => {
    let terminus;
    if (localStorage.getItem("terminus") === null) {
      terminus = [];
    } else {
      terminus = JSON.parse(localStorage.getItem("terminus"));
    }

    let directions;
    if (localStorage.getItem("directions") === null) {
      directions = [];
    } else {
      directions = JSON.parse(localStorage.getItem("directions"));
    }

    terminus.forEach(async (stop) => {
      let API_URL =
        "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
      let response = await fetch(API_URL);
      let data = await response.json();

      const { stops, stopId, stopName, stopCode, zoneId } = data;

      let input = stop;
      let ID;
      let dataArr = [];

      for (let i = 0; i < stops.length; i++) {
        if (
          stops[i].stopName === input &&
          stops[i].stopCode === directions[terminus.indexOf(input)] &&
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
      if (window.innerWidth <= 768) {
        cardDiv.setAttribute("draggable", "false");
        cardDiv.style.cursor = "auto";
      } else {
        cardDiv.setAttribute("draggable", "true");
      }

      const stopNameDiv = document.createElement("div");
      stopNameDiv.classList.add("stop-name-div");
      cardDiv.appendChild(stopNameDiv);

      const stopNameSpan = document.createElement("span");
      stopNameSpan.innerText = dataArr[1];
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
      timeSpan.innerText = times.join("\n");
      timeSpan.classList.add("time-span");
      scheduleDiv.appendChild(timeSpan);

      const dirSpan = document.createElement("span");
      dirSpan.innerText = headsigns.join("\n");
      dirSpan.classList.add("dir-span");
      scheduleDiv.appendChild(dirSpan);

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons-div");
      cardDiv.appendChild(buttonsDiv);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-button");
      buttonsDiv.appendChild(deleteButton);

      const dirButton = document.createElement("button");
      dirButton.innerHTML = '<i class="fas fa-retweet"></i>';
      dirButton.classList.add("reverse-button");
      buttonsDiv.appendChild(dirButton);

      const zoneIdContainer = document.createElement("div");
      zoneIdContainer.classList.add("zone-id-contaier");
      cardDiv.appendChild(zoneIdContainer);

      const zoneIdSpan = document.createElement("span");
      zoneIdSpan.innerText = directions[terminus.indexOf(dataArr[1])];
      zoneIdSpan.classList.add("zone-id-span");
      zoneIdContainer.appendChild(zoneIdSpan);

      stopList.appendChild(cardDiv);
      dragAndDrop();
    });
  };

  //remove from local
  const removeLocalTerminus = (stop) => {
    let terminus;
    if (localStorage.getItem("terminus") === null) {
      terminus = [];
    } else {
      terminus = JSON.parse(localStorage.getItem("terminus"));
    }

    const stopIndex = stop.children[0].innerText;
    terminus.splice(terminus.indexOf(stopIndex), 1);
    localStorage.setItem("terminus", JSON.stringify(terminus));
  };

  const removeLocalDirections = (stop) => {
    let directions;
    if (localStorage.getItem("directions") === null) {
      directions = [];
    } else {
      directions = JSON.parse(localStorage.getItem("directions"));
    }

    const stopIndex = stop.innerText;
    directions.splice(directions.indexOf(stopIndex), 1);
    localStorage.setItem("directions", JSON.stringify(directions));
  };

  document.addEventListener("DOMContentLoaded", getTerminus);
};

app();
