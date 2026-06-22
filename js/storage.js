const KEYS = {
  USERS:      'aloha_users',
  PROPERTIES: 'aloha_properties',
  RESERVAS:   'aloha_reservas',
  SESSION:    'aloha_session'
};

async function initStorage() {
  /*
  ../ -> for pages/registro.html and pages/inicio-sesion.html
  ./  -> for index.html and mis-reservas.html
  */
  const basePath = window.location.pathname.includes('/pages/') ? '../' : './';
  
  // Avoid overwriting existing data on page reload
  if (localStorage.getItem(KEYS.USERS) !== null) {
    return;
  };

  // We get streams
  const [usersRes, propsRes, reservasRes] = await Promise.all([
    fetch(basePath + 'data/users.json'),
    fetch(basePath + 'data/properties.json'),
    fetch(basePath + 'data/reservas.json')
  ]);

  // Then we parse them in parallel
  const [users, properties, reservas] = await Promise.all([
    usersRes.json(), propsRes.json(), reservasRes.json()
  ]);

  users.forEach(u => {
    if (u.propiedades) {
      u.propiedades.forEach(propId => {
        const prop = properties.find(p => p.id === propId);
        if (prop) {
          prop.propietario_id = u.id;
        }
      });
    }
  });

  // Local storage only accepts strings, so we stringify our data
  // .setItem() is used to save data in localStorage, if the key already exists, the value will be updated, otherwise a new key-value pair will be added
  localStorage.setItem(KEYS.USERS,      JSON.stringify(users));
  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
  localStorage.setItem(KEYS.RESERVAS,   JSON.stringify(reservas));
}

function getUsers() {
  // From localStorage we only get strings, so we parse them back to objects/arrays
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

function getProperties() {
  // From localStorage we only get strings, so we parse them back to objects/arrays
  return JSON.parse(localStorage.getItem(KEYS.PROPERTIES) || '[]');
}

function addProperty(prop) {
  const props = getProperties();
  props.push(prop);
  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(props));
}

function getReservas() {
  // From localStorage we only get strings, so we parse them back to objects/arrays
  return JSON.parse(localStorage.getItem(KEYS.RESERVAS) || '[]');
}

function addReserva(reserva) {
  const reservas = getReservas();
  reservas.push(reserva);
  localStorage.setItem(KEYS.RESERVAS, JSON.stringify(reservas));
}

function getSession() {
  return JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null');
}

function setSession(user) {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}
