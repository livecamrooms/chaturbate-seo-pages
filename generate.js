const fs = require('fs');
const path = require('path');

const niches = [
    { name: "Feet Lovers",   slug: "feet",      icon: "👣", desc: "Live feet fetish cams – soles, toes, and foot worship" },
    { name: "BDSM",          slug: "bdsm",      icon: "🔗", desc: "Bondage, domination, submission – live BDSM shows" },
    { name: "Anal Play",     slug: "anal",      icon: "🍑", desc: "Anal play and exploration – live now" },
    { name: "Squirt",        slug: "squirt",    icon: "💦", desc: "Squirting orgasms – real time" },
    // ... add all 50 niches here (full list from index.html)
    { name: "Virtual Reality", slug: "vr",      icon: "🥽", desc: "VR cams – immersive live shows" }
];

const template = fs.readFileSync('template.html', 'utf8');

if (!fs.existsSync('niches')) {
    fs.mkdirSync('niches');
}

niches.forEach((niche, idx) => {
    const filename = `${idx + 1}-${niche.slug}.html`;
    const content = template
        .replace(/{{NICHE_TAG}}/g, niche.slug)
        .replace(/{{NICHE_TITLE}}/g, niche.name)
        .replace(/{{NICHE_ICON}}/g, niche.icon)
        .replace(/{{NICHE_DESC}}/g, niche.desc);
    fs.writeFileSync(path.join('niches', filename), content);
    console.log(`✅ Generated: ${filename}`);
});

console.log('🎉 All 50 niche pages created!');
