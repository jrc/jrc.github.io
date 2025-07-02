function updateDisplay() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const hour = now.getHours();

  // Debug mode - override with URL parameters
  const params = new URLSearchParams(window.location.search);
  const debugDay = params.get("day");
  const debugHour = params.get("hour");

  const actualDay = debugDay || day;
  const actualHour = debugHour ? parseInt(debugHour, 10) : hour;

  const isAM = actualHour < 12;

  // Update color bars visibility
  document.querySelector(".am-bar").style.display = isAM ? "block" : "none";
  document.querySelector(".pm-bar").style.display = isAM ? "none" : "block";

  // Update text content and colors
  const dayElement = document.querySelector(".day");
  const periodElement = document.querySelector(".period");

  dayElement.textContent = actualDay;
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
