// Data for events and nearby places
const events = {
    wedding: {
        title: "Viswajith & Niranjana Wedding Ceremony",
        date: "2025-08-25",
        startTime: "11:00",
        endTime: "11:40",
        location: "Lalith Mahal Kalyana Mandapam, West Fort, Trivandrum",
        mapLink: "https://maps.app.goo.gl/sDXLrUbBY6ens6vF9",
        description: "We request the honor of your gracious presence and blessings on the auspicious occasion of our son's marriage.",
        nearbyPlaces: [
            { name: "Padmanabhaswamy Temple", distance: "350 m", map: "https://g.co/kgs/csyC773" },
            { name: "Sunil's Wax Museum", distance: "800 m", map: "https://g.co/kgs/43DwBDH" },
            { name: "Kuthiramalika Palace", distance: "850 m", map: "https://maps.app.goo.gl/poT88mU9nP8Tcsed6" },
            { name: "Trivandrum Railway Station(TVC)", distance: "2.3 km", map: "https://maps.app.goo.gl/et8rn4243F4uX2qN7" },
            { name: "Zoo", distance: "4.2 km", map: "https://maps.app.goo.gl/rYZUSvdrPRNxKSvJ7" },
            { name: "Trivandrum International Airport (TRV)", distance: "5.3 km", map: "https://maps.app.goo.gl/zmJgvWKTEFsf2vDG6" },
            { name: "Kanakakunnu Palace", distance: "4.5 km", map: "https://maps.app.goo.gl/SJfojcrqnLXrB6LCA" },
            { name: "Veli Tourist Village", distance: "8.2 km", map: "https://maps.app.goo.gl/17B2Jz9TFCsUMZG38" },
            { name: "Varkala Cliff", distance: "45 km", map: "https://maps.app.goo.gl/biX1ER2Ti45PbMhs5" }
        ]
    },
    reception: {
        title: "Viswajith & Niranjana Wedding Reception",
        date: "2025-08-27",
        startTime: "18:00", // 6:00 PM
        endTime: "21:00",   // 9:00 PM
        location: "SGP Hall, Thiruvankulam, Kochi",
        mapLink: "https://maps.app.goo.gl/RiVvpVF2u7eCCMBQ6",
        description: "I Mrs. Dr. Kairali Dileep, Ashtapathi House, Chottanikkara, Thazhakkal Family, Ernakulam, request the honour of your gracious presence & blessings on the auspicious occasion of my son’s Marriage Reception.",
        nearbyPlaces: [
            { name: "Hill Palace Museum", distance: "1.5 km", map: "https://maps.app.goo.gl/dxfP3kUvrLCca8zBA" },
            { name: "Chottanikkara Bhagavathy Temple", distance: "3.4 km", map: "https://maps.app.goo.gl/b2Qa5Lp9UJxup5yXA" },
            { name: "Thrippunithura Railway Station (TRTR)", distance: "3.1 km", map: "https://maps.app.goo.gl/hwJzdJerChhv5NZVA" },
            { name: "Thripunithura Terminal Metro Station", distance: "3.2 km", map: "https://maps.app.goo.gl/c4s1m3hMn85WHunW9" },
            { name: "Mangalavanam Bird Sanctuary", distance: "15 km", map: "https://maps.app.goo.gl/Ci2zZUALW5aZEgc97" },
            { name: "Marine Viewpoint", distance: "13 km", map: "https://maps.app.goo.gl/BbLWSK7w58pqHCdR7" },
            { name: "Ernakulam Jn Railway Station", distance: "11.5 km", map: "https://maps.app.goo.gl/GroNx9gSm97nMrVo9" },
            { name: "Vasco da Gama Square", distance: "21 km", map: "https://maps.app.goo.gl/hjDePcLXggzZNa1y7" },
            { name: "Cochin International Airport (COK)", distance: "33 km", map: "https://maps.app.goo.gl/vMSETDdtKFZtWqyS6" }
        ]
    }
};

// Get modal elements
const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const modalMessage = document.getElementById('modalMessage');
const errorMessage = document.getElementById('errorMessage');
const googleCalLink = document.getElementById('googleCalLink');
const icsCalLink = document.getElementById('icsCalLink');
const loadingOverlay = document.getElementById('loading-overlay');
const mainContent = document.getElementById('main-content');

/**
 * Shows the specified modal.
 * @param {string} modalId - The ID of the modal to show ('successModal' or 'errorModal').
 * @param {string} message - The message to display in the modal.
 * @param {object} [eventData] - Event data for calendar links (only for success modal).
 * @param {string} [eventType] - 'wedding', 'reception', or 'both'
 */
function showModal(modalId, message, eventData = null, eventType = '') {
    if (modalId === 'successModal') {
        modalMessage.textContent = message;
        successModal.classList.remove('hidden');
        // Generate calendar links if eventData is provided
        if (eventData) {
            googleCalLink.href = generateGoogleCalendarLink(eventData, eventType);
            icsCalLink.href = generateICSFile(eventData, eventType);
        } else {
            googleCalLink.href = "#"; // Disable if no event data
            icsCalLink.href = "#"; // Disable if no event data
        }
    } else if (modalId === 'errorModal') {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
    }
}

/**
 * Hides the specified modal.
 * @param {string} modalId - The ID of the modal to hide.
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/**
 * Formats a date and time into a Google Calendar friendly format (YYYYMMDDTHHMMSSZ).
 * @param {string} dateStr - Date string (YYYY-MM-DD).
 * @param {string} timeStr - Time string (HH:MM).
 * @returns {string} Formatted datetime string.
 */
function formatDateTimeForGoogle(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    const dt = new Date(`${dateStr}T${timeStr}:00`);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}${pad(dt.getSeconds())}`;
}

/**
 * Generates nearby places description for calendar events.
 * @param {Array<Object>} places - Array of nearby place objects.
 * @param {string} venueName - Name of the venue.
 * @returns {string} Formatted string of nearby places.
 */
function getNearbyPlacesDescription(places, venueName) {
    if (!places || places.length === 0) return "";
    let description = `\\n\\nYou can also explore nearby places around ${venueName}:\\n`;
    places.forEach(place => {
        description += `- ${place.name} (${place.distance} from ${venueName})\\n`;
    });
    return description;
}

/**
 * Generates a Google Calendar link.
 * @param {object} data - Event data (title, date, startTime, endTime, location, description, nearbyPlaces).
 * @param {string} eventType - 'wedding', 'reception', or 'both'.
 * @returns {string} Google Calendar URL.
 */
function generateGoogleCalendarLink(data, eventType) {
    let desc = data.description;
    if (eventType === 'wedding' || eventType === 'both') {
        desc += getNearbyPlacesDescription(events.wedding.nearbyPlaces, events.wedding.location.split(',')[0]);
    }
    if (eventType === 'reception' || eventType === 'both') {
         desc += getNearbyPlacesDescription(events.reception.nearbyPlaces, events.reception.location.split(',')[0]);
    }

    const startDate = formatDateTimeForGoogle(data.date, data.startTime);
    const endDate = formatDateTimeForGoogle(data.date, data.endTime);
    const encodedTitle = encodeURIComponent(data.title);
    const encodedLocation = encodeURIComponent(data.location);
    const encodedDescription = encodeURIComponent(desc);

    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = `text=${encodedTitle}&dates=${startDate}/${endDate}&details=${encodedDescription}&location=${encodedLocation}&sf=true&output=xml`;
    return `${baseUrl}&${params}`;
}

/**
 * Generates an ICS file content.
 * @param {object} data - Event data (title, date, startTime, endTime, location, description, nearbyPlaces).
 * @param {string} eventType - 'wedding', 'reception', or 'both'.
 * @returns {string} Data URI for ICS file.
 */
function generateICSFile(data, eventType) {
    const startDate = new Date(`${data.date}T${data.startTime}:00`);
    const endDate = new Date(`${data.date}T${data.endTime}:00`);

    // Format dates for ICS (YYYYMMDDTHHMMSS)
    const formatICSDate = (dt) => {
        const pad = (num) => num.toString().padStart(2, '0');
        return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}${pad(dt.getSeconds())}`;
    };

    let descriptionText = data.description;
    if (eventType === 'wedding' || eventType === 'both') {
        descriptionText += getNearbyPlacesDescription(events.wedding.nearbyPlaces, events.wedding.location.split(',')[0]);
    }
    if (eventType === 'reception' || eventType === 'both') {
         descriptionText += getNearbyPlacesDescription(events.reception.nearbyPlaces, events.reception.location.split(',')[0]);
    }

    // Reminders (VALARM) - 1 week, 3 days, same day
    const now = new Date();
    const uid = `${Math.random().toString(36).substring(2, 15)}@yourdomain.com`; // Unique ID for the event

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Viswajith & Niranjana Wedding//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${formatICSDate(now)}Z
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${data.title}
LOCATION:${data.location}
DESCRIPTION:${descriptionText.replace(/\n/g, '\\n')}
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${data.title} is in 1 week!
TRIGGER;RELATED=START:-P7D
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${data.title} is in 3 days!
TRIGGER;RELATED=START:-P3D
END:VALARM
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${data.title} is today!
TRIGGER;RELATED=START:-PT0M
END:VALARM
END:VEVENT
END:VCALENDAR`;

    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}

// Event Listeners for RSVP buttons
document.getElementById('rsvpWeddingBtn').addEventListener('click', () => {
    showModal('successModal', 'Great! We\'ve prepared the calendar event for your wedding attendance.', events.wedding, 'wedding');
});

document.getElementById('rsvpReceptionBtn').addEventListener('click', () => {
    showModal('successModal', 'Wonderful! We\'ve prepared the calendar event for your reception attendance.', events.reception, 'reception');
});

document.getElementById('rsvpBothBtn').addEventListener('click', () => {
    // Modify modal message to indicate two events
    modalMessage.innerHTML = `Excellent! We've prepared calendar events for both the wedding and reception.<br><br>
                             You can add the wedding to your calendar: <a id="googleCalWeddingLink" href="#" target="_blank" class="btn-primary inline-flex items-center text-sm mr-2 mt-2"><i class="fab fa-google mr-1"></i> Google Cal</a>
                             <a id="icsCalWeddingLink" href="#" class="btn-secondary inline-flex items-center text-sm mt-2"><i class="fas fa-calendar-plus mr-1"></i> Download ICS (Wedding)</a>
                             <br><br>
                             And the reception: <a id="googleCalReceptionLink" href="#" target="_blank" class="btn-primary inline-flex items-center text-sm mr-2 mt-2"><i class="fab fa-google mr-1"></i> Google Cal</a>
                             <a id="icsCalReceptionLink" href="#" class="btn-secondary inline-flex items-center text-sm mt-2"><i class="fas fa-calendar-plus mr-1"></i> Download ICS (Reception)</a>`;

    successModal.classList.remove('hidden');

    // Set specific links for "both" option
    document.getElementById('googleCalWeddingLink').href = generateGoogleCalendarLink(events.wedding, 'wedding');
    document.getElementById('icsCalWeddingLink').href = generateICSFile(events.wedding, 'wedding');

    document.getElementById('googleCalReceptionLink').href = generateGoogleCalendarLink(events.reception, 'reception');
    document.getElementById('icsCalReceptionLink').href = generateICSFile(events.reception, 'reception');

    // Hide the default singular buttons in the modal if "both" is clicked
    googleCalLink.style.display = 'none';
    icsCalLink.style.display = 'none';
});

// Event listener to reset modal buttons when it's closed, ensuring correct display for next click
successModal.addEventListener('transitionend', () => {
    if (successModal.classList.contains('hidden')) {
        googleCalLink.style.display = 'inline-flex';
        icsCalLink.style.display = 'inline-flex';
    }
});

// Handle page load for preloader and content fade-in
window.onload = function() {
    // Fade out the loading overlay
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        // Make body visible after overlay is hidden
        document.body.classList.add('loaded');
    }, 500); // Wait for fade-out transition to complete
};
