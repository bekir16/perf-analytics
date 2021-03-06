window.onload = function() {
// FCP
const paintEntries = window.performance.getEntriesByType("paint")[1];
const navigationEntries = performance.getEntriesByType("navigation")[0];

console.log("paintEntries", paintEntries)

//TTFB
const ttfb = navigationEntries.responseStart - navigationEntries.requestStart;

// DOM lOAD (Check startTime)
const domLoad = navigationEntries.domComplete - navigationEntries.domContentLoadedEventStart;

// WINDOW LOAD EVENTS
const windowLoadEvents = navigationEntries.loadEventStart - navigationEntries.loadEventEnd

const siteName = window.location.href;

const data = JSON.stringify({
  site: siteName,
  ttfb: ttfb,
  fcp: paintEntries && paintEntries.startTime || 0,
  domload: domLoad,
  windowLoadEvents: windowLoadEvents
  })
  console.log("data",data)
  fetch("https://bba-performance-analytics.herokuapp.com", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  }).then(res => {
    console.log("Request complete! response:", res);
  });

}