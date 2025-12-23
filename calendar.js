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
        const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
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

                // Add padding for first execution of month if it doesn't start on Sunday? 
                // Creating a simple grid 7-wide would require empty cells for alignment.
                // For simplicity first iteration, we might just list days or do a flex wrap.
                // Let's do a flex wrap "cards" style which is more responsive and easier than strict 7-col grid without alignment logic.
                // If user wants strict calendar (Sun-Sat), we need day of week logic.
                // Let's try strict calendar for "wow" factor.

                const firstDayOfWeek = currentDate.getDay(); // 0 is Sunday
                for (let i = 0; i < firstDayOfWeek; i++) {
                    const emptyCell = document.createElement('div');
                    emptyCell.className = 'calendar-day empty';
                    gridDiv.appendChild(emptyCell);
                }
            }

            // Calculate Target Chapter for this specific date
            // Days passed since start (inclusive of this day?)
            // If start is Dec 16, and today is Dec 16, daysPassed should be 0 or 1?
            // In app.js: const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24)); (0-indexed)
            // But targetChapter = (daysPassed + 1) * rate. 
            // So Dec 16 (0 days passed) -> Target 1 * rate.

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

            dayCell.innerHTML = `
                <div class="day-number">${currentDate.getDate()}</div>
                <div class="day-chapter">${target}</div>
            `;

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
