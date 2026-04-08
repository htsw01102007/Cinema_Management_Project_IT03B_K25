// Local Storage

let movies = JSON.parse(localStorage.getItem("movies"));

function reglog() {
    window.location.replace("../pages/register.html");
}

function renderHomeFilms(list) {
  let str = "";
  for (let i = 0; i < 4; i++) {
    const film = list[i];
    const genres = film.genres; // giả sử là chuỗi "Hành động, Viễn tưởng"
    str += `
      <div class="film-card">
        <img src="${film.posterUrl}" alt="${film.title}" />
        <div class="film-card-content">
          <h3>${film.title}</h3>
          <div class="film-card-info">
            <i class="fa-regular fa-clock"></i>
            <p>${film.duration} phút</p>
            <p>•</p>
            <p>${genres}</p>
          </div>
          <button>Mua Vé</button>
        </div>
      </div>
    `;
  }
  document.querySelector(".film-container").innerHTML = str;
}

renderHomeFilms(movies);