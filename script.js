// Bullet point formatter
const parseBullets = (text) => {
    if (!text || text.trim().length < 2) return null;
    if (text.includes(',,')) {
        const lines = text.split(',,').filter(l => l.trim() !== '');
        return `<ul class="res-bullets">${lines.map(l => `<li>${l.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

// Clickable link formatter
const parseLink = (url, label) => {
    if (!url || url.length < 5) return '';
    const link = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${link}" target="_blank" style="color:inherit; text-decoration:underline;">${label}</a>`;
};

// Add dynamic project field
document.getElementById('add-proj').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'proj-item';
    div.style.marginTop = '10px';
    div.innerHTML = `<input type="text" class="p-title" placeholder="Project Name">
                     <textarea class="p-desc" rows="2" placeholder="Details (,, for bullets)"></textarea>`;
    document.getElementById('project-entries').appendChild(div);
});

document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const color = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--primary', color);

    const generate = (imgData = '') => {
        const getVal = (id) => document.getElementById(id).value.trim();
        
        // Strict Conditional Section Function
        const renderSection = (title, body) => {
            if (!body || body.trim().length < 3) return ''; 
            return `<div class="res-sec">
                        <div class="res-title" style="color:${color}; border-color:${color}">${title}</div>
                        ${body}
                    </div>`;
        };

        // Header Logic
        const contactLinks = [
            getVal('linkedin') ? parseLink(getVal('linkedin'), 'LinkedIn') : '',
            getVal('github') ? parseLink(getVal('github'), 'GitHub') : ''
        ].filter(Boolean).join(' | ');

        // Projects Logic
        let projHtml = '';
        document.querySelectorAll('.proj-item').forEach(p => {
            const t = p.querySelector('.p-title').value;
            const d = p.querySelector('.p-desc').value;
            if(t) projHtml += `<div class="res-quote" style="border-color:${color}"><strong>${t}</strong>${parseBullets(d)}</div>`;
        });

        // Construct Final Template
        const finalHtml = `
            <div class="res-header" style="border-color:${color}">
                ${imgData ? `<img src="${imgData}" class="res-photo" style="border-color:${color}">` : ''}
                <div>
                    <h1 style="margin:0; color:${color}; font-size: 2rem;">${getVal('name') || 'Your Name'}</h1>
                    <p style="margin:5px 0;">${getVal('email')} ${getVal('phone') ? '| ' + getVal('phone') : ''}</p>
                    <small>${contactLinks}</small>
                </div>
            </div>

            ${renderSection('Objective', `<p style="font-style:italic;">${parseBullets(getVal('objective'))}</p>`)}
            
            <div class="flex-row" style="min-width: 100%;">
                ${renderSection('Experience', `<div class="res-quote" style="border-color:${color}">${parseBullets(getVal('experience'))}</div>`)}
                ${renderSection('Education', `<div class="res-quote" style="border-color:${color}">${parseBullets(getVal('education'))}</div>`)}
            </div>

            <div class="flex-row" style="min-width: 100%;">
                ${renderSection('Courses', `<div class="res-quote" style="border-color:${color}">${parseBullets(getVal('courses'))}</div>`)}
                ${renderSection('Achievements', `<div class="res-quote" style="border-color:${color}">${parseBullets(getVal('achievements'))}</div>`)}
            </div>

            ${renderSection('Projects', projHtml)}
            ${renderSection('Skills', `<p>${getVal('skills')}</p>`)}
        `;

        document.getElementById('resume-render').innerHTML = finalHtml;
        document.getElementById('resume-form').classList.add('hidden');
        document.getElementById('preview-area').classList.remove('hidden');
    };

    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (ev) => generate(ev.target.result);
        reader.readAsDataURL(photo);
    } else {
        generate();
    }
});

// Edit & Download
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('preview-area').classList.add('hidden');
});

document.getElementById('download-btn').addEventListener('click', () => {
    const el = document.getElementById('resume-render');
    html2pdf().set({
        margin: [0.4, 0.4],
        filename: 'My_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(el).save();
});
