"use strict";

const googleMapsKey = "AIzaSyCNNszCTC65ganmb5MVPiQy7Ks48iy9-eI";
const googleMapsBaseUrl =
  "https://maps.googleapis.com/maps/api/geocode/json";

const hikingApiKey = "fdc58f645amshaf6bf1f34f5cb9bp1b330ajsn7739ff6a06b1";
const hikingApiBaseURL =
  "https://trailapi-trailapi.p.rapidapi.com/activity/";

const processForm = (e) => {
  e.preventDefault();
  let location = document.getElementById("city-state").value;
  getCoordinates(location);
};

const formatQueryString = (params) => {
  const queryItems = Object.keys(params).map(
    (key) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
};

const getCoordinates = (location) => {
  const params = {
    key: googleMapsKey,
    address: location,
    language: "en",
  };
  const queryString = formatQueryString(params);
  const googleMapsUrl = googleMapsBaseUrl + "?" + queryString;
  fetch(googleMapsUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((coordinatesData) => displayResults(coordinatesData))
    .catch((err) => {
      document.getElementById(
        "error-message"
      ).textContent += `Error: ${err.message}`;
    });
};

const displayResults = (latLongCoords) => {
  let latitude = latLongCoords.results[0].geometry.location.lat;
  let longitude = latLongCoords.results[0].geometry.location.lng;
  fetchTrails(latitude, longitude);
  //fetchWeather(latitude, longitude);
};

// const formatTrailQuery = (params) => {
//   const trailQueryItems = Object.keys(params).map(
//     (key) =>
//       `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
//   );
//   return trailQueryItems.join("&");
// };

const fetchTrails = (latitude, longitude) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "trailapi-trailapi.p.rapidapi.com",
      "X-RapidAPI-Key":
        "fdc58f645amshaf6bf1f34f5cb9bp1b330ajsn7739ff6a06b1",
    },
  };

  fetch(
    `https://trailapi-trailapi.p.rapidapi.com/trails/explore/?lat=${latitude}&lon=${longitude}&radius=10`,
    options
  )
    .then((response) => response.json())
    .then((trailData) => renderTrailData(trailData))
    .catch((err) => console.error(err));

  //   .catch((err) => {
  //     document.getElementById(
  //       "error-message"
  //     ).textContent += `Error: ${err.message}`;
  //   });
};

const renderTrailData = (trailData) => {
  console.log(trailData, trailData.data[0]);
  let trailArray = trailData.data;
  const trailList = document.getElementById("results-list");
  trailArray.map((trail) => {
    let card = document.createElement("li");
    let cardHeader = document.createElement("h2");
    cardHeader.class = "card-header";
    cardHeader.appendChild(document.createTextNode(`${trail.name}`));

    let trailDifficulty = document.createElement("p");
    trailDifficulty.class = "difficulty";
    let difficulty =
      trail.difficulty == "" ? "undetermined" : `${trail.difficulty}`;
    trailDifficulty.appendChild(
      document.createTextNode(`Difficulty: ${difficulty}`)
    );

    let imageContainer = document.createElement("div");
    let trailImage = document.createElement("img");
    if (trail.thumbnail == null) {
      trailImage.alt = `Unable to load picture of ${trail.name} trail.`;
    } else {
      trailImage.src = `${trail.thumbnail}`;
      trailImage.alt = `picture of ${trail.name} trail`;
    }
    imageContainer.appendChild(trailImage);
    trailList.appendChild(card);

    let trailDistance = document.createElement("div");
    trailDistance.class = "trail-distance";

    if (trail.length == "0.0") {
      trailDistance.appendChild(
        document.createTextNode(`Distance: undetermined`)
      );
    } else {
      trailDistance.appendChild(
        document.createTextNode(`Distance: ${trail.length} miles`)
      );
    }

    let moreInfo = document.createElement("a");
    moreInfo.href = `${trail.url}`;
    moreInfo.class = "info-button";
    moreInfo.appendChild(document.createTextNode(`More Info`));

    card.append(
      cardHeader,
      imageContainer,
      trailDifficulty,
      trailDistance,
      moreInfo
    );
    trailList.append(card);
  });
};

document
  .querySelector("#search-form")
  .addEventListener("submit", processForm);
