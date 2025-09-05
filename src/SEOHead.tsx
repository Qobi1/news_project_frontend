import React, { useEffect } from 'react';
import { 
  updateSEO, 
  addJSONLD, 
  removeJSONLD, 
  newsArticleToSEOData, 
  generateNewsArticleJSONLD,
  generateWebsiteJSONLD,
  generateBreadcrumbJSONLD,
  defaultSEO,
  NewsArticleData
} from './seo';

interface SEOHeadProps {
  article?: NewsArticleData | null;
  isArticle?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({ article, isArticle = false }) => {
  useEffect(() => {
    if (isArticle && article) {
      // Update SEO for news article
      const seoData = newsArticleToSEOData(article, window.location.origin);
      
      // Update basic meta tags
      updateSEO(seoData);
      
      // Remove existing JSON-LD scripts
      removeJSONLD('news-article-jsonld');
      removeJSONLD('breadcrumb-jsonld');
      
      // Add news article JSON-LD
      const articleJsonLd = generateNewsArticleJSONLD(article, window.location.origin);
      addJSONLD(articleJsonLd, 'news-article-jsonld');
      
      // Add breadcrumb JSON-LD
      const breadcrumbs = [
        { name: 'Главная', url: window.location.origin },
        { name: article.category, url: `${window.location.origin}/?category=${encodeURIComponent(article.category)}` },
        { name: article.title, url: `${window.location.origin}/?id=${article.id}` }
      ];
      const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);
      addJSONLD(breadcrumbJsonLd, 'breadcrumb-jsonld');
    } else {
      // Reset to default SEO for home page
      updateSEO(defaultSEO);
      
      // Remove article-specific JSON-LD
      removeJSONLD('news-article-jsonld');
      removeJSONLD('breadcrumb-jsonld');
      
      // Add website JSON-LD
      const websiteJsonLd = generateWebsiteJSONLD();
      addJSONLD(websiteJsonLd, 'website-jsonld');
    }
  }, [article, isArticle]);

  return null; // This component doesn't render anything
};

export default SEOHead;
