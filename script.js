import { portfolioManager } from './data.js?v=10';

// --- STATE RENDERING LOGIC ---
const sectionTemplates = {
    'about': () => `
        <section id="about" class="about">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>About Me</h2>
                    <div class="header-line"></div>
                </div>
                <div class="about-content reveal" style="grid-template-columns: 1fr;">
                    <div class="about-text">
                        <p class="editable-text" id="render-about-bio" data-key="about.bio"></p>
                    </div>
                </div>
            </div>
        </section>`,
    'portfolio': () => `
        <section id="portfolio" class="portfolio">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>Featured Projects</h2>
                    <div class="header-line"></div>
                    <button class="admin-add-btn" id="add-project-btn" style="display:none;">+ Add Project</button>
                </div>
                <div class="projects-grid-new" id="render-projects-container"></div>
            </div>
        </section>`,
    'certs': () => `
        <section id="certs" class="certs">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>Experience & Certifications</h2>
                    <div class="header-line"></div>
                    <button class="admin-add-btn" id="add-cert-btn" style="display:none;">+ Add Cert</button>
                </div>
                <div class="cert-stack-wrapper reveal reveal-delay-1">
                    <div class="cert-stack-container" id="render-certs-container"></div>
                    <div class="cert-pagination" id="render-certs-pagination"></div>
                </div>
            </div>
        </section>`,
    'skills': () => `
        <section id="skills" class="skills">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>Technologies I work with</h2>
                    <div class="header-line"></div>
                    <button class="admin-add-btn" id="add-skill-btn" style="display:none;">+ Add Skill</button>
                </div>
                <div class="skills-grid-new" id="render-skills-container"></div>
            </div>
        </section>`,
    'contact': () => `
        <section id="contact" class="contact">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>Get In Touch</h2>
                    <div class="header-line"></div>
                    <button class="admin-edit-btn" id="edit-contact-btn" style="display:none;">Edit Contact Info</button>
                </div>
                <div class="contact-wrapper reveal">
                    <div class="contact-info">
                        <h3>Let's build something together.</h3>
                        <p>I'm currently looking for new opportunities and collaborations. Whether you have a question or just want to say hi, my inbox is always open.</p>
                        <div class="contact-methods" id="render-contact-methods">
                            <!-- Injected by JS -->
                        </div>
                    </div>
                    <form id="contact-form" action="https://formsubmit.co/ajax/devadath754@gmail.com" method="POST" class="contact-form">
                        <input type="hidden" name="_subject" value="New Portfolio Contact Message!">
                        <input type="hidden" name="_template" value="box">
                        <input type="hidden" name="_captcha" value="false">
                        <div class="form-group"><input type="text" name="name" placeholder="Your Name" required></div>
                        <div class="form-group"><input type="email" name="email" placeholder="Your Email" required></div>
                        <div class="form-group"><input type="text" name="subject" placeholder="Subject" required></div>
                        <div class="form-group"><textarea name="message" rows="5" placeholder="Your Message" required></textarea></div>
                        <button type="submit" id="contact-submit-btn" class="btn-primary submit-btn" style="width: 100%; justify-content: center; gap: 8px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            <span>Send Message</span>
                        </button>
                        <p id="contact-status" style="display:none; text-align:center; font-size: 0.9rem; margin-top: 10px;"></p>
                    </form>
                </div>
            </div>
        </section>`
};

function getSectionTemplate(sectionId, data) {
    if (sectionTemplates[sectionId]) return sectionTemplates[sectionId]();
    if (data.customSections && data.customSections[sectionId]) {
        const custom = data.customSections[sectionId];
        return `
        <section id="${sectionId}" class="custom-section">
            <div class="section-container">
                <div class="section-header reveal">
                    <h2>${custom.title}</h2>
                    <div class="header-line"></div>
                </div>
                <div class="custom-content reveal">
                    <p class="editable-text" id="render-custom-${sectionId}" data-key="customSections.${sectionId}.content">${custom.content || ''}</p>
                </div>
            </div>
        </section>`;
    }
    return '';
}

function buildLayout(data) {
    const container = document.getElementById('dynamic-layout');
    if (!container) return;
    
    const layoutStr = JSON.stringify(data.layout || []);
    if (container.dataset.layout === layoutStr) return;
    
    container.innerHTML = '';
    const layout = data.layout || ['about', 'portfolio', 'certs', 'skills', 'contact'];
    
    // Build Sections
    layout.forEach(sectionId => {
        const div = document.createElement('div');
        div.innerHTML = getSectionTemplate(sectionId, data);
        if (div.firstElementChild) {
            container.appendChild(div.firstElementChild);
        }
    });
    
    // Build Nav Links
    const deskNav = document.getElementById('desktop-nav-links');
    const mobNav = document.getElementById('mobile-nav-links');
    if (deskNav && mobNav) {
        let deskHtml = '<a href="#home">Home</a>';
        let mobHtml = '<a href="#home">Home</a>';
        
        layout.forEach((sectionId, idx) => {
            let title = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            if (sectionId === 'portfolio') title = 'Projects';
            if (sectionId === 'certs') title = 'Certifications';
            if (data.customSections && data.customSections[sectionId]) title = data.customSections[sectionId].title;
            
            // Last item becomes the button on desktop
            if (idx === layout.length - 1) {
                deskHtml += `<a href="#${sectionId}" class="btn-primary nav-btn">${title}</a>`;
            } else {
                deskHtml += `<a href="#${sectionId}">${title}</a>`;
            }
            mobHtml += `<a href="#${sectionId}">${title}</a>`;
        });
        
        deskNav.innerHTML = deskHtml;
        mobNav.innerHTML = mobHtml;
    }
    
    container.dataset.layout = layoutStr;
}

function renderContent() {
    const data = window.portfolioManager.getData();
    buildLayout(data);

    // Hero
    document.getElementById('render-hero-name').textContent = data.hero.name;
    document.getElementById('render-hero-tagline').textContent = data.hero.tagline;
    document.getElementById('render-hero-desc').textContent = data.hero.description;
    
    const heroImgWrapper = document.getElementById('render-hero-image');
    if (heroImgWrapper) {
        if (data.hero.imageUrl) {
            heroImgWrapper.innerHTML = `<img src="${data.hero.imageUrl}" alt="Profile Picture" style="width:100%; height:100%; object-fit:cover; border-radius:50%; animation: fadeIn 0.5s ease-in-out;">`;
        } else {
            heroImgWrapper.innerHTML = '';
        }
    }

    // About
    const aboutBio = document.getElementById('render-about-bio');
    if (aboutBio && data.about) aboutBio.textContent = data.about.bio;

    // Projects
    const projectsContainer = document.getElementById('render-projects-container');
    if (projectsContainer && data.projects) {
        projectsContainer.innerHTML = '';
        data.projects.forEach(p => {
            const card = `
                <div class="reveal">
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                    </a>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    </div>
                </div>
            `;
            projectsContainer.innerHTML += card;
        });
    }

    // Certifications (Vertical Stack)
    const certsContainer = document.getElementById('render-certs-container');
    const certsPagination = document.getElementById('render-certs-pagination');
    if (certsContainer && data.certifications && data.certifications.length > 0) {
        certsContainer.innerHTML = '';
        if (certsPagination) certsPagination.innerHTML = '';
        
        data.certifications.forEach((c, index) => {
            const card = `
                <div class="cert-card" data-index="${index}" data-id="${c.id}">
                    <div class="admin-actions-overlay">
                        <button class="admin-edit-item-btn" onclick="editItem('certifications', ${c.id}); event.stopPropagation();">Edit</button>
                        <button class="admin-delete-btn" onclick="deleteItem('certifications', ${c.id}); event.stopPropagation();">Delete</button>
                    </div>
                    <div class="cert-card-image" style="background-image: url('${c.imageUrl}');"></div>
                    <div class="cert-card-content">
                        <h3>${c.title}</h3>
                    </div>
                </div>
            `;
            certsContainer.innerHTML += card;
            
            if (certsPagination) {
                certsPagination.innerHTML += `<div class="cert-dot" data-index="${index}"></div>`;
            }
        });
        
        // Click active card to open detail modal
        certsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.cert-card');
            if (!card || !card.classList.contains('active')) return;
            const certId = parseInt(card.dataset.id);
            const cert = data.certifications.find(c => c.id === certId);
            if (cert) openCertDetailModal(cert);
        });
        
        if (typeof window.initCertStack === 'function') {
            window.initCertStack();
        }
    }

    // Skills
    const skillsContainer = document.getElementById('render-skills-container');
    if (skillsContainer && data.skills) {
        skillsContainer.innerHTML = '';
        data.skills.forEach((s) => {
            const card = `
                <div class="reveal">
                    <div class="skill-card" data-id="${s.id}">
                    <div class="admin-actions-overlay">
                        <button class="admin-edit-btn" onclick="editItem('skills', ${s.id})" style="position:static; margin-bottom:5px;">Edit</button>
                        <button class="admin-delete-btn" onclick="deleteItem('skills', ${s.id})" style="position:static;">Delete</button>
                    </div>
                    <img src="${s.imageUrl}" alt="${s.name}" class="skill-icon-img">
                    <h4>${s.name}</h4>
                    <p>${s.label}</p>
                    </div>
                </div>
            `;
            skillsContainer.innerHTML += card;
        });
    }

    // Contact & Footer
    const contactMethodsContainer = document.getElementById('render-contact-methods');
    if (contactMethodsContainer && data.contact) {
        contactMethodsContainer.innerHTML = '';
        if (data.contact.email) {
            contactMethodsContainer.innerHTML += `
                <a href="mailto:${data.contact.email}" class="contact-method">
                    <i data-lucide="mail"></i>
                    <span>${data.contact.email}</span>
                </a>
            `;
        }
        if (data.contact.github) {
            contactMethodsContainer.innerHTML += `
                <a href="${data.contact.github}" target="_blank" class="contact-method">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                    <span>github.com</span>
                </a>
            `;
        }
        if (data.contact.linkedin) {
            contactMethodsContainer.innerHTML += `
                <a href="${data.contact.linkedin}" target="_blank" class="contact-method">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                    <span>linkedin.com</span>
                </a>
            `;
        }
        if (data.contact.instagram) {
            contactMethodsContainer.innerHTML += `
                <a href="${data.contact.instagram}" target="_blank" class="contact-method">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <span>instagram.com</span>
                </a>
            `;
        }
    }

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
    
    const g4 = newForm.querySelector('#prompt-group-4');
    const i4 = newForm.querySelector('#prompt-input-4');
    if (options.label4) {
        g4.style.display = 'block';
        i4.placeholder = options.label4;
        i4.value = options.val4 || '';
    } else { g4.style.display = 'none'; }
    
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
        const val4 = i4 ? i4.value : '';
        const externalUrl = iExtUrl.value;
        const githubUrl = iGit.value;
        
        const finalize = (finalImgVal) => {
            modal.style.display = 'none';
            callback(val1, val2, finalImgVal, externalUrl, uploadedDocData, githubUrl, val4);
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

    // Manage Layout Logic
    const layoutModal = document.getElementById('manage-layout-modal');
    const layoutSortableList = document.getElementById('layout-sortable-list');
    
    document.getElementById('manage-layout-btn').addEventListener('click', () => {
        const data = window.portfolioManager.getData();
        const layout = data.layout || ['about', 'portfolio', 'certs', 'skills', 'contact'];
        
        layoutSortableList.innerHTML = '';
        layout.forEach(id => {
            const div = document.createElement('div');
            div.className = 'admin-layout-item';
            div.dataset.id = id;
            div.style.cssText = 'padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: grab; display: flex; justify-content: space-between; align-items: center; color: white;';
            
            let title = id.toUpperCase();
            if(data.customSections && data.customSections[id]) title = data.customSections[id].title;
            
            div.innerHTML = `
                <span><i data-lucide="grip-vertical" style="margin-right: 10px; width: 16px; opacity: 0.5;"></i> ${title}</span>
                <button type="button" class="btn-cancel delete-layout-item" style="padding: 4px 8px; font-size: 0.8rem;">Remove</button>
            `;
            layoutSortableList.appendChild(div);
        });
        if(window.lucide) window.lucide.createIcons();
        
        if (window.layoutSortable) window.layoutSortable.destroy();
        window.layoutSortable = new Sortable(layoutSortableList, {
            animation: 150,
            handle: '.admin-layout-item',
            ghostClass: 'sortable-ghost'
        });
        
        layoutModal.style.display = 'flex';
    });

    document.getElementById('close-layout-btn').addEventListener('click', () => {
        layoutModal.style.display = 'none';
    });
    
    document.getElementById('save-layout-btn').addEventListener('click', () => {
        const data = window.portfolioManager.getData();
        const newLayout = Array.from(layoutSortableList.children).map(el => el.dataset.id);
        data.layout = newLayout;
        window.portfolioManager.saveData(data);
        layoutModal.style.display = 'none';
        
        // Clear dataset layout to force rebuild
        const container = document.getElementById('dynamic-layout');
        if (container) container.dataset.layout = '';
        renderContent();
    });

    layoutSortableList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-layout-item')) {
            e.target.closest('.admin-layout-item').remove();
        }
    });

    document.getElementById('add-custom-section-btn').addEventListener('click', () => {
        layoutModal.style.display = 'none'; // Hide temporarily while custom prompt is open
        openCustomPrompt({
            title: "Add Custom Section",
            label1: "Section Title (e.g. Education)",
            label2: "Content (Text)",
            showFileUpload: false
        }, (title, content) => {
            layoutModal.style.display = 'flex'; // Re-show layout modal
            if (!title) return;
            const data = window.portfolioManager.getData();
            if (!data.customSections) data.customSections = {};
            const sectionId = 'custom_' + Date.now();
            data.customSections[sectionId] = { title, content };
            
            // Add to list visually
            const div = document.createElement('div');
            div.className = 'admin-layout-item';
            div.dataset.id = sectionId;
            div.style.cssText = 'padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; cursor: grab; display: flex; justify-content: space-between; align-items: center; color: white;';
            div.innerHTML = `
                <span><i data-lucide="grip-vertical" style="margin-right: 10px; width: 16px; opacity: 0.5;"></i> ${title}</span>
                <button type="button" class="btn-cancel delete-layout-item" style="padding: 4px 8px; font-size: 0.8rem;">Remove</button>
            `;
            layoutSortableList.appendChild(div);
            if(window.lucide) window.lucide.createIcons();
            
            // Re-bind sortable
            if (window.layoutSortable) window.layoutSortable.destroy();
            window.layoutSortable = new Sortable(layoutSortableList, {
                animation: 150,
                handle: '.admin-layout-item',
                ghostClass: 'sortable-ghost'
            });
        });
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
                label4: "Instagram URL",
                val4: data.contact.instagram,
                showFileUpload: false
            }, (email, github, linkedin, ext, doc, git, instagram) => {
                if(!email) return;
                data.contact.email = email;
                data.contact.github = github || "#";
                data.contact.linkedin = linkedin || "#";
                data.contact.instagram = instagram || "";
                window.portfolioManager.saveData(data);
                renderContent();
            });
        });
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');
    const btn = document.getElementById('contact-submit-btn');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                status.textContent = 'Message sent successfully!';
                status.style.color = '#4ade80'; // success green
                status.style.display = 'block';
                form.reset();
            } else {
                status.textContent = 'Oops! There was a problem sending your message.';
                status.style.color = '#f87171'; // error red
                status.style.display = 'block';
            }
        }).catch(error => {
            status.textContent = 'Oops! There was a problem sending your message.';
            status.style.color = '#f87171';
            status.style.display = 'block';
        }).finally(() => {
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        });
    });
}

// --- STANDARD UI LOGIC ---
async function bootstrap() {
    // 1. Instantly render from local cache so the profile picture is there immediately
    // 1. Initial render (fast local cache)
    renderContent();
    
    // 2. Trigger load animations IMMEDIATELY for luxury feel
    document.body.classList.add('run-animation');
    
    // 3. Fetch from Firebase to ensure we have latest data
    await portfolioManager.init();
    
    // 4. Re-render just in case Firebase had newer data
    renderContent();

    initContactForm();
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



// Certificate Detail Modal
function openCertDetailModal(cert) {
    // Remove any existing modal
    const existing = document.getElementById('cert-detail-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'cert-detail-modal';
    modal.className = 'cert-detail-overlay';
    
    let html = '<div class="cert-detail-modal">';
    html += '<button class="cert-detail-close" onclick="this.closest(\'.cert-detail-overlay\').remove()">';
    html += '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    html += '</button>';
    html += '<div class="cert-detail-img"><img src="' + cert.imageUrl + '" alt="' + cert.title + '"></div>';
    html += '<div class="cert-detail-body">';
    html += '<h2>' + cert.title + '</h2>';
    if (cert.organization) html += '<p class="cert-detail-org">' + cert.organization + '</p>';
    if (cert.date) html += '<p class="cert-detail-date">' + cert.date + '</p>';
    if (cert.description) html += '<p class="cert-detail-desc">' + cert.description + '</p>';
    var linkUrl = cert.pdfUrl || cert.externalUrl || cert.documentData;
    if (linkUrl) html += '<a href="' + linkUrl + '" target="_blank" class="cert-detail-link">View Credential</a>';
    html += '</div></div>';

    modal.innerHTML = html;
    document.body.appendChild(modal);
    requestAnimationFrame(function() { modal.classList.add('show'); });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
}
window.openCertDetailModal = openCertDetailModal;

window.initCertStack = function() {
  const container = document.getElementById('render-certs-container');
  const pagination = document.getElementById('render-certs-pagination');
  if (!container || !pagination) return;

  const cards = Array.from(container.querySelectorAll('.cert-card'));
  const dots = Array.from(pagination.querySelectorAll('.cert-dot'));
  if (cards.length === 0) return;

  let currentIndex = 0;
  let isScrolling = false;

  function updateStack() {
    cards.forEach((card, i) => {
      card.className = 'cert-card'; // reset
      let offset = i - currentIndex;

      if (offset === 0) card.classList.add('active');
      else if (offset === -1) card.classList.add('prev-1');
      else if (offset === -2) card.classList.add('prev-2');
      else if (offset === 1) card.classList.add('next-1');
      else if (offset === 2) card.classList.add('next-2');
      else if (offset < -2) card.classList.add('hidden-up');
      else if (offset > 2) card.classList.add('hidden-down');
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function handleScroll(e) {
    if (isScrolling) return;
    
    // Determine direction
    const dir = Math.sign(e.deltaY);
    if (dir > 0 && currentIndex < cards.length - 1) {
      currentIndex++;
      triggerScrollLock();
    } else if (dir < 0 && currentIndex > 0) {
      currentIndex--;
      triggerScrollLock();
    }
  }

  function triggerScrollLock() {
    updateStack();
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 600);
  }

  // Mouse wheel
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    handleScroll(e);
  }, { passive: false });

  // Pagination click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentIndex = parseInt(e.target.dataset.index);
      updateStack();
    });
  });

  // Touch Swipe
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 30) {
      if (diff > 0 && currentIndex < cards.length - 1) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateStack();
    }
  }, { passive: true });

  // Init
  updateStack();
};
