const short = (stop) => {
  if (stop === "Wały Piastowskie") {
    stop = "Wały Piast.";
    return stop;
  }

  if (stop === "Dworzec Główny") {
    stop = "Dworzec Gł.";
    return stop;
  }

  if (stop === "Os. Barniewice") {
    stop = "Os. Barniewice";
    return stop;
  }

  if (stop === "Olszynka Szkoła") {
    stop = "Olszynka Sz.";
    return stop;
  }

  if (stop === "Górki Zachodnie") {
    stop = "Górki Zach.";
    return stop;
  }

  if (stop === "Górki Wschodnie") {
    stop = "Górki Wsch.";
    return stop;
  }

  if (stop === 'Sopot "Leśnik"') {
    stop = "Sopot Leśnik";
    return stop;
  }

  if (stop === "Urząd Skarbowy") {
    stop = "Urząd Skarb.";
    return stop;
  }

  if (stop === "Osiedle Wschód") {
    stop = "Osiedle Wsch.";
    return stop;
  }

  if (stop === "Chełm Cienista") {
    stop = "Chełm Cien.";
    return stop;
  }

  if (stop === "Galeria Bałtycka") {
    stop = "Galeria Bał.";
    return stop;
  }

  if (stop === "al. Płażyńskiego") {
    stop = "al. Płażyń.";
    return stop;
  }

  if (stop === "Sopot Kamienny Potok SKM") {
    stop = "Sopot K.P. SKM";
    return stop;
  }

  if (stop === "Nowy Port Szaniec Zachodni") {
    stop = "Nowy Port S. Z.";
    return stop;
  }

  if (stop.includes(" ") && stop.length > 13) {
    const words = stop.split(" ");

    if (words.length === 2) {
      return `${words[0]} ${words[1][0]}.`;
    }

    if (words.length === 3) {
      if ((words[0] + words[1]).length + 1 < 12) {
        return `${words[0]} ${words[1]} ${words[2][0]}.`;
      } else {
        return `${words[0]} ${words[1][0]}. ${words[2][0]}.`;
      }
    }
  } else {
    return stop;
  }
};
