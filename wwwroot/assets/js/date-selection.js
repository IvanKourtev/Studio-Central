// Зареждаме данните на клиента
document.addEventListener('DOMContentLoaded', function() {
    const clientData = JSON.parse(sessionStorage.getItem('clientData'));
    if (!clientData) {
        window.location.href = '/Lessons/Registration';
        return;
    }

    document.getElementById('client-name').textContent = clientData.name;
    document.getElementById('client-email').textContent = clientData.email;
    document.getElementById('client-phone').textContent = clientData.phone;

    // Зареждаме наличните часове при промяна на датата
    document.getElementById('lesson-date').addEventListener('change', loadAvailableSlots);
});

async function loadAvailableSlots() {
    const date = document.getElementById('lesson-date').value;
    if (!date) return;

    try {
        const response = await fetch(`/api/lessons/GetAvailableSlots?date=${date}`);
        const bookedSlots = await response.json();
        
        const timeSelect = document.getElementById('lesson-time');
        timeSelect.innerHTML = '<option value="">Изберете час</option>';
        
        // Генерираме часове от 9:00 до 18:00
        for (let hour = 9; hour <= 18; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            if (!bookedSlots.includes(time)) {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            }
        }
    } catch (error) {
        console.error('Грешка при зареждане на часовете:', error);
    }
}

document.getElementById('date-selection-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const clientData = JSON.parse(sessionStorage.getItem('clientData'));
    const date = document.getElementById('lesson-date').value;
    const time = document.getElementById('lesson-time').value;
    const notes = document.getElementById('notes').value;

    const lessonData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        lessonDateTime: `${date}T${time}`,
        notes: notes
    };

    try {
        const response = await fetch('/api/lessons/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lessonData)
        });

        if (response.ok) {
            alert('Урокът е успешно запазен!');
            sessionStorage.removeItem('clientData');
            window.location.href = '/Lessons/Registration';
        } else {
            const error = await response.text();
            alert(error);
        }
    } catch (error) {
        console.error('Грешка при запазване на часа:', error);
        alert('Възникна грешка при запазване на часа. Моля, опитайте отново.');
    }
}); 