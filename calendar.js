document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendarContainer');

    renderCalendar();

    function renderCalendar() {
        calendarContainer.innerHTML = '';

        const startDate = new Date(config.startDate);
        const endDate = new Date(config.endDate);
        const today = new Date();
        // Clean today for comparison
        const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Clean dates
        const cleanStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const cleanEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        const totalDuration = cleanEnd - cleanStart; // ms
        const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start date
        const chaptersPerDay = config.totalChapters / totalDays;

        let currentDate = new Date(cleanStart);
        let currentMonth = -1;
        let monthDiv = null;
        let gridDiv = null;
        let dayCounter = 0;

        // Loop until we pass the end date
        while (currentDate <= cleanEnd) {
            // Check for new month
            if (currentDate.getMonth() !== currentMonth) {
                // Close previous month if exists
                if (monthDiv) {
                    monthDiv.appendChild(gridDiv);
                    calendarContainer.appendChild(monthDiv);
                }

                currentMonth = currentDate.getMonth();
                const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

                monthDiv = document.createElement('div');
                monthDiv.className = 'calendar-month';

                const monthTitle = document.createElement('h3');
                monthTitle.textContent = monthName;
                monthTitle.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
                monthTitle.style.paddingBottom = "5px";
                monthTitle.style.marginBottom = "10px";
                monthTitle.style.marginTop = "20px";
                monthDiv.appendChild(monthTitle);

                gridDiv = document.createElement('div');
                gridDiv.className = 'calendar-grid';

                // Add Day Headers
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayNames.forEach(day => {
                    const header = document.createElement('div');
                    header.className = 'calendar-header';
                    header.textContent = day;
                    gridDiv.appendChild(header);
                });

                // Add padding for first execution of month if it doesn't start on Sunday
                const firstDayOfWeek = currentDate.getDay(); // 0 is Sunday
                for (let i = 0; i < firstDayOfWeek; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'calendar-day empty';
                    gridDiv.appendChild(emptyCell);
                }
            }

            // Calculate Target Chapter for this specific date
            const diffTime = currentDate - cleanStart;
            const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            let target = Math.floor((daysPassed + 1) * chaptersPerDay);
            if (target > config.totalChapters) target = config.totalChapters;

            // Create Day Cell
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';

            // Highlight today
            if (currentDate.getTime() === cleanToday.getTime()) {
                dayCell.classList.add('today');
            }

            // Highlight past days
            if (currentDate < cleanToday) {
                dayCell.classList.add('past');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = currentDate.getDate();
            dayCell.appendChild(dayNumber);

            const dayChapter = document.createElement('div');
            dayChapter.className = 'day-chapter';
            dayChapter.textContent = target;
            dayCell.appendChild(dayChapter);

            gridDiv.appendChild(dayCell);

            // Increment Date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Append final month
        if (monthDiv) {
            monthDiv.appendChild(gridDiv);
            calendarContainer.appendChild(monthDiv);
        }
    }
});
