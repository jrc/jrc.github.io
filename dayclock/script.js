/*
    For compatibility with Safari 9:
    i.e. iOS 9 (9/2015) / OS X El Capitan (9/2015)

    * Use var instead of let
    <https://caniuse.com/let>

    * Use Moment.js instead of toLocaleTimeString()
    <https://caniuse.com/?search=toLocaleTimeString%3Aoptions>    
*/

const TEST_MODE = false;
const USE_MOMENT = (window.Intl === undefined);  // Workaround for Safari 9

const testTransitionSecs = 0.25;
var testHoursAndMinutes = 0;

document.addEventListener("DOMContentLoaded", function () {
    function describeDaysUntil(dateString) {
        var deltaDays;
        
        if (USE_MOMENT) {
            const today = moment();
            const targetDate = moment(dateString);

            deltaDays = targetDate.diff(today, 'days');
        }
        else {
            const today = new Date();
            const targetDate = new Date(dateString);

            // Normalize to midnight to avoid time component issues
            today.setHours(0, 0, 0, 0);
            targetDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(targetDate - today);
            deltaDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        }
      
        if (deltaDays === 0) {
            return "today";
        } else if (deltaDays === 1) {
            return "tomorrow"; // Corrected from "in 1 day" for Moment.js
        } else {
            return "in " + deltaDays + " days";
        }
    }

    function fetchAnnouncement() {
        document.getElementById('message').textContent = ''; // Clear

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = xhr.responseText;
                data = "John is back {{describeDaysUntil('2024-07-07')}}.";

                const regex = /{{([^}]+)}}/g;

                data = data.replace(regex, function(match, expression) {
                    return eval(expression); // Assuming no sensitive data!
                });

                document.getElementById('message').textContent = data;
            }
        };
        xhr.open("GET", 'https://jrcpl.us/dayclock/announcement.txt', true);
        xhr.send();

        setTimeout(fetchAnnouncement, 1000 * 60 * 60); // 1 hour
    }

    function updateUI() {
        const now = new Date();

        var time;
        var weekday;
        var date;

        if (USE_MOMENT) {
            // toLocaleDate/TimeString(locale, ...) is not implemented
            // and polyfill.io returns the time in UTC timezone
            // so use Moment.js.
            const currentDate = moment();
            time = currentDate.format('LT');
            weekday = currentDate.format('dddd');
            date = currentDate.format('LL');
        }
        else {
            // Known issue: This uses the browser locale, not the host's time/date format
            // so e.g. with language='en-US', region=SE, it returns 12 not 24 hour time
            time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            weekday = now.toLocaleDateString([], { weekday: 'long' });
            date = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        }

        var hourAndMinutes;
        if (TEST_MODE) {
            hourAndMinutes = testHoursAndMinutes;
            time = hourAndMinutes + ':00 XX';
        }
        else {
            hourAndMinutes = now.getHours() + now.getMinutes() / 60.0;
        }

        // For debugging:
        // weekday = 'Wednesday';
        // date = 'September 30, 2023';
        // hourAndMinutes = 23;

        var themeClassName = 'theme-light';
        var partofdayIcon = '';
        var partofday = '';

        if (hourAndMinutes >= 7 && hourAndMinutes < 9) {
            partofdayIcon = '🥣';
            partofday = 'Breakfast';
        }
        else if (hourAndMinutes >= 12 && hourAndMinutes < 13) {
            partofdayIcon = '🍚';
            partofday = 'Lunch';
        }
        else if (hourAndMinutes >= 17 && hourAndMinutes < 18.5) {
            partofdayIcon = '🍜';
            partofday = 'Dinner';
        }
        else if (hourAndMinutes >= 6.5 && hourAndMinutes < 12) {
            partofdayIcon = '🌅';
            partofday = 'Morning';
        }
        else if (hourAndMinutes >= 12 && hourAndMinutes < 18) {
            partofdayIcon = '';
            partofday = 'Afternoon';
        }
        else if (hourAndMinutes >= 18 && hourAndMinutes < 22) {
            partofdayIcon = '🌇';
            partofday = 'Evening';
        }
        else {
            themeClassName = 'theme-dark';
            partofdayIcon = '🛌';
            partofday = 'Night';
        }

        document.getElementById("container").classList = "container";
        document.getElementById("container").classList.add(themeClassName);

        document.getElementById("top").className = "box top";
        document.getElementById("top").classList.add('top' + partofday);

        document.getElementById("middle").className = "box middle";
        document.getElementById("middle").classList.add('middle' + partofday);

        document.getElementById('partofdayIcon').innerHTML = partofdayIcon;
        document.getElementById('partofday').innerHTML = partofday.toUpperCase();
        document.getElementById('weekday').innerHTML = weekday;
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time.toUpperCase();

        if (TEST_MODE) {
            setTimeout(updateUI, 1000 * testTransitionSecs);

            testHoursAndMinutes = ++testHoursAndMinutes % 24;
        }
        else {
            // Calculate the time remaining until the next full minute
            const secondsRemaining = 60 - now.getSeconds();

            // Schedule the next update at the next full minute
            setTimeout(updateUI, 1000 * secondsRemaining);
        }
    }

    if (TEST_MODE) {
        const styleSheet = document.createElement('style');      
        const newStyles = ".top, .middle, .bottom { transition: background-color " + testTransitionSecs + "s !important; }";
        styleSheet.appendChild(document.createTextNode(newStyles));
        document.head.appendChild(styleSheet);
    }
    
    // Initialize
    fetchAnnouncement();
    updateUI();    
});

// Reload everything periodically
setTimeout(function() { location.reload(); }, 1000 * 60 * 60 * 24); // 24 hours
