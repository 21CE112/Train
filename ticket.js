let tickets = [];

function bookTicket() {
  tickets.push({
    id: "T" + (tickets.length + 1),
    train: train.value,
    user: userId.value,
    name: name.value,
    from: from.value,
    to: to.value,
    count: count.value,
    status: "Confirmed"
  });

  localStorage.setItem("tickets", JSON.stringify(tickets));
  window.location.href = "confirm.html";
}

function cancelTicket(index) {
  if (confirm("Are you sure you want to cancel this ticket?")) {
    tickets[index].status = "Cancelled";
    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
  }
}

function renderTickets() {
  tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  let html = "";
  tickets.forEach((t, i) => {
    html += `
      <div class="ticket ${t.status}">
        <b>${t.from} → ${t.to}</b><br>
        Train: ${t.train}<br>
        Tickets: ${t.count}<br>
        Status: ${t.status}<br>
        ${t.status === "Confirmed" ? `<button onclick="cancelTicket(${i})">Cancel</button>` : ""}
      </div>`;
  });
  document.getElementById("tickets").innerHTML = html;
}
