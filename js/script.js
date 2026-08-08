document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Logic
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            }
        });
    }

    // 2. Dynamic Booking Modal Creation
    if (!document.getElementById('booking-modal')) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const modalHTML = `
        <div class="booking-modal-overlay" id="booking-modal">
            <div class="booking-modal-container">
                <button class="booking-modal-close" id="close-booking-modal">&times;</button>
                
                <div class="booking-modal-header" id="modal-header-section">
                    <h3>Book Your Stay at <span>Royal Haven</span></h3>
                    <p>Experience luxury beyond expectations</p>
                </div>

                <form class="booking-modal-form" id="booking-modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label><i class="fa-solid fa-calendar-days"></i> Check-in Date</label>
                            <input type="date" required id="check-in-date" value="${todayStr}" min="${todayStr}">
                        </div>
                        <div class="form-group">
                            <label><i class="fa-solid fa-calendar-days"></i> Check-out Date</label>
                            <input type="date" required id="check-out-date" value="${tomorrowStr}" min="${tomorrowStr}">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label><i class="fa-solid fa-bed"></i> Room Type / Service</label>
                            <select required id="room-type">
                                <option value="Deluxe Suite">Deluxe Suite ($250 / night)</option>
                                <option value="Executive Suite">Executive Suite ($450 / night)</option>
                                <option value="Royal Suite" selected>Royal Suite ($750 / night)</option>
                                <option value="Presidential Suite">Presidential Suite ($1,200 / night)</option>
                                <option value="Fine Dining Reservation">Fine Dining Reservation</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label><i class="fa-solid fa-user-group"></i> Guests</label>
                            <select required id="guest-count">
                                <option value="1 Guest">1 Guest</option>
                                <option value="2 Guests" selected>2 Guests</option>
                                <option value="3 Guests">3 Guests</option>
                                <option value="4+ Guests">4+ Guests</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label><i class="fa-solid fa-user"></i> Full Name</label>
                            <input type="text" placeholder="Enter your full name" required id="guest-name">
                        </div>
                        <div class="form-group">
                            <label><i class="fa-solid fa-envelope"></i> Email Address</label>
                            <input type="email" placeholder="name@example.com" required id="guest-email">
                        </div>
                    </div>

                    <button type="submit" class="modal-submit-btn">Confirm Reservation <i class="fa-solid fa-arrow-right"></i></button>
                </form>

                <div class="booking-success-message" id="booking-success" style="display: none;">
                    <div class="success-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <h3>Reservation Confirmed!</h3>
                    <p>Thank you, <strong id="success-name">Guest</strong>! Your reservation for <strong id="success-room">Royal Suite</strong> has been successfully received.</p>
                    <p class="sub-text">A confirmation email has been sent to <span id="success-email"></span>.</p>
                    <button class="modal-submit-btn" id="close-success-btn">Done</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Modal Control Functions
    const modal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-booking-modal');
    const bookingForm = document.getElementById('booking-modal-form');
    const modalHeader = document.getElementById('modal-header-section');
    const bookingSuccess = document.getElementById('booking-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    const openModal = (roomName = '') => {
        if (modal) {
            modal.classList.add('active');
            if (bookingForm) bookingForm.style.display = 'flex';
            if (modalHeader) modalHeader.style.display = 'block';
            if (bookingSuccess) bookingSuccess.style.display = 'none';

            if (roomName) {
                const roomSelect = document.getElementById('room-type');
                if (roomSelect) {
                    for (let option of roomSelect.options) {
                        if (option.value.toLowerCase().includes(roomName.toLowerCase())) {
                            option.selected = true;
                            break;
                        }
                    }
                }
            }
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
        }
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Bind all "Book Now", "Book Your Table" buttons across all pages
    const bookButtons = document.querySelectorAll('.btn, .cta-btn, .outline-btn, a, button');
    bookButtons.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes('book now') || text.includes('book your table')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Extract room name if inside a room card
                const roomCard = btn.closest('.room-card');
                let roomName = '';
                if (roomCard) {
                    const titleElem = roomCard.querySelector('h3');
                    if (titleElem) roomName = titleElem.textContent.trim();
                } else if (text.includes('book your table')) {
                    roomName = 'Fine Dining Reservation';
                }

                openModal(roomName);
            });
        }
    });

    // Booking Modal Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('guest-name').value;
            const email = document.getElementById('guest-email').value;
            const room = document.getElementById('room-type').value;

            document.getElementById('success-name').textContent = name;
            document.getElementById('success-room').textContent = room;
            document.getElementById('success-email').textContent = email;

            bookingForm.style.display = 'none';
            if (modalHeader) modalHeader.style.display = 'none';
            bookingSuccess.style.display = 'block';

            bookingForm.reset();
        });
    }

    // Home Page In-line Booking Form Handler
    const inlineBookingForm = document.querySelector('.booking-form');
    if (inlineBookingForm && !inlineBookingForm.classList.contains('booking-modal-form')) {
        inlineBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = inlineBookingForm.querySelector('input[type="text"]');
            const emailInput = inlineBookingForm.querySelector('input[type="email"]');
            const roomInput = inlineBookingForm.querySelector('select');
            
            openModal();

            document.getElementById('success-name').textContent = nameInput && nameInput.value ? nameInput.value : 'Valued Guest';
            document.getElementById('success-room').textContent = roomInput && roomInput.value ? roomInput.value : 'Royal Suite';
            document.getElementById('success-email').textContent = emailInput && emailInput.value ? emailInput.value : 'your email address';

            if (bookingForm) bookingForm.style.display = 'none';
            if (modalHeader) modalHeader.style.display = 'none';
            if (bookingSuccess) bookingSuccess.style.display = 'block';
        });
    }

    // 3. Contact Form Submission Handler (Send Message)
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = contactForm.querySelectorAll('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const messageInput = contactForm.querySelector('textarea');

            const name = inputs.length > 0 ? inputs[0].value.trim() : '';
            const subject = inputs.length > 1 ? inputs[1].value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            // Strict Validation: Only show success message if required fields are filled
            if (!name || !email || !subject || !message) {
                return;
            }

            const contactFormBox = contactForm.closest('.contact-form');
            if (contactFormBox) {
                contactForm.style.display = 'none';
                
                const oldCard = contactFormBox.querySelector('.contact-success-card');
                if (oldCard) oldCard.remove();

                const successCardHTML = `
                <div class="contact-success-card" style="text-align: center; padding: 40px 25px; background: #fafafa; border-radius: 12px; border-left: 5px solid #d4af37; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-top: 20px;">
                    <div style="font-size: 55px; color: #d4af37; margin-bottom: 15px;"><i class="fa-solid fa-paper-plane"></i></div>
                    <h3 style="font-size: 26px; color: #222; margin-bottom: 12px; font-weight: 700;">Message Sent Successfully!</h3>
                    <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 12px;">Thank you, <strong style="color: #222;">${name}</strong>! Your message regarding <strong style="color: #d4af37;">"${subject}"</strong> has been received by our management team.</p>
                    <p style="color: #777; font-size: 14px; margin-bottom: 25px;">A response will be sent to <span style="color: #d4af37; font-weight: 500;">${email}</span> as soon as possible.</p>
                    <button class="contact-btn" id="send-another-msg-btn" style="width: auto; padding: 12px 30px; height: auto; border-radius: 5px; background: #d4af37; color: #fff;">Send Another Message</button>
                </div>`;

                contactFormBox.insertAdjacentHTML('beforeend', successCardHTML);

                const sendAnotherBtn = document.getElementById('send-another-msg-btn');
                if (sendAnotherBtn) {
                    sendAnotherBtn.addEventListener('click', () => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        const newCard = contactFormBox.querySelector('.contact-success-card');
                        if (newCard) newCard.remove();
                    });
                }
            }
        });
    }

    // 4. Newsletter Form Handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'your email address';

            const container = newsletterForm.parentElement;
            if (container) {
                newsletterForm.style.display = 'none';

                const oldNewsCard = container.querySelector('.newsletter-success-card');
                if (oldNewsCard) oldNewsCard.remove();

                const newsSuccessHTML = `
                <div class="newsletter-success-card" style="text-align: center; padding: 25px 20px; background: rgba(255,255,255,0.08); border-radius: 10px; backdrop-filter: blur(10px);">
                    <div style="font-size: 40px; color: #d4af37; margin-bottom: 10px;"><i class="fa-solid fa-envelope-circle-check"></i></div>
                    <h3 style="font-size: 22px; color: #fff; margin-bottom: 8px;">Subscribed to Royal Haven Updates!</h3>
                    <p style="color: #ddd; font-size: 14px;">Thank you for subscribing. Premium offers and updates will be sent to <span style="color: #d4af37;">${email}</span>.</p>
                </div>`;

                container.insertAdjacentHTML('beforeend', newsSuccessHTML);
            }
        });
    }
});
