//An IIFE (Immediately Invoked Function Expression) — a function that runs itself the moment the script loads.
// It's async so we can use await inside it
(async () => {
  await initStorage();

  const session = getSession();
  if (!session) {
    window.location.href = 'inicio-sesion.html';
    return;
  }

  document.getElementById('perfil-nombre').textContent = session.nombre;
  document.getElementById('perfil-email').textContent = session.email;
  document.getElementById('perfil-telefono').textContent = session.telefono || '—';

  document.getElementById('btn-logout').addEventListener('click', () => {
    clearSession();
    window.location.href = '../index.html';
  });

  const modalPropEl    = document.getElementById('modalPropiedad');
  const modalReservaEl = document.getElementById('modalReserva');
  const modalProp    = new bootstrap.Modal(modalPropEl);
  const modalReserva = new bootstrap.Modal(modalReservaEl);

  modalPropEl.addEventListener('hidden.bs.modal', () => {
    const f = document.getElementById('formPropiedad');
    f.reset();
    f.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  });

  modalReservaEl.addEventListener('hidden.bs.modal', () => {
    const f = document.getElementById('formReserva');
    f.reset();
    f.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  });

  function validate(campos) {
    let valid = true;
    campos.forEach(({ el, check }) => {
      if (!check(el.value)) { el.classList.add('is-invalid'); valid = false; }
      else el.classList.remove('is-invalid');
    });
    return valid;
  }

  function renderPropiedades() {
    const misProps = getProperties().filter(p => p.propietario_id === session.id);
    const grid = document.getElementById('mis-propiedades-grid');

    if (misProps.length === 0) {
      grid.innerHTML = '<p class="text-muted">No tienes propiedades aún. Agrega una usando el botón de arriba.</p>';
    } else {
      grid.innerHTML = misProps.map(p => `
          <div class="col-12 col-md-6">
            <article class="card">
              <div class="d-flex gap-3 p-3">
                <img src="../${p.image}" alt="${p.title}" style="width:160px;height:120px;object-fit:cover;">
                <div class="flex-grow-1">
                  <p><strong>${p.title}</strong></p>
                  <p><i class="bi bi-geo-alt"></i> ${p.city}, ${p.region}</p>
                  <p><strong>S/ ${p.price}</strong> / noche &nbsp; <span class="badge bg-secondary">${p.type}</span></p>
                  <div class="d-flex gap-2 mt-2">
                    <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-prop" data-id="${p.id}">
                      <i class="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>`).join('');

      grid.querySelectorAll('.btn-eliminar-prop').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const props = getProperties().filter(p => p.id !== id);
          localStorage.setItem('aloha_properties', JSON.stringify(props));
          renderPropiedades();
          renderReservas();
        });
      });
    }

    const select = document.getElementById('reserva-propiedadId');
    select.innerHTML = misProps.length === 0
      ? '<option value="">— Sin propiedades —</option>'
      : misProps.map(p => `<option value="${p.id}">${p.title} (${p.city})</option>`).join('');

    const btnAgregarReserva = document.getElementById('btn-agregar-reserva');
    if (misProps.length === 0) {
      btnAgregarReserva.disabled = true;
      btnAgregarReserva.title = 'Primero agrega una propiedad';
    } else {
      btnAgregarReserva.disabled = false;
      btnAgregarReserva.title = '';
    }
  }

  function renderReservas() {
    const misReservas = getReservas().filter(r => r.userId === session.id);
    const grid = document.getElementById('mis-reservas-grid');

    if (misReservas.length === 0) {
      grid.innerHTML = '<p class="text-muted">No tienes reservas aún.</p>';
      return;
    }

    const allProps = getProperties();
    grid.innerHTML = misReservas.map(r => {
      const prop = allProps.find(p => p.id === r.propiedadId);
      const propNombre = prop ? prop.title : 'Propiedad desconocida';
      return `
        <div class="col-12 col-md-6">
          <article class="card p-3">
            <dl class="mb-2">
              <div><dt>Propiedad:</dt><dd>${propNombre}</dd></div>
              <div><dt>Fecha llegada:</dt><dd>${r.fechaEntrada}</dd></div>
              <div><dt>Fecha salida:</dt><dd>${r.fechaSalida}</dd></div>
              <div><dt>Huéspedes:</dt><dd>${r.personas}</dd></div>
              <div><dt>A nombre de:</dt><dd>${r.cliente}</dd></div>
              ${r.observaciones ? `<div><dt>Observaciones:</dt><dd>${r.observaciones}</dd></div>` : ''}
            </dl>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar-reserva" data-id="${r.id}">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </article>
        </div>`;
    }).join('');

    grid.querySelectorAll('.btn-eliminar-reserva').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const reservas = getReservas().filter(r => r.id !== id);
        localStorage.setItem('aloha_reservas', JSON.stringify(reservas));
        renderReservas();
      });
    });
  }

  renderPropiedades();
  renderReservas();

  document.getElementById('formPropiedad').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    if (!validate([
      { el: f.querySelector('#prop-title'),       check: v => v.trim() !== '' },
      { el: f.querySelector('#prop-city'),        check: v => v.trim() !== '' },
      { el: f.querySelector('#prop-region'),      check: v => v.trim() !== '' },
      { el: f.querySelector('#prop-price'),       check: v => v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) > 0 },
      { el: f.querySelector('#prop-guests'),      check: v => v !== '' && !isNaN(parseInt(v)) && parseInt(v) > 0 },
      { el: f.querySelector('#prop-rooms'),       check: v => v !== '' && !isNaN(parseInt(v)) && parseInt(v) > 0 },
      { el: f.querySelector('#prop-description'), check: v => v.trim() !== '' },
    ])) return;

    addProperty({
      id:          Date.now(),
      title:       f.querySelector('#prop-title').value.trim(),
      city:        f.querySelector('#prop-city').value.trim(),
      region:      f.querySelector('#prop-region').value.trim(),
      type:        f.querySelector('#prop-type').value,
      price:       parseFloat(f.querySelector('#prop-price').value),
      guests:      parseInt(f.querySelector('#prop-guests').value),
      rooms:       parseInt(f.querySelector('#prop-rooms').value),
      beds:        parseInt(f.querySelector('#prop-rooms').value),
      bathrooms:   1,
      description: f.querySelector('#prop-description').value.trim(),
      image:       'images/property-1.png',
      host:        session.nombre,
      propietario_id: session.id,
      rating:      0,
      reviews:     0,
      amenities:   []
    });
    modalProp.hide();
    renderPropiedades();
  });

  document.getElementById('formReserva').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const fechaEntrada = f.querySelector('#reserva-fechaEntrada');
    const fechaSalida  = f.querySelector('#reserva-fechaSalida');
    if (!validate([
      { el: f.querySelector('#reserva-propiedadId'), check: v => v !== '' },
      { el: fechaEntrada,                            check: v => v !== '' },
      { el: fechaSalida,                             check: v => v !== '' },
      { el: f.querySelector('#reserva-personas'),    check: v => v !== '' && !isNaN(parseInt(v)) && parseInt(v) > 0 },
    ])) return;

    addReserva({
      id:           Date.now(),
      propiedadId:  parseInt(f.querySelector('#reserva-propiedadId').value),
      cliente:      session.nombre,
      userId:       session.id,
      fechaEntrada: fechaEntrada.value,
      fechaSalida:  fechaSalida.value,
      personas:     parseInt(f.querySelector('#reserva-personas').value),
      observaciones: f.querySelector('#reserva-observaciones').value.trim()
    });
    modalReserva.hide();
    renderReservas();
  });
})();
