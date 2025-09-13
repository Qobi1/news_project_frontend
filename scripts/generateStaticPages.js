// Build-time script to generate static HTML pages with proper meta tags
// This ensures search engines see the correct meta tags

const fs = require('fs');
const path = require('path');

// Mock data - in production, this would fetch from your API
const mockArticles = [
  {
    id: 1,
    title: "Открыто целительное дыхание: новые практики и техники",
    datetime_str: "2 сентября, вт 19:00",
    datetime_iso: "2025-09-02T19:00:00",
    location: "Центр Старшилова Человека",
    description: "<p>Центр йоги «Центр Старшилова Человека» приглашает всех желающих на мастер-класс «Целительное дыхание».</p>",
    image_url: "/api/placeholder/280/190",
    category: "практика"
  }
];

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
function generateArticleMetaTags(article) {
  const plainTextDescription = extractTextFromHTML(article.description);
  const metaDescription = plainTextDescription.length > 160 
    ? plainTextDescription.substring(0, 160) + '...' 
    : plainTextDescription;

  const title = `${article.title} — ${article.location}, ${article.datetime_str}`;
  const url = `/?id=${article.id}`;

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
function generateArticleJSONLD(article) {
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
      "url": "/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Новости Иркутска",
      "url": "/"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `/?id=${article.id}`
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
function generateArticleHTML(article) {
  const meta = generateArticleMetaTags(article);
  const jsonLd = generateArticleJSONLD(article);
  
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

// Generate static HTML files
function generateStaticPages() {
  const distDir = path.join(__dirname, '../dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Generate article pages
  mockArticles.forEach(article => {
    const html = generateArticleHTML(article);
    const filename = `article-${article.id}.html`;
    const filepath = path.join(distDir, filename);
    
    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`Generated: ${filename}`);
  });
  
  console.log('Static pages generated successfully!');
}

// Run if called directly
if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages, generateArticleHTML };
