export const getDisplayTime = (time?: number) => {
  if (time === undefined) {
    return "--";
  }
  const hours = ("0" + Math.floor((time / 3600000) % 60)).slice(-2);
  const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
  const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
  const deciSeconds = Math.floor(time / 100) % 10;

  let preDecimal = [hours, minutes, seconds]
    .reduce((timeString, timeSlot) => {
      if (timeString === "") {
        if (timeSlot === "00") {
          return timeString;
        }
        if (timeSlot.slice(0, 1) === "0") {
          return stripLeadingZero(timeSlot).concat(":");
        }
      }
      return timeString.concat(timeSlot).concat(":");
    }, "")
    .slice(0, -1);

  if (!preDecimal) {
    preDecimal = "0";
  }

  return preDecimal.concat(".").concat(deciSeconds.toString());
};

const stripLeadingZero = (numberString: string) => {
  if (numberString.slice(0, 1) === "0") {
    return numberString.slice(1);
  }
  return numberString;
};
