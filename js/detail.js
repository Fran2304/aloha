// 1. Leer el id de la URL → detail.html?id=2 → id = 2

const params = new URLSearchParams(window.location.search);

const id = parseInt(params.get("id"));



// 2. Cargar el JSON y buscar la propiedad con ese id

async function cargarPropiedad() {

    try {

        const res = await fetch("../data/properties.json");

        const propiedades = await res.json();

        const p = propiedades.find((prop) => prop.id === id);



        // Si no existe el id, mostrar error

        if (!p) {

            document.querySelector("main").innerHTML = `

            <div class="container py-5 text-center">

                <h2>Propiedad no encontrada</h2>

                <a href="../index.html" class="btn btn-primary mt-3">Volver al inicio</a>

            </div>`;

            return;

        }



        // 3. Rellenar el título de la pestaña del navegador

        document.title = `${p.title} - Aloha`;



        // 4. Badge de tipo

        document.getElementById("det-tipo").textContent =

            p.type.charAt(0).toUpperCase() + p.type.slice(1);



     // 5. Rating y número de reseñas dinámicos

        if (document.getElementById("det-rating")) {

        document.getElementById("det-rating").textContent = p.rating;

        }

        if (document.getElementById("det-reviews")) {

        document.getElementById("det-reviews").textContent = p.reviews;

        }



        // 6. Título y ciudad

        document.getElementById("det-titulo").textContent = p.title;

        document.getElementById("det-ciudad").textContent = `${p.city}, ${p.region}`;



        // 7. Galería de fotos

        const imagenes = p.images && p.images.length > 0 ? p.images : [p.image];

        document.getElementById("det-img-principal").src = `../${imagenes[0]}`;

        document.getElementById("det-img-principal").alt = p.title;



        const gridSecundario = document.getElementById("det-imgs-secundarias");

        gridSecundario.innerHTML = imagenes.slice(1, 5).map((img) => `

            <div class="col-6">

            <img src="../${img}" alt="${p.title}" class="img-fluid w-100">

            </div>

        `).join("");



        // 8. Info rápida

        document.getElementById("det-huespedes").textContent = `${p.guests} huéspedes`;

        document.getElementById("det-habitaciones").textContent = `${p.rooms} hab.`;



        // 9. Descripción y anfitrión

        document.getElementById("det-descripcion").textContent = p.description;

        document.getElementById("det-host").textContent = p.host;



        // 10. Amenidades (lo que incluye)

        document.getElementById("det-amenidades").innerHTML = p.amenities

        .map((a) => `<li class="col-6"><i class="bi bi-check-circle text-success me-2"></i>${a}</li>`)

        .join("");



        // 11. Card de reserva — precio y WhatsApp

        document.getElementById("det-precio").textContent = `S/ ${p.price}`;



        // ==========================================

        //  ¡CORRECCIÓN AQUÍ! Mover las líneas adentro

        // ==========================================



        // Camas y baños

        if(document.getElementById("det-camas")) document.getElementById("det-camas").textContent = `${p.beds} camas`;

        if(document.getElementById("det-banos")) document.getElementById("det-banos").textContent = `${p.bathrooms} baños`;



        // Ubicación dinámica

        if(document.getElementById("det-ubicacion")) document.getElementById("det-ubicacion").textContent = `${p.city}, ${p.region}`;



        // Mapa dinámico (Corregida la URL para que incruste bien Google Maps con el nombre de la ciudad)

        if(document.getElementById("det-mapa")) {

            document.getElementById("det-mapa").src = `https://maps.google.com/maps?q=${p.city},${p.region},Peru&output=embed`;

        }



    } catch (error) {

        console.error("Error al cargar la propiedad:", error);

    }

}



// 12. Cálculo de precio total según fechas

const TARIFA_SERVICIO = 0.12;



function calcularPrecio() {

    const entrada = document.getElementById("fecha-entrada").value;

    const salida  = document.getElementById("fecha-salida").value;

    const resumen = document.getElementById("resumen-precio");



    if (!entrada || !salida) return;



    const fechaEntrada = new Date(entrada);

    const fechaSalida  = new Date(salida);

    const noches = Math.round((fechaSalida - fechaEntrada) / (1000 * 60 * 60 * 24));



    if (noches <= 0) {

        resumen.classList.add("d-none");

        return;

    }



    const precioTexto = document.getElementById("det-precio").textContent;

    const precio = parseInt(precioTexto.replace("S/ ", ""));



    const subtotal = precio * noches;

    const tarifa   = Math.round(subtotal * TARIFA_SERVICIO);

    const total    = subtotal + tarifa;



    document.getElementById("num-noches").textContent = noches;

    document.getElementById("subtotal").textContent   = "S/ " + subtotal;

    document.getElementById("tarifa").textContent     = "S/ " + tarifa;

    document.getElementById("total").textContent      = "S/ " + total;



    resumen.classList.remove("d-none");

}



document.getElementById("fecha-entrada").addEventListener("change", calcularPrecio);

document.getElementById("fecha-salida").addEventListener("change", calcularPrecio);



// Iniciar la carga

cargarPropiedad();




