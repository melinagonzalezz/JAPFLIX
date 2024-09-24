document.addEventListener('DOMContentLoaded', async () => {
    let movies = [];
    
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        if (!response.ok) throw new Error('Error en la carga de datos');
        movies = await response.json();
    } catch (error) {
        console.error(error);
        alert('No se pudo cargar la información. Intenta más tarde. ʚ₍ᐢ. .ᐢ₎ɞ');
        return; 
    }

    const btnBuscar = document.getElementById('btnBuscar');
    const inputBuscar = document.getElementById('inputBuscar');
    const lista = document.getElementById('lista');
    const detallePeliculas = document.getElementById('detallePeliculas');
    const desplegable = document.getElementById('desplegable');

    btnBuscar.onclick = () => {
        const query = inputBuscar.value.toLowerCase().trim();
        lista.innerHTML = '';

        if (!query) {
            alert('Por favor ingresa un término de búsqueda. ₍ᐢ. .ᐢ₎'); 
            return;
        }

        const filteredMovies = filterMovies(query);
        filteredMovies.sort((a, b) => a.title.localeCompare(b.title));

        if (filteredMovies.length === 0) {
            lista.innerHTML = '<li class="list-group-item"> No se encontraron películas. ₍ᐢx.xᐢ₎ </li>';
            return;
        }

        filteredMovies.forEach(movie => {
            const starRating = getStarRating(movie);
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                <p>${'★'.repeat(starRating)}${'☆'.repeat(5 - starRating)} (${movie.vote_average} votos)</p>
            `;
            listItem.addEventListener('click', () => showMovieDetails(movie));
            lista.appendChild(listItem);
        });
    };

    function filterMovies(query) {
        const prioritizedMovies = movies.filter(movie => {
            const titleMatch = movie.title.toLowerCase().includes(query);
            const genreMatch = movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(query));
            return titleMatch || genreMatch;
        });

        if (prioritizedMovies.length > 0) {
            return prioritizedMovies;
        }

        return movies.filter(movie => {
            const taglineMatch = movie.tagline && movie.tagline.toLowerCase().includes(query);
            const overviewMatch = movie.overview && movie.overview.toLowerCase().includes(query);
            return taglineMatch || overviewMatch;
        });
    }

    function getStarRating(movie) {
        let starRating = Math.round(movie.vote_average / 2);
        const popularity = parseFloat(String(movie.popularity).replace(/\./g, '').replace(/,/g, '.'));

        if (popularity < 3000000) {
            starRating = Math.max(0, starRating - 1);
        } else if (popularity > 10000000) {
            starRating = Math.min(5, starRating + 1);
        }

        return Math.max(0, Math.min(5, starRating));
    }

    function showMovieDetails(movie) {
        document.getElementById('tituloDetalle').textContent = movie.title;
        document.getElementById('overviewDetalle').textContent = movie.overview;
        document.getElementById('generosDetalle').textContent = movie.genres.map(genre => genre.name).join(', ');
        detallePeliculas.style.display = 'block';

        desplegable.innerHTML = `
            <button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                Más información
            </button>
            <div class="collapse" id="collapseInfo">
                <div class="card card-body">
                    <p><strong>Año de lanzamiento:</strong> ${new Date(movie.release_date).getFullYear()}</p>
                    <p><strong>Duración:</strong> ${movie.runtime ? `${movie.runtime} minutos` : 'Desconocido'}</p>
                    <p><strong>Presupuesto:</strong> ${movie.budget ? `$${movie.budget.toLocaleString()}` : 'No disponible'}</p>
                    <p><strong>Ganancias:</strong> ${movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'No disponible'}</p>
                </div>
            </div>
        `;
    }

    document.getElementById('btnCerrar').onclick = () => {
        detallePeliculas.style.display = 'none';
    };
});
