function toFilmManagement() {
    window.location.replace("../pages/film-management.html");
}

// --- LOAD DATA ---
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
let movies = JSON.parse(localStorage.getItem("movies")) || [];

// --- DOM ELEMENTS ---
const tbody = document.getElementById("ticket-tbody");
const blurOverlay = document.getElementById("blur-overlay");
const toastContainer = document.getElementById("toast-container");

// Modals
const addModal = document.getElementById("add-ticket-modal");
const editModal = document.getElementById("edit-ticket-modal");
const deleteModal = document.getElementById("delete-ticket-modal");

// --- PAGINATION & SEARCH STATES ---
let currentPage = 1;
const itemsPerPage = 5;
let filteredTickets = [...tickets];

// --- TOAST NOTIFICATION ---
function showToast(type, icon, title, msg, color) {
  let toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: ${color}"></i>
    <div>
        <h4>${title}</h4>
        <p>${msg}</p>
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// --- RENDER FUNCTIONS ---
function updateStats() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    // Giả lập logic: đếm tổng vé, doanh thu, vé chờ xử lý
    let totalTickets = tickets.length;
    let totalRevenue = tickets.reduce((sum, t) => t.paymentStatus ? sum + t.totalAmount : sum, 0);
    let pendingTickets = tickets.filter(t => t.paymentStatus === false && t.statusDisplay !== "Đã huỷ").length;

    document.getElementById("stat-total-tickets").innerText = totalTickets;
    document.getElementById("stat-total-revenue").innerText = totalRevenue.toLocaleString('vi-VN');
    document.getElementById("stat-pending-tickets").innerText = pendingTickets;
}

function renderTickets() {
    updateStats();
    let str = "";
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let paginatedTickets = filteredTickets.slice(start, end);

    if (paginatedTickets.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Không tìm thấy vé nào</td></tr>`;
    } else {
        paginatedTickets.forEach((ticket, index) => {
            // Actual index in the main tickets array for edit/delete
            let realIndex = tickets.findIndex(t => t.id === ticket.id);
            
            let statusClass = ticket.statusDisplay === "Đã Thanh Toán" ? "status-success" 
                            : ticket.statusDisplay === "Đã huỷ" ? "status-cancel" 
                            : "status-pending";

            str += `
            <tr>
                <td class="ticket-code">#${ticket.ticketCode}</td>
                <td class="customer-info">
                    <p>${ticket.customerName}</p>
                    <p class="phone">${ticket.customerPhone}</p>
                </td>
                <td class="movie-info">
                    <p>${ticket.movieTitle}</p>
                </td>
                <td class="movie-info">
                    <p>${ticket.showTime}</p>
                    <p class="time">${ticket.showDate}</p>
                </td>
                <td><span class="seat-badge">${ticket.seats.join(', ')}</span></td>
                <td class="total-money">${ticket.totalAmount.toLocaleString('vi-VN')}đ</td>
                <td><span class="status-badge ${statusClass}">${ticket.statusDisplay}</span></td>
                <td class="actions">
                    <i class="fa-solid fa-pencil" onclick="showEditModal(${realIndex})"></i>
                    <i class="fa-regular fa-circle-xmark" onclick="showDeleteModal(${realIndex})"></i>
                </td>
            </tr>
            `;
        });
        tbody.innerHTML = str;
    }
    renderPagination();
}

function renderPagination() {
    let totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    let paginationContainer = document.getElementById("ticket-pagination");
    let footerInfo = document.getElementById("footer-info");
    
    let startItem = filteredTickets.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    let endItem = Math.min(currentPage * itemsPerPage, filteredTickets.length);
    
    footerInfo.innerHTML = `Đang xem <span>${startItem}</span> đến <span>${endItem}</span> trong số <span>${filteredTickets.length}</span> kết quả`;

    let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? "select" : ""}" onclick="changePage(${i})">${i}</button>`;
    }
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}>&gt;</button>`;
    
    paginationContainer.innerHTML = html;
}

function changePage(page) {
    let totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTickets();
    }
}

function searchTickets() {
    let keyword = document.getElementById("search-ticket-input").value.toLowerCase().trim();
    filteredTickets = tickets.filter(t => 
        t.ticketCode.toLowerCase().includes(keyword) || 
        t.customerName.toLowerCase().includes(keyword) ||
        t.customerPhone.includes(keyword)
    );
    currentPage = 1;
    renderTickets();
}

// --- ADD TICKET ---
function populateMovieSelect() {
    let select = document.getElementById("add-movie");
    select.innerHTML = '<option value="">Chọn phim đang chiếu...</option>';
    movies.filter(m => m.status === 1).forEach(m => {
        select.innerHTML += `<option value="${m.id}" data-price="${m.ticketPrice}">${m.titleVI}</option>`;
    });
}

function showAddModal() {
    blurOverlay.style.display = "block";
    addModal.style.display = "flex";
    populateMovieSelect();
    
    // Reset form
    document.getElementById("add-customer").value = "";
    document.getElementById("add-movie").value = "";
    document.getElementById("add-showtime").value = "";
    document.getElementById("add-seats").value = "";
    document.getElementById("add-total-price").innerText = "0 đ";
    document.getElementById("add-seat-count-info").innerText = "0 vé x 0 đ";
    
    // Clear errors
    document.querySelectorAll(".error-msg").forEach(e => e.innerText = "");
}

function hideAddModal() {
    blurOverlay.style.display = "none";
    addModal.style.display = "none";
}

function calculateAddTotal() {
    let movieSelect = document.getElementById("add-movie");
    let seatsStr = document.getElementById("add-seats").value.trim();
    
    let price = 0;
    if(movieSelect.value !== "") {
        price = parseInt(movieSelect.options[movieSelect.selectedIndex].getAttribute("data-price"));
    }
    
    let seatArr = seatsStr.split(",").map(s => s.trim()).filter(s => s !== "");
    let count = seatArr.length;
    let total = count * price;
    
    document.getElementById("add-total-price").innerText = total.toLocaleString('vi-VN') + " đ";
    document.getElementById("add-seat-count-info").innerText = `${count} vé x ${price.toLocaleString('vi-VN')} đ`;
}

function submitAddTicket() {
    let customer = document.getElementById("add-customer").value.trim();
    let movieId = document.getElementById("add-movie").value;
    let showtime = document.getElementById("add-showtime").value;
    let seatsStr = document.getElementById("add-seats").value.trim();
    let paymentMethod = document.getElementById("add-payment-method").value;
    let paymentStatus = document.getElementById("add-payment-status").value === "true";
    
    let isValid = true;
    document.querySelectorAll(".error-msg").forEach(e => e.innerText = "");

    if(!customer) { document.getElementById("add-customer-err").innerText = "*Vui lòng nhập khách hàng"; isValid = false; }
    if(!movieId) { document.getElementById("add-movie-err").innerText = "*Vui lòng chọn phim"; isValid = false; }
    if(!showtime) { document.getElementById("add-showtime-err").innerText = "*Vui lòng chọn suất chiếu"; isValid = false; }
    if(!seatsStr) { document.getElementById("add-seats-err").innerText = "*Vui lòng nhập vị trí ghế"; isValid = false; }

    if(!isValid) return;

    let seatArr = seatsStr.split(",").map(s => s.trim().toUpperCase()).filter(s => s !== "");
    let movieSelect = document.getElementById("add-movie");
    let movieName = movieSelect.options[movieSelect.selectedIndex].text;
    let price = parseInt(movieSelect.options[movieSelect.selectedIndex].getAttribute("data-price"));
    
    let newId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1000;
    
    let newTicket = {
        id: newId,
        ticketCode: "VE-" + newId,
        customerName: customer,
        customerPhone: "09xx.xxx.xxx", // Giả lập do form gộp chung
        movieId: parseInt(movieId),
        movieTitle: movieName,
        showDate: new Date().toISOString().split('T')[0], // Mặc định ngày hôm nay
        showTime: showtime,
        seats: seatArr,
        seatCount: seatArr.length,
        pricePerSeat: price,
        totalAmount: seatArr.length * price,
        paymentMethod: parseInt(paymentMethod),
        paymentStatus: paymentStatus,
        createdAt: new Date().toISOString(),
        note: "",
        statusDisplay: paymentStatus ? "Đã Thanh Toán" : "Chờ xử lý"
    };

    tickets.unshift(newTicket); // Thêm lên đầu danh sách
    localStorage.setItem("tickets", JSON.stringify(tickets));
    filteredTickets = [...tickets];
    currentPage = 1;
    
    hideAddModal();
    renderTickets();
    showToast("success", "fa-circle-check", "Thành công", "Tạo vé mới thành công!", "#10B981");
}

// --- EDIT TICKET ---
let editingTicketIndex = -1;

function showEditModal(index) {
    editingTicketIndex = index;
    let ticket = tickets[index];
    
    document.getElementById("edit-modal-title").innerText = `Cập Nhật Thông Tin Vé (Mã: ${ticket.ticketCode})`;
    document.getElementById("edit-customer").value = ticket.customerName;
    document.getElementById("edit-movie").value = ticket.movieTitle;
    document.getElementById("edit-showtime").value = `${ticket.showDate} - ${ticket.showTime}`;
    document.getElementById("edit-seats").value = ticket.seats.join(", ");
    document.getElementById("edit-note").value = ticket.note;
    
    let statusSelect = document.getElementById("edit-payment-status");
    if(ticket.statusDisplay === "Đã huỷ") {
        statusSelect.value = "cancel";
    } else {
        statusSelect.value = ticket.paymentStatus ? "true" : "false";
    }

    calculateEditTotal();
    
    blurOverlay.style.display = "block";
    editModal.style.display = "flex";
}

function hideEditModal() {
    blurOverlay.style.display = "none";
    editModal.style.display = "none";
}

function calculateEditTotal() {
    if(editingTicketIndex === -1) return;
    let ticket = tickets[editingTicketIndex];
    let seatsStr = document.getElementById("edit-seats").value.trim();
    let seatArr = seatsStr.split(",").map(s => s.trim()).filter(s => s !== "");
    
    let count = seatArr.length;
    let total = count * ticket.pricePerSeat;
    
    document.getElementById("edit-seat-count").innerText = count;
    document.getElementById("edit-total-price").innerText = total.toLocaleString('vi-VN') + "đ";
}

function submitEditTicket() {
    let seatsStr = document.getElementById("edit-seats").value.trim();
    let statusVal = document.getElementById("edit-payment-status").value;
    let note = document.getElementById("edit-note").value.trim();
    
    if(!seatsStr) {
        document.getElementById("edit-seats-err").innerText = "*Vui lòng nhập vị trí ghế";
        return;
    }

    let seatArr = seatsStr.split(",").map(s => s.trim().toUpperCase()).filter(s => s !== "");
    let ticket = tickets[editingTicketIndex];
    
    ticket.seats = seatArr;
    ticket.seatCount = seatArr.length;
    ticket.totalAmount = seatArr.length * ticket.pricePerSeat;
    ticket.note = note;
    
    if(statusVal === "cancel") {
        ticket.statusDisplay = "Đã huỷ";
        ticket.paymentStatus = false;
    } else {
        ticket.paymentStatus = (statusVal === "true");
        ticket.statusDisplay = ticket.paymentStatus ? "Đã Thanh Toán" : "Chờ xử lý";
    }

    localStorage.setItem("tickets", JSON.stringify(tickets));
    filteredTickets = [...tickets];
    
    hideEditModal();
    renderTickets();
    showToast("success", "fa-circle-check", "Thành công", "Cập nhật vé thành công!", "#10B981");
}

// --- DELETE/CANCEL TICKET ---
let deletingTicketIndex = -1;

function showDeleteModal(index) {
    deletingTicketIndex = index;
    document.getElementById("delete-ticket-code").innerText = tickets[index].ticketCode;
    blurOverlay.style.display = "block";
    deleteModal.style.display = "flex";
}

function hideDeleteModal() {
    blurOverlay.style.display = "none";
    deleteModal.style.display = "none";
}

function confirmDeleteTicket() {
    tickets.splice(deletingTicketIndex, 1);
    localStorage.setItem("tickets", JSON.stringify(tickets));
    filteredTickets = [...tickets];
    
    // Adjust page if deleting last item on page
    let totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    if(currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    hideDeleteModal();
    renderTickets();
    showToast("success", "fa-check", "Thành công", "Đã xóa vé khỏi hệ thống!", "#10B981");
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
    renderTickets();
});

// Giữ lại hàm chuyển hướng
function toFilmManagement() {
    window.location.replace("../pages/film-management.html");
}