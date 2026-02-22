// Bullet Logic
const parseBullets = (text) => {
    if (!text || text.trim().length < 2) return '';
    if (text.includes(',,')) {
        const items = text.split(',,').filter(i => i.trim() !== '');
        return `<ul class="res-bullets">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    }
    return text.replace(/\n/g, '<br>');
};

// Add Projects
document.getElementById('add-proj').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `<input type="text" class="p-title" placeholder="Project Name" style="margin-top:10px">
                     <textarea class="p-desc" rows="2" placeholder="Details (,, for bullets)"></textarea>`;
    document.getElementById('project-list').appendChild(div);
});

// Main Generate Function
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const color = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--brand', color);

    const render = (imgData = '') => {
        const getV = (id) => document.getElementById(id).value.trim();
        
        // Conditional Section Builder
        const sec = (title, content) => {
            if (!content || content.length < 3) return '';
            return `<div class="res-section">
                        <div class="res-title" style="color:${color}; border-color:${color}">${title}</div>
                        <div>${content}</div>
                    </div>`;
        };

        // Projects
        let projs = '';
        document.querySelectorAll('.project-item').forEach(p => {
            const t = p.querySelector('.p-title').value;
            const d = p.querySelector('.p-desc').value;
            if(t) projs += `<div class="res-box" style="border-color:${color}"><strong>${t}</strong>${parseBullets(d)}</div>`;
        });

        const resumeHTML = `
            <div class="res-header" style="border-color:${color}">
                ${imgData ? `<img src="${imgData}" class="res-photo" style="border-color:${color}">` : ''}
                <div>
                    <h1 style="margin:0; color:${color}">${getV('name') || 'Resume'}</h1>
                    <p style="margin:5px 0;">${getV('email')} | ${getV('phone')}</p>
                    <small>${getV('linkedin')} ${getV('github') ? ' | ' + getV('github') : ''}</small>
                </div>
            </div>

            ${sec('Objective', `<p style="font-style:italic;">${parseBullets(getV('objective'))}</p>`)}

            <div class="res-flex-row">
                ${sec('Experience', `<div class="res-box" style="border-color:${color}">${parseBullets(getV('experience'))}</div>`)}
                ${sec('Education', `<div class="res-box" style="border-color:${color}">${parseBullets(getV('education'))}</div>`)}
            </div>

            ${sec('Projects', projs)}

            <div class="res-flex-row">
                ${sec('Skills', `<p>${getV('skills')}</p>`)}
                ${sec('Achievements', `<div class="res-box" style="border-color:${color}">${parseBullets(getV('achievements'))}</div>`)}
            </div>
        `;

        document.getElementById('resume-sheet').innerHTML = resumeHTML;
        document.getElementById('form-container').classList.add('hidden');
        document.getElementById('preview-container').classList.remove('hidden');
        window.scrollTo(0, 0); // Force scroll to top to see preview
    };

    const photo = document.getElementById('photo').files[0];
    if (photo) {
        const reader = new FileReader();
        reader.onload = (ev) => render(ev.target.result);
        reader.readAsDataURL(photo);
    } else {
        render();
    }
});

// Buttons
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('form-container').classList.remove('hidden');
    document.getElementById('preview-container').classList.add('hidden');
});

document.getElementById('download-pdf').addEventListener('click', () => {
    const el = document.getElementById('resume-sheet');
    html2pdf().set({
        margin: [0.4, 0.4],
        filename: 'My_Resume.pdf',
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(el).save();
});

document.getElementById('download-png').addEventListener('click', () => {
    const el = document.getElementById('resume-sheet');
    html2canvas(el, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'My_Resume.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
