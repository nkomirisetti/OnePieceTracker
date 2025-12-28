document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const currentDateEl = document.getElementById('currentDate');
    const targetChapterEl = document.getElementById('targetChapter');
    const currentArcEl = document.getElementById('currentArc'); // New Element
    const statusMessageEl = document.getElementById('statusMessage');
    const progressBarEl = document.getElementById('progressBar');
    const progressPercentEl = document.getElementById('progressPercent');

    // Gamification Data
    const crewData = [
        { name: "Zoro", chapter: 6, icon: "⚔️" },
        { name: "Usopp", chapter: 41, icon: "🤥" },
        { name: "Sanji", chapter: 68, icon: "🍳" },
        { name: "Nami", chapter: 94, icon: "🍊" },
        { name: "Chopper", chapter: 154, icon: "🦌" },
        { name: "Robin", chapter: 218, icon: "🌸" },
        { name: "Franky", chapter: 437, icon: "🤖" },
        { name: "Brook", chapter: 489, icon: "💀" },
        { name: "Jinbe", chapter: 976, icon: "🦈" }
    ];

    const bountyData = [
        { chapter: 1053, value: "3,000,000,000" },
        { chapter: 903, value: "1,500,000,000" },
        { chapter: 801, value: "500,000,000" },
        { chapter: 600, value: "400,000,000" },
        { chapter: 435, value: "300,000,000" },
        { chapter: 230, value: "100,000,000" },
        { chapter: 96, value: "30,000,000" },
        { chapter: 0, value: "0" }
    ];

    // Configuration is now loaded from config.js
    // const config = { ... };

    // Initialize App
    initApp();

    function initApp() {
        const today = new Date();
        const startDate = new Date(config.startDate);
        const endDate = new Date(config.endDate);
        // dailyGoal is now calculated dynamically

        // Display Date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = today.toLocaleDateString('en-US', options);

        // Calculate Days Passed
        // Set time to midnight for accurate day calculation
        const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const cleanStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const cleanEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        const diffTime = cleanToday - cleanStart;
        const totalDuration = cleanEnd - cleanStart;

        const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 0-indexed if starts today
        const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24)) + 1; // Inclusive of start date

        // Dynamic Goal Calculation
        // Spread total chapters over total days available
        const chaptersPerDay = config.totalChapters / totalDays;

        // Target is chaptersPerDay * daysPassed
        let targetChapter = Math.floor((daysPassed + 1) * chaptersPerDay);
        if (targetChapter < 0) targetChapter = 0; // Not started yet

        targetChapterEl.textContent = targetChapter;

        // Load Saved Progress
        updateStatus(targetChapter);
        updateGamification(targetChapter, chaptersPerDay);
        createFloatingElements();
    }

    function updateGamification(currentChapter, pace) {
        // 1. Update Bounty
        const currentBountyObj = bountyData.find(b => currentChapter >= b.chapter);
        const bountyValue = currentBountyObj ? currentBountyObj.value : "0";
        document.getElementById('bountyValue').textContent = bountyValue;

        // 2. Update Crew
        const crewContainer = document.getElementById('crewContainer');
        crewContainer.textContent = ''; // Clear existing
        crewData.forEach(member => {
            const isUnlocked = currentChapter >= member.chapter;
            const el = document.createElement('div');
            el.className = `crew-icon ${isUnlocked ? 'unlocked' : 'locked'}`;

            const iconText = document.createTextNode(member.icon);
            el.appendChild(iconText);

            const tooltip = document.createElement('div');
            tooltip.className = 'crew-tooltip';
            tooltip.textContent = `${member.name} (Ch ${member.chapter})`;
            el.appendChild(tooltip);

            crewContainer.appendChild(el);
        });

        // 3. Log Pose (Next Island)
        const nextArc = arcs.find(a => a.start > currentChapter);
        const nextArcEl = document.getElementById('nextArcName');
        const nextTimeEl = document.getElementById('nextArcTime');

        if (nextArc) {
            nextArcEl.textContent = nextArc.name;
            const chaptersToGo = nextArc.start - currentChapter;
            const daysToGo = Math.ceil(chaptersToGo / pace);
            nextTimeEl.textContent = `Arriving in ~${daysToGo} days`;
        } else {
            nextArcEl.textContent = "Laughtale Reached!";
            nextTimeEl.textContent = "Journey Complete";
        }
    }

    function getArc(chapter) {
        const arc = arcs.find(a => chapter >= a.start && chapter <= a.end);
        return arc ? arc.name : "Unknown Waters";
    }

    function updateStatus(target) {
        // Progress Bar Calculation
        // Based on total chapters
        const totalParams = config.totalChapters;
        const percent = Math.min(100, Math.max(0, (target / totalParams) * 100));
        progressBarEl.style.width = `${percent}%`;
        progressPercentEl.textContent = `${percent.toFixed(1)}%`;

        // Update Arc Display
        currentArcEl.textContent = getArc(target);

        // Status Message updates
        statusMessageEl.textContent = `Set sail for Chapter ${target}! 🌊`;
        statusMessageEl.style.color = '#e0ffe0';
    }

    function createFloatingElements() {
        const container = document.getElementById('floatingContainer');
        const icons = ['☠️', '🍖', '🍊', '⚔️', '👒', '⚓', '🌊'];

        // Create 15 floating items
        for (let i = 0; i < 15; i++) {
            const el = document.createElement('div');
            el.classList.add('floating-item');
            el.setAttribute('aria-hidden', 'true'); // Decorative only
            el.textContent = icons[Math.floor(Math.random() * icons.length)];

            // Randomize position and animation details
            el.style.left = `${Math.random() * 100}%`;
            el.style.animationDuration = `${10 + Math.random() * 20}s`; // 10-30s duration
            el.style.animationDelay = `-${Math.random() * 20}s`; // start at random times
            el.style.fontSize = `${1.5 + Math.random()}rem`;

            container.appendChild(el);
        }
    }
});
