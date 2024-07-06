/*
    For compatibility with Safari 9:
    i.e. iOS 9 (9/2015) / OS X El Capitan (9/2015)

    * Use var instead of let
    https://caniuse.com/let

    * Use Moment.js instead of toLocaleTimeString()
    https://caniuse.com/?search=toLocaleTimeString%3Aoptions
    
    * Use XMLHttpRequest() instead of fetch()
    https://caniuse.com/?search=fetch

    * Use getQueryParam() instead of URLSearchParams
    https://caniuse.com/?search=URLSearchParams
*/

var FETCH_ANNOUNCEMENT_SECS = 60 * 60 * 6; // 6 hours
var RELOAD_PAGE_SECS = 60 * 60 * 24; // 24 hours


// URLSearchParams was introduced in Safari 10
function getQueryParam(name, url) {  
    name = name.replace(/[\[\]]/g, '\\$&'); // Escape special characters
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
  
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
  
function getQueryParamAsBoolean(name, url) {
    if (!url) {
        url = window.location.href; // Use current URL if not provided
    }

    const value = getQueryParam(name, url); // Use the original getQueryParam function
    return value ? value.toLowerCase() === 'true' : false;
}

const TEST_MODE = getQueryParamAsBoolean('testMode');
const TEST_TRANSITION_SECS = 0.25;

if (TEST_MODE) {
    FETCH_ANNOUNCEMENT_SECS = 10;
    RELOAD_PAGE_SECS = 60;
}
var testHoursAndMinutes = 0;


const IS_OLD_BROWSER = (window.Intl === undefined);  // Workaround for Safari 9


console.log('Hello, world!');

function describeDaysUntil(dateString) {
    var deltaDays;
    
    if (IS_OLD_BROWSER) {
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

  
document.addEventListener("DOMContentLoaded", function () {
    function fetchAnnouncement() {
        document.getElementById('announcement').textContent = ''; // Clear

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = xhr.responseText;
                // data = "<b>John</b> is back {{describeDaysUntil('2024-07-07')}}.";

                const regex = /{{([^}]+)}}/g;

                data = data.replace(regex, function(match, expression) {
                    return eval(expression); // Assuming no sensitive data!
                });

                document.getElementById('announcement').innerHTML = data;
            }
        };
        const url = 'https://jrcpl.us/dayclock/announcement.txt';
        console.log('Fetching ' + url);
        xhr.open("GET", url, true);
        xhr.send();

        setTimeout(fetchAnnouncement, 1000 * FETCH_ANNOUNCEMENT_SECS);
    }

    function updateUI() {
        const now = new Date();
        var hourAndMinutes = now.getHours() + now.getMinutes() / 60.0;

        var time;
        var weekday;
        var date;

        if (IS_OLD_BROWSER) {
            // toLocaleDate/TimeString(locale, ...) is not implemented
            // and polyfill.io returns the time in UTC timezone
            // so use Moment.js.
            const now = moment();
            time = now.format('LT');
            weekday = now.format('dddd');
            date = now.format('LL');
        }
        else {
            // Known issue: This uses the browser locale, not the host's time/date format
            // so e.g. with language='en-US', region=SE, it returns 12 not 24 hour time
            time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            weekday = now.toLocaleDateString([], { weekday: 'long' });
            date = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        }

        if (TEST_MODE) {
            hourAndMinutes = testHoursAndMinutes;
            time = hourAndMinutes + ':00 XX';
        }

        // For debugging:
        // weekday = 'Wednesday';
        // date = 'September 30, 2023';
        // hourAndMinutes = 23;

        var themeClassName = 'theme-light';
        var partofdayIcon;
        var partofdayIconName = null;
        var partofday;

        if (hourAndMinutes >= 7 && hourAndMinutes < 9) {
            partofdayIcon = '🥣';
            partofdayIconName = 'openmoji-72x72-color/1F963.png';
            partofday = 'Breakfast';
        }
        else if (hourAndMinutes >= 12 && hourAndMinutes < 13) {
            partofdayIcon = '🍚';
            partofdayIconName = 'openmoji-72x72-color/1F35A.png';
            partofday = 'Lunch';
        }
        else if (hourAndMinutes >= 17 && hourAndMinutes < 18.5) {
            partofdayIcon = '🍜';
            partofdayIconName = 'openmoji-72x72-color/1F35C.png';
            partofday = 'Dinner';
        }
        else if (hourAndMinutes >= 6.5 && hourAndMinutes < 12) {
            partofdayIcon = '';
            partofday = 'Morning';
        }
        else if (hourAndMinutes >= 12 && hourAndMinutes < 18) {
            partofdayIcon = '';
            partofday = 'Afternoon';
        }
        else if (hourAndMinutes >= 18 && hourAndMinutes < 22) {
            partofdayIcon = '';
            partofday = 'Evening';
        }
        else {
            themeClassName = 'theme-dark';
            partofdayIcon = '🛌';
            partofdayIconName = 'openmoji-72x72-color/1F6CC.png';
            partofday = 'Sleep';
        }

        document.getElementById("container").className = "container";
        document.getElementById("container").classList.add(themeClassName);

        document.getElementById("top").className = "box top";
        document.getElementById("top").classList.add('top' + partofday);

        document.getElementById("middle").className = "box middle";
        document.getElementById("middle").classList.add('middle' + partofday);

        if (IS_OLD_BROWSER) {
            const partofdayIconDiv = document.getElementById('partofdayIcon');
            partofdayIconDiv.innerHTML = '';
            if (partofdayIconName) {
                const img = document.createElement('img');
                img.src = partofdayIconName;
                partofdayIconDiv.appendChild(img); 
            }
        }
        else {
            document.getElementById('partofdayIcon').innerHTML = partofdayIcon;
        }

        document.getElementById('partofday').innerHTML = partofday.toUpperCase();
        document.getElementById('weekday').innerHTML = weekday;
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time.toUpperCase();

        if (TEST_MODE) {
            setTimeout(updateUI, 1000 * TEST_TRANSITION_SECS);

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
        const newStyles = ".top, .middle, .bottom { transition: background-color " + TEST_TRANSITION_SECS + "s !important; }";
        styleSheet.appendChild(document.createTextNode(newStyles));
        document.head.appendChild(styleSheet);
    }
    
    // Initialize
    fetchAnnouncement();
    updateUI();    
});

// Reload everything periodically
setTimeout(function() { location.reload(); }, 1000 * RELOAD_PAGE_SECS);
