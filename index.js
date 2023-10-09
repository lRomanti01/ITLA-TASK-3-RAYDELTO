const itemsPerPage = 25;
let currentPage = 1; 
const form = document.getElementById('form');
const apiUrl = 'http://www.raydelto.org/agenda.php'; 

showData();

// Función para mostrar los elementos en la página actual
function displayItems(data) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  const tbodyElement = document.getElementById('data-body');
  tbodyElement.innerHTML = '';

  pageData.forEach(item => {
    const trElement = document.createElement('tr');
    const tdNombre = document.createElement('td');
    const tdApellido = document.createElement('td');
    const tdNumero = document.createElement('td');

    tdNombre.textContent = item.nombre;
    tdApellido.textContent = item.apellido;
    tdNumero.textContent = item.telefono;

    trElement.appendChild(tdNombre);
    trElement.appendChild(tdApellido);
    trElement.appendChild(tdNumero);

    tbodyElement.appendChild(trElement);
  });
}

function showData() {
  fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    const data = responseData; // Almacenar los datos completos
    console.log(data);
    displayItems(data); // Mostrar la primera página de elementos
    
    // Manejar la paginación
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginationElement = document.getElementById('pagination');

    // Crear botones de paginación
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => {
        currentPage = i;
        displayItems(data);
      });
      paginationElement.appendChild(button);
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

  form.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const numeroInput = document.getElementById('numero');
  
    // Obtén los valores de los campos de entrada
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const numero = numeroInput.value;
  
    // Crea un objeto con los datos a enviar a la API
    const dataToSend = {
      nombre: nombre,
      apellido: apellido,
      telefono: numero
    };
  
    fetch(apiUrl, {
      method: 'POST', // Método HTTP POST para enviar datos
      body: JSON.stringify(dataToSend)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        console.log('Respuesta de la API:', responseData);
        alert('Datos enviados correctamente')
        showData();
  
        // Puedes realizar alguna acción adicional aquí, como limpiar los campos del formulario
        nombreInput.value = '';
        apellidoInput.value = '';
        numeroInput.value = '';
      })
      .catch(error => {
        console.error('Error al enviar datos a la API:', error);
        alert('Error al enviar datos')
      });
  });