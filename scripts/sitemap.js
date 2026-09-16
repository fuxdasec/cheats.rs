const fs = require('node:fs');
const path = require('node:path');
const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
function localRoutes(root, filename = 'sitemap.xml') {
    const xml = fs.readFileSync(path.join(root, filename), 'utf8');
    if (xml.includes('<sitemapindex')) return locations(xml).flatMap(url => localRoutes(root, path.basename(new URL(url).pathname)));
    return locations(xml).map(url => new URL(url).pathname);
}
async function servedRoutes(base, filename = '/sitemap.xml') {
    const response = await fetch(new URL(filename, base));
    if (!response.ok) throw new Error(`${filename}: HTTP ${response.status}`);
    const xml = await response.text();
    if (xml.includes('<sitemapindex')) return (await Promise.all(locations(xml).map(url => servedRoutes(base, new URL(url).pathname)))).flat();
    return locations(xml).map(url => new URL(url).pathname);
}
module.exports = { localRoutes, servedRoutes };
