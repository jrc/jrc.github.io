function getUrlParam(param) {
  var search = window.location.search;
  var params = {};

  if (search) {
    // Remove leading '?' if present
    search = search.charAt(0) === "?" ? search.slice(1) : search;

    var pairs = search.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      params[decodeURIComponent(pair[0])] = pair[1]
        ? decodeURIComponent(pair[1])
        : "";
    }
  }

  return params.hasOwnProperty(param) ? params[param] : undefined;
}

function updateDisplay() {
  var now = moment();
  var day = now.format("ddd");
  var hour = now.hour();

  // Debug mode - override with URL parameters
  var debugDay = getUrlParam("day");
  var debugHour = getUrlParam("hour");

  if (debugDay) {
    day = debugDay;
  }
  if (debugHour) {
    hour = parseInt(debugHour, 10);
  }

  var isAM = hour < 12;

  // Update color bars visibility
  document.querySelector(".am-bar").style.display = isAM ? "block" : "none";
  document.querySelector(".pm-bar").style.display = isAM ? "none" : "block";

  // Update text content and colors
  var dayElement = document.querySelector(".day");
  var periodElement = document.querySelector(".period");

  dayElement.textContent = day;
  periodElement.textContent = isAM ? "AM" : "PM";

  // Reset classes
  dayElement.className = "day";
  periodElement.className = "period";

  // Add color classes
  if (isAM) {
    dayElement.classList.add("am-color");
    periodElement.classList.add("am-color");
  } else {
    dayElement.classList.add("pm-color");
    periodElement.classList.add("pm-color");
  }
}

// Initialize and update every minute
updateDisplay();
setInterval(updateDisplay, 60000);
