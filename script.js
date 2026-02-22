// Function to format ,, into <li> tags
const formatDynamicText = (text) => {
    if (!text || text.length < 2) return null;
    if (text.includes(',,')) {
        const items = text.split(',,').filter(i => i.trim() !== '');
        return `<ul class="res-bullets">${items.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

// URL Link Wrapper
const createSafeLink = (url, label) => {
    if (!url || url.length < 5) return '';
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${cleanUrl}" target="_blank" style="color:inherit; text-decoration:none; border-bottom:1px solid;">${label}</a>`;
};

// Add Projects Dynamically
document.getElementById('add-proj-btn').addEventListener('click', () => {
    const list = document.getElementById('projects-list');
    const div = document.createElement('div');
    div.className = 'project-entry card-inner';
    div.style.marginTop = "10px";
    div.innerHTML = `
        <input type="text" class="p-title" placeholder="Project Title">
        <textarea class="p-desc" rows="2" placeholder="Details (Use ,, for bullets)"></textarea>
    `;
    list.appendChild(div);
});

// Main Resume Generation
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const themeColor = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--primary', themeColor);

    const generateHTML = (imgBase64 = '') => {
        const getVal = (id) => document.getElementById(id).value.trim();
        
        // Conditional Section Helper
        const buildSection = (title, content, isColumn = false) => {
            if (!content || content.length < 3) return '';
            return `<div class="${isColumn ? 'col' : 'full'}">
                        <div class="res-section-header" style="color:${themeColor}; border-color:${themeColor}">${title}</div>
                        ${content}
                    </div>`;
        };

        // Project logic
        let projectsHtml = '';
        document.querySelectorAll('.project-entry').forEach(p => {
            const title = p.querySelector('.p-title').value;
            const desc = p.querySelector('.p-desc').value;
            if (title) projectsHtml += `<div class="res-box" style="border-color:${themeColor}"><strong>${title}</strong>${formatDynamicText(desc)}</div>`;
        });

        const socials = [
            createSafeLink(getVal('linkedin'), 'LinkedIn'),
            createSafeLink(getVal('github'), 'GitHub')
        ].filter(Boolean).join(' | ');

        const finalContent = `
            <div class="res-header" style="border-color:${themeColor}">
                ${imgBase64 ? `<img src="${imgBase64}" class="res-photo" style="border-color:${themeColor}">` : ''}
                <div>
                    <h1 style="margin:0; font-size: 2.2rem; color:${themeColor}">${getVal('name')}</h1>
                    <p style="margin:5px 0; text-align:left; color:#475569;">${getVal('email')} | ${getVal('phone')}</p>
                    <small>${socials}</small>
                </div>
            </div>

            ${buildSection('Objective', `<p style="font-style:italic;">${formatDynamicText(getVal('objective'))}</p>`)}

            <div class="res-grid-cols">
                ${buildSection('Experience', `<div class="res-box" style="border-color:${themeColor}">${formatDynamicText(getVal('experience'))}</div>`, true)}
                ${buildSection('Education', `<div class="res-box" style="border-color:${themeColor}">${formatDynamicText(getVal('education'))}</div>`, true)}
            </div>

            ${buildSection('Projects', projectsHtml)}

            <div class="res-grid-cols">
                ${buildSection('Skills', `<p>${getVal('skills')}</p>`, true)}
                ${buildSection('Achievements / Interests', `<p>${getVal('achievements')}</p>`, true)}
            </div>
        `;

        document.getElementById('resume-output').innerHTML = finalContent;
        document.getElementById('resume-form').classList.add('hidden');
        document.getElementById('preview-section').classList.remove('hidden');
    };

    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (ev) => generateHTML(ev.target.result);
        reader.readAsDataURL(photo);
    } else {
        generateHTML();
    }
});

// Navigation
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('preview-section').classList.add('hidden');
});

// Download PDF
document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('resume-output');
    const name = document.getElementById('name').value || 'Resume';
    html2pdf().set({
        margin: [0.5, 0.5],
        filename: `${name}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
});
