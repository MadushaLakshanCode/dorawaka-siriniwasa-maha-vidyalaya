// ================= INITIAL DEFAULT DATA =================
const defaultData = {
    stats: { students: "1,250+", staff: "65+" },
    principal: {
        name: "Mr. K. A. Dharmasena",
        title: "Principal (SLPS I) - Dorawaka Siriniwasa Vidyalaya",
        img: "principal.jpg", // Default placeholder
        message: "Welcome to the official digital portal of Dorawaka Siriniwasa Vidyalaya. Our goal is to develop both the intellectual potential and moral character of every student. We encourage every child to actively participate in our school clubs, societies, and sports alongside their academic studies."
    },
    news: [
        { id: 1, title: "First Term Examination Schedule Released", category: "Principal Announcement", date: "2026-10-05", desc: "All students from Grade 6 to Grade 13 are informed that the upcoming term examinations will begin on the 19th of this month." },
        { id: 2, title: "Annual Inter-House Sports Meet 2026", category: "Event", date: "2026-09-28", desc: "House selections and track events for the Annual Sports Meet have officially commenced at the school main ground." }
    ],
    clubs: [
        { id: 1, name: "ICT & Coding Society", teacher: "Mr. S. Bandara", desc: "Develops software skills, web design, robotics.", howToJoin: "Register at the Computer Lab every Wednesday." },
        { id: 2, name: "Science & Innovation Club", teacher: "Mrs. N. Jayasinghe", desc: "Conducts practical experiments and exhibitions.", howToJoin: "Submit a membership slip to the Main Science Lab." }
    ],
    sports: [
        { id: 1, name: "Volleyball (Boys & Girls)", coach: "Mr. R. Perera", desc: "Under-14, Under-16, and Under-19 school teams.", howToJoin: "Attend trials at the volleyball court." },
        { id: 2, name: "Cricket", coach: "Mr. D. Wijesinghe", desc: "Junior and Senior leather & softball cricket squads.", howToJoin: "Register with the Sports Coordinator." }
    ],
    staff: [
        { id: 1, name: "Mr. K. A. Dharmasena", role: "Principal (SLPS I)", subject: "School Administration", img: "" },
        { id: 2, name: "Mrs. S. M. Gunasekara", role: "Deputy Principal", subject: "Academic & Senior Section Head", img: "" },
        { id: 3, name: "Mr. R. M. Bandara", role: "Assistant Principal", subject: "Discipline & Co-Curricular Head", img: "" },
        { id: 4, name: "Mrs. N. Jayasinghe", role: "Sectional Head (O/L)", subject: "Science & Mathematics", img: "" }
    ]
};


// මුල් වරට විස්තර නොමැති නම් Default විස්තර ලබා දීම
if (!localStorage.getItem("adminCredentials")) {
    localStorage.setItem("adminCredentials", JSON.stringify({ user: "admin", pass: "admin123" }));
}

function loginAdmin() {
    const inputUser = document.getElementById("admin-user").value;
    const inputPass = document.getElementById("admin-password").value;
    const storedCreds = JSON.parse(localStorage.getItem("adminCredentials"));

    if (inputUser === storedCreds.user && inputPass === storedCreds.pass) {
        isAdminLoggedIn = true;
        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        
        // ඩෑෂ්බෝඩ් එකට අවශ්‍ය අනෙකුත් දත්ත පිරවීම
        if (schoolData.stats) {
            document.getElementById("admin-students").value = schoolData.stats.students;
            document.getElementById("admin-staff").value = schoolData.stats.staff;
        }
        if (schoolData.principal) {
            document.getElementById("admin-prin-name").value = schoolData.principal.name;
            document.getElementById("admin-prin-title").value = schoolData.principal.title;
            document.getElementById("admin-prin-message").value = schoolData.principal.message;
        }

        renderAll();
        alert("Logged in successfully!");
    } else {
        alert("Incorrect username or password!");
    }
}

// ================= STATE MANAGEMENT =================
let schoolData = JSON.parse(localStorage.getItem("dorawakaSchoolData")) || defaultData;
let isAdminLoggedIn = false;
let currentNewsFilter = "All";

// Ensure older local storage files get the new image fields
if (!schoolData.victories) schoolData.victories = [];
if (!schoolData.principal) schoolData.principal = defaultData.principal;
if (!schoolData.principal.img) schoolData.principal.img = "principal.jpg";
if (!schoolData.staff) schoolData.staff = defaultData.staff;
schoolData.staff.forEach((s, i) => { 
    if (!s.id) s.id = Date.now() + i; 
    if (s.img === undefined) s.img = ""; 
});

function saveData() {
    localStorage.setItem("dorawakaSchoolData", JSON.stringify(schoolData));
    renderAll();
}

// ================= NAVIGATION LOGIC =================
function switchTab(tabId) {
    document.querySelectorAll(".tab-section").forEach(sec => sec.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    document.getElementById("nav-links").classList.remove("show");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
    document.getElementById("nav-links").classList.toggle("show");
}

// ================= RENDER FUNCTIONS =================
function renderAll() {
    if (!schoolData.stats) schoolData.stats = { students: "1,250+", staff: "65+" };

    document.getElementById("stat-students").innerText = schoolData.stats.students;
    document.getElementById("stat-staff").innerText = schoolData.stats.staff;
    document.getElementById("home-clubs-count").innerText = schoolData.clubs.length;
    document.getElementById("home-sports-count").innerText = schoolData.sports.length;
    document.getElementById("total-clubs-badge").innerText = schoolData.clubs.length;
    document.getElementById("total-sports-badge").innerText = schoolData.sports.length;

    renderPrincipal();
    renderHomeNews();
    renderNews();
    renderClubs();
    renderSports();
    renderStaff();
    renderVictories();
    renderHomeLatestVictory();
}

function renderPrincipal() {
    document.getElementById("principal-name").innerText = schoolData.principal.name;
    document.getElementById("principal-title").innerText = schoolData.principal.title;
    document.getElementById("principal-message").innerText = `"${schoolData.principal.message}"`;
    document.getElementById("principal-img").src = schoolData.principal.img;
}

function renderHomeNews() {
    const container = document.getElementById("home-news-grid");
    container.innerHTML = schoolData.news.slice(0, 3).map(item => `
        <div class="card">
            <div><span class="card-tag">${item.category}</span><h3>${item.title}</h3><p>${item.desc}</p></div>
            <div class="card-meta"><i class="far fa-calendar-alt"></i> Published: ${item.date}</div>
        </div>
    `).join("");
}

function renderNews() {
    const container = document.getElementById("news-grid");
    const filtered = currentNewsFilter === "All" ? schoolData.news : schoolData.news.filter(n => n.category === currentNewsFilter);
    container.innerHTML = filtered.map(item => `
        <div class="card">
            <div><span class="card-tag">${item.category}</span><h3>${item.title}</h3><p>${item.desc}</p></div>
            <div>
                <div class="card-meta"><i class="far fa-calendar-alt"></i> Date: ${item.date}</div>
                ${isAdminLoggedIn ? `<button class="delete-btn" onclick="deleteItem('news', ${item.id})"><i class="fas fa-trash"></i> Delete Notice</button>` : ""}
            </div>
        </div>
    `).join("");
}

function filterNews(category, btnElement) {
    currentNewsFilter = category;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btnElement.classList.add("active");
    renderNews();
}

function renderClubs() {
    const container = document.getElementById("clubs-grid");
    container.innerHTML = schoolData.clubs.map(club => `
        <div class="card">
            <div>
                <span class="card-tag"><i class="fas fa-users"></i> Official School Society</span>
                <h3>${club.name}</h3><p>${club.desc}</p>
                <div class="join-box"><strong><i class="fas fa-hand-point-right"></i> How to Join:</strong><br>${club.howToJoin}</div>
            </div>
            <div>
                <div class="card-meta"><i class="fas fa-chalkboard-teacher"></i> <strong>Teacher-in-Charge:</strong> ${club.teacher}</div>
                ${isAdminLoggedIn ? `<button class="delete-btn" onclick="deleteItem('clubs', ${club.id})"><i class="fas fa-trash"></i> Remove Club</button>` : ""}
            </div>
        </div>
    `).join("");
}

function renderSports() {
    const container = document.getElementById("sports-grid");
    container.innerHTML = schoolData.sports.map(sport => `
        <div class="card">
            <div>
                <span class="card-tag"><i class="fas fa-medal"></i> School Athletics</span>
                <h3>${sport.name}</h3><p>${sport.desc}</p>
                <div class="join-box"><strong><i class="fas fa-running"></i> How to Join:</strong><br>${sport.howToJoin}</div>
            </div>
            <div>
                <div class="card-meta"><i class="fas fa-user-tie"></i> <strong>Coach / MIC:</strong> ${sport.coach}</div>
                ${isAdminLoggedIn ? `<button class="delete-btn" onclick="deleteItem('sports', ${sport.id})"><i class="fas fa-trash"></i> Remove Sport</button>` : ""}
            </div>
        </div>
    `).join("");
}

function renderStaff() {
    const container = document.getElementById("staff-grid");
    container.innerHTML = schoolData.staff.map(member => `
        <div class="card">
            <div class="staff-card-header">
                <img src="${member.img || 'default-user.png'}" alt="${member.name}" class="staff-img" onerror="this.style.display='none'">
                <span class="card-tag">${member.role}</span>
                <h3>${member.name}</h3>
                <p><i class="fas fa-book-open"></i> ${member.subject}</p>
            </div>
            ${isAdminLoggedIn ? `<div><button class="delete-btn" onclick="deleteItem('staff', ${member.id})"><i class="fas fa-trash"></i> Remove Teacher</button></div>` : ""}
        </div>
    `).join("");
}

// ================= ADMIN FUNCTIONS =================
function loginAdmin() {
    const pass = document.getElementById("admin-password").value;
    if (pass === "admin123") {
        isAdminLoggedIn = true;
        document.getElementById("admin-login-box").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        
        // Auto-fill text fields for Principal and Stats
        if (schoolData.stats) {
            document.getElementById("admin-students").value = schoolData.stats.students;
            document.getElementById("admin-staff").value = schoolData.stats.staff;
        }
        if (schoolData.principal) {
            document.getElementById("admin-prin-name").value = schoolData.principal.name;
            document.getElementById("admin-prin-title").value = schoolData.principal.title;
            document.getElementById("admin-prin-message").value = schoolData.principal.message;
        }

        renderAll();
        alert("Logged in! You can now manage all school content.");
    } else {
        alert("Incorrect password! Try: admin123");
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById("admin-login-box").style.display = "block";
    document.getElementById("admin-dashboard").style.display = "none";
    renderAll();
}

function addNewsItem(e) {
    e.preventDefault();
    schoolData.news.unshift({
        id: Date.now(),
        title: document.getElementById("news-title").value,
        category: document.getElementById("news-category").value,
        date: new Date().toISOString().split("T")[0],
        desc: document.getElementById("news-desc").value
    });
    saveData(); e.target.reset(); alert("Announcement published!");
}

function addClubItem(e) {
    e.preventDefault();
    schoolData.clubs.push({
        id: Date.now(),
        name: document.getElementById("club-name").value,
        teacher: document.getElementById("club-teacher").value,
        desc: document.getElementById("club-desc").value,
        howToJoin: document.getElementById("club-join").value
    });
    saveData(); e.target.reset(); alert("New Club added!");
}

function addSportItem(e) {
    e.preventDefault();
    schoolData.sports.push({
        id: Date.now(),
        name: document.getElementById("sport-name").value,
        coach: document.getElementById("sport-coach").value,
        desc: document.getElementById("sport-desc").value,
        howToJoin: document.getElementById("sport-join").value
    });
    saveData(); e.target.reset(); alert("New Sport added!");
}

// === Image Upload Logic for Staff ===
function addStaffItem(e) {
    e.preventDefault();
    const fileInput = document.getElementById("staff-img");
    
    const saveNewStaff = (imgData) => {
        schoolData.staff.push({
            id: Date.now(),
            name: document.getElementById("staff-name").value,
            role: document.getElementById("staff-role").value,
            subject: document.getElementById("staff-subject").value,
            img: imgData
        });
        saveData(); 
        e.target.reset(); 
        alert("Staff member and photo added!");
    };

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveNewStaff(event.target.result); // Save the image data
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveNewStaff(""); // Save without image
    }
}

// === Image Upload Logic for Principal ===
function updatePrincipalProfile(e) {
    e.preventDefault();
    const fileInput = document.getElementById("admin-prin-img");

    const savePrincipalUpdates = (imgData) => {
        schoolData.principal.name = document.getElementById("admin-prin-name").value;
        schoolData.principal.title = document.getElementById("admin-prin-title").value;
        schoolData.principal.message = document.getElementById("admin-prin-message").value;
        if (imgData) {
            schoolData.principal.img = imgData; // Only overwrite image if a new one was uploaded
        }
        saveData(); 
        e.target.reset();
        // Refill text fields
        document.getElementById("admin-prin-name").value = schoolData.principal.name;
        document.getElementById("admin-prin-title").value = schoolData.principal.title;
        document.getElementById("admin-prin-message").value = schoolData.principal.message;
        alert("Principal Profile updated successfully!");
    };

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            savePrincipalUpdates(event.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        savePrincipalUpdates(null); // Keep old image if no new one is chosen
    }
}

function updateSchoolStats(e) {
    e.preventDefault();
    schoolData.stats.students = document.getElementById("admin-students").value;
    schoolData.stats.staff = document.getElementById("admin-staff").value;
    saveData(); alert("School statistics updated!");
}

function deleteItem(type, id) {
    if (confirm("Are you sure you want to remove this?")) {
        schoolData[type] = schoolData[type].filter(item => item.id !== id);
        saveData();
    }
}

function handleContactSubmit(e) {
    e.preventDefault(); alert("Inquiry sent!"); e.target.reset();
}

document.addEventListener("DOMContentLoaded", renderAll);

function addVictoryItem(e) {
    e.preventDefault();
    const fileInput = document.getElementById("vic-img");
    
    const saveVictory = (imgData) => {
        schoolData.victories.push({
            id: Date.now(),
            title: document.getElementById("vic-title").value,
            category: document.getElementById("vic-category").value,
            desc: document.getElementById("vic-desc").value,
            img: imgData
        });
        saveData(); 
        e.target.reset(); 
        alert("Victory added successfully!");
    };

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveVictory(event.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveVictory(""); 
    }
}


function renderVictories() {
    const sportsContainer = document.getElementById("sports-victories-list");
    const clubsContainer = document.getElementById("clubs-victories-list");
    
    let sportsHTML = "";
    let clubsHTML = "";

    schoolData.victories.forEach(vic => {
        const vicCard = `
        <div class="principal-card" style="padding: 25px; margin-bottom: 25px; align-items: flex-start;">
            <img src="${vic.img}" alt="${vic.title}" style="width: 250px; height: 250px; object-fit: cover; border-radius: 12px;" onerror="this.style.display='none'">
            <div class="principal-info" style="width: 100%;">
                <h3 style="font-size: 1.8rem; margin-bottom: 5px;">${vic.title}</h3>
                <h4 style="color: var(--secondary); font-size: 1rem; margin-bottom: 15px;">${vic.category} Achievement</h4>
                <p style="font-size: 1rem; color: #475569;">${vic.desc}</p>
                ${isAdminLoggedIn ? `<button class="delete-btn" style="margin-top: 20px;" onclick="deleteItem('victories', ${vic.id})"><i class="fas fa-trash"></i> Delete Victory</button>` : ""}
            </div>
        </div>`;

        if (vic.category === "Sport") sportsHTML += vicCard;
        else clubsHTML += vicCard;
    });

    if (sportsContainer) sportsContainer.innerHTML = sportsHTML || "<p style='padding: 20px; color: #64748b;'>No sports victories added yet.</p>";
    if (clubsContainer) clubsContainer.innerHTML = clubsHTML || "<p style='padding: 20px; color: #64748b;'>No club achievements added yet.</p>";
}

function renderHomeLatestVictory() {
    const container = document.getElementById("home-latest-victory");
    const section = document.getElementById("home-victory-section");
    
    // ජයග්‍රහණ කිසිවක් නැත්නම් මෙම කොටස මුල් පිටුවෙන් සඟවා තබයි
    if (!schoolData.victories || schoolData.victories.length === 0) {
        if(section) section.style.display = "none";
        return;
    }

    if(section) section.style.display = "block";
    
    // අවසානයටම ඇතුළත් කළ (නවතම) ජයග්‍රහණය තෝරාගැනීම
    const latestVic = schoolData.victories[schoolData.victories.length - 1];

    if(container) {
        container.innerHTML = `
        <div class="principal-card" style="padding: 25px; align-items: flex-start; margin-top: 0;">
            <img src="${latestVic.img}" alt="${latestVic.title}" style="width: 250px; height: 250px; object-fit: cover; border-radius: 12px;" onerror="this.style.display='none'">
            <div class="principal-info" style="width: 100%;">
                <h3 style="font-size: 1.8rem; margin-bottom: 5px;">${latestVic.title}</h3>
                <h4 style="color: var(--secondary); font-size: 1rem; margin-bottom: 15px;">${latestVic.category} Achievement</h4>
                <p style="font-size: 1rem; color: #475569;">${latestVic.desc}</p>
            </div>
        </div>`;
    }
}

// Admin Account Settings - Username & Password Update Function
function updateAdminCredentials(e) {
    e.preventDefault();
    const newUser = document.getElementById("new-admin-user").value.trim();
    const newPass = document.getElementById("new-admin-pass").value.trim();

    if (newUser === "" || newPass === "") {
        alert("Please enter both username and password!");
        return;
    }

    localStorage.setItem("adminCredentials", JSON.stringify({ user: newUser, pass: newPass }));
    
    alert("Admin username and password updated successfully! Please log in again with your new details.");
    logoutAdmin();
}