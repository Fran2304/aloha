let allProperties = [];

function renderProperties(properties) {
  if (!properties || properties.length === 0) {
    document.getElementById("properties-grid").innerHTML = "<p>No se encontraron propiedades.</p>";
    return;
  }
  const grid = document.getElementById("properties-grid");

  grid.innerHTML = properties.map((p) => `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="card h-100">
        <img src="${p.image}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h3 class="card-title h6">${p.title}</h3>
            <span><i class="bi bi-star-fill"></i> ${p.rating}</span>
          </div>
          <p class="card-text"><i class="bi bi-geo-alt"></i> ${p.city}, ${p.region}</p>
          <p class="card-text">
            <i class="bi bi-people"></i> ${p.guests} huéspedes &nbsp;
            <i class="bi bi-door-open"></i> ${p.rooms} hab.
          </p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span><strong>S/ ${p.price}</strong> / noche</span>
        <a href="pages/detail.html?id=${p.id}" class="btn btn-sm btn-outline-primary">Ver más</a>
        </div>
      </article>
    </div>
  `).join("");
}

async function displayProperties() {
  await initStorage();
  allProperties = getProperties();
  renderProperties(allProperties);
}

document.querySelector(".search-bar form").addEventListener("submit", (e) => {
    e.preventDefault();
    const ubicacion = document.getElementById("ubicacion").value.trim().toLowerCase();
    const precioMax = parseFloat(document.getElementById("precioMax").value);
    const tipo      = document.getElementById("tipoAlojam").value;
    const huespedes = parseInt(document.getElementById("huespedes").value) || 0;

    const filtered = allProperties.filter((p) => {
      const matchLocation = !ubicacion || p.city.toLowerCase().includes(ubicacion) || p.region.toLowerCase().includes(ubicacion);
      const matchPrice    = !precioMax || p.price <= precioMax;
      const matchType     = !tipo || tipo === 'todos' || p.type === tipo;
      const matchGuests   = !huespedes || p.guests >= huespedes;

      return matchLocation && matchPrice && matchType && matchGuests;
    });

   renderProperties(filtered);
});

displayProperties();
