// Server-Side Rendering server for dynamic meta tags
// This ensures meta tags are visible in page source for SEO

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Mock API endpoint for articles (replace with your actual API)
const mockArticles = {
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
    publishedTime: article.datetime_iso,
    modifiedTime: article.datetime_iso,
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
    "datePublished": article.datetime_iso,
    "dateModified": article.datetime_iso,
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

// Generate HTML for an article page
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

// Handle article pages with dynamic meta tags
app.get('/', (req, res) => {
  const articleId = req.query.id;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  if (articleId && mockArticles[articleId]) {
    // Generate HTML with dynamic meta tags for article
    const article = mockArticles[articleId];
    const html = generateArticleHTML(article, baseUrl);
    res.send(html);
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
  console.log(`🚀 SSR Server running on http://localhost:${PORT}`);
  console.log(`📰 Article pages with dynamic meta tags:`);
  Object.keys(mockArticles).forEach(id => {
    console.log(`   http://localhost:${PORT}/?id=${id}`);
  });
  console.log(`🏠 Home page: http://localhost:${PORT}/`);
  console.log(`\n✨ Meta tags are now visible in page source!`);
});

module.exports = app;
