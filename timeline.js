document.addEventListener('DOMContentLoaded', () => {
    const timelineList = document.getElementById('timelineList');

    // Duplicate Arcs Data
    const arcs = [
        { name: "East Blue Saga", start: 1, end: 100 },
        { name: "Alabasta Saga", start: 101, end: 217 },
        { name: "Sky Island Saga", start: 218, end: 303 },
        { name: "Water 7 Saga", start: 304, end: 441 },
        { name: "Thriller Bark Saga", start: 442, end: 490 },
        { name: "Summit War Saga", start: 491, end: 597 },
        { name: "Fish-Man Island Saga", start: 598, end: 653 },
        { name: "Punk Hazard Saga", start: 654, end: 699 },
        { name: "Dressrosa Saga", start: 700, end: 801 },
        { name: "Zou Saga", start: 802, end: 822 },
        { name: "Whole Cake Island Saga", start: 823, end: 902 },
        { name: "Reverie Arc", start: 903, end: 908 },
        { name: "Wano Country Saga", start: 909, end: 1057 },
        { name: "Final Saga", start: 1058, end: 9999 } // Cap at total chapters
    ];

    // Configuration (Embedded to avoid local file fetch errors)
    const config = {
        "startDate": "2025-12-16",
        "endDate": "2026-03-12",
        "totalChapters": 1168
    };

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
                <span class="arc-date">${dateStr}</span>
            `;

            timelineList.appendChild(li);

            // Stop if we hit the end
            if (arc.end >= config.totalChapters) return;
        });
    }
});
