function showDeactivateModal() {
  document.getElementById("deactivateModal").classList.add("show");
  document.getElementById("deactivatePassword").value = "";
}

function closeDeactivateModal() {
  document.getElementById("deactivateModal").classList.remove("show");
  document.getElementById("deactivatePassword").value = "";
}

function deactivateAccount() {
  let password = document.getElementById("deactivatePassword").value.trim();
  
  if (!password) {
    alert("Please enter your password to confirm");
    return;
  }

  let loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("No user logged in");
    return;
  }

  let customers = localStorage.getItem("customers");
  if (customers) {
    customers = JSON.parse(customers);
    
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].username === loggedInUser) {
        if (customers[i].password !== password) {
          alert("Incorrect password. Please try again.");
          return;
        }
        
        customers[i].status = "inactive";
        localStorage.setItem("customers", JSON.stringify(customers));
        
        alert("Your account has been deactivated successfully.\nYou will be logged out now.");
        
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("userRole");
        
        window.location.href = "../../AUTH/pages/login.html";
        return;
      }
    }
  }
  
  alert("Account deactivation failed. Please try again.");
}