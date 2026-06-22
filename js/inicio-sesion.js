function findUser(user, email, contrasena) {
     return user.email === email.value.trim() && user.contrasena === contrasena.value;
}

document.getElementById("loginForm").addEventListener("submit", async e => {
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

    // Preload users from storage
    await initStorage();

    const users = getUsers();
    const user = users.find(u => findUser(u, email, contrasena));

    if (user) {
        setSession({ id: user.id, nombre: user.nombre, email: user.email, telefono: user.telefono });
        window.location.href = "mis-reservas.html";
    } else {
        errorMsg.classList.remove("d-none");
    }
});
