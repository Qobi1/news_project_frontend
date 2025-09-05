// Vite plugin to inject meta tags at build time
import { Plugin } from 'vite';

interface MetaTagOptions {
  articles: Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    location: string;
    datetime_str: string;
    datetime_iso: string;
  }>;
}

export function metaTagInjector(options: MetaTagOptions): Plugin {
  return {
    name: 'meta-tag-injector',
    generateBundle() {
      // Generate static HTML files for each article
      options.articles.forEach(article => {
        const html = generateArticleHTML(article);
        this.emitFile({
          type: 'asset',
          fileName: `article-${article.id}.html`,
          source: html
        });
      });
    }
  };
}

function generateArticleHTML(article: any): string {
  const title = `${article.title} — ${article.location}, ${article.datetime_str}`;
  const description = article.description.length > 160 
    ? article.description.substring(0, 160) + '...' 
    : article.description;
  const url = `https://news.irk.ru/?id=${article.id}`;

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index,follow" />
    
    <!-- Basic Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${article.category}, ${article.location}, новости иркутска">
    <meta name="author" content="Новости Иркутска">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Новости Иркутска" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${article.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${article.image}" />
    
    <!-- Article Meta Tags -->
    <meta property="article:published_time" content="${article.datetime_iso}" />
    <meta property="article:modified_time" content="${article.datetime_iso}" />
    <meta property="article:section" content="${article.category}" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": "${article.title}",
      "description": "${description}",
      "image": ["${article.image}"],
      "datePublished": "${article.datetime_iso}",
      "dateModified": "${article.datetime_iso}",
      "author": {
        "@type": "Organization",
        "name": "Новости Иркутска",
        "url": "https://news.irk.ru"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Новости Иркутска",
        "url": "https://news.irk.ru"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${url}"
      },
      "articleSection": "${article.category}",
      "keywords": "${article.category}, ${article.location}, новости иркутска",
      "about": {
        "@type": "Place",
        "name": "${article.location}"
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
