function logout() {
  window.location.href = "../../AUTH/pages/login.html";
}

let selectedDate = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let baseFare = 850;

window.onload = function() {
  let trainInfo = localStorage.getItem("selectedTrain");
  if (trainInfo) {
    trainInfo = JSON.parse(trainInfo);
    document.getElementById("trainName").textContent = trainInfo.number + " - " + trainInfo.name;
    document.getElementById("fromStation").textContent = trainInfo.from;
    document.getElementById("toStation").textContent = trainInfo.to;
    document.getElementById("trainClass").textContent = trainInfo.class;
    document.getElementById("trainTime").textContent = trainInfo.time;
  }
  renderCalendar();
};

function toggleCalendar() {
  let cal = document.getElementById("customCalendar");
  cal.style.display = cal.style.display === "none" ? "block" : "none";
}

function renderCalendar() {
  let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  document.getElementById("currentMonth").textContent = monthNames[currentMonth] + " " + currentYear;
  
  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  maxDate.setHours(0, 0, 0, 0);
  
  let calendarDays = document.getElementById("calendarDays");
  calendarDays.innerHTML = "";
  
  for (let i = 0; i < firstDay; i++) {
    let emptyDiv = document.createElement("div");
    emptyDiv.className = "calendar-day empty";
    calendarDays.appendChild(emptyDiv);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    let dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day;
    
    let checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate < today || checkDate > maxDate) {
      dayDiv.classList.add("disabled");
    } else {
      if (selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
        dayDiv.classList.add("selected");
      }
      dayDiv.onclick = function() { selectDate(day); };
    }
    calendarDays.appendChild(dayDiv);
  }
}

function selectDate(day) {
  selectedDate = new Date(currentYear, currentMonth, day);
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let dateStr = day + " " + monthNames[currentMonth] + " " + currentYear;
  document.getElementById("travelDateDisplay").value = dateStr;
  document.getElementById("selectedDateText").textContent = dateStr;
  renderCalendar();
  document.getElementById("customCalendar").style.display = "none";
}

function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  else if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  
  let today = new Date();
  let maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  let checkMonth = new Date(currentYear, currentMonth, 1);
  
  if (checkMonth < new Date(today.getFullYear(), today.getMonth(), 1)) {
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();
  }
  if (checkMonth > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) {
    currentMonth = maxDate.getMonth();
    currentYear = maxDate.getFullYear();
  }
  renderCalendar();
}

function updatePassengerCount() {
  let count = parseInt(document.getElementById("ticketCount").value);
  
  if (!count) {
    document.getElementById("passengerForms").innerHTML = "";
    document.getElementById("ticketCountDisplay").textContent = "0";
    document.getElementById("subtotalFare").textContent = "₹0";
    document.getElementById("gst").textContent = "₹0";
    document.getElementById("totalFare").textContent = "₹0";
    return;
  }
  
  // Update fare
  let subtotal = baseFare * count;
  let gstAmount = subtotal * 0.05;
  let total = subtotal + gstAmount;
  
  document.getElementById("ticketCountDisplay").textContent = count;
  document.getElementById("subtotalFare").textContent = "₹" + subtotal;
  document.getElementById("gst").textContent = "₹" + gstAmount.toFixed(2);
  document.getElementById("totalFare").textContent = "₹" + total.toFixed(2);
  
  // Generate passenger forms
  let formsHTML = "";
  for (let i = 1; i <= count; i++) {
    formsHTML += `
      <div class="booking-card">
        <h3>Passenger ${i} Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Full Name *</label>
            <input type="text" id="passenger${i}Name" placeholder="Enter full name" required>
          </div>
          <div class="form-group">
            <label>Age *</label>
            <input type="number" id="passenger${i}Age" placeholder="Age" min="1" max="120" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Gender *</label>
            <select id="passenger${i}Gender" required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Berth Preference</label>
            <select id="passenger${i}Berth">
              <option value="">No Preference</option>
              <option>Lower</option>
              <option>Middle</option>
              <option>Upper</option>
              <option>Side Lower</option>
              <option>Side Upper</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById("passengerForms").innerHTML = formsHTML;
}

function confirmBooking() {
  let ticketCount = parseInt(document.getElementById("ticketCount").value);
  let mobile = document.getElementById("contactMobile").value.trim();
  let payment = document.getElementById("paymentMethod").value;
  let paymentDetails = document.getElementById("paymentDetails").value.trim();

  let errorMsg = document.getElementById("errorMessage");
  errorMsg.classList.remove("show");

  if (!selectedDate) {
    errorMsg.textContent = "Please select travel date";
    errorMsg.classList.add("show");
    return;
  }

  if (!ticketCount) {
    errorMsg.textContent = "Please select number of tickets";
    errorMsg.classList.add("show");
    return;
  }

  // Validate all passengers
  let passengers = [];
  for (let i = 1; i <= ticketCount; i++) {
    let name = document.getElementById("passenger" + i + "Name").value.trim();
    let age = document.getElementById("passenger" + i + "Age").value.trim();
    let gender = document.getElementById("passenger" + i + "Gender").value;
    let berth = document.getElementById("passenger" + i + "Berth").value || "No Preference";
    
    if (!name || !age || !gender) {
      errorMsg.textContent = "Please fill all passenger " + i + " details";
      errorMsg.classList.add("show");
      return;
    }
    
    if (age < 1 || age > 120) {
      errorMsg.textContent = "Invalid age for passenger " + i;
      errorMsg.classList.add("show");
      return;
    }
    
    passengers.push({name: name, age: age, gender: gender, berth: berth, seat: Math.floor(1 + Math.random() * 72)});
  }

  if (!mobile || !payment || !paymentDetails) {
    errorMsg.textContent = "Please fill contact and payment details";
    errorMsg.classList.add("show");
    return;
  }

  if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
    errorMsg.textContent = "Mobile number must be exactly 10 digits";
    errorMsg.classList.add("show");
    return;
  }

  let trainInfo = localStorage.getItem("selectedTrain");
  if (trainInfo) {
    trainInfo = JSON.parse(trainInfo);
  } else {
    trainInfo = {number: "12901", name: "Gujarat Express", from: "Ahmedabad", to: "Mumbai", class: "3AC", time: "06:45 AM"};
  }

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let dateStr = selectedDate.getDate() + " " + monthNames[selectedDate.getMonth()] + " " + selectedDate.getFullYear();
  let pnr = "PNR" + Math.floor(1000000000 + Math.random() * 9000000000);

  let booking = {
    pnr: pnr,
    train: trainInfo.number + " - " + trainInfo.name,
    from: trainInfo.from,
    to: trainInfo.to,
    date: dateStr,
    class: trainInfo.class,
    time: trainInfo.time,
    passengers: passengers,
    mobile: mobile,
    ticketCount: ticketCount,
    status: "Confirmed",
    bookingDate: new Date().toLocaleDateString()
  };

  let bookings = localStorage.getItem("bookings");
  bookings = bookings ? JSON.parse(bookings) : [];
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  localStorage.setItem("currentBooking", JSON.stringify(booking));
  
  window.location.href = "confirm.html";
}