async function loadUsers() {
  const res = await fetch("../data/users.json");
  const users = await res.json();
  return users;
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email");
    const contrasena = document.getElementById("contrasena");
    const errorMsg = document.getElementById("loginError");
    let valid = true;

    if (!email.value.trim() || !email.validity.valid) {
        email.classList.add("is-invalid");
        valid = false;
    } else {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
    }

    if (!contrasena.value.trim()) {
        contrasena.classList.add("is-invalid");
        valid = false;
    } else {
        contrasena.classList.remove("is-invalid");
        contrasena.classList.add("is-valid");
    }

    if (!valid) return;

    const users = await loadUsers();
    const user = users.find(
        (u) => u.email === email.value.trim() && u.contrasena === contrasena.value
    );

    if (user) {
        window.location.href = "mis-reservas.html";
    } else {
        errorMsg.classList.remove("d-none");
    }
});
