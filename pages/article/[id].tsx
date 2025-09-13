import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NewsArticleData } from '../../types';
import { fetchNewsById, fetchNewsData } from '../../lib/api';
import { 
  newsArticleToSEOData, 
  generateNewsArticleJSONLD, 
  generateEventJSONLD, 
  generateBreadcrumbJSONLD,
  isEventContent 
} from '../../lib/seo';
import { formatDate, wrapImagesScrollable, getIconClass } from '../../lib/utils';
import RandomNews from '../../components/RandomNews';

interface ArticlePageProps {
  article: NewsArticleData;
  relatedArticles: NewsArticleData[];
}

export default function ArticlePage({ article, relatedArticles }: ArticlePageProps) {
  const router = useRouter();
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const seoData = newsArticleToSEOData(article, baseUrl);
  const isEvent = isEventContent(article);
  
  // Generate JSON-LD structured data
  const articleJsonLd = isEvent 
    ? generateEventJSONLD(article, baseUrl)
    : generateNewsArticleJSONLD(article, baseUrl);
    
  const breadcrumbs = [
    { name: 'Главная', url: baseUrl },
    { name: article.category, url: `${baseUrl}/?category=${encodeURIComponent(article.category)}` },
    { name: article.title, url: `${baseUrl}/article/${article.id}` }
  ];
  const breadcrumbJsonLd = generateBreadcrumbJSONLD(breadcrumbs);

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.tags?.join(', ')} />
        <meta name="author" content={seoData.author} />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="yandex" content="index,follow" />
        
        {/* Language and locale */}
        <meta httpEquiv="content-language" content="ru" />
        <meta name="language" content="Russian" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content={seoData.type} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:site_name" content={seoData.siteName} />
        <meta property="og:locale" content={seoData.locale} />
        
        {/* Article-specific Open Graph tags */}
        <meta property="article:published_time" content={seoData.publishedTime} />
        <meta property="article:modified_time" content={seoData.modifiedTime} />
        <meta property="article:author" content={seoData.author} />
        <meta property="article:section" content={seoData.category} />
        {seoData.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        
        {/* Yandex specific meta tags */}
        <meta name="yandex-verification" content="" />
        <meta name="yandex" content="all" />
        
        {/* Google specific meta tags */}
        <meta name="google-site-verification" content="" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Additional SEO meta tags */}
        <meta name="news_keywords" content={seoData.tags?.join(', ')} />
        <meta name="article:section" content={seoData.category} />
        <meta name="article:tag" content={seoData.tags?.join(', ')} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>

      {/* Navigation for Article Page */}
      <nav className="navbar navbar-expand-lg sticky-top shadow">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold fs-3">
            <i className={getIconClass('BRAND', 'LG') + ' me-2'}></i>Новости
          </Link>
        </div>
      </nav>

      {/* Breadcrumbs for Article Detail Page */}
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-white px-3 py-2 rounded shadow-sm">
            <li className="breadcrumb-item">
              <Link href="/" style={{ textDecoration: 'none', color: '#007bff' }}>Главная</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/?category=${encodeURIComponent(article.category)}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                {article.category}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{article.title}</li>
          </ol>
        </nav>
      </div>

      {/* Article Detail View */}
      <main className="py-4">
        <div className="container">
          <button 
            className="btn btn-outline-primary mb-4"
            onClick={handleBackToHome}
          >
            <i className={getIconClass('BACK', 'SM') + ' me-2'}></i>Назад на главную
          </button>
          <article className="bg-white rounded shadow-sm overflow-hidden">
            <div className="p-4 p-lg-5">
              <header className="mb-4">
                <span className="badge bg-primary mb-3 fs-6">{article.category}</span>
                <h1 className="display-5 fw-bold mb-3">{article.title}</h1>
                <div className="d-flex flex-wrap align-items-center text-muted mb-3">
                  <div className="me-4 mb-2">
                    <i className={getIconClass('CALENDAR', 'SM') + ' me-2'}></i>
                    {formatDate(article.datetime_str)}
                  </div>
                  <div className="me-4 mb-2">
                    <i className={getIconClass('PERSON', 'SM') + ' me-2'}></i>
                    {article.location}
                  </div>
                  <div className="mb-2">
                    <i className={getIconClass('CLOCK', 'SM') + ' me-2'}></i>
                    5 мин чтения
                  </div>
                </div>
              </header>
              
              <div className="article-content">
                <div
                  dangerouslySetInnerHTML={{ __html: wrapImagesScrollable(article.description) }}
                />
              </div>
              
              <footer className="border-top pt-4 mt-5" style={{borderTop: 'none'}}>
                <div className="row">
                  <div className="col-md-6 text-md-end">
                    {/* Removed copyright text as requested */}
                  </div>
                </div>
              </footer>
            </div>
          </article>
        </div>
      </main>

      {/* Recommended News Section */}
      <RandomNews backendUrl={process.env.BACKEND_URL || 'http://localhost:8000'} />

      {/* Footer */}
      <footer className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="fw-bold mb-3" style={{color: '#ffeb3b'}}>
                <i className={getIconClass('BRAND', 'MD') + ' me-2'}></i>Новости
              </h5>
              <p className="text-muted" style={{color: '#fff'}}>
                Ваш надежный источник достоверных новостей и подробного анализа.
              </p>
              <div className="social-links">
                <a href="#" className="me-3 fs-4" style={{color: '#ffeb3b'}}>
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="me-3 fs-4" style={{color: '#ffeb3b'}}>
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="me-3 fs-4" style={{color: '#ffeb3b'}}>
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="me-3 fs-4" style={{color: '#ffeb3b'}}>
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="fs-4" style={{color: '#ffeb3b'}}>
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3" style={{color: '#ffeb3b'}}>Быстрые ссылки</h6>
              <ul className="list-unstyled">
                <li><Link href="/" className="text-muted text-decoration-none" style={{color: '#fff'}}>Главная</Link></li>
                <li><Link href="/#news" className="text-muted text-decoration-none" style={{color: '#fff'}}>Новости</Link></li>
                <li><Link href="/#about" className="text-muted text-decoration-none" style={{color: '#fff'}}>О нас</Link></li>
              </ul>
            </div>
            <div className="col-lg-4 mb-4">
              <h6 className="fw-bold mb-3" style={{color: '#ffeb3b'}}>Подписка на новости</h6>
              <p className="mb-3" style={{color: '#fff'}}>Подпишитесь, чтобы получать последние новости на вашу почту.</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-muted mb-0" style={{color: '#fff'}}>
                © 2025 Новости. Все права защищены.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-muted text-decoration-none me-3" style={{color: '#fff'}}>Политика конфиденциальности</a>
              <a href="#" className="text-muted text-decoration-none me-3" style={{color: '#fff'}}>Условия использования</a>
              <a href="#" className="text-muted text-decoration-none" style={{color: '#fff'}}>Политика файлов cookie</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { id } = context.params!;
    
    if (!id || typeof id !== 'string') {
      return {
        notFound: true,
      };
    }

    const articleId = parseInt(id, 10);
    
    if (isNaN(articleId)) {
      return {
        notFound: true,
      };
    }

    // Fetch the article
    const article = await fetchNewsById(articleId);
    
    // Fetch related articles (same category, excluding current article)
    let relatedArticles: NewsArticleData[] = [];
    try {
      const allNews = await fetchNewsData();
      relatedArticles = allNews
        .filter(news => news.category === article.category && news.id !== article.id)
        .slice(0, 4);
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }

    return {
      props: {
        article,
        relatedArticles,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      notFound: true,
    };
  }
};
