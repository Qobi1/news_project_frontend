import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaTagInjectorProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  keywords?: string;
  jsonLd?: any;
}

const MetaTagInjector: React.FC<MetaTagInjectorProps> = ({
  title = 'Новости Иркутска - Последние новости и события',
  description = 'Актуальные новости Иркутска и Иркутской области. События, мероприятия, происшествия и важные новости региона.',
  image = '/api/placeholder/1200/630',
  url = window.location.href,
  type = 'website',
  siteName = 'Новости Иркутска',
  locale = 'ru_RU',
  author = 'Новости Иркутска',
  publishedTime,
  modifiedTime,
  category,
  keywords,
  jsonLd
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article Meta Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, null, 2)}
        </script>
      )}
    </Helmet>
  );
};

export default MetaTagInjector;
