import fetch from "node-fetch";
import pkg from 'ical.js';
const { parse, Component, Event } = pkg;

async function fetchCalendar(url) {
    // Replace 'webcal://' with 'http://'
    const httpUrl = url.replace('webcal://', 'http://');

    const response = await fetch(httpUrl);
    const data = await response.text();
    const jcalData = parse(data);
    const comp = new Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');

    for (let i = 0; i < events.length; i++) {
        const event = new Event(events[i]);
        console.log('Event:', event.summary);
        console.log('Starts:', event.startDate.toString());
        console.log('Ends:', event.endDate.toString());
    }
}

fetchCalendar('webcal://www.officeholidays.com/ics/ics_country.php?tbl_country=USA&nocache');
