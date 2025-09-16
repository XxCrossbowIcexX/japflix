document.addEventListener("DOMContentLoaded", function () {
  let arrayPelis = [];
  const btnBuscar = document.getElementById('btnBuscar');
  const inputBuscar = document.getElementById('inputBuscar');
  const lista = document.getElementById('lista');

  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(res => res.json())
    .then(data => { arrayPelis = data; });

  btnBuscar.addEventListener('click', function () {
    let criterio = inputBuscar.value.toLowerCase();
    if (criterio.length === 0) return;
    let palabras = criterio.split(/\s+/);

    lista.innerHTML = '';

    let peliculasFiltradas = arrayPelis.filter(pelicula => {
      let texto = [
        pelicula.title,
        pelicula.tagline || '',
        pelicula.overview || '',
        pelicula.genres.map(gr => gr.name).join(' ')
      ].join(' ').toLowerCase();

      return palabras.every(palabra => texto.includes(palabra));
    });

    peliculasFiltradas.forEach(pelicula => {
      let li = document.createElement('li');
      li.classList.add('list-group-item', 'list-group-item-action', 'bg-dark', 'text-white', 'd-flex', 'justify-content-between', 'align-items-center');
      li.style.cursor = 'pointer';
      li.innerHTML = `
        <div>
          <h5 class="mb-1">${pelicula.title}</h5>
          <small class="text-secondary">${pelicula.tagline || ''}</small>
        </div>
        <span class="">
          ${iconosEstrellas(pelicula.vote_average)}
        </span>
      `;
      li.addEventListener('click', () => MostrarInformacion(pelicula));
      lista.appendChild(li);
    });
    if (peliculasFiltradas.length === 0) {
      lista.innerHTML = `
        <li class="list-group-item list-group-item-dark bg-dark text-white text-center">
          <span class="text-muted">No se encontraron resultados.</span>
        </li>`;
    }
  });


  let MostrarInformacion = (pelicula) => {
    const infoDiv = document.getElementById('mostrarInformacion');
    infoDiv.innerHTML = `
    <div class="p-3">
      <div class="d-flex justify-content-between">
        <h2 class="mb-3">${pelicula.title}</h2>
        <button type="button" class="btn-close" 
          onclick="document.getElementById('mostrarInformacion').hidden = true">
        </button>
      </div>
      <p class="mt-2">${pelicula.overview}</p>
      <hr>
      <div class="d-flex justify-content-between">
        <small class="text-muted">${pelicula.genres.map(g => g.name).join(' - ')}</small>
        <div class="dropdown">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                  type="button" id="dropdownMenuButton" 
                  data-bs-toggle="dropdown" aria-expanded="false">
            More
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li class="dropdown-item-text d-flex justify-content-between gap-2"><p class="m-0">Year:</p><span>${pelicula.release_date ? pelicula.release_date.split('-')[0] : '—'}</span></li>
            <li class="dropdown-item-text d-flex justify-content-between gap-2"><p class="m-0">Runtime:</p><span>${pelicula.runtime ? pelicula.runtime + ' min' : '—'}</span></li>
            <li class="dropdown-item-text d-flex justify-content-between gap-2"><p class="m-0">Budget:</p><span>${pelicula.budget ? '$' + pelicula.budget.toLocaleString() : '—'}</span></li>
            <li class="dropdown-item-text d-flex justify-content-between gap-2"><p class="m-0">Revenue:</p><span>${pelicula.revenue ? '$' + pelicula.revenue.toLocaleString() : '—'}</span></li>
          </ul>
        </div>
      </div>
    </div>
  `;
    infoDiv.style.zIndex = 3;
    infoDiv.hidden = false;
  };


  let iconosEstrellas = (votos) => {
    const rating = (Number(votos) || 0) / 2;
    const estrellasLlenas = Math.floor(rating);
    const tieneMedia = rating % 1 >= 0.5;
    let htmlIconos = '';

    for (let i = 1; i <= 5; i++) {
      if (i <= estrellasLlenas) {
        htmlIconos += `<span class="fa fa-star checked"></span>`;
      } else if (tieneMedia && i === estrellasLlenas + 1) {
        htmlIconos += `<span class="fa fa-star-half-o checked"></span>`;
      } else {
        htmlIconos += `<span class="fa fa-star-o"></span>`;
      }
    }
    return htmlIconos;
  };

});