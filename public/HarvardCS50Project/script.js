// Show welcome alert
window.onload = function() {
    alert("Welcome to Eduardo's Portfolio!");
};

// Toggle skills visibility
document.getElementById('toggleSkills').addEventListener('click', function() {
    const advanced = document.querySelectorAll('.advanced');
    advanced.forEach(item => item.classList.toggle('d-none'));
});
