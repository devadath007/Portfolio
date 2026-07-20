import { portfolioManager } from './data.js?v=4';

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
                        ${p.githubUrl ? `
                            <div style="margin-top: 12px; display: flex; justify-content: flex-start;">
                                <a href="${p.githubUrl}" target="_blank" class="github-link" title="View Repository">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /></svg>
                                </a>
                            </div>
                        ` : ''}
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
                    ${(c.externalUrl || c.documentData) ? `
                        <div class="card-footer">
                            <a href="${c.externalUrl || c.documentData}" target="_blank" class="view-doc-btn">
                                <i data-lucide="external-link"></i> View Credential
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        certsContainer.innerHTML += card;
    });

    // Skills
    const skillsContainer = document.getElementById('render-skills-container');
    skillsContainer.innerHTML = '';
    
    data.skills.forEach((s, index) => {
        const delay = Math.min(index * 0.05, 0.4); // Faster staggered delay, capped at 0.4s
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
    document.getElementById('custom-prompt-title').textContent = options.title || "Edit Item";
    
    const form = document.getElementById('custom-prompt-form');
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    const g1 = newForm.querySelector('#prompt-group-1');
    const i1 = newForm.querySelector('#prompt-input-1');
    if (options.label1) {
        g1.style.display = 'block';
        i1.placeholder = options.label1;
        i1.value = options.val1 || '';
        i1.required = true;
    } else { g1.style.display = 'none'; i1.required = false; }
    
    const g2 = newForm.querySelector('#prompt-group-2');
    const i2 = newForm.querySelector('#prompt-input-2');
    if (options.label2) {
        g2.style.display = 'block';
        i2.placeholder = options.label2;
        i2.value = options.val2 || '';
        i2.required = false;
    } else { g2.style.display = 'none'; i2.required = false; }
    
    const gImg = newForm.querySelector('#prompt-group-image');
    const iImgUrl = newForm.querySelector('#prompt-input-image-url');
    const iImgFile = newForm.querySelector('#prompt-input-image-file');
    if (options.showFileUpload || options.label3) {
        gImg.style.display = 'block';
        if (options.label3) gImg.querySelector('.modal-label').textContent = options.label3;
        iImgUrl.value = options.val3 || '';
    } else { gImg.style.display = 'none'; }

    // Link / Document
    const gDoc = newForm.querySelector('#prompt-group-document');
    const iExtUrl = newForm.querySelector('#prompt-input-external-url');
    const iDocFile = newForm.querySelector('#prompt-input-document-file');
    const docStatus = newForm.querySelector('#document-status');
    const docFilename = newForm.querySelector('#doc-filename');
    const removeDocBtn = newForm.querySelector('#remove-doc-btn');
    
    let uploadedDocData = options.documentData || null;

    if (options.showDocument) {
        gDoc.style.display = 'block';
        iExtUrl.value = options.externalUrlVal || '';
        if (uploadedDocData) {
            docStatus.style.display = 'flex';
            docFilename.textContent = "Previously uploaded document";
        }
        iDocFile.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                if (file.size > 300 * 1024) {
                    alert("File is too large! Maximum 300KB allowed to protect the database.");
                    e.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    uploadedDocData = evt.target.result;
                    docStatus.style.display = 'flex';
                    docFilename.textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        });
        removeDocBtn.addEventListener('click', () => {
            uploadedDocData = null;
            iDocFile.value = '';
            docStatus.style.display = 'none';
        });
    } else { gDoc.style.display = 'none'; }

    // GitHub
    const gGit = newForm.querySelector('#prompt-group-github');
    const iGit = newForm.querySelector('#prompt-input-github');
    if (options.showGithub) {
        gGit.style.display = 'block';
        iGit.value = options.githubVal || '';
    } else { gGit.style.display = 'none'; }

    modal.style.display = 'flex';

    newForm.querySelector('#cancel-prompt-btn').onclick = () => { modal.style.display = 'none'; };

    newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val1 = i1.value;
        const val2 = i2.value;
        const externalUrl = iExtUrl.value;
        const githubUrl = iGit.value;
        
        const finalize = (finalImgVal) => {
            modal.style.display = 'none';
            callback(val1, val2, finalImgVal, externalUrl, uploadedDocData, githubUrl);
        };
        
        if (gImg.style.display !== 'none' && iImgFile.files && iImgFile.files[0]) {
            const file = iImgFile.files[0];
            const reader = new FileReader();
            reader.onload = function(evt) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) { height = Math.floor(height * (MAX_WIDTH / width)); width = MAX_WIDTH; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    finalize(canvas.toDataURL('image/png'));
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            finalize(iImgUrl.value);
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

        // Enable drag and drop sorting for certifications
        const certsContainer = document.getElementById('render-certs-container');
        if (certsContainer && window.Sortable) {
            window.certsSortable = new Sortable(certsContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    const data = window.portfolioManager.getData();
                    const movedItem = data.certifications.splice(evt.oldIndex, 1)[0];
                    data.certifications.splice(evt.newIndex, 0, movedItem);
                    window.portfolioManager.saveData(data);
                }
            });
        }

        // Enable drag and drop sorting for projects
        const projectsContainer = document.getElementById('render-projects-container');
        if (projectsContainer && window.Sortable) {
            window.projectsSortable = new Sortable(projectsContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: function (evt) {
                    const data = window.portfolioManager.getData();
                    const movedItem = data.projects.splice(evt.oldIndex, 1)[0];
                    data.projects.splice(evt.newIndex, 0, movedItem);
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
        if (window.certsSortable) {
            window.certsSortable.destroy();
            window.certsSortable = null;
        }
        if (window.projectsSortable) {
            window.projectsSortable.destroy();
            window.projectsSortable = null;
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
            showFileUpload: true,
            showGithub: collection === 'projects',
            githubVal: item.githubUrl,
            showDocument: collection === 'certifications',
            externalUrlVal: item.externalUrl,
            documentData: item.documentData
        }, (title, desc, img, extUrl, docData, gitUrl) => {
            if(!title) return;
            const data = window.portfolioManager.getData();
            const targetItem = data[collection].find(i => i.id === id);
            if (targetItem) {
                targetItem.title = title;
                targetItem.description = desc;
                if(img) targetItem.imageUrl = img;
                if (collection === 'projects') {
                    targetItem.githubUrl = gitUrl;
                } else if (collection === 'certifications') {
                    targetItem.externalUrl = extUrl;
                    targetItem.documentData = docData;
                }
                window.portfolioManager.saveData(data);
                renderContent();
            }
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
            showFileUpload: true,
            showGithub: true
        }, (title, desc, img, extUrl, docData, gitUrl) => {
            if(!title) return;
            const data = window.portfolioManager.getData();
            data.projects.push({
                id: Date.now(),
                title: title,
                description: desc,
                imageUrl: img || "",
                githubUrl: gitUrl || ""
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
            showFileUpload: true,
            showDocument: true
        }, (title, desc, img, extUrl, docData) => {
            if(!title) return;
            const data = window.portfolioManager.getData();
            data.certifications.push({
                id: Date.now(),
                title: title,
                description: desc,
                imageUrl: img || "",
                externalUrl: extUrl || "",
                documentData: docData || null
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
async function bootstrap() {
    await portfolioManager.init();
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
