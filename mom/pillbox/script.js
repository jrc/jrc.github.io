function updateDisplay() {
  var now = moment();
  var day = now.format("ddd");
  var hour = now.hour();
  var isAM = hour < 12;
  var isSaturday = day === "Sat";

  // DEBUG
  // isAM = true;
  isSaturday = true;

  // Update color bars visibility
  document.querySelector(".am-bar").style.display = isAM ? "block" : "none";
  document.querySelector(".pm-bar").style.display = !isAM ? "block" : "none";

  // Update text content
  document.querySelector(".day").textContent = day;
  document.querySelector(".period").textContent = isAM ? "AM" : "PM";

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
