## 2025-12-28 - Insecure DOM Manipulation
**Vulnerability:** Usage of `innerHTML` to insert dynamic content in `app.js`, `calendar.js`, and `timeline.js`.
**Learning:** Even with trusted static data, using `innerHTML` creates a pattern that is vulnerable if data sources become dynamic or user-controlled.
**Prevention:** Always use `document.createElement` and `textContent` (or proper sanitization libraries) when handling text insertion to prevent XSS.
