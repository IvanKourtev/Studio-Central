document.addEventListener("DOMContentLoaded", function () {
    const lessonDate = document.getElementById("lesson-date");
    const lessonTime = document.getElementById("lesson-time");
    const successMessage = document.getElementById("success-message");

    // Фиксирани работни часове
    const availableTimes = ["10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

    // Задаваме минимална и максимална дата
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 30);

    lessonDate.min = today.toISOString().split('T')[0];
    lessonDate.max = endDate.toISOString().split('T')[0];

    // Функция за проверка на свободните дни
    async function checkAvailableDays() {
        try {

            const formatDate = (date) => date.toISOString().split("T")[0]; // Взима само YYYY-MM-DD

            console.log("Проверявам свободни дни от:", formatDate(today), "до:", formatDate(endDate));

            const response = await fetch(`/api/Lessons/GetAvailableDays?startDate=${formatDate(today)}&endDate=${formatDate(endDate)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const bookedDays = await response.json();
            console.log("Заети дни:", bookedDays);

            // Деактивираме заетите дни
            lessonDate.addEventListener("change", function() {
                const selectedDate = this.value;
                if (bookedDays.includes(selectedDate)) {
                    alert("Този ден е напълно зает. Моля, изберете друга дата.");
                    this.value = "";
                    return;
                }
            });
        } catch (error) {
            console.error("Грешка при проверка на свободните дни:", error);
        }
    }

    // При избор на дата - обновяваме опциите за часове
    lessonDate.addEventListener("change", async function () {
        let selectedDate = lessonDate.value;
        console.log("Избрана дата:", selectedDate);
        lessonTime.innerHTML = "";

        try {
            // Форматираме датата правилно
            const date = new Date(selectedDate);
            const formattedDate = date.toISOString().split('T')[0];
            console.log("Форматирана дата:", formattedDate);
            
            const response = await fetch(`/api/lessons/GetAvailableSlots?date=${formattedDate}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const bookedSlots = await response.json();
            console.log("Заети часове:", bookedSlots);

            if (bookedSlots.length >= availableTimes.length) {
                alert("За съжаление, всички часове за този ден са заети. Моля, изберете друга дата.");
                lessonDate.value = "";
                return;
            }

            // Първо добавяме празна опция
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Изберете час";
            lessonTime.appendChild(defaultOption);

            // След това добавяме всички часове
            availableTimes.forEach(time => {
                let isBooked = bookedSlots.includes(time);
                console.log(`Час ${time} е ${isBooked ? 'зает' : 'свободен'}`);

                let option = document.createElement("option");
                option.value = time;
                option.textContent = time;

                if (isBooked) {
                    option.disabled = true;
                }

                lessonTime.appendChild(option);
            });
        } catch (error) {
            console.error("Грешка при взимане на наличните часове:", error);
            alert(error.message || "Възникна грешка при зареждане на часовете. Моля, опитайте отново.");
        }
    });

    // Формата за записване
    document.getElementById("booking-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const formData = {
            studentName: document.getElementById("full-name").value,
            studentEmail: document.getElementById("email").value,
            studentPhone: document.getElementById("phone").value,
            lessonType: document.getElementById("lesson-type").value,
            lessonDateTime: new Date(lessonDate.value + "T" + lessonTime.value),
            teacherName: "Константин Куртев"
        };

        try {
            const response = await fetch("/api/lessons/Create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                successMessage.style.display = "block";
                this.reset();
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
                const error = await response.json();
                alert(error.message || "Възникна грешка при записването.");
            }
        } catch (error) {
            console.error("Грешка при записване:", error);
            alert("Възникна грешка при записването. Моля, опитайте отново.");
        }
    });

    // Проверяваме свободните дни при зареждане на страницата
    checkAvailableDays();
});