document.getElementById('registroForm').addEventListener('submit', function(event) {
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

    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = '¡Ya eres parte de ALOHAPE!';
    successMessage.classList.remove('d-none');
});
