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

const app = () => {
  const searchButton = document.querySelector(".submit-button");
  const stopInput = document.querySelector(".stop-input");
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

  const capitalize = (string) => {
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

      let direct;
      if (localStorage.getItem("direct") === null) {
        direct = [];
      } else {
        direct = JSON.parse(localStorage.getItem("direct"));
      }

      let input = stopInput.value.split(" ").map(capitalize).join(" ");
      //let input = stopInput.value;

      let words = input.split(" ");
      let code = words[words.length - 1];
      input = "";

      for (let i = 0; i < words.length - 1; i++) {
        input += words[i];
        input += " ";
      }

      stopInput.value = input.toLowerCase();
      input = input.slice(0, -1);

      const isDuplicate = direct.some(
        (n) =>
          latinize(n.toLowerCase()) ===
          latinize(`${input} ${code}`.toLowerCase())
      );

      if (isDuplicate) {
        console.log("Do not repeat values!");
        return;
      }

      for (let i = 0; i < stops.length; i++) {
        if (
          latinize(stops[i].stopName) === latinize(input) &&
          stops[i].stopCode === code &&
          stops[i].zoneId === 1
        ) {
          let ID = stops[i].stopId;
          let dataArr = [ID, `${stops[i].stopName} ${stops[i].stopCode}`];
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
      if (window.innerWidth <= 1024) {
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

      saveLocalDirectStop(arr[1]);

      const dragDropButton = document.createElement("button");
      dragDropButton.classList.add("drag-drop-button");
      if (window.innerWidth > 1024) {
        dragDropButton.classList.add("indicator");
      }
      dragDropButton.innerHTML = "<i class='fas fa-arrows-alt'></i>";
      stopNameDiv.appendChild(dragDropButton);

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
        dirSpan.style.width = "100%";
      } else {
        dirSpan.style.width = "auto";
        dirSpan.innerText = headsigns.join("\n");
      }
      dirSpan.classList.add("dir-span");
      scheduleDiv.appendChild(dirSpan);

      const timeSpan = document.createElement("span");
      timeSpan.innerText = times.join("\n");
      timeSpan.classList.add("time-span");
      scheduleDiv.appendChild(timeSpan);

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons-div");
      cardDiv.appendChild(buttonsDiv);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-button");
      buttonsDiv.appendChild(deleteButton);

      const zoneIdContainer = document.createElement("div");
      zoneIdContainer.classList.add("zone-id-contaier");
      cardDiv.appendChild(zoneIdContainer);

      const idSpan = document.createElement("span");
      idSpan.innerText = ID;
      idSpan.classList.add("id-span");
      zoneIdContainer.appendChild(idSpan);

      stopList.appendChild(cardDiv);
      dragAndDrop();
    };

    // getTimeData().catch((error) => {
    //   console.error();
    // });
    getTimeData();
  });

  //toggle dragAndDrop on mobile
  stopList.addEventListener("click", (e) => {
    const item = e.target;

    if (item.classList[0] === "drag-drop-button") {
      const card1 = item.parentElement;
      const card = card1.parentElement;

      if (card.getAttribute("draggable") === "true") {
        card.setAttribute("draggable", "false");
        item.style.color = "white";
        card.style.cursor = "auto";
      } else {
        card.setAttribute("draggable", "true");
        card.style.cursor = "move";
        item.style.color = "#f54538";
      }
    }
  });

  //remove line
  stopList.addEventListener("click", (e) => {
    const item = e.target;

    if (item.classList[0] === "delete-button") {
      const card1 = item.parentElement;
      const card = card1.parentElement;
      card.classList.add("fall");
      removeLocalDirect(card);
      card.addEventListener("transitionend", () => {
        card.remove();
      });
    }
  });

  //save to local storage
  const saveLocalDirectStop = (stop) => {
    let direct;
    if (localStorage.getItem("direct") === null) {
      direct = [];
    } else {
      direct = JSON.parse(localStorage.getItem("direct"));
    }

    direct.push(stop);
    localStorage.setItem("direct", JSON.stringify(direct));
  };

  //add from local to ui
  const getDirect = async () => {
    let direct;
    if (localStorage.getItem("direct") === null) {
      direct = [];
    } else {
      direct = JSON.parse(localStorage.getItem("direct"));
    }

    const API_URL =
      "https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/d3e96eb6-25ad-4d6c-8651-b1eb39155945/download/stopsingdansk.json";
    let response = await fetch(API_URL);
    let data = await response.json();

    const { stops, stopId, stopName, stopCode, zoneId } = data;

    const getData = async (arg) => {
      let input = arg;
      let words = input.split(" ");
      let code = words[words.length - 1];
      input = "";

      for (let i = 0; i < words.length - 1; i++) {
        input += words[i];
        input += " ";
      }
      input = input.slice(0, -1);

      let ID;

      for (let i = 0; i < stops.length; i++) {
        if (
          stops[i].stopName === input &&
          stops[i].stopCode === code &&
          stops[i].zoneId === 1
        ) {
          ID = stops[i].stopId;
        }
      }

      ID_API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;

      response = await fetch(ID_API_URL);
      data = await response.json();

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
      if (window.innerWidth <= 1024) {
        cardDiv.setAttribute("draggable", "false");
        cardDiv.style.cursor = "auto";
      } else {
        cardDiv.setAttribute("draggable", "true");
      }

      const stopNameDiv = document.createElement("div");
      stopNameDiv.classList.add("stop-name-div");
      cardDiv.appendChild(stopNameDiv);

      const stopNameSpan = document.createElement("span");
      stopNameSpan.innerText = `${input} ${code}`;
      stopNameSpan.classList.add("stop-name-span");
      stopNameDiv.appendChild(stopNameSpan);

      const dragDropButton = document.createElement("button");
      dragDropButton.classList.add("drag-drop-button");
      if (window.innerWidth > 1024) {
        dragDropButton.classList.add("indicator");
      }
      dragDropButton.innerHTML = "<i class='fas fa-arrows-alt'></i>";
      stopNameDiv.appendChild(dragDropButton);

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

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons-div");
      cardDiv.appendChild(buttonsDiv);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.classList.add("delete-button");
      buttonsDiv.appendChild(deleteButton);

      const zoneIdContainer = document.createElement("div");
      zoneIdContainer.classList.add("zone-id-contaier");
      cardDiv.appendChild(zoneIdContainer);

      const idSpan = document.createElement("span");
      idSpan.innerText = ID;
      idSpan.classList.add("id-span");
      zoneIdContainer.appendChild(idSpan);

      stopList.appendChild(cardDiv);
      dragAndDrop();
    };

    direct.reduce(async (prev, arg) => {
      await prev;
      return getData(arg);
    }, Promise.resolve());
  };

  document.addEventListener("DOMContentLoaded", getDirect);

  //remove from local
  const removeLocalDirect = (stop) => {
    let direct;
    if (localStorage.getItem("direct") === null) {
      direct = [];
    } else {
      direct = JSON.parse(localStorage.getItem("direct"));
    }

    const stopIndex = stop.children[0].innerText;
    direct.splice(direct.indexOf(stopIndex), 1);
    localStorage.setItem("direct", JSON.stringify(direct));
  };

  //refreshes data
  const refresh = () => {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const schedule = card.children[1];
      const idSpan = card.children[3];
      const ID = idSpan.children[0].innerText;

      const getRefreshedData = async (ID) => {
        let API_URL = `https://ckan2.multimediagdansk.pl/delays?stopId=${ID}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        const { delay, estimatedTime, routeId, headsign } = data;

        if (delay.length === 0) {
          if (window.innerWidth <= 1024) {
            schedule.style.display = "flex";
            schedule.style.justifyContent = "center";
          }
          schedule.children[1].innerText = "No courses available now.";
          schedule.children[0].innerText = "";
          schedule.children[2].innerText = "";
        } else {
          schedule.style.display = "grid";
        }

        for (let i = 0; i < delay.length; i++) {
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

          if (headsigns.length !== 0) {
            routeIds.unshift("Line");
            headsigns.unshift("Direction");
            times.unshift("Departure");
          }

          schedule.children[0].innerText = routeIds.join("\n");
          schedule.children[1].innerText = headsigns.join("\n");
          schedule.children[2].innerText = times.join("\n");
        }
      };
      getRefreshedData(ID);
    });
  };

  window.setInterval(() => {
    const date = new Date();
    const currentTime = date.toLocaleTimeString().substring(6);
    if (currentTime === "00") {
      refresh();
    }
  }, 1000);
};

app();
