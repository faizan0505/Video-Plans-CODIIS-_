module.exports.calculateEndDate = (durationValue, durationUnit) => {
  const startDate = new Date();
  durationValue = parseInt(durationValue);

  if (isNaN(durationValue) || durationValue <= 0) {
    return {
      status: false,
      message: "Duration value must be greater than 0."
    };
  }

  switch (durationUnit) {
    case "seconds":
      return {
        status: true,
        date: new Date(startDate.getTime() + durationValue * 1000).toISOString()
      };
    case "minutes":
      return {
        status: true,
        date: new Date(
          startDate.getTime() + durationValue * 60000
        ).toISOString()
      };
    case "hours":
      return {
        status: true,
        date: new Date(
          startDate.getTime() + durationValue * 3600000
        ).toISOString()
      };
    case "days":
      return {
        status: true,
        date: new Date(
          startDate.getTime() + durationValue * 86400000
        ).toISOString()
      };
    case "weeks":
      return {
        status: true,
        date: new Date(
          startDate.getTime() + durationValue * 7 * 86400000
        ).toISOString()
      };
    case "months":
      const newDate = new Date(startDate);
      newDate.setMonth(newDate.getMonth() + durationValue);
      return {
        status: true,
        date: newDate.toISOString()
      };
    case "years":
      const newYearDate = new Date(startDate);
      newYearDate.setFullYear(newYearDate.getFullYear() + durationValue);
      return {
        status: true,
        date: newYearDate.toISOString()
      };
    default:
      return {
        status: false,
        message: "Invalid duration unit."
      };
  }
};
