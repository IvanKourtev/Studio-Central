document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    // Запазваме данните в sessionStorage
    sessionStorage.setItem('clientData', JSON.stringify(formData));
    
    // Пренасочваме към страницата за избор на дата
    window.location.href = '/Lessons/DateSelection';
}); 