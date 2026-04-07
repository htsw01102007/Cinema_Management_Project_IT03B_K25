// Local Storage

let movies = JSON.parse(localStorage.getItem("movies"));

// DOM

let logout = document.getElementById("logout");
let modal = document.querySelector(".modal");
let modalEdit = document.querySelector(".edit-modal");
let blur = document.querySelector(".blur");
let tbody = document.getElementById("tbody");

// Toast

let toastContainer = document.getElementById("toast-container");

function showToast(type, icon, title, msg, color) {
  let toast = document.createElement("div");
  toast.classList.add("toast", type);

  let i = document.createElement("i");
  i.classList.add("fa-regular", icon);
  i.style.color = color;

  let div = document.createElement("div");

  let h4 = document.createElement("h4");
  h4.innerHTML = title;

  let p = document.createElement("p");
  p.innerHTML = msg;

  div.appendChild(h4);
  div.appendChild(p);
  toast.appendChild(i);
  toast.appendChild(div);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

// function

function toTicketManagement() {
  window.location.replace("../pages/ticket-management.html");
}

function showLogout() {
  logout.style.display = "flex";
  blur.style.display = "block";

  document.getElementById("logout-title").textContent = "Đăng xuất";
  document.getElementById("logout-info").textContent =
    "Bạn có chắc chắn muốn đăng xuất không?";
  document.getElementById("logout-submit-btn").textContent = "Đồng ý";
  document.getElementById("logout-submit-btn").onclick = "logoutToLogin()";
}

function hideLogout() {
  logout.style.display = "none";
  blur.style.display = "none";
}

function logoutToLogin() {
  window.location.replace("../pages/login.html");
}

function showModal() {
  modal.style.display = "flex";
  blur.style.display = "block";

  NameError.textContent = "";
  GenreError.textContent = "";
  DurationError.textContent = "";
  DateError.textContent = "";
  DescriptionError.textContent = "";
  ImgError.textContent = "";
  StatusError.textContent = "";
  PriceError.textContent = "";

  document.getElementById("film-title").value = "";
  document.getElementById("film-genres").value = "";
  document.getElementById("film-duration").value = "";
  document.getElementById("film-releaseDate").value = "";
  document.getElementById("film-status").value = "1";
  document.getElementById("film-ticketPrice").value = "";
  document.getElementById("film-posterUrl").value = "";
  document.getElementById("film-description").value = "";
}

function hideModal() {
  modal.style.display = "none";
  blur.style.display = "none";
}

// render

function renderFilm(list, currentPage = 1, itemsPerPage = 5) {
  let str = "";

  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;

  if (endIndex > list.length) {
    endIndex = list.length;
  }

  if (list.length === 0) {
    tbody.innerHTML =
      "<tr><td colspan='7' style='text-align:center;'>Không có dữ liệu phim</td></tr>";
    return;
  }

  for (let i = startIndex; i < endIndex; i++) {
    let film = list[i];
    let genres = film.genres
      .split(",")
      .map((g) => `<p>${g.trim()}</p>`)
      .join("");

    let id = movies.findIndex((m) => m.id === film.id);

    let statusText;
    let statusClass;
    if (film.status == 2) {
      statusText = "Sắp chiếu";
      statusClass = "status2";
    } else if (film.status == 1) {
      statusText = "Đang chiếu";
      statusClass = "status1";
    } else {
      statusText = "Đã chiếu";
      statusClass = "status0";
    }

    str += `
      <tr>
        <td>
          <div class="table-img">
            <img src="${film.posterUrl}" alt="${film.title}" />
          </div>
        </td>
        <td class="film-managerment-table-info">
          <h1>${film.title}</h1>
          <p>${film.titleVI || ""}</p>
        </td>
        <td>
          <div class="genre">
            ${genres}
          </div>
        </td>
        <td>${film.duration} phút</td>
        <td>${film.releaseDate}</td>
        <td>
          <div class="${statusClass}">
            <p>${statusText}</p>
          </div>
        </td>
        <td>
          <div class="edit">
            <i onclick="showEditModal(${id})" class="fa-solid fa-pencil"></i>
            <i onclick="showDeleteFilm(${id})" class="fa-regular fa-circle-xmark"></i>
          </div>
        </td>
      </tr>
    `;
  }

  tbody.innerHTML = str;
}

function showEditModal(index) {
  let film = movies[index];

  editNameError.textContent = "";
  editGenreError.textContent = "";
  editDurationError.textContent = "";
  editDateError.textContent = "";
  editDescriptionError.textContent = "";
  editImgError.textContent = "";
  editStatusError.textContent = "";
  editPriceError.textContent = "";

  if (film) {
    document.getElementById("edit-film-title").value = film.title || "";
    document.getElementById("edit-film-genres").value = film.genres || "";
    document.getElementById("edit-film-duration").value = film.duration || "";
    document.getElementById("edit-film-releaseDate").value =
      film.releaseDate || "";
    document.getElementById("edit-film-description").value =
      film.description || "";
    document.getElementById("edit-film-posterUrl").value = film.posterUrl || "";
    document.getElementById("edit-film-status").value = film.status;
    document.getElementById("edit-film-ticketPrice").value =
      film.ticketPrice || "";
  }

  html = `
          <button onclick="hideEditModal()">Hủy</button>
          <button onclick="updateFilm(${index})" id="modal-confirm-btn" class="select">
            <i class="fa-regular fa-floppy-disk"></i> Cập nhật
          </button>
    `;

  document.querySelector(".edit-modal-footer").innerHTML = html;

  // Hiển thị modal
  modalEdit.style.display = "flex";
  blur.style.display = "block";
}

function hideEditModal() {
  modalEdit.style.display = "none";
  blur.style.display = "none";
}

// Pagination

let currentPage = 1;
let totalPages = Math.ceil(movies.length / 5);

function renderPagination(currentPage, totalPages) {
  let paginationContainer = document.querySelector(".pagination");
  let footerInfo = document.getElementById("footer-info");

  footerInfo.innerHTML = `Hiển thị <span>1-5</span> trên <span>${moviesFinal.length}</span> phim`

  if (!paginationContainer) return;

  let html = "";

  html += `<button id="paginationL" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>&lt;</button>`;

  // Logic hiển thị số trang
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === currentPage ? "select" : ""}" onclick="changePage(${i})">${i}</button>`;
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) {
        html += `<button class="${i === currentPage ? "select" : ""}" onclick="changePage(${i})">${i}</button>`;
      }
      html += `<button disabled>...</button>`;
      html += `<button class="${totalPages === currentPage ? "select" : ""}" onclick="changePage(${totalPages})">${totalPages}</button>`;
    } else if (currentPage >= totalPages - 2) {
      html += `<button class="${1 === currentPage ? "select" : ""}" onclick="changePage(1)">1</button>`;
      html += `<button disabled>...</button>`;
      for (let i = totalPages - 2; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? "select" : ""}" onclick="changePage(${i})">${i}</button>`;
      }
    } else {
      html += `<button class="${1 === currentPage ? "select" : ""}" onclick="changePage(1)">1</button>`;
      html += `<button disabled>...</button>`;

      html += `<button onclick="changePage(${currentPage - 1})">${currentPage - 1}</button>`;
      html += `<button class="select" onclick="changePage(${currentPage})">${currentPage}</button>`;
      html += `<button onclick="changePage(${currentPage + 1})">${currentPage + 1}</button>`;

      html += `<button disabled>...</button>`;
      html += `<button class="${totalPages === currentPage ? "select" : ""}" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
  }

  html += `<button id="paginationR" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>&gt;</button>`;

  paginationContainer.innerHTML = html;
}

// Hàm xử lý khi click chuyển trang
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages) return;

  currentPage = newPage;

  renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));

  renderFilm(moviesFinal, currentPage, 5);
}

//

let moviesFiltered = movies;
let moviesFinal = moviesFiltered;
let currentStatus = 3;

function renderFilter(currentFilter) {
  let html = "";
  switch (currentFilter) {
    case 3:
      html = `
          <div onclick="renderFilter(3)" class="filter select">Tất cả (${movies.length})</div>
          <div onclick="renderFilter(1)" class="filter">Đang chiếu (${movies.filter((film) => film.status == 1).length})</div>
          <div onclick="renderFilter(2)" class="filter">Sắp chiếu (${movies.filter((film) => film.status == 2).length})</div>
          <div onclick="renderFilter(0)" class="filter">Đã chiếu (${movies.filter((film) => film.status == 0).length})</div>
      `;
      document.querySelector(".filter-container").innerHTML = html;
      moviesFiltered = movies;
      moviesFinal = moviesFiltered;
      renderFilm(moviesFinal);
      currentStatus = 3;
      currentPage = 1;
      renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));
      break;
    case 1:
      html = `
          <div onclick="renderFilter(3)" class="filter">Tất cả (${movies.length})</div>
          <div onclick="renderFilter(1)" class="filter select">Đang chiếu (${movies.filter((film) => film.status == 1).length})</div>
          <div onclick="renderFilter(2)" class="filter">Sắp chiếu (${movies.filter((film) => film.status == 2).length})</div>
          <div onclick="renderFilter(0)" class="filter">Đã chiếu (${movies.filter((film) => film.status == 0).length})</div>
      `;
      document.querySelector(".filter-container").innerHTML = html;
      moviesFiltered = movies.filter((film) => film.status == 1);
      moviesFinal = moviesFiltered;
      renderFilm(moviesFinal);
      currentStatus = 1;
      currentPage = 1;
      renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));
      break;
    case 2:
      html = `
          <div onclick="renderFilter(3)" class="filter">Tất cả (${movies.length})</div>
          <div onclick="renderFilter(1)" class="filter">Đang chiếu (${movies.filter((film) => film.status == 1).length})</div>
          <div onclick="renderFilter(2)" class="filter select">Sắp chiếu (${movies.filter((film) => film.status == 2).length})</div>
          <div onclick="renderFilter(0)" class="filter">Đã chiếu (${movies.filter((film) => film.status == 0).length})</div>
      `;
      document.querySelector(".filter-container").innerHTML = html;
      moviesFiltered = movies.filter((film) => film.status == 2);
      moviesFinal = moviesFiltered;
      renderFilm(moviesFinal);
      currentStatus = 2;
      currentPage = 1;
      renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));
      break;
    case 0:
      html = `
          <div onclick="renderFilter(3)" class="filter">Tất cả (${movies.length})</div>
          <div onclick="renderFilter(1)" class="filter">Đang chiếu (${movies.filter((film) => film.status == 1).length})</div>
          <div onclick="renderFilter(2)" class="filter">Sắp chiếu (${movies.filter((film) => film.status == 2).length})</div>
          <div onclick="renderFilter(0)" class="filter select">Đã chiếu (${movies.filter((film) => film.status == 0).length})</div>
      `;
      document.querySelector(".filter-container").innerHTML = html;
      moviesFiltered = movies.filter((film) => film.status == 0);
      moviesFinal = moviesFiltered;
      renderFilm(moviesFinal);
      currentStatus = 0;
      currentPage = 1;
      renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));
      break;
    default:
      break;
  }
}

function search() {
  keyword = document.getElementById("search").value.toLowerCase().trim();
  moviesFinal = moviesFiltered.filter((film) =>
    film.title.toLowerCase().includes(keyword),
  );

  renderFilm(moviesFinal);
  currentPage = 1;
  renderPagination(currentPage, Math.ceil(moviesFinal.length / 5));
}

let NameError = document.getElementById("name-error");
let GenreError = document.getElementById("genre-error");
let DurationError = document.getElementById("duration-error");
let DateError = document.getElementById("date-error");
let DescriptionError = document.getElementById("description-error");
let ImgError = document.getElementById("img-error");
let StatusError = document.getElementById("status-error");
let PriceError = document.getElementById("price-error");

function isValidDate(dateString) {
  const regEx = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regEx);

  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

let lastId = movies.length > 0 ? movies[movies.length - 1].id : 0;

function addFilm() {
  let title = document.getElementById("film-title").value;
  let genre = document.getElementById("film-genres").value;
  let duration = document.getElementById("film-duration").value;
  let releaseDate = document.getElementById("film-releaseDate").value;
  let status = document.getElementById("film-status").value;
  let price = document.getElementById("film-ticketPrice").value;
  let url = document.getElementById("film-posterUrl").value;
  let description = document.getElementById("film-description").value;

  NameError.textContent = "";
  GenreError.textContent = "";
  DurationError.textContent = "";
  DateError.textContent = "";
  DescriptionError.textContent = "";
  ImgError.textContent = "";
  StatusError.textContent = "";
  PriceError.textContent = "";

  let flag = false;

  if (title.trim() === "") {
    NameError.textContent = "*Tên phim không được để trống";
    flag = true;
  }
  if (genre === "") {
    GenreError.textContent = "*Thể loại không được để trống";
    flag = true;
  }
  if (duration === "" || duration <= 0) {
    DurationError.textContent =
      "*Thời lượng không được để trống và phải hợp lệ";
    flag = true;
  }

  if (!isValidDate(releaseDate)) {
    DateError.textContent =
      "*Ngày không hợp lệ (Ví dụ: tháng 2 chỉ có 28/29 ngày)";
    flag = true;
  }

  if (releaseDate.trim() === "") {
    DateError.textContent = "*Ngày khởi chiếu không được để trống";
    flag = true;
  }

  if (description === "") {
    DescriptionError.textContent = "*Trạng thái phim không được để trống";
    flag = true;
  }
  if (url === "") {
    ImgError.textContent = "*URL ảnh bìa phim không được để trống";
    flag = true;
  }
  if (price === "" || duration <= 0) {
    PriceError.textContent = "*Giá không được để trống và phải hợp lệ";
    flag = true;
  }

  if (flag) {
    showToast(
      "error",
      "fa-circle-xmark",
      "Thất bại",
      "Thêm phim không thành công!",
      "#f04343",
    );
    return;
  }

  let newMovies = {
    id: lastId + 1,
    title: title,
    titleVI: title,
    genres: genre,
    duration: Number(duration),
    releaseDate: releaseDate,
    status: Number(status),
    posterUrl: url,
    description: description,
    ticketPrice: Number(price),
  };

  movies.push(newMovies);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderFilm(moviesFinal, currentPage);
  renderFilter(currentStatus);
  showToast(
    "success",
    "fa-circle-check",
    "Thành công",
    "Thêm phim thành công!",
    "#11d411",
  );

  hideModal();
}

let editNameError = document.getElementById("edit-name-error");
let editGenreError = document.getElementById("edit-genre-error");
let editDurationError = document.getElementById("edit-duration-error");
let editDateError = document.getElementById("edit-date-error");
let editDescriptionError = document.getElementById("edit-description-error");
let editImgError = document.getElementById("edit-img-error");
let editStatusError = document.getElementById("edit-status-error");
let editPriceError = document.getElementById("edit-price-error");

function updateFilm(i) {
  let title = document.getElementById("edit-film-title").value;
  let genre = document.getElementById("edit-film-genres").value;
  let duration = document.getElementById("edit-film-duration").value;
  let releaseDate = document.getElementById("edit-film-releaseDate").value;
  let status = document.getElementById("edit-film-status").value;
  let price = document.getElementById("edit-film-ticketPrice").value;
  let url = document.getElementById("edit-film-posterUrl").value;
  let description = document.getElementById("edit-film-description").value;

  editNameError.textContent = "";
  editGenreError.textContent = "";
  editDurationError.textContent = "";
  editDateError.textContent = "";
  editDescriptionError.textContent = "";
  editImgError.textContent = "";
  editStatusError.textContent = "";
  editPriceError.textContent = "";

  let flag = false;

  if (title.trim() === "") {
    editNameError.textContent = "*Tên phim không được để trống";
    flag = true;
  }
  if (genre === "") {
    editGenreError.textContent = "*Thể loại không được để trống";
    flag = true;
  }
  if (duration === "" || duration <= 0) {
    editDurationError.textContent =
      "*Thời lượng không được để trống và phải hợp lệ";
    flag = true;
  }

  if (!isValidDate(releaseDate)) {
    editDateError.textContent =
      "*Ngày không hợp lệ (Ví dụ: tháng 2 chỉ có 28/29 ngày)";
    flag = true;
  }

  if (releaseDate.trim() === "") {
    editDateError.textContent = "*Ngày khởi chiếu không được để trống";
    flag = true;
  }

  if (description === "") {
    editDescriptionError.textContent = "*Trạng thái phim không được để trống";
    flag = true;
  }
  if (url === "") {
    editImgError.textContent = "*URL ảnh bìa phim không được để trống";
    flag = true;
  }
  if (price === "" || duration <= 0) {
    editPriceError.textContent = "*Giá không được để trống và phải hợp lệ";
    flag = true;
  }

  if (flag) {
    showToast(
      "error",
      "fa-circle-xmark",
      "Thất bại",
      "Sửa phim không thành công!",
      "#f04343",
    );
    return;
  }

  movies[i] = {
    id: movies[i].id,
    title: title,
    titleVI: title,
    genres: genre,
    duration: Number(duration),
    releaseDate: releaseDate,
    status: Number(status),
    posterUrl: url,
    description: description,
    ticketPrice: Number(price),
  };

  localStorage.setItem("movies", JSON.stringify(movies));
  renderFilm(moviesFinal, currentPage);
  renderFilter(currentStatus);

  hideEditModal();
  showToast(
    "success",
    "fa-circle-check",
    "Thành công",
    "Sửa phim thành công!",
    "#11d411",
  );
}

function showDeleteFilm(i) {
  showLogout();
  document.getElementById("logout-title").textContent = "Xác nhận xóa phim";
  document.getElementById("logout-info").innerHTML =
    `Bạn có chắc chắn muốn xóa phim <span>"${movies[i].title}"</span> không? Hành động này không thể hoàn tác.`;
  document.getElementById("logout-submit-btn").textContent = "Xóa ngay";
  document.getElementById("logout-submit-btn").onclick = function () {
    deleteFilm(i);
  };
}

function uploadImg() {
  showToast(
    "error",
    "fa-trash-can",
    "Em chịu thua ạ",
    "Em chưa làm đượcc!",
    "#f04343",
  );
}

function deleteFilm(i) {
  movies.splice(i, 1);
  localStorage.setItem("movies", JSON.stringify(movies));
  renderFilm(moviesFinal, currentPage);
  renderFilter(currentStatus);
  hideLogout();
  showToast(
    "error",
    "fa-trash-can",
    "Thành công",
    "Xóa phim thành công!",
    "#f04343",
  );
}

// Gọi hàm lần đầu khi load trang
renderPagination(currentPage, totalPages);

renderFilter(3);

renderFilm(movies);
