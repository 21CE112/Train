function logout() {
  window.location.href = "../../AUTH/pages/login.html";
}

let allBookings = [];
let cancelIndex = -1;

window.onload = function() {
  loadBookings();
};

function loadBookings() {
  let bookings = localStorage.getItem("bookings");
  if (bookings) {
    allBookings = JSON.parse(bookings);
  } else {
    allBookings = [];
  }
  displayBookings(allBookings);
}

function displayBookings(bookings) {
  let list = document.getElementById("bookingsList");
  let count = document.getElementById("resultCount");
  
  if (bookings.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <p>📭 No bookings found</p>
        <button class="primary-btn" onclick="window.location.href='train-search.html'">Book Your First Ticket</button>
      </div>
    `;
    count.textContent = "0 bookings found";
    return;
  }
  
  count.textContent = bookings.length + " booking" + (bookings.length > 1 ? "s" : "") + " found";
  
  let html = "";
  for (let i = 0; i < bookings.length; i++) {
    let b = bookings[i];
    let statusClass = b.status.toLowerCase();
    
    html += `
      <div class="booking-card">
        <div class="booking-header">
          <div>
            <div class="booking-title">${b.train}</div>
            <div class="booking-route">${b.from} → ${b.to}</div>
          </div>
          <span class="status-badge ${statusClass}">${b.status.toUpperCase()}</span>
        </div>
        
        <div class="booking-details">
          <div class="detail-item">
            <span class="detail-label">PNR Number</span>
            <span class="detail-value">${b.pnr}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Travel Date</span>
            <span class="detail-value">${b.date}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Class</span>
            <span class="detail-value">${b.class}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Passenger</span>
            <span class="detail-value">${b.passenger}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Seat Number</span>
            <span class="detail-value">${b.seat}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tickets</span>
            <span class="detail-value">${b.ticketCount || 1}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Booking Date</span>
            <span class="detail-value">${b.bookingDate}</span>
          </div>
        </div>
        
        <div class="booking-actions">
          <button class="view-btn" onclick="viewTicket(${i})">View Details</button>
          ${b.status === 'Confirmed' ? `<button class="cancel-btn" onclick="showCancelModal(${i})">Cancel Ticket</button>` : ''}
        </div>
      </div>
    `;
  }
  
  list.innerHTML = html;
}

function applyFilters() {
  let pnr = document.getElementById("searchPNR").value.trim().toLowerCase();
  let train = document.getElementById("searchTrain").value.trim().toLowerCase();
  let date = document.getElementById("filterDate").value;
  let status = document.getElementById("filterStatus").value;
  
  let filtered = allBookings;
  
  if (pnr) {
    filtered = filtered.filter(function(b) {
      return b.pnr.toLowerCase().includes(pnr);
    });
  }
  
  if (train) {
    filtered = filtered.filter(function(b) {
      return b.train.toLowerCase().includes(train);
    });
  }
  
  if (date) {
    filtered = filtered.filter(function(b) {
      return b.bookingDate === new Date(date).toLocaleDateString();
    });
  }
  
  if (status) {
    filtered = filtered.filter(function(b) {
      return b.status === status;
    });
  }
  
  displayBookings(filtered);
}

function resetFilters() {
  document.getElementById("searchPNR").value = "";
  document.getElementById("searchTrain").value = "";
  document.getElementById("filterDate").value = "";
  document.getElementById("filterStatus").value = "";
  displayBookings(allBookings);
}

function viewTicket(index) {
  let booking = allBookings[index];
  localStorage.setItem("currentBooking", JSON.stringify(booking));
  window.location.href = "confirm.html";
}

function showCancelModal(index) {
  cancelIndex = index;
  document.getElementById("cancelModal").classList.add("show");
  document.getElementById("cancelPassword").value = "";
}

function closeCancelModal() {
  document.getElementById("cancelModal").classList.remove("show");
  cancelIndex = -1;
}

function cancelTicket() {
  if (cancelIndex === -1) {
    return;
  }

  let password = document.getElementById("cancelPassword").value.trim();
  
  if (!password) {
    alert("Please enter your password to confirm cancellation");
    return;
  }

  let loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("Please login to cancel ticket");
    return;
  }

  let customers = localStorage.getItem("customers");
  if (customers) {
    customers = JSON.parse(customers);
    
    let passwordMatch = false;
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].username === loggedInUser) {
        if (customers[i].password === password) {
          passwordMatch = true;
        }
        break;
      }
    }
    
    if (!passwordMatch) {
      alert("Incorrect password. Please try again.");
      return;
    }
  }

  let booking = allBookings[cancelIndex];
  let travelDate = new Date(booking.date);
  let today = new Date();
  let hoursDiff = (travelDate - today) / (1000 * 60 * 60);

  if (hoursDiff < 24) {
    alert("Cannot cancel ticket. Cancellation is only allowed 24 hours before departure.");
    return;
  }

  allBookings[cancelIndex].status = "Cancelled";
  localStorage.setItem("bookings", JSON.stringify(allBookings));
  displayBookings(allBookings);
  closeCancelModal();
  alert("Ticket cancelled successfully. Refund will be processed within 7 working days.");
}