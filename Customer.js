function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "view") renderTickets();
}

function logout() {
  window.location.href = "../../AUTH/pages/login.html";
}

window.onload = function () {
  const uid = document.getElementById("userId");
  if (uid) {
    uid.value = "U101";
  }
};

function searchTrains() {
  let from = document.getElementById("fromStation").value;
  let to = document.getElementById("toStation").value;
  
  if (!from || !to) {
    alert("Please select from and to stations");
    return;
  }
  
  if (from === to) {
    alert("From and To station cannot be same");
    return;
  }
  
  // Get trains from shared function in train-data.js
  let trains = searchTrainsByRoute(from, to);
  
  if (trains.length === 0) {
    alert("No trains found for this route");
    return;
  }
  
  displayTrains(trains);
  document.getElementById("resultsSection").style.display = "block";
}

function displayTrains(trains) {
  let resultsSection = document.getElementById("resultsSection");
  let resultsContainer = resultsSection.querySelector(".results-section") || resultsSection;
  
  // Clear existing results except header
  let existingCards = resultsContainer.querySelectorAll(".train-card");
  existingCards.forEach(card => card.remove());
  
  // Add train cards
  trains.forEach(train => {
    let card = createTrainCard(train);
    resultsContainer.appendChild(card);
  });
}

function createTrainCard(train) {
  let card = document.createElement("div");
  card.className = "train-card";
  
  // Calculate seat availability status
  let slCount = train.seats > 0 ? Math.floor(train.seats * 0.4) : 0;
  let ac3Count = train.seats > 0 ? Math.floor(train.seats * 0.3) : 0;
  let ac2Count = train.seats > 0 ? Math.floor(train.seats * 0.2) : 0;
  let ac1Count = train.seats > 0 ? Math.floor(train.seats * 0.1) : 0;
  
  card.innerHTML = `
    <div class="train-top">
      <div class="train-info">
        <h3>${train.number} – ${train.name}</h3>
        <span>${train.from} → ${train.to}</span>
      </div>
      <div class="train-time">
        <span class="time">${train.departureTime}</span>
        <span class="duration">${train.type}</span>
      </div>
    </div>

    <div class="seat-grid">
      <div class="seat ${slCount > 10 ? 'available' : 'limited'}">
        <span class="seat-label">Sleeper</span>
        <span class="seat-count">${slCount > 0 ? slCount : 'WL'}</span>
      </div>
      <div class="seat ${ac3Count > 10 ? 'available' : 'limited'}">
        <span class="seat-label">3AC</span>
        <span class="seat-count">${ac3Count > 0 ? ac3Count : 'WL'}</span>
      </div>
      <div class="seat ${ac2Count > 10 ? 'available' : 'limited'}">
        <span class="seat-label">2AC</span>
        <span class="seat-count">${ac2Count > 0 ? ac2Count : 'WL'}</span>
      </div>
      <div class="seat ${ac1Count > 5 ? 'available' : 'limited'}">
        <span class="seat-label">1AC</span>
        <span class="seat-count">${ac1Count > 0 ? ac1Count : 'WL'}</span>
      </div>
    </div>

    <button class="primary-btn" onclick="goToBooking('${train.number}', '${train.name}', '${train.departureTime}', '3AC')">Book Now</button>
  `;
  
  return card;
}

function goToBooking(trainNumber, trainName, trainTime, trainClass) {
  let from = document.getElementById("fromStation").value || "Ahmedabad";
  let to = document.getElementById("toStation").value || "Mumbai";
  
  let trainInfo = {
    number: trainNumber,
    name: trainName,
    from: from,
    to: to,
    class: trainClass || "3AC",
    time: trainTime
  };
  
  localStorage.setItem("selectedTrain", JSON.stringify(trainInfo));
  window.location.href = "booking.html";
}