const formatText = (text) => {
    if (!text) return '';
    if (text.includes(',,')) {
        const items = text.split(',,').filter(item => item.trim() !== '');
        return `<ul class="bullet-list">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

const createLink = (url, label) => {
    if (!url) return '';
    const href = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${href}" target="_blank" style="color:inherit; text-decoration:none; border-bottom:1px solid;">${label}</a>`;
};

document.getElementById('add-project').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'dynamic-entry';
    div.innerHTML = `<input type="text" class="proj-title" placeholder="Project Title" style="margin-top:10px">
                     <textarea class="proj-desc" rows="2" placeholder="Description (,, for bullets)"></textarea>`;
    document.getElementById('projects-container').appendChild(div);
});

document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const color = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--primary', color);

    const generate = (imgSrc = '') => {
        const getV = (id) => document.getElementById(id).value.trim();
        
        // Conditional Section Helper: Header + Content only if content exists
        const renderSection = (title, content) => {
            if (!content || content.length < 5) return ''; // Skip if empty or too short
            return `<div><div class="section-title" style="color:${color}; border-color:${color}">${title.toUpperCase()}</div>${content}</div>`;
        };

        const contactLinks = [
            getV('linkedin') ? createLink(getV('linkedin'), 'LinkedIn') : '',
            getV('github') ? createLink(getV('github'), 'GitHub') : ''
        ].filter(Boolean).join(' | ');

        let projectsHtml = '';
        document.querySelectorAll('.dynamic-entry').forEach(el => {
            const t = el.querySelector('.proj-title').value;
            const d = el.querySelector('.proj-desc').value;
            if(t) projectsHtml += `<div class="quoted-box" style="border-color:${color}"><strong>${t}</strong>${formatText(d)}</div>`;
        });

        const resumeHTML = `
            <div class="resume-header" style="border-color:${color}">
                ${imgSrc ? `<img src="${imgSrc}" class="profile-img" style="border-color:${color}">` : ''}
                <div>
                    <h1 style="margin:0; color:${color}; font-size: 2rem;">${getV('name')}</h1>
                    <p style="margin:5px 0;">${getV('email')} | ${getV('phone')}</p>
                    <small>${contactLinks}</small>
                </div>
            </div>

            ${renderSection('Objective', `<p style="font-style:italic;">"${formatText(getV('objective'))}"</p>`)}

            <div class="grid-row">
                ${renderSection('Education', `<div class="quoted-box" style="border-color:${color}">${formatText(getV('education'))}</div>`)}
                ${renderSection('Experience', `<div class="quoted-box" style="border-color:${color}">${formatText(getV('experience'))}</div>`)}
            </div>

            <div class="grid-row">
                ${renderSection('Courses', `<div class="quoted-box" style="border-color:${color}">${formatText(getV('courses'))}</div>`)}
                ${renderSection('Achievements', `<div class="quoted-box" style="border-color:${color}">${formatText(getV('achievements'))}</div>`)}
            </div>

            ${renderSection('Projects', projectsHtml)}

            <div class="grid-row">
                ${renderSection('Skills', `<p>${getV('skills')}</p>`)}
                ${renderSection('Interests', `<p>${getV('interests')}</p>`)}
            </div>
        `;

        document.getElementById('resume-output').innerHTML = resumeHTML;
        document.getElementById('resume-form').classList.add('hidden');
        document.getElementById('resume-preview').classList.remove('hidden');
    };

    const file = document.getElementById('photo').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => generate(e.target.result);
        reader.readAsDataURL(file);
    } else {
        generate();
    }
});

document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('resume-preview').classList.add('hidden');
});

document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('resume-output');
    html2pdf().set({
        margin: [0.5, 0.5],
        filename: `${document.getElementById('name').value}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
});
