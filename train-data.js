// Shared Train Data Management
// This file will be used by both Admin and Customer sections
// In future, replace localStorage calls with API calls to database

function initializeTrains() {
  let trains = localStorage.getItem("trains");
  if (!trains) {
    // Initial mock data - only set if no data exists
    let initialTrains = [
      {
        number: "12901",
        name: "Gujarat Express",
        from: "Ahmedabad",
        to: "Mumbai",
        seats: 800,
        owner: "Indian Railways",
        departureTime: "06:45",
        arrivalTime: "14:15",
        type: "Express"
      },
      {
        number: "12951",
        name: "Rajdhani Express",
        from: "Mumbai",
        to: "Delhi",
        seats: 650,
        owner: "Indian Railways",
        departureTime: "09:20",
        arrivalTime: "18:45",
        type: "Rajdhani"
      },
      {
        number: "12009",
        name: "Shatabdi Express",
        from: "Ahmedabad",
        to: "Mumbai",
        seats: 720,
        owner: "Indian Railways",
        departureTime: "14:15",
        arrivalTime: "20:35",
        type: "Shatabdi"
      }
    ];
    localStorage.setItem("trains", JSON.stringify(initialTrains));
  }
}

// Get all trains
function getAllTrains() {
  initializeTrains();
  let trains = localStorage.getItem("trains");
  return trains ? JSON.parse(trains) : [];
}

// Get train by number
function getTrainByNumber(trainNumber) {
  let trains = getAllTrains();
  for (let i = 0; i < trains.length; i++) {
    if (trains[i].number === trainNumber) {
      return trains[i];
    }
  }
  return null;
}

// Add new train
function addTrain(trainData) {
  let trains = getAllTrains();
  
  // Check if train number already exists
  for (let i = 0; i < trains.length; i++) {
    if (trains[i].number === trainData.number) {
      return { success: false, message: "Train number already exists" };
    }
  }
  
  trains.push(trainData);
  localStorage.setItem("trains", JSON.stringify(trains));
  return { success: true, message: "Train registered successfully" };
}

// Update train
function updateTrain(trainNumber, updatedData) {
  let trains = getAllTrains();
  let found = false;
  
  for (let i = 0; i < trains.length; i++) {
    if (trains[i].number === trainNumber) {
      trains[i] = updatedData;
      found = true;
      break;
    }
  }
  
  if (found) {
    localStorage.setItem("trains", JSON.stringify(trains));
    return { success: true, message: "Train updated successfully" };
  }
  
  return { success: false, message: "Train not found" };
}

// Delete train
function deleteTrain(trainNumber) {
  let trains = getAllTrains();
  let newTrains = [];
  let found = false;
  
  for (let i = 0; i < trains.length; i++) {
    if (trains[i].number !== trainNumber) {
      newTrains.push(trains[i]);
    } else {
      found = true;
    }
  }
  
  if (found) {
    localStorage.setItem("trains", JSON.stringify(newTrains));
    
    // Cancel all bookings for this train
    cancelBookingsForTrain(trainNumber);
    
    return { success: true, message: "Train deleted successfully" };
  }
  
  return { success: false, message: "Train not found" };
}

// Cancel bookings when train is deleted
function cancelBookingsForTrain(trainNumber) {
  let bookings = localStorage.getItem("bookings");
  if (bookings) {
    bookings = JSON.parse(bookings);
    
    for (let i = 0; i < bookings.length; i++) {
      if (bookings[i].train.includes(trainNumber)) {
        bookings[i].status = "Cancelled";
      }
    }
    
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }
}

// Search trains by route (renamed to avoid conflict)
function searchTrainsByRoute(from, to) {
  let trains = getAllTrains();
  let results = [];
  
  for (let i = 0; i < trains.length; i++) {
    if (trains[i].from === from && trains[i].to === to) {
      results.push(trains[i]);
    }
  }
  
  return results;
}

// Initialize on page load
if (typeof window !== 'undefined') {
  initializeTrains();
}