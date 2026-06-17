async function loadProperties() {
  const res = await fetch("data/properties.json");
  const properties = await res.json();
  return properties;
}

async function displayProperties() {
  const properties = await loadProperties();

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
          <a href="pages/detail.html" class="btn btn-sm btn-outline-primary">Ver más</a>
        </div>
      </article>
    </div>
  `).join("");
}

displayProperties();
