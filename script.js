const form = document.getElementById('resume-form');
const sheet = document.getElementById('resume-sheet');
const themeColorInput = document.getElementById('theme-color');

// Helper: Formats bullets if ,, is present
const formatText = (val) => {
    if (!val || val.trim().length < 2) return '';
    if (val.includes(',,')) {
        const items = val.split(',,').filter(i => i.trim() !== '');
        return `<ul class="res-bullets">${items.map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
    }
    return `<p>${val.replace(/\n/g, '<br>')}</p>`;
};

// Helper: Makes links clickable and ensures https
const formatLink = (url, label) => {
    if (!url || url.length < 5) return '';
    const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
    return `<a href="${cleanUrl}" class="res-link" target="_blank">${label}</a>`;
};

let photoData = '';

// Main Update Engine
const updatePreview = () => {
    const color = themeColorInput.value;
    document.documentElement.style.setProperty('--brand', color);

    const get = (id) => document.getElementById(id).value.trim();

    // Section logic: If content is empty, return nothing (no heading!)
    const buildSection = (title, content) => {
        if (!content || content.length < 5) return '';
        return `<div><div class="res-title" style="color:${color}; border-color:${color}">${title}</div>${content}</div>`;
    };

    sheet.innerHTML = `
        <div class="res-header" style="border-color:${color}">
            ${photoData ? `<img src="${photoData}" class="res-img" style="border-color:${color}">` : ''}
            <div>
                <h1 style="margin:0; color:${color}">${get('in-name') || 'Your Name'}</h1>
                <p style="margin:5px 0;">${get('in-email')} | ${get('in-phone')}</p>
                <div>
                    ${formatLink(get('in-linkedin'), 'LinkedIn')}
                    ${formatLink(get('in-github'), 'GitHub')}
                </div>
            </div>
        </div>

        ${buildSection('Objective', formatText(get('in-objective')))}
        ${buildSection('Experience', formatText(get('in-experience')))}
        ${buildSection('Education', formatText(get('in-education')))}
        ${buildSection('Skills', `<p>${get('in-skills')}</p>`)}
    `;
};

// Listeners
form.addEventListener('input', updatePreview);
themeColorInput.addEventListener('input', updatePreview);

document.getElementById('in-photo').addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = (e) => { photoData = e.target.result; updatePreview(); };
    reader.readAsDataURL(this.files[0]);
});

// Download Logic
document.getElementById('download-pdf').addEventListener('click', () => {
    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(sheet).save();
});

document.getElementById('download-png').addEventListener('click', () => {
    html2canvas(sheet, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'resume.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Initial Load
updatePreview();
