/*
    For compatibility with Safari 9:
    i.e. iOS 9 (9/2015) / OS X El Capitan (9/2015)

    * Use var instead of let
    <https://caniuse.com/let>

    * Use Moment.js instead of toLocaleTimeString()
    <https://caniuse.com/?search=toLocaleTimeString%3Aoptions>    
*/

document.addEventListener("DOMContentLoaded", function () {
    function fetchAnnouncement() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById('message').textContent = xhr.responseText;
            }
        };
        xhr.open("GET", 'https://jrcpl.us/dayclock/announcement.txt', true);
        xhr.send();

        setTimeout(fetchAnnouncement, 1000 * 60 * 60); // 1 hour
    }

    function updateUI() {
        const now = new Date();

        // Known issue: This uses the browser locale, not the host's time/date format
        // so e.g. with language='en-US', region=SE, it returns 12 not 24 hour time
        var time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        var weekday = now.toLocaleDateString([], { weekday: 'long' });
        var date = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

        // Workaround for Safari 9
        if (window.Intl === undefined) {
            // toLocaleDate/TimeString(locale, ...) is not implemented
            // and polyfill.io returns the time in UTC timezone
            // so use Moment.js.
            const currentDate = moment();
            time = currentDate.format('LT');
            weekday = currentDate.format('dddd');
            date = currentDate.format('LL');
        }

        var hourAndMinutes = now.getHours() + now.getMinutes() / 60.0;

        // For debugging:
        // weekday = 'Wednesday';
        // date = 'September 30, 2023';
        // hourAndMinutes = 23;

        var partofday = '';
        var themeClassName = 'theme-light';

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
        document.getElementById('top').classList.add('top-fade');

        document.getElementById("middle").className = "box middle";
        document.getElementById("middle").classList.add('middle' + partofday);

        document.getElementById('partofdayIcon').innerHTML = partofdayIcon;
        document.getElementById('partofday').innerHTML = partofday.toUpperCase();
        document.getElementById('weekday').innerHTML = weekday;
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time.toUpperCase();

        // Calculate the time remaining until the next full minute
        const secondsRemaining = 60 - now.getSeconds();

        // Schedule the next update at the next full minute
        setTimeout(updateUI, secondsRemaining * 1000);
    }

    // Initialize
    fetchAnnouncement();
    updateUI();
    
    // Reload everything periodically
    setTimeout(() => location.reload(), 1000 * 60 * 60 * 24); // 24 hour
});
