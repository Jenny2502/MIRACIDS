$(function () {
  document
    .getElementById("eventForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Create an event object
      const newEvent = {
        date: $("#eventDate").val(),
        duration: $("#duration").val(),
        description: $("#eventDescription").val(),
      };

      // Submit event
      submitEvent(newEvent);
      // Add the event object to the calendar
      addEventToCalendar(newEvent);

      // Clear the form
      event.target.reset();
    });

  fetchEvents();
});

function fetchEvents() {
  fetch("/schedules")
    .then((response) => response.json())
    .then((data) => {
      renderCalendar(data);
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}

function renderCalendar(events) {
  events.forEach((event) => {
    addEventToCalendar(event);
  });
}

function addEventToCalendar(eventData) {
  var eventStartTime = new Date(eventData.date);
  var eventEndTime = addMinutes(eventStartTime, eventData.duration);

  const days = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
  const styles = ["ent-law", "corp-fi", "writing", "securities"];

  const eventElement = `<div style="grid-row-start: ${eventStartTime.getHours() + 1}; grid-row-end: ${eventEndTime.getHours() + 2};" class="event ${
    styles[random(4)]
  }">
                <p class="title">${eventData.description}</p>
                <p class="time">${eventStartTime
                  .toLocaleTimeString("en-US")} - ${eventEndTime.toLocaleTimeString("en-US")} </p>
    </div>`;
  const dayClass = days[eventStartTime.getDay()];
  $("." + dayClass + " > .events").append(eventElement);
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function addMinutes(inputDate, minutes) {
  var dateInMs = inputDate.getTime();
  var addMlSeconds = minutes * 60 * 1000;
  var newDateObj = new Date(dateInMs + addMlSeconds);
  return newDateObj;
}

function submitEvent(eventData) {
  console.log(JSON.stringify(eventData));
  fetch("/schedules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Event added:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
