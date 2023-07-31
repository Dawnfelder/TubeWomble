console.log("journey.js is linked");

// Part 1: POPULATE DROP DOWN MENUS WITH STATION DATA

// Function to populate dropdowns with station data
function populateDropdown(dropdownId, stations) {
  try {
    const dropdown = document.getElementById(dropdownId);

    // Clear existing options
    dropdown.innerHTML = "";

    // Create and append new options
    stations.forEach((station) => {
      const option = document.createElement("option");
      option.value = station.code;
      option.text = station.name;
      dropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating dropdown:", error);
  }
}

// Call function to populate the dropdowns
populateDropdown("start-station", stationData);
populateDropdown("dest-station", stationData);

// Part 2: API CALL AND ROUTE CHECK

// Function to make the API call and retrieve journey results
async function getJourneyResults(from, to) {
  const apiUrl = `https://api.tfl.gov.uk/Journey/JourneyResults/${from}/to/${to}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

// Function for form submission
async function handleSubmit(event) {
  event.preventDefault();
  const startStationCode = document.getElementById("start-station").value;
  const destStationCode = document.getElementById("dest-station").value;

  try {
    const journeyResults = await getJourneyResults(
      startStationCode,
      destStationCode
    );
    console.log("journeyResults:", journeyResults);

    // Check if a direct route is available
    const directRoute = journeyResults.journeys.some((journey) => {
      // Check if all legs are tube
      const allLegsTube = journey.legs.every((leg) => leg.mode.id === "tube");
      // Check number of legs in the journey
      const numberOfLegs = journey.legs.length;

      // Check if exactly one leg AND it is tube
      if (allLegsTube && numberOfLegs === 1) {
        return true;
      } else {
        return false;
      }
    });

    console.log("Direct route available:", directRoute);

    const resultsDiv = document.getElementById("journey-results");

    // Get the station names from our stationData variable
    const startStationName = stationData.find(
      (station) => station.code === startStationCode
    ).name;
    const destStationName = stationData.find(
      (station) => station.code === destStationCode
    ).name;

    // Format and display the results
    if (directRoute) {
      const lineName = journeyResults.lines[0].name;
      resultsDiv.innerHTML = `You can get from ${startStationName} to ${destStationName} via the ${lineName} line.`;
    } else {
      resultsDiv.innerHTML = `You cannot travel directly from ${startStationName} to ${destStationName}.`;
    }
    resultsDiv.style.display = "block";
  } catch (error) {
    console.error("Error fetching journey results:", error);
  }
}

// Event listener for form submission
const journeyForm = document.getElementById("journey-form");
journeyForm.addEventListener("submit", handleSubmit);
