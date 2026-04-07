// DOM

let registerName = document.getElementById("register-name");
let registerNameError = document.getElementById("register-name-error");
let registerEmail = document.getElementById("register-email");
let registerEmailError = document.getElementById("register-email-error");
let registerPassword = document.getElementById("register-password");
let registerHidePassword = document.getElementById("eye-password");
let registerPasswordError = document.getElementById("register-password-error");
let registerConfirmPassword = document.getElementById("register-confirm-password");
let registerHideConfirmPassword = document.getElementById("eye-confirm-password");
let registerConfirmPasswordError = document.getElementById("register-confirm-password-error");
let eula = document.getElementById("eula");
let eulaError = document.getElementById("eula-error");

//

function resetErrorRegister() {
    registerNameError.textContent = "";
    registerEmailError.textContent = "";
    registerPasswordError.textContent = "";
    registerConfirmPasswordError.textContent = "";
    eulaError.textContent = "";
}

function resetRegister() {
    registerName.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    registerConfirmPassword.value = "";
    eula.checked = false;
}

function validateEmail(email) {
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
}

// Register

function hidePassword() {
    // console.log(registerHidePassword.className);
    
    if (registerHidePassword.classList.contains("fa-eye-slash")) {
        registerHidePassword.classList.remove("fa-eye-slash");
        registerHidePassword.classList.add("fa-eye");
        registerPassword.type = "type"
    } else if (registerHidePassword.classList.contains("fa-eye")) {
        registerHidePassword.classList.remove("fa-eye");
        registerHidePassword.classList.add("fa-eye-slash");
        registerPassword.type = "password"
    }
}

function hideConfirmPassword() {
    if (registerHideConfirmPassword.classList.contains("fa-eye-slash")) {
        registerHideConfirmPassword.classList.remove("fa-eye-slash");
        registerHideConfirmPassword.classList.add("fa-eye");
        registerConfirmPassword.type = "type"
    } else if (registerHideConfirmPassword.classList.contains("fa-eye")) {
        registerHideConfirmPassword.classList.remove("fa-eye");
        registerHideConfirmPassword.classList.add("fa-eye-slash");
        registerConfirmPassword.type = "password"
    }
}

function register() {
    resetErrorRegister();

    if (registerName.value.trim() === "") {
        registerNameError.textContent = "*Họ và tên không được để trống."
        return;
    } else if (registerEmail.value.trim() === "") {
        registerEmailError.textContent = "*Email không được để trống."
        return;
    } else if (!validateEmail(registerEmail.value)) {
        registerEmailError.textContent = "*Email không đúng định dạng."
        return;
    } else if (registerPassword.value.trim() === "") {
        registerPasswordError.textContent = "*Mật khẩu không được để trống.";
        return;
    } else if (!validatePassword(registerPassword.value)) {
        registerPasswordError.textContent = "*Mật khẩu tối thiểu 8 ký tự và có ít nhất một ký tự đặc biệt.";
        return;
    } else if (registerConfirmPassword.value.trim() === "") {
        registerConfirmPasswordError.textContent = "*Mật khẩu xác nhận không được để trống.";
        return;
    } else if (registerConfirmPassword.value !== registerPassword.value) {
        registerConfirmPasswordError.textContent = "*Mật khẩu không trùng khớp.";
        return;
    } else if (!eula.checked) {
        eulaError.textContent = "*Vui lòng đồng ý điều khoản sử dụng và chính sách bảo mật của CineEdu.";
        return;
    }

    localStorage.setItem("registered", JSON.stringify("true"))
    window.location.replace("../pages/login.html")
}



