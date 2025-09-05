// Enhanced Server-Side Rendering server that fetches real data from your backend API
// This ensures meta tags are visible in page source with real article data

const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Your backend URL - update this to match your actual backend
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Extract plain text from HTML
function extractTextFromHTML(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Escape HTML for safe insertion
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Fetch article data from your backend API
async function fetchArticleFromAPI(articleId) {
  try {
    const response = await fetch(`${BACKEND_URL}/news/${encodeURIComponent(articleId)}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching article from API:', error);
  }
  return null;
}

// Generate meta tags for an article
function generateArticleMetaTags(article, baseUrl) {
  const plainTextDescription = extractTextFromHTML(article.description);
  const metaDescription = plainTextDescription.length > 160 
    ? plainTextDescription.substring(0, 160) + '...' 
    : plainTextDescription;

  const title = `${article.title} — ${article.location}, ${article.datetime_str}`;
  const url = `${baseUrl}/?id=${article.id}`;

  return {
    title: escapeHtml(title),
    description: escapeHtml(metaDescription),
    image: escapeHtml(article.image_url),
    url: escapeHtml(url),
    type: 'article',
    siteName: 'Новости Иркутска',
    locale: 'ru_RU',
    author: 'Новости Иркутска',
    publishedTime: article.datetime_iso || article.datetime_str,
    modifiedTime: article.datetime_iso || article.datetime_str,
    category: escapeHtml(article.category),
    keywords: escapeHtml([article.category, article.location, 'новости иркутска'].join(', '))
  };
}

// Generate JSON-LD for an article
function generateArticleJSONLD(article, baseUrl) {
  const plainTextDescription = extractTextFromHTML(article.description);
  
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": plainTextDescription.substring(0, 200),
    "image": [article.image_url],
    "datePublished": article.datetime_iso || article.datetime_str,
    "dateModified": article.datetime_iso || article.datetime_str,
    "author": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": baseUrl
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/?id=${article.id}`
    },
    "articleSection": article.category,
    "keywords": [article.category, article.location, "новости иркутска"].join(", "),
    "about": {
      "@type": "Place",
      "name": article.location
    }
  };
}

// Generate HTML for an article page with real data
function generateArticleHTML(article, baseUrl) {
  const meta = generateArticleMetaTags(article, baseUrl);
  const jsonLd = generateArticleJSONLD(article, baseUrl);
  
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${meta.url}" />
    <meta name="robots" content="index,follow" />
    
    <!-- Basic Meta Tags -->
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <meta name="keywords" content="${meta.keywords}">
    <meta name="author" content="${meta.author}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:url" content="${meta.url}" />
    <meta property="og:type" content="${meta.type}" />
    <meta property="og:site_name" content="${meta.siteName}" />
    <meta property="og:locale" content="${meta.locale}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${meta.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
    
    <!-- Article Meta Tags -->
    <meta property="article:published_time" content="${meta.publishedTime}" />
    <meta property="article:modified_time" content="${meta.modifiedTime}" />
    <meta property="article:section" content="${meta.category}" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
    </script>
    
    <!-- Preconnect/Hint -->
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>`;
}

// Handle article pages with dynamic meta tags from real API data
app.get('/', async (req, res) => {
  const articleId = req.query.id;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  if (articleId) {
    try {
      // Fetch real article data from your backend API
      const article = await fetchArticleFromAPI(articleId);
      
      if (article) {
        // Generate HTML with real article data and dynamic meta tags
        const html = generateArticleHTML(article, baseUrl);
        res.send(html);
        console.log(`✅ Served article ${articleId} with real meta tags: ${article.title}`);
      } else {
        // Article not found, serve default page
        const indexPath = path.join(__dirname, '../dist/index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Article not found and build files missing');
        }
        console.log(`❌ Article ${articleId} not found in API`);
      }
    } catch (error) {
      console.error('Error serving article:', error);
      // Fallback to default page
      const indexPath = path.join(__dirname, '../dist/index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(500).send('Server error');
      }
    }
  } else {
    // Serve default index.html for home page
    const indexPath = path.join(__dirname, '../dist/index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Build the project first: npm run build');
    }
  }
});

// Handle all other routes (SPA routing)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build the project first: npm run build');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced SSR Server running on http://localhost:${PORT}`);
  console.log(`🔗 Backend API: ${BACKEND_URL}`);
  console.log(`🏠 Home page: http://localhost:${PORT}/`);
  console.log(`📰 Article pages: http://localhost:${PORT}/?id=<article_id>`);
  console.log(`\n✨ Meta tags are now visible in page source with real article data!`);
  console.log(`\n📋 To test:`);
  console.log(`   1. Make sure your backend is running on ${BACKEND_URL}`);
  console.log(`   2. Visit any article URL like http://localhost:${PORT}/?id=1`);
  console.log(`   3. Right-click → "View Page Source" to see dynamic meta tags`);
});

module.exports = app;
