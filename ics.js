import fs from 'fs';
import csv from 'csv-parser';
import ICAL from 'ical.js';
import moment from 'moment-timezone';

let events = [];

fs.createReadStream('events.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Parse the date and time
    let dateTime = row.date.split('\n');
    let date = dateTime[0].trim();
    let timeRange = dateTime[1].split(' - ');
    let startTime = timeRange[0].trim();
    let endTime = timeRange[1].split(' ')[0].trim(); // Remove timezone

    // Convert the date and time to the format required by iCalendar
    let startDateTime = moment.tz(date + ' ' + startTime, 'dddd, MMMM DD hh:mm A', 'America/New_York').format();
    let endDateTime = moment.tz(date + ' ' + endTime, 'dddd, MMMM DD hh:mm A', 'America/New_York').format();

    // Create an event object
    let event = new ICAL.Event();
    event.summary = row.title;
    event.description = row['web-scraper-start-url'] + row.link;
    event.startDate = ICAL.Time.fromDateTimeString(startDateTime);
    event.endDate = ICAL.Time.fromDateTimeString(endDateTime);

    events.push(event);
  })
  .on('end', () => {
    // Create a calendar and add the events
    let calendar = new ICAL.Component(['vcalendar', [], []]);
    events.forEach(event => {
      calendar.addSubcomponent(event.component);
    });

    // Write the calendar to an .ics file
    fs.writeFileSync('events.ics', calendar.toString());
    console.log('CSV has been converted to ICS successfully.');
  });
