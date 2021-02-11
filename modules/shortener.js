const short = (stop) => {
  if (stop.includes(" ") && stop.length > 12) {
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
