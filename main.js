const API = 'https://fakestoreapi.com/products?limit=20';
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const empty = document.getElementById('empty');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

let PRODUCTS = [];

async function loadProducts() {
    try {
        status.style.display = 'flex';
        grid.style.display = 'none';
        empty.style.display = 'none';
        status.textContent = 'Yuklanyapti...';

        const res = await fetch(API);
        if (!res.ok) throw new Error('API xatosi: ' + res.status);
        PRODUCTS = await res.json();
        render(PRODUCTS);
    } catch (err) {
        status.textContent = 'Xato: ' + err.message;
        console.error(err);
    }
}

function render(items) {
    grid.innerHTML = '';
    if (!items || items.length === 0) {
        status.style.display = 'none';
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    items.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';

        card.innerHTML = `
            <div class="imgwrap"><img loading="lazy" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}"/></div>
            <div class="category">${escapeHtml(capitalize(p.category))}</div>
            <div class="title">${escapeHtml(p.title)}</div>
            <div class="price">
                <strong>\$${Number(p.price).toFixed(2)}</strong>
                <span class="badge">Rating: ${p.rating && p.rating.rate ? p.rating.rate : '—'}</span>
            </div>
            `;

        grid.appendChild(card);
    });

    status.style.display = 'none';
    empty.style.display = 'none';
    grid.style.display = 'grid';
}

function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    let filtered = PRODUCTS.filter(p => {
        return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });

    const sort = sortSelect.value;
    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

    render(filtered);
}

searchInput.addEventListener('input', () => applyFilters());
sortSelect.addEventListener('change', () => applyFilters());

function escapeHtml(text) {
    if (text === undefined || text === null) return '';
    return String(text).replace(/[&<>\"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', '\'': '&#39;' }[c];
    });
}
function capitalize(s) { return String(s || '').replace(/(^|\s)\S/g, l => l.toUpperCase()); }

loadProducts();