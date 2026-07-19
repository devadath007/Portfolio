// --- STATE RENDERING LOGIC ---
function renderContent() {
    const data = window.portfolioManager.getData();

    // Hero
    document.getElementById('render-hero-name').textContent = data.hero.name;
    document.getElementById('render-hero-tagline').textContent = data.hero.tagline;
    document.getElementById('render-hero-desc').textContent = data.hero.description;
    
    const heroImgWrapper = document.getElementById('render-hero-image');
    if (heroImgWrapper) {
        if (data.hero.imageUrl) {
            heroImgWrapper.innerHTML = `<img src="${data.hero.imageUrl}" alt="Profile Picture" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            heroImgWrapper.innerHTML = `
                <div class="profile-placeholder">
                    <i data-lucide="user" class="placeholder-icon"></i>
                </div>
            `;
        }
    }

    // About
    document.getElementById('render-about-bio').textContent = data.about.bio;

    // Projects
    const projectsContainer = document.getElementById('render-projects-container');
    projectsContainer.innerHTML = '';
    data.projects.forEach(p => {
        const card = `
            <div class="card-new" data-id="${p.id}">
                <div class="admin-actions-overlay">
                    <button class="admin-edit-item-btn" onclick="editItem('projects', ${p.id})">Edit</button>
                    <button class="admin-delete-btn" onclick="deleteItem('projects', ${p.id})">Delete</button>
                </div>
                <div class="card-img-wrapper">
                    <img src="${p.imageUrl}" alt="${p.title}">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${p.title}</h3>
                    </div>
                    <div class="card-desc-container">
                        <p class="card-desc">${p.description}</p>
                    </div>
                </div>
            </div>
        `;
        projectsContainer.innerHTML += card;
    });

    // Certifications
    const certsContainer = document.getElementById('render-certs-container');
    certsContainer.innerHTML = '';
    data.certifications.forEach(c => {
        const card = `
            <div class="card-new" data-id="${c.id}">
                <div class="admin-actions-overlay">
                    <button class="admin-edit-item-btn" onclick="editItem('certifications', ${c.id})">Edit</button>
                    <button class="admin-delete-btn" onclick="deleteItem('certifications', ${c.id})">Delete</button>
                </div>
                <div class="card-img-wrapper cert-card-img-wrapper">
                    <img src="${c.imageUrl}" alt="${c.title}">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${c.title}</h3>
                    </div>
                    <div class="card-desc-container">
                        <p class="card-desc">${c.description}</p>
                    </div>
                </div>
            </div>
        `;
        certsContainer.innerHTML += card;
    });

    // Skills
    const skillsContainer = document.getElementById('render-skills-container');
    skillsContainer.innerHTML = '';
    
    data.skills.forEach((s, index) => {
        const delay = index * 0.1; // Staggered delay for each card
        const card = `
            <div class="skill-card" data-id="${s.id}" style="animation-delay: ${delay}s;">
                <div class="admin-actions-overlay">
                    <button class="admin-edit-btn" onclick="editItem('skills', ${s.id})" style="position:static; margin-bottom:5px;">Edit</button>
                    <button class="admin-delete-btn" onclick="deleteItem('skills', ${s.id})" style="position:static;">Delete</button>
                </div>
                <img src="${s.imageUrl}" alt="${s.name}" class="skill-icon-img">
                <h4>${s.name}</h4>
                <p>${s.label}</p>
            </div>
        `;
        skillsContainer.innerHTML += card;
    });

    // Contact & Footer
    document.getElementById('render-contact-email').querySelector('span').textContent = data.contact.email;
    document.getElementById('render-contact-email').href = `mailto:${data.contact.email}`;
    document.getElementById('render-contact-github').href = data.contact.github;
    document.getElementById('render-contact-linkedin').href = data.contact.linkedin;

    // Re-initialize icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Removed toggleCard function as we now use CSS hover

// --- CUSTOM PROMPT MODAL LOGIC (Handles File Uploads to Base64) ---
function openCustomPrompt(options, callback) {
    const modal = document.getElementById('custom-prompt-modal');
    document.getElementById('custom-prompt-title').textContent = options.title || "Add Item";
    
    const form = document.getElementById('custom-prompt-form');
    // Clone first so we can manipulate the new instance's properties
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Group 1
    const g1 = newForm.querySelector('#prompt-group-1');
    const i1 = newForm.querySelector('#prompt-input-1');
    if (options.label1) {
        g1.style.display = 'flex';
        newForm.querySelector('#prompt-label-1').textContent = options.label1;
        i1.value = options.val1 || '';
        i1.required = true;
    } else {
        g1.style.display = 'none';
        i1.required = false;
    }
    
    // Group 2
    const g2 = newForm.querySelector('#prompt-group-2');
    const i2 = newForm.querySelector('#prompt-input-2');
    if (options.label2) {
        g2.style.display = 'flex';
        newForm.querySelector('#prompt-label-2').textContent = options.label2;
        i2.value = options.val2 || '';
        i2.required = false;
    } else {
        g2.style.display = 'none';
        i2.required = false;
    }
    
    // Group 3
    const g3 = newForm.querySelector('#prompt-group-3');
    const i3 = newForm.querySelector('#prompt-input-3');
    if (options.label3) {
        g3.style.display = 'flex';
        newForm.querySelector('#prompt-label-3').textContent = options.label3;
        i3.value = options.val3 || '';
        i3.required = false;
    } else {
        g3.style.display = 'none';
        i3.required = false;
    }

    // File Upload Group
    const gFile = newForm.querySelector('#prompt-group-file');
    const iFile = newForm.querySelector('#prompt-input-file');
    if (options.showFileUpload) {
        gFile.style.display = 'block';
        iFile.value = '';
    } else {
        gFile.style.display = 'none';
    }

    modal.style.display = 'flex';

    // Close button
    document.getElementById('close-prompt-btn').onclick = () => {
        modal.style.display = 'none';
    };

    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const val1 = i1.value;
        const val2 = i2.value;
        const val3 = i3.value;
        
        // Handle file upload if present
        if (options.showFileUpload && iFile.files && iFile.files[0]) {
            const file = iFile.files[0];
            const reader = new FileReader();
            reader.onload = function(evt) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > MAX_WIDTH) {
                        height = Math.floor(height * (MAX_WIDTH / width));
                        width = MAX_WIDTH;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 0.7 quality to save space
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    
                    modal.style.display = 'none';
                    callback(val1, val2, compressedBase64); // Override val3 with file
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            modal.style.display = 'none';
            callback(val1, val2, val3);
        }
    });
}


// --- ADMIN IN-PLACE EDITING LOGIC ---
let isAdminMode = false;

function toggleAdminMode(enable) {
    isAdminMode = enable;
    if (enable) {
        document.body.classList.add('admin-active');
        document.getElementById('admin-save-bar').style.display = 'flex';
        
        // Enable drag and drop sorting for skills
        const skillsContainer = document.getElementById('render-skills-container');
        if (skillsContainer && window.Sortable) {
            window.skillsSortable = new Sortable(skillsContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    const data = window.portfolioManager.getData();
                    // Reorder the array based on oldIndex and newIndex
                    const movedItem = data.skills.splice(evt.oldIndex, 1)[0];
                    data.skills.splice(evt.newIndex, 0, movedItem);
                    window.portfolioManager.saveData(data);
                }
            });
        }
        
        // Show inline add buttons
        document.querySelectorAll('.admin-add-btn').forEach(btn => btn.style.display = 'inline-block');
        
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) editProfileBtn.style.display = 'flex';
        
        const editContactBtn = document.getElementById('edit-contact-btn');
        if (editContactBtn) editContactBtn.style.display = 'inline-block';

        // Make text editable
        document.querySelectorAll('.editable-text').forEach(el => {
            el.setAttribute('contenteditable', 'true');
            // Prevent Enter from creating new lines in single-line elements
            el.addEventListener('keydown', (e) => {
                if(e.key === 'Enter' && el.tagName !== 'P' && el.tagName !== 'DIV') {
                    e.preventDefault();
                    el.blur();
                }
            });
        });
    } else {
        document.body.classList.remove('admin-active');
        document.getElementById('admin-save-bar').style.display = 'none';
        
        // Disable sorting
        if (window.skillsSortable) {
            window.skillsSortable.destroy();
            window.skillsSortable = null;
        }
        
        document.querySelectorAll('.admin-add-btn').forEach(btn => btn.style.display = 'none');
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) editProfileBtn.style.display = 'none';
        
        const editContactBtn = document.getElementById('edit-contact-btn');
        if (editContactBtn) editContactBtn.style.display = 'none';
        document.querySelectorAll('.editable-text').forEach(el => {
            el.setAttribute('contenteditable', 'false');
        });
    }
}

// Global function for inline delete
window.deleteItem = function(collection, id) {
    if(!isAdminMode) return;
    if(confirm('Are you sure you want to delete this item?')) {
        const data = window.portfolioManager.getData();
        data[collection] = data[collection].filter(item => item.id !== id);
        window.portfolioManager.saveData(data);
        renderContent();
    }
};

// Global function for inline edit
window.editItem = function(collection, id) {
    if(!isAdminMode) return;
    const data = window.portfolioManager.getData();
    const item = data[collection].find(i => i.id === id);
    if(!item) return;

    if (collection === 'skills') {
        openCustomPrompt({
            title: "Edit Skill",
            label1: "Skill Name",
            val1: item.name,
            label2: "Label",
            val2: item.label,
            label3: "Image URL",
            val3: item.imageUrl || item.iconClass,
            showFileUpload: true
        }, (name, label, img) => {
            if(!name) return;
            item.name = name;
            item.label = label || "Skill";
            item.imageUrl = img || "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg";
            window.portfolioManager.saveData(data);
            renderContent();
        });
        return;
    }

    if (collection === 'projects' || collection === 'certifications') {
        openCustomPrompt({
            title: `Edit ${collection === 'projects' ? 'Project' : 'Certification'}`,
            label1: "Title",
            val1: item.title,
            label2: "Description",
            val2: item.description,
            label3: "Image URL",
            val3: item.imageUrl,
            showFileUpload: true
        }, (title, desc, img) => {
            if(!title) return;
            item.title = title;
            item.description = desc;
            if(img) item.imageUrl = img;
            window.portfolioManager.saveData(data);
            renderContent();
        });
    }
};

function initAdminLogic() {
    // Hidden Trigger Login
    let clickCount = 0;
    let clickTimer;
    
    document.getElementById('secret-trigger').addEventListener('click', (e) => {
        e.preventDefault();
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
        
        if (clickCount >= 3) {
            document.getElementById('login-modal').style.display = 'flex';
            clickCount = 0;
        }
    });

    document.getElementById('close-login-btn').addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'none';
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        
        if (user === 'admin' && pass === 'admin123') {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('login-error').style.display = 'none';
            toggleAdminMode(true);
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });

    // Save Bar Logic
    document.getElementById('inline-exit-btn').addEventListener('click', () => {
        // Re-render from saved state to discard unsaved inline edits
        renderContent();
        toggleAdminMode(false);
    });

    document.getElementById('inline-save-btn').addEventListener('click', () => {
        const data = window.portfolioManager.getData();
        
        // Harvest inline text edits
        document.querySelectorAll('.editable-text').forEach(el => {
            const keys = el.getAttribute('data-key').split('.'); // e.g. hero.name
            if (keys.length === 2) {
                data[keys[0]][keys[1]] = el.textContent;
            }
        });

        window.portfolioManager.saveData(data);
        
        const btn = document.getElementById('inline-save-btn');
        btn.textContent = "Saved!";
        setTimeout(() => { btn.textContent = "Save Changes"; }, 2000);
    });

    // Inline Add Buttons
    document.getElementById('add-project-btn').addEventListener('click', () => {
        openCustomPrompt({
            title: "Add Project",
            label1: "Project Title",
            label2: "Description",
            label3: "Image URL",
            showFileUpload: true
        }, (title, desc, img) => {
            if(!title) return;
            const data = window.portfolioManager.getData();
            data.projects.push({
                id: Date.now(),
                title: title,
                description: desc || "",
                imageUrl: img || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80"
            });
            window.portfolioManager.saveData(data);
            renderContent();
        });
    });

    document.getElementById('add-cert-btn').addEventListener('click', () => {
        openCustomPrompt({
            title: "Add Certification",
            label1: "Certification Title",
            label2: "Description",
            label3: "Image URL",
            showFileUpload: true
        }, (title, desc, img) => {
            if(!title) return;
            const data = window.portfolioManager.getData();
            data.certifications.push({
                id: Date.now(),
                title: title,
                description: desc || "",
                imageUrl: img || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"
            });
            window.portfolioManager.saveData(data);
            renderContent();
        });
    });

    document.getElementById('add-skill-btn').addEventListener('click', () => {
        openCustomPrompt({
            title: "Add Skill",
            label1: "Skill Name (e.g. React)",
            label2: "Label (e.g. Frontend)",
            label3: "Image URL (e.g. Devicon link)",
            showFileUpload: true
        }, (name, label, img) => {
            if(!name) return;
            const data = window.portfolioManager.getData();
            data.skills.push({
                id: Date.now(),
                name: name,
                label: label || "Skill",
                imageUrl: img || "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg"
            });
            window.portfolioManager.saveData(data);
            renderContent();
        });
    });

    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            openCustomPrompt({
                title: "Change Profile Picture",
                label1: "Profile Image URL",
                showFileUpload: true
            }, (urlOrBase64, _, base64Override) => {
                const finalImg = base64Override || urlOrBase64;
                if (finalImg) {
                    const data = window.portfolioManager.getData();
                    data.hero.imageUrl = finalImg;
                    window.portfolioManager.saveData(data);
                    renderContent();
                }
            });
        });
    }

    const editContactBtn = document.getElementById('edit-contact-btn');
    if (editContactBtn) {
        editContactBtn.addEventListener('click', () => {
            const data = window.portfolioManager.getData();
            openCustomPrompt({
                title: "Edit Contact Links",
                label1: "Email Address",
                val1: data.contact.email,
                label2: "GitHub URL",
                val2: data.contact.github,
                label3: "LinkedIn URL",
                val3: data.contact.linkedin,
                showFileUpload: false
            }, (email, github, linkedin) => {
                if(!email) return;
                data.contact.email = email;
                data.contact.github = github || "#";
                data.contact.linkedin = linkedin || "#";
                window.portfolioManager.saveData(data);
                renderContent();
            });
        });
    }
}

// --- STANDARD UI LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    initAdminLogic();

    document.getElementById('year').textContent = new Date().getFullYear();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.add('active');
            mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
        } else {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        }
        if(window.lucide) window.lucide.createIcons();
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 24px';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.padding = '20px 24px';
            navbar.style.boxShadow = 'none';
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));
});
