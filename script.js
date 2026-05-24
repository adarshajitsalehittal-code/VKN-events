// State
let currentUser = null;
let selectedEvent = null;
let bookings = [];
let currentBooking = null;

// Events Data
const events = [
    {
        id: 1,
        name: 'Birthday Celebration',
        emoji: '🎂',
        color: 'linear-gradient(135deg, #FF6B9D, #FF8FB1)',
        price: 15000,
        description: 'Make your birthday special with our premium decorations',
        locations: ['Mumbai', 'Delhi', 'Bangalore']
    },
    {
        id: 2,
        name: 'Wedding Ceremony',
        emoji: '💑',
        color: 'linear-gradient(135deg, #C850C0, #FFCC70)',
        price: 150000,
        description: 'Your dream wedding with royal decorations',
        locations: ['Mumbai', 'Delhi', 'Bangalore', 'Pune']
    },
    {
        id: 3,
        name: 'Haldi Ceremony',
        emoji: '🌼',
        color: 'linear-gradient(135deg, #FFD93D, #F6C555)',
        price: 25000,
        description: 'Traditional Haldi ceremony with vibrant decorations',
        locations: ['Mumbai', 'Delhi', 'Bangalore']
    },
    {
        id: 4,
        name: 'Anniversary',
        emoji: '💕',
        color: 'linear-gradient(135deg, #E91E63, #FF6B9D)',
        price: 20000,
        description: 'Celebrate your love with romantic decorations',
        locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']
    },
    {
        id: 5,
        name: 'Christmas Party',
        emoji: '🎄',
        color: 'linear-gradient(135deg, #D32F2F, #4CAF50)',
        price: 30000,
        description: 'Festive Christmas celebration with Santa',
        locations: ['Mumbai', 'Delhi', 'Bangalore']
    },
    {
        id: 6,
        name: 'Custom Event',
        emoji: '🎉',
        color: 'linear-gradient(135deg, #5E35B1, #7C3AED)',
        price: 0,
        description: 'Design your own custom event with our team',
        locations: ['All Cities']
    }
];

// Initialize
window.addEventListener('DOMContentLoaded', function () {
    renderEvents();
    setupEventListeners();
});

// Render Events
function renderEvents(searchTerm = '') {
    const grid = document.getElementById('eventsGrid');
    const filtered = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    grid.innerHTML = filtered.map(event => `
        <div class="event-card">
            <div class="event-image" style="background: ${event.color}">
                ${event.emoji}
            </div>
            <div class="event-card-content">
                <h3>${event.name}</h3>
                <p>${event.description}</p>
                <div style="color: #7c3aed; margin-bottom: 16px;">📍 ${event.locations.join(', ')}</div>
                ${event.price > 0 ? `<div class="event-price">₹${event.price.toLocaleString()}</div>` : ''}
                <button class="btn-book" onclick="bookEvent(${event.id})">Book Now</button>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Header buttons
    document.getElementById('loginBtn').addEventListener('click', () => showPage('loginPage'));
    document.getElementById('registerBtn').addEventListener('click', () => showPage('registerPage'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('adminBtn').addEventListener('click', () => showPage('adminPage'));

    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('loginBackBtn').addEventListener('click', () => showPage('homePage'));

    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('registerBackBtn').addEventListener('click', () => showPage('homePage'));

    // Booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('bookingBackBtn').addEventListener('click', () => showPage('homePage'));

    // Feedback form
    document.getElementById('feedbackForm').addEventListener('submit', handleFeedback);
    document.getElementById('feedbackBackBtn').addEventListener('click', () => showPage('homePage'));

    // Admin
    document.getElementById('adminBackBtn').addEventListener('click', () => showPage('homePage'));

    // Search
    document.getElementById('searchInput').addEventListener('input', function (e) {
        renderEvents(e.target.value);
    });
}

// Show Page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'loginPage' || pageId === 'registerPage' || pageId === 'bookingPage' || pageId === 'adminPage' || pageId === 'feedbackPage') {
        document.getElementById('header').classList.add('hidden');
    } else {
        document.getElementById('header').classList.remove('hidden');
    }

    if (pageId === 'adminPage') {
        updateAdminDashboard();
    }
}

// Update Header Auth
function updateHeaderAuth() {
    if (currentUser) {
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('registerBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        document.getElementById('userGreeting').classList.remove('hidden');
        document.getElementById('userGreeting').textContent = `Hi, ${currentUser.name}`;

        if (currentUser.isAdmin) {
            document.getElementById('adminBtn').classList.remove('hidden');
        }
    } else {
        document.getElementById('loginBtn').classList.remove('hidden');
        document.getElementById('registerBtn').classList.remove('hidden');
        document.getElementById('logoutBtn').classList.add('hidden');
        document.getElementById('userGreeting').classList.add('hidden');
        document.getElementById('adminBtn').classList.add('hidden');
    }
}

// Logout
function logout() {
    currentUser = null;
    updateHeaderAuth();
    showPage('homePage');
    alert('Logged out successfully!');
}

// Book Event
function bookEvent(eventId) {
    if (!currentUser) {
        alert('Please login first to book an event');
        showPage('loginPage');
        return;
    }

    selectedEvent = events.find(e => e.id === eventId);
    document.getElementById('bookingTitle').textContent = `Book ${selectedEvent.name}`;
    document.getElementById('totalPrice').textContent = `Total: ₹${selectedEvent.price.toLocaleString()}`;

    const locationSelect = document.getElementById('bookingLocation');
    locationSelect.innerHTML = '<option value="">Select location</option>' +
        selectedEvent.locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');

    showPage('bookingPage');
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Check for admin
    if (email === 'admin@vknevents.com' && password === 'admin123') {
        currentUser = { email, name: 'Admin', isAdmin: true };
        alert('Welcome Admin!');
        updateHeaderAuth();
        document.getElementById('loginForm').reset();
        showPage('adminPage');
    } else {
        currentUser = { email, name: email.split('@')[0], isAdmin: false };
        alert('Login successful! Welcome ' + currentUser.name);
        updateHeaderAuth();
        document.getElementById('loginForm').reset();
        showPage('homePage');
    }
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;

    if (!name || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }

    currentUser = { email, name, phone, isAdmin: false };
    alert('Registration successful! Welcome ' + name);
    updateHeaderAuth();
    document.getElementById('registerForm').reset();
    showPage('homePage');
}

// Handle Booking
function handleBooking(e) {
    e.preventDefault();
    
    const date = document.getElementById('bookingDate').value;
    const location = document.getElementById('bookingLocation').value;
    const guests = document.getElementById('bookingGuests').value;
    const custom = document.getElementById('bookingCustom').value.trim();

    if (!date || !location || !guests) {
        alert('Please fill in all required fields');
        return;
    }

    const bookingId = 'BK' + Date.now();
    
    currentBooking = {
        id: bookingId,
        event: selectedEvent.name,
        customer: currentUser.name,
        email: currentUser.email,
        date: date,
        location: location,
        guests: guests,
        amount: selectedEvent.price,
        custom: custom,
        status: 'Confirmed',
        bookedAt: new Date().toLocaleString()
    };

    bookings.push(currentBooking);

    // Show confirmation on feedback page
    document.getElementById('confirmBookingId').textContent = bookingId;
    document.getElementById('confirmEvent').textContent = selectedEvent.name;
    document.getElementById('confirmDate').textContent = new Date(date).toLocaleDateString();
    document.getElementById('confirmLocation').textContent = location;
    document.getElementById('confirmAmount').textContent = '₹' + selectedEvent.price.toLocaleString();

    document.getElementById('bookingForm').reset();
    showPage('feedbackPage');
}

// Handle Feedback
function handleFeedback(e) {
    e.preventDefault();
    
    const rating = document.getElementById('feedbackRating').value;
    const comment = document.getElementById('feedbackComment').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    // Add feedback to the booking
    if (currentBooking) {
        currentBooking.feedback = {
            rating: rating,
            comment: comment
        };
    }

    alert('Thank you for your feedback! We look forward to making your event special.');
    
    document.getElementById('feedbackForm').reset();
    showPage('homePage');
}

// Update Admin Dashboard
function updateAdminDashboard() {
    document.getElementById('totalBookings').textContent = bookings.length;

    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;

    // Count unique users
    const uniqueUsers = new Set(bookings.map(b => b.email)).size;
    document.getElementById('totalUsers').textContent = uniqueUsers;

    const tbody = document.getElementById('bookingsTable');
    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">No bookings yet</td></tr>';
    } else {
        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.event}</td>
                <td>${b.customer}<br><small style="color: #666;">${b.email}</small></td>
                <td>${new Date(b.date).toLocaleDateString()}</td>
                <td>${b.location}</td>
                <td>${b.guests}</td>
                <td>₹${b.amount.toLocaleString()}</td>
                <td><span class="status-badge">${b.status}</span></td>
            </tr>
        `).join('');
    }
}