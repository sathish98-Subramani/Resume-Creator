// Function to add more project fields
document.getElementById('add-project').addEventListener('click', () => {
    const container = document.getElementById('projects-container');
    const projectCount = container.getElementsByClassName('project-entry').length + 1;
    
    const div = document.createElement('div');
    div.className = 'project-entry';
    div.innerHTML = `
        <label>Project ${projectCount} Title</label>
        <input type="text" class="proj-title" placeholder="Project Title">
        <label>Description</label>
        <textarea class="proj-desc" rows="2" placeholder="Project Description"></textarea>
    `;
    container.appendChild(div);
});

// Handle Form Submission
document.getElementById('resume-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Show Preview / Hide Form
    document.getElementById('resume-form').classList.add('hidden');
    document.getElementById('resume-preview').classList.remove('hidden');

    const output = document.getElementById('resume-output');
    
    // Process Skills and Projects
    const skills = document.getElementById('skills').value.split(',').map(s => `<span class="tag">${s.trim()}</span>`).join('');
    
    let projectsHtml = '';
    const titles = document.getElementsByClassName('proj-title');
    const descs = document.getElementsByClassName('proj-desc');
    for(let i=0; i < titles.length; i++) {
        if(titles[i].value) {
            projectsHtml += `<div><strong>${titles[i].value}</strong><p>${descs[i].value}</p></div>`;
        }
    }

    // Handle Image
    const photoFile = document.getElementById('photo').files[0];
    let photoUrl = '';
    if (photoFile) {
        photoUrl = URL.createObjectURL(photoFile);
    }

    // Inject Content
    output.innerHTML = `
        <div class="resume-header">
            ${photoUrl ? `<img src="${photoUrl}" class="profile-img">` : ''}
            <div class="resume-info">
                <h1>${document.getElementById('name').value}</h1>
                <div class="contact-grid">
                    <span>📧 ${document.getElementById('email').value}</span>
                    <span>📞 ${document.getElementById('phone').value}</span>
                    <span>🔗 ${document.getElementById('linkedin').value}</span>
                    <span>💻 ${document.getElementById('github').value}</span>
                </div>
            </div>
        </div>

        <div class="resume-section">
            <h3>Career Objective</h3>
            <p>${document.getElementById('objective').value}</p>
        </div>

        <div class="resume-section">
            <h3>Skills</h3>
            <div class="tag-container">${skills}</div>
        </div>

        <div class="resume-section">
            <h3>Projects</h3>
            ${projectsHtml}
        </div>

        <div class="resume-section">
            <h3>Education</h3>
            <p style="white-space: pre-line;">${document.getElementById('education').value}</p>
        </div>

        <div class="resume-section">
            <h3>Certifications & Languages</h3>
            <p><strong>Certs:</strong> ${document.getElementById('certs').value}</p>
            <p><strong>Languages:</strong> ${document.getElementById('languages').value}</p>
        </div>
    `;
});

// Edit Button
document.getElementById('edit-btn').addEventListener('click', () => {
    document.getElementById('resume-form').classList.remove('hidden');
    document.getElementById('resume-preview').classList.add('hidden');
});

// PDF Download
document.getElementById('download-btn').addEventListener('click', () => {
    const element = document.getElementById('resume-output');
    const userName = document.getElementById('name').value || 'Resume';
    
    const opt = {
        margin: 0,
        filename: `${userName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
});