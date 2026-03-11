const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The CSS injection script was slightly broken in the previous step because of how I replaced the comments.
// Let's ensure the data stream animation works by defining it explicitly in a style block.

html = html.replace('</style>', `
        @keyframes dataStream {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes bounceAnim {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px); }
            60% { transform: translateY(-7px); }
        }
</style>`);

// Fix Tailwind classes that rely on custom animations since JIT compilation is via CDN and might not pick up complex arbitrary variants without proper config
html = html.replace('animate-[dataStream_1s_linear_infinite]', '[animation:dataStream_1.5s_linear_infinite]');
html = html.replace('animate-[bounce_0.5s_ease-out]', '[animation:bounceAnim_0.5s_ease-out]');
html = html.replace('animate-[fadeIn_0.2s_ease-out]', '[animation:fadeIn_0.2s_ease-out]');

// Ensure that next button correctly handles step 4 edge case (hide)
const navClickLogic = `
        // Navigation click handler
        document.querySelectorAll('.step-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                if (step <= maxUnlockedStep) {
                    currentStep = step;
                    updateStepperUI();
                }
            });
        });`;

if (!html.includes('item.addEventListener(\'click\'')) {
   html += navClickLogic;
}

fs.writeFileSync('index.html', html);
console.log('CSS fixed.');
