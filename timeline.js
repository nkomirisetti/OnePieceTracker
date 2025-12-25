document.addEventListener('DOMContentLoaded', () => {
    const timelineList = document.getElementById('timelineList');

    // Configuration is now loaded from config.js
    // const config = { ... };

    renderTimeline();

    function renderTimeline() {
        timelineList.innerHTML = '';

        const startDate = new Date(config.startDate);
        const endDate = new Date(config.endDate);

        // Clean dates
        const cleanStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const cleanEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        const totalDuration = cleanEnd - cleanStart; // ms
        const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
        const chaptersPerDay = config.totalChapters / totalDays;

        arcs.forEach(arc => {
            // Calculate when we hit the END of this arc
            // But verify we don't exceed total chapters.
            let targetChapter = arc.end;
            if (targetChapter > config.totalChapters) targetChapter = config.totalChapters;

            // Days required to reach this chapter
            // target = day * chaptersPerDay => day = target / chaptersPerDay
            const daysToReach = Math.ceil(targetChapter / chaptersPerDay);

            // Add days to start date
            // Note: daysToReach is from Day 0 (Start Date)
            const targetDate = new Date(cleanStart);
            targetDate.setDate(cleanStart.getDate() + daysToReach);

            // Create List Item
            const li = document.createElement('li');
            li.className = 'timeline-item';

            // Format Date
            const dateStr = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            li.innerHTML = `
                <span class="arc-name">${arc.name}</span>
                <span class="arc-chapter">Ch. ${targetChapter}</span>
                <span class="arc-date">${dateStr}</span>
            `;

            timelineList.appendChild(li);

            // Stop if we hit the end
            if (arc.end >= config.totalChapters) return;
        });
    }
});
