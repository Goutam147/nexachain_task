/**
 * Date and Time Helper configured for Asia/Kolkata Timezone (IST)
 */

// Returns a new Date object representing the current time shifted to Asia/Kolkata (IST = UTC + 5:30)
const getKolkataTime = () => {
  const utc = Date.now();
  const kolkataOffset = 5.5 * 60 * 60 * 1000;
  return new Date(utc + kolkataOffset);
};

// Returns a YYYY-MM-DD calendar date string in Asia/Kolkata timezone
const getKolkataDateString = (date = new Date()) => {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  // Returns MM/DD/YYYY
  const formatted = date.toLocaleDateString('en-US', options);
  const [month, day, year] = formatted.split('/');
  return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
};

// Returns start and end Date bounds for the current calendar date in IST
const getKolkataStartAndEndOfToday = () => {
  const dateStr = getKolkataDateString(); // YYYY-MM-DD in IST
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);
  return { start, end };
};

module.exports = {
  getKolkataTime,
  getKolkataDateString,
  getKolkataStartAndEndOfToday
};
