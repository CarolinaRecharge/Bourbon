/* ===================================
   WINSTON-SALEM BARREL LEAGUE
   Membership Form JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    const membershipForm = document.getElementById('membershipForm');
    
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(membershipForm);
            const data = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                if (key === 'interests') {
                    if (!data[key]) {
                        data[key] = [];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
            
            // Validate age confirmation
            if (!formData.get('ageConfirm')) {
                alert('You must confirm that you are 21 years of age or older.');
                return;
            }
            
            // Validate terms
            if (!formData.get('terms')) {
                alert('You must agree to the membership terms and conditions.');
                return;
            }
            
            // Validate at least one interest is selected
            if (!data.interests || data.interests.length === 0) {
                alert('Please select at least one spirit interest.');
                return;
            }
            
            // Show success message (in production, this would submit to a server)
            console.log('Form Data:', data);
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <h3>Application Submitted!</h3>
                <p>Thank you for your interest in joining the Winston-Salem Barrel League. We've received your application and will review it within 2-3 business days.</p>
                <p>You'll receive a confirmation email at <strong>${data.email}</strong> shortly.</p>
                <p>If you have any questions, please contact us at membership@wsblbarreleague.com</p>
            `;
            
            // Replace form with success message
            membershipForm.style.display = 'none';
            membershipForm.parentNode.insertBefore(successMessage, membershipForm);
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // In production, you would send this data to your server:
            /*
            fetch('/api/membership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error submitting your application. Please try again.');
            });
            */
        });
    }
    
    // Smooth scroll to application form when clicking tier buttons
    const tierButtons = document.querySelectorAll('a[href="#apply"]');
    tierButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedTier = this.closest('.tier-card')?.querySelector('.tier-badge')?.textContent.toLowerCase();
            
            // Scroll to form
            const formSection = document.getElementById('apply');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth' });
                
                // Pre-select tier if clicked from a tier card
                if (selectedTier) {
                    setTimeout(() => {
                        const tierSelect = document.getElementById('membershipTier');
                        if (tierSelect) {
                            tierSelect.value = selectedTier;
                            tierSelect.focus();
                        }
                    }, 500);
                }
            }
        });
    });
});

// Add styles for success message dynamically
const style = document.createElement('style');
style.textContent = `
    .form-success {
        background-color: var(--secondary-dark);
        padding: var(--spacing-lg);
        border: 2px solid var(--accent-gold);
        text-align: center;
        margin-top: var(--spacing-md);
    }
    
    .form-success h3 {
        color: var(--accent-gold);
        margin-bottom: var(--spacing-md);
        font-size: 2rem;
    }
    
    .form-success p {
        color: var(--text-muted);
        margin-bottom: var(--spacing-sm);
    }
    
    .form-success strong {
        color: var(--accent-gold);
    }
`;
document.head.appendChild(style);
