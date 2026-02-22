// Bullet point logic
const formatBullets = (text) => {
    if (!text || text.trim().length < 2) return '';
    if (text.includes(',,')) {
        const items = text.split(',,').filter(i => i.trim() !== '');
        return `<ul class="res-bullets">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

// Dynamic Project Field
document.getElementById('add-proj').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `<input type="text" class="p-title" placeholder="Project Title" style="margin-top:10px">
                     <textarea class="p-desc" rows="2" placeholder="Details (Use ,, for bullets)"></textarea>`;
    document.getElementById('project-list').appendChild(div);
});

// Generator Logic
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const color = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--brand', color);

    const generate = (imgBase64 = '') => {
        const getV = (id) => document.getElementById(id).value.trim();
        
        // Strict Conditional Section: Returns empty string if content is missing
        const renderSection = (title, content) => {
            if (!content || content.length < 3) return ''; 
            return `<div class="res-sec">
                        <div class="res-section-title" style="color:${color}; border-color:${color}">${title}</div>
                        <div>${content}</div>
                    </div>`;
        };

        // Projects processing
        let projectsHtml = '';
        document.querySelectorAll('.project-item').forEach(p => {
            const t = p.querySelector('.p-title').value;
            const d = p.querySelector('.p-desc').value;
            if(t) projectsHtml += `<div class="res-quote" style="border-color:${color}"><strong>${t}</strong>${formatBullets(d)}</div>`;
        });

        const resumeHTML = `
            <div class="res-header" style="border-color:${color}">
                ${imgBase64 ? `<img src="${imgBase64}" class="res-photo" style="border-color:${color}">` : ''}
                <div>
                    <h1 style="margin:0; font-size: 2.2rem; color:${color}">${getV('name') || 'Resume'}</h1>
                    <p style="margin:5px 0;">${getV('email')} ${getV('phone') ? '| ' + getV('phone') : ''}</p>
                    <small>${getV('linkedin')} ${getV('github') ? ' | ' + getV('github') : ''}</small>
                </div>
            </div>

            ${renderSection('Objective', `<p style="font-style:italic;">${formatBullets(getV('objective'))}</p>`)}

            <div class="responsive-grid" style="grid-template-columns: 1fr 1fr; display: flex; flex-wrap: wrap;">
                <div style="flex:1; min-width:250px;">
                    ${renderSection('Experience', `<div class="res-quote" style="border-color:${color}">${formatBullets(getV('experience'))}</div>`)}
                </div>
                <div style="flex:1; min-width:250px;">
                    ${renderSection('Education', `<div class="res-quote" style="border-color:${color}">${formatBullets(getV('education'))}</div>`)}
                </div>
            </div>

            ${renderSection('Projects', projectsHtml)}

            <div class="responsive-grid" style="grid-template-columns: 1fr 1fr; display: flex; flex-wrap: wrap;">
                <div style="flex:1; min-width:250px;">
                    ${renderSection('Skills', `<p>${getV('skills')}</p>`)}
                </div>
                <div style="flex:1; min-width:250px;">
                    ${renderSection('Achievements', `<div class="res-quote" style="border-color:${color}">${formatBullets(getV('achievements'))}</div>`)}
                </div>
            </div>
        `;

        document.getElementById('resume-render').innerHTML = resumeHTML;
        document.getElementById('resume-form').classList.add('hidden');
        document.getElementById('preview-modal').classList.remove('hidden');
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

// Edit Button
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('preview-modal').classList.add('hidden');
});

// Download PDF
document.getElementById('download-pdf').addEventListener('click', () => {
    const el = document.getElementById('resume-render');
    html2pdf().set({
        margin: [0.4, 0.4],
        filename: 'MyResume.pdf',
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(el).save();
});

// Download PNG Image
document.getElementById('download-png').addEventListener('click', () => {
    const el = document.getElementById('resume-render');
    html2canvas(el, { scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'MyResume.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});
