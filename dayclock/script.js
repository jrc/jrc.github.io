document.addEventListener("DOMContentLoaded", function () {
    function updateTime() {
        const now = new Date();
        const locale = navigator.language || navigator.userLanguage;

        // Polyfill the toLocaleTimeString method if it doesn't exist
        if (!Date.prototype.toLocaleTimeString) {
            Date.prototype.toLocaleTimeString = function (locale, options) {
                var date = this;
                var format = options.hour12
                    ? 'h:mm:ss a'
                    : 'HH:mm:ss';
                var formattedTime = date
                    .toString()
                    .split(' ')[4]
                    .replace(/:\d+ /, ' ');
                return formattedTime;
            };
        }

        // Polyfill the toLocaleDateString method if it doesn't exist
        if (!Date.prototype.toLocaleDateString) {
            Date.prototype.toLocaleDateString = function (locale, options) {
                var date = this;
                var format = options.year === 'numeric'
                    ? 'MMMM d, yyyy'
                    : options.month === 'long'
                        ? 'MMMM d'
                        : options.day === 'numeric'
                            ? 'd'
                            : 'MM/dd/yyyy';

                var formattedDate = format
                    .replace(/MMMM/, date.toLocaleString(locale, { month: 'long' }))
                    .replace(/yyyy/, date.toLocaleString(locale, { year: 'numeric' }))
                    .replace(/d/, date.toLocaleString(locale, { day: 'numeric' }));
                return formattedDate;
            };
        }

        const time = now.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
        const weekday = now.toLocaleDateString(locale, { weekday: 'long' });
        const date = now.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

        const hour = now.getHours();
        // const hour = 22;
        let greeting = "";
        let clockClassName = "clock-light";
        let topSectionClassName = "";
        if (hour >= 6 && hour < 12) {
            // Morning: yellow background, white text
            topSectionClassName = 'top-section-morning';
            greeting = 'Good morning';
        } else if (hour >= 12 && hour < 18) {
            // Afternoon: blue background, white text
            topSectionClassName = 'top-section-afternoon';
            greeting = 'Good afternoon';
        } else if (hour >= 18 && hour < 22) {
            // Evening: purple background, white text
            topSectionClassName = 'top-section-evening';
            greeting = 'Good evening';
        } else {
            // Evening: black background, dark red text
            clockClassName = "clock-dark";
            topSectionClassName = 'top-section-night';
            greeting = 'Good night';
        }

        document.getElementById("clock").className = clockClassName;
        document.getElementById("top-section").className = 'top-section';
        document.getElementById("top-section").classList.add(topSectionClassName);

        document.getElementById('greeting').innerHTML = greeting.toUpperCase();
        document.getElementById('weekday').innerHTML = weekday.toUpperCase();
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time.toUpperCase();

        // Calculate the time remaining until the next full minute
        const secondsRemaining = 60 - now.getSeconds();

        // Schedule the next update at the next full minute
        setTimeout(updateTime, secondsRemaining * 1000);
    }

    document.getElementById('top-section').classList.add('top-section-fade');

    updateTime(); // Initial call to start the clock
});
