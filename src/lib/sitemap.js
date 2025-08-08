import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base URL of your website
const BASE_URL = ''; // TODO: Change to the actual URL of the website

// Function to get last modified date of a file
function getLastModified(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}

// Function to generate sitemap XML
function generateSitemap() {
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    // Add main pages
    const mainPages = [
        { url: '/', priority: '1.0', changefreq: 'monthly' }
    ];

    mainPages.forEach(page => {
        const lastmod = getLastModified(path.join(__dirname, '..', 'routes', page.url === '/' ? '+page.svelte' : `${page.url}/+page.svelte`));
        sitemap.push(`
    <url>
        <loc>${BASE_URL}${page.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>`);
    });

    // Add project pages
    const projectsDir = path.join(__dirname, '..', 'routes', 'projects');
    if (fs.existsSync(projectsDir)) {
        const projects = fs.readdirSync(projectsDir)
            .filter(dir => fs.statSync(path.join(projectsDir, dir)).isDirectory())
            .filter(dir => dir !== '+page.svelte');

        projects.forEach(project => {
            const lastmod = getLastModified(path.join(projectsDir, project, '+page.svelte'));
            sitemap.push(`
    <url>
        <loc>${BASE_URL}/projects/${project}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>`);
        });
    }

    // Add blog posts
    const blogDir = path.join(__dirname, '..', 'routes', 'blog');
    if (fs.existsSync(blogDir)) {
        const posts = fs.readdirSync(blogDir)
            .filter(dir => fs.statSync(path.join(blogDir, dir)).isDirectory())
            .filter(dir => dir !== '+page.svelte');

        posts.forEach(post => {
            const lastmod = getLastModified(path.join(blogDir, post, '+page.svelte'));
            sitemap.push(`
    <url>
        <loc>${BASE_URL}/blog/${post}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`);
        });
    }

    sitemap.push('</urlset>');

    // Write sitemap to file
    fs.writeFileSync(path.join(__dirname, '..', '..', 'static', 'sitemap.xml'), sitemap.join('\n'));
}

// Generate sitemap
generateSitemap(); 