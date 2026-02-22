// Helper to turn double commas into Bullet Points
const formatText = (text) => {
    if (!text) return '';
    if (text.includes(',,')) {
        const listItems = text.split(',,').filter(item => item.trim() !== '');
        return `<ul class="bullet-list">${listItems.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

// Helper to create Active Links
const createLink = (url, prefix) => {
    if (!url) return '';
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${cleanUrl}" target="_blank" style="color:inherit; text-decoration:underline;">${prefix}: ${url}</a>`;
};

// Handle Dynamic Project Addition
document.getElementById('add-project').addEventListener('click', () => {
    const container = document.getElementById('projects-container');
    const div = document.createElement('div');
    div.className = 'dynamic-entry';
    div.innerHTML = `
        <input type="text" class="proj-title" placeholder="Project Title" style="margin-top:10px">
        <textarea class="proj-desc" rows="2" placeholder="Details (use ,, for bullets)"></textarea>
    `;
    container.appendChild(div);
});

// Main Generation Logic
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const themeColor = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--primary', themeColor);

    const generate = (imgSrc = '') => {
        const getVal = (id) => document.getElementById(id).value.trim();
        const wrapSection = (title, content) => content ? `<div><div class="section-title" style="color:${themeColor}; border-color:${themeColor}">${title.toUpperCase()}</div>${content}</div>` : '';

        // Skills & Interests as Tags
        const skillsTags = getVal('skills').split(',').map(s => s.trim() ? `<span class="tag">${s}</span>` : '').join('');
        const interestTags = getVal('interests').split(',').map(i => i.trim() ? `<span class="tag" style="background:${themeColor}; color:white;">${i}</span>` : '').join('');

        // Projects
        let projectOutput = '';
        document.querySelectorAll('.dynamic-entry').forEach(el => {
            const title = el.querySelector('.proj-title').value;
            const desc = el.querySelector('.proj-desc').value;
            if(title) projectOutput += `<div class="quoted-box" style="border-color:${themeColor}"><strong>${title}</strong>${formatText(desc)}</div>`;
        });

        // Construct HTML
        const resumeHTML = `
            <div class="resume-header">
                <div>
                    <h1 style="margin:0; font-size: 2.2rem; color:${themeColor}">${getVal('name')}</h1>
                    <p style="margin:5px 0;">${getVal('email')} | ${getVal('phone')}</p>
                    <div style="font-size: 11px; display:flex; gap:10px;">
                        ${getVal('linkedin') ? `<span>${createLink(getVal('linkedin'), 'LinkedIn')}</span>` : ''}
                        ${getVal('github') ? `<span>${createLink(getVal('github'), 'GitHub')}</span>` : ''}
                    </div>
                </div>
                ${imgSrc ? `<img src="${imgSrc}" class="profile-img">` : ''}
            </div>

            ${wrapSection('Objective', `<p>${formatText(getVal('objective'))}</p>`)}
            
            <div class="grid-row">
                ${wrapSection('Education', `<div class="quoted-box" style="border-color:${themeColor}">${formatText(getVal('education'))}</div>`)}
                ${wrapSection('Courses', `<div class="quoted-box" style="border-color:${themeColor}">${formatText(getVal('courses'))}</div>`)}
            </div>

            ${wrapSection('Projects', projectOutput)}
            ${wrapSection('Achievements', `<div class="quoted-box" style="border-color:${themeColor}">${formatText(getVal('achievements'))}</div>`)}

            <div class="grid-row">
                ${wrapSection('Technical Skills', `<div class="tag-container">${skillsTags}</div>`)}
                ${wrapSection('Interests', `<div class="tag-container">${interestTags}</div>`)}
            </div>
        `;

        document.getElementById('resume-output').innerHTML = resumeHTML;
        document.getElementById('resume-form').classList.add('hidden');
        document.getElementById('resume-preview').classList.remove('hidden');
    };

    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (e) => generate(e.target.result);
        reader.readAsDataURL(photo);
    } else {
        generate();
    }
});

// Edit functionality
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('resume-preview').classList.add('hidden');
});

// PDF download logic
document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('resume-output');
    const name = document.getElementById('name').value || 'Resume';
    html2pdf().set({
        margin: 0.4,
        filename: `${name}_Resume.pdf`,
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
});
