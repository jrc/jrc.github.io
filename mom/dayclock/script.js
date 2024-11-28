var FETCH_ANNOUNCEMENT_SECS = 60 * 60 * 12; // 12 hours

/*
    For compatibility with Safari 9:
    i.e. iOS 9 (9/2015) / OS X El Capitan (9/2015)

    * Use var instead of let
    https://caniuse.com/let

    * Use getQueryParam() instead of URLSearchParams
    https://caniuse.com/?search=URLSearchParams
    
    * Use Moment.js instead of toLocaleTimeString()
    https://caniuse.com/?search=toLocaleTimeString%3Aoptions
    // toLocaleDate/TimeString(locale, ...) is not implemented
    // and polyfill.io returns the time in UTC timezone, so use Moment.js.

    * Use XMLHttpRequest() instead of fetch()
    https://caniuse.com/?search=fetch
*/

/* Safari 9's Date constructor doesn't reliably parse ISO 8601 date strings
   without time/timezone info, often treating them as UTC midnight,
   leading to potential timezone issues. */
function parseISODate(dateString) {
  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

function describeDaysUntil(dateString) {
  var deltaDays;

  const today = new Date();
  const targetDate = new parseISODate(dateString);

  // Normalize to midnight to avoid time component issues
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  deltaDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (deltaDays < 0) {
    return "(already)";
  } else if (deltaDays === 0) {
    return "today";
  } else if (deltaDays === 1) {
    return "tomorrow"; // Corrected from "in 1 day" for Moment.js
  } else {
    return "in " + deltaDays + " days";
  }
}

function fetchAnnouncement() {
  document.getElementById("announcement").textContent = ""; // Clear

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var data = xhr.responseText;
      // data = "Alan &amp; John leave {{describeDaysUntil('2024-07-15')}}.\n蓮芬 comes Monday 3:00&nbsp;PM\nand Thursday 9:00&nbsp;AM.";
      // data = "蓮芬 comes Mondays and Thursdays."

      data = data.replace(/\n/g, "<br>");

      data = data.replace(/{{([^}]+)}}/g, function (match, expression) {
        return eval(expression); // Assuming no sensitive data!
      });

      document.getElementById("announcement").innerHTML = data;
    }
  };
  const url = "https://jrcpl.us/mom/dayclock/announcement.txt";
  console.log("Fetching " + url);
  xhr.open("GET", url, true);
  xhr.send();

  setTimeout(fetchAnnouncement, 1000 * FETCH_ANNOUNCEMENT_SECS);
}

document.addEventListener("DOMContentLoaded", function () {
  function updateUI() {
    try {
      const now = new Date();

      var time;
      var weekday;
      var date;

      const momentNow = moment();
      time = momentNow.format("LT");
      weekday = momentNow.format("dddd");
      date = momentNow.format("LL");

      var hourAndMinutes = now.getHours() + now.getMinutes() / 60.0;

      // For debugging:
      // weekday = "Wednesday";
      // date = "December 12, 2024";
      // hourAndMinutes = 23;

      var themeClassName = "theme-light";
      var partofdayText;
      var partofdayClassName;

      if (hourAndMinutes >= 6.5 && hourAndMinutes < 12) {
        partofdayText = "Morning".toUpperCase();
        partofdayClassName = "morning";
      } else if (hourAndMinutes >= 12 && hourAndMinutes < 18) {
        partofdayText = "Afternoon".toUpperCase();
        partofdayClassName = "afternoon";
      } else if (hourAndMinutes >= 18 && hourAndMinutes < 22) {
        partofdayText = "Evening".toUpperCase();
        partofdayClassName = "evening";
      } else {
        themeClassName = "theme-dark";
        partofdayText = "Bedtime";
        partofdayClassName = "bedtime";
      }

      if (hourAndMinutes >= 7 && hourAndMinutes < 9) {
        partofdayText = "Time for Breakfast";
      } else if (hourAndMinutes >= 12 && hourAndMinutes < 13) {
        partofdayText = "Time for Lunch";
      } else if (hourAndMinutes >= 17 && hourAndMinutes < 18.5) {
        partofdayText = "Time for Dinner";
      }

      var container = document.getElementById("container");
      container.className = "container"; // Reset
      container.classList.add(themeClassName);
      container.classList.add(partofdayClassName);

      document.getElementById("weekday").textContent = weekday.toUpperCase();
      document.getElementById("partofday").textContent = partofdayText;
      document.getElementById("date").textContent = date;
      document.getElementById("time").textContent = time;

      // Calculate the time remaining until the next full minute
      const secondsRemaining = 60 - now.getSeconds();
      // Schedule the next update at the next full minute
      setTimeout(updateUI, 1000 * secondsRemaining);
    } catch (err) {
      console.error(err);

      const container = document.getElementById("container");
      const newParagraph = document.createElement("p");
      newParagraph.textContent = err;
      container.appendChild(newParagraph);
    }
  }

  // Initialize
  updateUI();
  fetchAnnouncement();
});
