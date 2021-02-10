const timeDifference = (departureTime) => {
  const date = new Date();
  const currentTime = date.toLocaleTimeString().slice(0, -3);

  const timeStart = new Date("01/01/2021 " + currentTime);
  const timeStop = new Date("01/01/2021 " + departureTime);
  let difference = timeStop - timeStart;
  difference = difference / 60 / 1000;

  if (navigator.userAgent.includes("SamsungBrowser")) {
    return departureTime;
  }

  if (difference <= 0) {
    difference = "Now";
    return difference;
  } else {
    return `${difference} min`;
  }
};
