document.getElementById('registroForm').addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.getElementById('email');
    const contrasena = document.getElementById('contrasena');
    const nombre = document.getElementById('nombre');
    const dni = document.getElementById('dni');
    const telefono = document.getElementById('telefono');
    let valid = true;

    if (!email.value.trim() || !email.validity.valid) {
        email.classList.add('is-invalid');
        valid = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (!contrasena.value.trim()) {
        contrasena.classList.add('is-invalid');
        valid = false;
    } else {
        contrasena.classList.remove('is-invalid');
        contrasena.classList.add('is-valid');
    }

    if (!nombre.value.trim()) {
        nombre.classList.add('is-invalid');
        valid = false;
    } else {
        nombre.classList.remove('is-invalid');
        nombre.classList.add('is-valid');
    }

    if (!dni.value.trim()) {
        dni.classList.add('is-invalid');
        valid = false;
    } else {
        dni.classList.remove('is-invalid');
        dni.classList.add('is-valid');
    }

    if (!telefono.value.trim()) {
        telefono.classList.add('is-invalid');
        valid = false;
    } else {
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
    }

    if (!valid) return;

    await initStorage();

    const existente = getUsers().find(u => u.email === email.value.trim());

    if (existente) {
        const msg = document.getElementById('successMessage');
        msg.textContent = 'Este correo ya está registrado.';
        msg.className = 'alert alert-danger text-center mt-3';
        return;
    }

    const newUser = {
        id: Date.now(),
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        contrasena: contrasena.value,
        dni: dni.value.trim(),
        telefono: telefono.value.trim(),
        propiedades: []
    };

    addUser(newUser);
    setSession({ id: newUser.id, nombre: newUser.nombre, email: newUser.email, telefono: newUser.telefono });
    window.location.href = 'mis-reservas.html';
});
