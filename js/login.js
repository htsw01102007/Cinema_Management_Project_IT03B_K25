// Toast

let toastContainer = document.getElementById("toast-container");

function showToast(type, icon, title, msg, color) {
  let toast = document.createElement("div");
  toast.classList.add("toast", type);

  let i = document.createElement("i");
  i.classList.add("fa-regular", icon);
  i.style.color = color;

  let div = document.createElement("div");

  let h4 = document.createElement("h4");
  h4.innerHTML = title;

  let p = document.createElement("p");
  p.innerHTML = msg;

  div.appendChild(h4);
  div.appendChild(p);
  toast.appendChild(i);
  toast.appendChild(div);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

let registered = JSON.parse(localStorage.getItem("registered"));
if (registered) {
  showToast(
    "success",
    "fa-circle-check",
    "Thành công",
    "Đã đăng ký thành công!",
    "#11d411",
  );
  localStorage.setItem("registered", false)
}

//  DOM

let loginEmail = document.getElementById("login-email");
let loginPassword = document.getElementById("login-password");
let loginHidePassword = document.getElementById("eye-password");
let loginError = document.getElementById("login-error");

//

function resetErrorLogin() {
  loginError.textContent = "";
}

function validateEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
}

// Login

function hidePassword() {
  if (loginHidePassword.classList.contains("fa-eye")) {
    loginHidePassword.classList.remove("fa-eye");
    loginHidePassword.classList.add("fa-eye-slash");
    loginPassword.type = "password";
  } else if (loginHidePassword.classList.contains("fa-eye-slash")) {
    loginHidePassword.classList.remove("fa-eye-slash");
    loginHidePassword.classList.add("fa-eye");
    loginPassword.type = "type";
  }
}

function login() {
  resetErrorLogin();

  if (
    loginEmail.value.trim() === "" ||
    !validateEmail(loginEmail.value) ||
    loginPassword.value.trim() === "" ||
    !validatePassword(loginPassword.value)
  ) {
    loginError.textContent = "*Email hoặc mật khẩu không hợp lệ.";
    return;
  }

  window.location.replace("../pages/film-management.html");
}
