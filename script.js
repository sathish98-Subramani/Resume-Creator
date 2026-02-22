// Add more project fields
document.getElementById('add-project').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'dynamic-entry';
    div.innerHTML = `<input type="text" class="proj-title" placeholder="Project Title" style="margin-top:10px">
                     <textarea class="proj-desc" rows="2" placeholder="Description..."></textarea>`;
    document.getElementById('projects-container').appendChild(div);
});

document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const primaryColor = document.getElementById('theme-color').value;
    document.documentElement.style.setProperty('--primary', primaryColor);

    const generate = (imgSrc = '') => {
        const skills = document.getElementById('skills').value.split(',').map(s => `<span class="tag" style="background:${primaryColor}">${s.trim()}</span>`).join('');
        
        let projects = '';
        document.querySelectorAll('.dynamic-entry').forEach(entry => {
            const title = entry.querySelector('.proj-title').value;
            const desc = entry.querySelector('.proj-desc').value;
            if(title) projects += `<div class="quoted-box" style="border-color:${primaryColor}"><strong>${title}</strong><p>${desc}</p></div>`;
        });

        document.getElementById('resume-output').innerHTML = `
            <div class="resume-header" style="border-color:${primaryColor}">
                ${imgSrc ? `<img src="${imgSrc}" class="profile-img" style="border-color:${primaryColor}">` : ''}
                <div>
                    <h1 style="margin:0; color:${primaryColor}">${document.getElementById('name').value}</h1>
                    <p>${document.getElementById('email').value} | ${document.getElementById('phone').value}</p>
                    <small>${document.getElementById('linkedin').value} | ${document.getElementById('github').value}</small>
                </div>
            </div>

            <div class="resume-section">
                <h3 style="color:${primaryColor}">OBJECTIVE</h3>
                <p><em>"${document.getElementById('objective').value}"</em></p>
            </div>

            <div class="grid-row">
                <div>
                    <h3 style="color:${primaryColor}">EDUCATION</h3>
                    <div class="quoted-box" style="border-color:${primaryColor}">${document.getElementById('education').value.replace(/\n/g, '<br>')}</div>
                </div>
                <div>
                    <h3 style="color:${primaryColor}">COURSES</h3>
                    <div class="quoted-box" style="border-color:${primaryColor}">${document.getElementById('courses').value.replace(/\n/g, '<br>')}</div>
                </div>
            </div>

            <h3 style="color:${primaryColor}">PROJECTS</h3>
            ${projects}

            <h3 style="color:${primaryColor}">ACHIEVEMENTS</h3>
            <div class="quoted-box" style="border-color:${primaryColor}">${document.getElementById('achievements').value.replace(/\n/g, '<br>')}</div>

            <div class="grid-row">
                <div>
                    <h3 style="color:${primaryColor}">SKILLS</h3>
                    <div class="tag-container">${skills}</div>
                </div>
                <div>
                    <h3 style="color:${primaryColor}">INTERESTS</h3>
                    <p>${document.getElementById('interests').value}</p>
                </div>
            </div>
        `;
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

document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('resume-preview').classList.add('hidden');
});

document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('resume-output');
    html2pdf().set({
        margin: 0.3,
        filename: `${document.getElementById('name').value}_Resume.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
});
