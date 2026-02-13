// Hardcoded Admin Credentials
let adminUsername = "Admin";
let adminPassword = "Admin@123";

function login() {
  let u = username.value.trim();
  let p = password.value.trim();

  if (!u || !p) {
    alert("All fields required");
    return;
  }

  // Check Admin Login
  if (u === adminUsername && p === adminPassword) {
    localStorage.setItem("loggedInUser", "Admin");
    localStorage.setItem("userRole", "admin");
    window.location.href = "../../ADMIN/pages/home.html";
    return;
  }

  // Check Customer Login from localStorage
  let customers = localStorage.getItem("customers");
  if (customers) {
    customers = JSON.parse(customers);
    for (let i = 0; i < customers.length; i++) {
      if (customers[i].username === u && customers[i].password === p) {
        localStorage.setItem("loggedInUser", customers[i].username);
        localStorage.setItem("userRole", "customer");
        window.location.href = "../../CUSTOMER/pages/home.html";
        return;
      }
    }
  }

  // If no match found
  alert("Invalid username or password");
}

function register() {
  let u = username.value.trim();
  let e = email.value.trim();
  let m = mobile.value.trim();
  let a = aadhar.value.trim();
  let p = password.value.trim();
  let c = confirmPassword.value.trim();

  // Check if all fields are filled
  if (!u || !e || !m || !a || !p || !c) {
    alert("All fields are required");
    return;
  }

  // Check if username is Admin (reserved)
  if (u === adminUsername) {
    alert("This username is already taken. Choose another username");
    return;
  }

  // Mobile number validation (exactly 10 digits)
  if (m.length !== 10 || !/^\d{10}$/.test(m)) {
    alert("Mobile number must be exactly 10 digits");
    return;
  }

  // Aadhar validation (exactly 12 digits)
  if (a.length !== 12 || !/^\d{12}$/.test(a)) {
    alert("Aadhar number must be exactly 12 digits");
    return;
  }

  // Password match validation
  if (p !== c) {
    alert("Passwords do not match");
    return;
  }

  // Password strength validation
  if (
    p.length < 8 ||
    !/[A-Z]/.test(p) ||
    !/[a-z]/.test(p) ||
    !/[0-9]/.test(p) ||
    !/[!@#$%^&*]/.test(p)
  ) {
    alert("Password must be at least 8 characters with uppercase, lowercase, number and special character");
    return;
  }

  // Check if username already exists in localStorage
  let customers = localStorage.getItem("customers");
  if (customers) {
    customers = JSON.parse(customers);
  } else {
    customers = [];
  }

  for (let i = 0; i < customers.length; i++) {
    if (customers[i].username === u) {
      alert("Username already exists. Choose another username");
      return;
    }
  }

  // Save new customer to localStorage
  let newCustomer = {
    username: u,
    password: p,
    email: e,
    mobile: m,
    aadhar: a
  };

  customers.push(newCustomer);
  localStorage.setItem("customers", JSON.stringify(customers));

  alert("Registered successfully");
  window.location.href = "login.html";
}