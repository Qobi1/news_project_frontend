// Server-side meta tag generation for production
// This can be used with Express.js or any Node.js server

const express = require('express');
const path = require('path');

// Mock article data - in production, fetch from your database/API
const articles = {
  1: {
    id: 1,
    title: "Открыто целительное дыхание: новые практики и техники",
    datetime_str: "2 сентября, вт 19:00",
    datetime_iso: "2025-09-02T19:00:00",
    location: "Центр Старшилова Человека",
    description: "<p>Центр йоги «Центр Старшилова Человека» приглашает всех желающих на мастер-класс «Целительное дыхание».</p>",
    image_url: "https://static.irk.ru/media/img/site/gallery/30722/f06cc952-d7dc-4ce5-a958-aadaf17631c7_jpg_280x190_crop_q85.jpg",
    category: "практика"
  },
  2: {
    id: 2,
    title: "В Иркутске открылся новый парк",
    datetime_str: "3 сентября, ср 10:00",
    datetime_iso: "2025-09-03T10:00:00",
    location: "Иркутск",
    description: "<p>Сегодня в Иркутске открылся новый парк для семейного отдыха.</p>",
    image_url: "https://example.com/park.jpg",
    category: "новости"
  }
};

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

// Generate HTML for an article page
function generateArticleHTML(article, baseUrl) {
  const plainTextDescription = extractTextFromHTML(article.description);
  const metaDescription = plainTextDescription.length > 160 
    ? plainTextDescription.substring(0, 160) + '...' 
    : plainTextDescription;

  const title = `${article.title} — ${article.location}, ${article.datetime_str}`;
  const url = `${baseUrl}/?id=${article.id}`;

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta name="robots" content="index,follow" />
    
    <!-- Basic Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <meta name="keywords" content="${escapeHtml([article.category, article.location, 'новости иркутска'].join(', '))}">
    <meta name="author" content="Новости Иркутска">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Новости Иркутска" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(metaDescription)}" />
    <meta property="og:image" content="${escapeHtml(article.image_url)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(article.image_url)}" />
    
    <!-- Article Meta Tags -->
    <meta property="article:published_time" content="${article.datetime_iso}" />
    <meta property="article:modified_time" content="${article.datetime_iso}" />
    <meta property="article:section" content="${escapeHtml(article.category)}" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${escapeHtml(article.title)}",
      "description": "${escapeHtml(metaDescription)}",
      "image": ["${escapeHtml(article.image_url)}"],
      "datePublished": "${article.datetime_iso}",
      "dateModified": "${article.datetime_iso}",
      "author": {
        "@type": "Organization",
        "name": "Новости Иркутска",
        "url": "${baseUrl}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Новости Иркутска",
        "url": "${baseUrl}"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${escapeHtml(url)}"
      },
      "articleSection": "${escapeHtml(article.category)}",
      "keywords": "${escapeHtml([article.category, article.location, 'новости иркутска'].join(', '))}",
      "about": {
        "@type": "Place",
        "name": "${escapeHtml(article.location)}"
      }
    }
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

// Express.js middleware for server-side meta tags
function metaTagMiddleware(req, res, next) {
  const articleId = req.query.id;
  
  if (articleId && articles[articleId]) {
    const article = articles[articleId];
    const html = generateArticleHTML(article, req.protocol + '://' + req.get('host'));
    res.send(html);
  } else {
    next(); // Continue to next middleware/route
  }
}

// Example Express.js server setup
function createServer() {
  const app = express();
  
  // Serve static files
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Meta tag middleware for article pages
  app.get('/', metaTagMiddleware);
  
  // Fallback to index.html for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
  
  return app;
}

module.exports = { 
  generateArticleHTML, 
  metaTagMiddleware, 
  createServer,
  articles 
};
