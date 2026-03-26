// Universal app logic for all niche pages
let camsData = [];
let sortMode = 'viewers';

async function fetchCams(filter = 'all') {
    try {
        const config = window.NICHE_CONFIG;
        document.getElementById('loading').textContent = `🔄 Loading ${config.title}...`;
        
        // Enhanced API call with multiple tags for better results
        const tags = [config.tag];
        if (config.tag === 'feet') tags.push('nylon', 'soles');
        
        const url = `https://chaturbate.com/api/public/affiliates/onlinerooms/?
            wm=T2CSW&
            client_ip=request_ip&
            format=json&
            limit=200&
            hd=true&
            ${tags.map(t => `tag=${t}`).join('&')}&
            gender=f`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        camsData = data.results.filter(room => 
            room.current_show === 'public' && 
            room.num_users > 5
        );
        
        document.getElementById('online-count').textContent = data.count;
        document.getElementById('hd-count').textContent = camsData.filter(r => r.is_hd).length;
        
        renderCams();
        
    } catch (error) {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').innerHTML = '⚠️ Connection issue. Retrying...';
        setTimeout(fetchCams, 5000);
    }
}

function renderCams() {
    const container = document.getElementById('cams-container');
    const config = window.NICHE_CONFIG;
    
    // Sort logic
    let sortedCams = [...camsData];
    if (sortMode === 'viewers') {
        sortedCams.sort((a, b) => b.num_users - a.num_users);
    }
    
    container.innerHTML = sortedCams.slice(0, 24).map(room => `
        <article class="cam-card" itemscope itemtype="https://schema.org/VideoObject">
            <div class="cam-thumb">
                <img src="${room.image_url_360x270}" 
                     alt="${room.username} - ${room.room_subject}" 
                     loading="lazy"
                     itemprop="thumbnail">
                <div class="overlay">
                    <span class="viewers" aria-label="Viewers">${room.num_users}</span>
                    <span class="status ${room.is_hd ? 'hd' : ''}">${room.is_hd ? 'HD' : 'SD'}</span>
                </div>
            </div>
            <div class="cam-details">
                <h3 itemprop="name">${room.username}</h3>
                <p class="subject">${room.room_subject}</p>
                <div class="meta">
                    <span>👥 ${room.num_users}</span>
                    <span>❤️ ${room.num_followers.toLocaleString()}</span>
                    <span>${room.age}yo</span>
                    ${room.country ? `<span>🇺🇸</span>` : ''}
                </div>
                <a href="${room.chat_room_url_revshare}" 
                   target="_blank" 
                   class="cta-primary"
                   itemprop="url">
                   Watch FREE Now →
                </a>
            </div>
        </article>
    `).join('');
}

// Auto-refresh & init
fetchCams();
setInterval(fetchCams, 90000); // 90s refresh

// PWA Install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    document.getElementById('install-prompt').style.display = 'flex';
});

function installPWA() {
    deferredPrompt.prompt();
}
