const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-item');
const topTabs = document.querySelectorAll('.top-tab');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
    
    topTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('href') === `#${current}`) {
            tab.classList.add('active');
        }
    });
});

const countDownDate = new Date("March 25, 2026 10:30:00").getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const dEl = document.getElementById("days");
    if(dEl) {
        dEl.innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }
};

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById('registrationForm');
if(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        
        btn.innerText = "PROCESSING...";
        btn.disabled = true;

        try {
            // Collect main form data
            const payload = {
                leaderName: document.getElementById('leaderName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                college: document.getElementById('college').value,
                teamName: document.getElementById('teamName').value,
                problemStatement: document.getElementById('problemStatement').value,
                proposedSolution: document.getElementById('proposedSolution').value,
                teamSize: parseInt(document.getElementById('teamSize').value),
                members: []
            };

            // Collect dynamic team members data
            const memberInputs = document.querySelectorAll('.member-input-group');
            memberInputs.forEach(group => {
                const inputs = group.querySelectorAll('input');
                if (inputs.length === 3) {
                    payload.members.push({
                        name: inputs[0].value,
                        email: inputs[1].value,
                        phone: inputs[2].value
                    });
                }
            });

            // Send to Google Sheets Data Base ONLY
            const googleScriptURL = 'https://script.google.com/macros/s/AKfycbyI8tyKxhvzIDPFqxXc0m9B5-nvA7gDbwRfuDGMB5GMyCkwAcZ-F1t_pE74D9QpqyDwVQ/exec'; 
            
            const response = await fetch(googleScriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            });

            // With 'no-cors' mode, the response is opaque and response.ok is false by default.
            // As long as fetch doesn't throw a network error, we can assume it was sent successfully.
            btn.innerText = "SUCCESSFUL";
            btn.style.borderColor = "#5effff";
            btn.style.color = "#5effff";
            form.reset();
            document.getElementById('dynamic-team-members').innerHTML = '';

        } catch (error) {
            console.error(error);
            btn.innerText = "ERROR - TRY AGAIN";
            btn.style.borderColor = "#ff4444";
            btn.style.color = "#ff4444";
        } finally {
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.borderColor = "";
                btn.style.color = "";
                btn.disabled = false;
            }, 3000);
        }
    });
}

// FAQ Accordion Logic
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        // Toggle active class on clicked item
        item.classList.toggle('active');
        
        /*
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        */
    });
});

// Dynamic Team Members Logic
const teamSizeSelect = document.getElementById('teamSize');
const membersContainer = document.getElementById('dynamic-team-members');

if(teamSizeSelect && membersContainer) {
    teamSizeSelect.addEventListener('change', (e) => {
        const size = parseInt(e.target.value);
        membersContainer.innerHTML = '';
        
        // Loop from 2 up to the selected size (since Team Leader is member 1)
        for(let i=2; i<=size; i++) {
            membersContainer.innerHTML += `
                <div class="member-input-group p-3" style="border-left: 2px solid var(--accent); background: rgba(0,0,0,0.2);">
                    <p class="cyber-text" style="font-size: 0.8rem; margin-bottom: 10px;">TEAM MEMBER ${i}</p>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <input type="text" placeholder="NAME" required>
                        <input type="email" placeholder="EMAIL" required>
                        <input type="tel" placeholder="PHONE" required>
                    </div>
                </div>
            `;
        }
    });
}
