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

  // DEBUG
  if (getUrlParam("day")) {
    day = getUrlParam("day");
  }
  if (getUrlParam("hour")) {
    hour = parseInt(getUrlParam("hour"), 10);
  }

  var isAM = hour < 12;
  var isSaturday = day === "Sat";

  // Update color bars visibility
  document.querySelector(".am-bar").style.display = isAM ? "block" : "none";
  document.querySelector(".pm-bar").style.display = !isAM ? "block" : "none";

  // Update text content and colors
  var dayElement = document.querySelector(".day");
  var periodElement = document.querySelector(".period");

  dayElement.textContent = day;
  periodElement.textContent = isAM ? "AM" : "PM";

  dayElement.className = "day"; // Reset
  periodElement.className = "period"; // Reset

  if (isAM) {
    dayElement.classList.add("am-color");
    periodElement.classList.add("am-color");
  } else {
    dayElement.classList.add("pm-color");
    periodElement.classList.add("pm-color");
  }

  // Toggle right pane visibility
  var container = document.querySelector(".container");
  if (isSaturday && !isAM) {
    container.classList.remove("right-hidden");
  } else {
    container.classList.add("right-hidden");
  }
}

// Update initially and every minute
updateDisplay();
setInterval(updateDisplay, 60000);
