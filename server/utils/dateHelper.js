/**
 * Date and Time Helper configured for Asia/Kolkata Timezone
 */

// Returns a new Date object representing the current time adjusted to Asia/Kolkata
const getKolkataTime = () => {
  return new Date();
};

// Returns a YYYY-MM-DD calendar date string in Asia/Kolkata timezone
const getKolkataDateString = (date = new Date()) => {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  // Returns MM/DD/YYYY
  const formatted = date.toLocaleDateString('en-US', options);
  const [month, day, year] = formatted.split('/');
  return `${year}-${month}-${day}`; // Returns YYYY-MM-DD
};

module.exports = {
  getKolkataTime,
  getKolkataDateString
};
