import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { NewsArticle } from '../types';
import { fetchNews, fetchCategories, searchNewsLocally } from '../lib/api';
import { defaultSEO } from '../lib/seo';
import { formatDateSafe, getShortDescription, getIconClass } from '../lib/utils';
import SearchComponent from '../components/SearchComponent';

interface SearchPageProps {
  searchResults: NewsArticle[];
  searchQuery: string;
  categories: string[];
  allNews: NewsArticle[];
}

export default function SearchPage({ searchResults, searchQuery, categories, allNews }: SearchPageProps) {
  const [currentResults, setCurrentResults] = useState<NewsArticle[]>(searchResults);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchQuery);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setHasSearched(false);
      setCurrentResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const results = searchNewsLocally(query, allNews);
      setCurrentResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setCurrentResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setHasSearched(false);
    setCurrentResults([]);
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pageTitle = searchQuery 
    ? `Результаты поиска: "${searchQuery}" — Новости Иркутска`
    : 'Поиск новостей — Новости Иркутска';
  const pageDescription = searchQuery 
    ? `Найдено ${searchResults.length} результатов по запросу "${searchQuery}". Читайте актуальные новости Иркутска.`
    : 'Поиск по новостям Иркутска и Иркутской области. Найдите интересующие вас события и статьи.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`поиск новостей, ${searchQuery}, новости иркутска, события иркутской области`} />
        <meta name="author" content={defaultSEO.author} />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="yandex" content="index,follow" />
        
        {/* Language and locale */}
        <meta httpEquiv="content-language" content="ru" />
        <meta name="language" content="Russian" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={defaultSEO.image} />
        <meta property="og:url" content={`${baseUrl}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`} />
        <meta property="og:site_name" content={defaultSEO.siteName} />
        <meta property="og:locale" content={defaultSEO.locale} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={defaultSEO.image} />
        
        {/* Yandex specific meta tags */}
        <meta name="yandex-verification" content="" />
        <meta name="yandex" content="all" />
        
        {/* Google specific meta tags */}
        <meta name="google-site-verification" content="" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`${baseUrl}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`} />
        
        {/* JSON-LD Structured Data */}
        {searchQuery && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SearchResultsPage",
                "name": `Search results for "${searchQuery}"`,
                "description": `Search results for "${searchQuery}" on News Irkutsk`,
                "url": `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}`,
                "mainEntity": {
                  "@type": "ItemList",
                  "numberOfItems": currentResults.length,
                  "itemListElement": currentResults.map((article, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                      "@type": "NewsArticle",
                      "headline": article.title,
                      "description": article.excerpt,
                      "url": `${baseUrl}/article/${article.id}`,
                      "datePublished": article.date,
                      "author": {
                        "@type": "Organization",
                        "name": "Новости Иркутска"
                      }
                    }
                  }))
                }
              })
            }}
          />
        )}
        
        {/* Noindex for empty search results */}
        {!searchQuery && <meta name="robots" content="noindex,follow" />}
      </Head>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg sticky-top shadow">
        <div className="container d-flex align-items-center justify-content-between">
          <Link href="/" className="navbar-brand fw-bold">
            <i className={getIconClass('BRAND', 'MD') + ' me-2'}></i>Новости
          </Link>
          <div className="d-flex gap-2">
            <Link href="/" className="nav-link btn btn-gradient">Главная</Link>
            <Link href="/#news" className="nav-link btn btn-gradient">Новости</Link>
            <Link href="/#about" className="nav-link btn btn-gradient">О нас</Link>
          </div>
        </div>
      </nav>

      {/* Search Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h1 className="display-4 fw-bold mb-3">Поиск новостей</h1>
              <p className="lead text-muted">Найдите интересующие вас статьи и события</p>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto">
              <SearchComponent
                onSearch={handleSearch}
                onClear={clearSearch}
                isLoading={isSearching}
                hasSearched={hasSearched}
                resultsCount={currentResults.length}
                searchTerm={searchQuery}
                placeholder="Введите поисковый запрос..."
                className="search-main"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {hasSearched && (
        <section className="py-5">
          <div className="container">
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="h4 fw-bold mb-3">
                  {isSearching ? 'Поиск...' : `Результаты поиска${searchQuery ? ` по запросу "${searchQuery}"` : ''}`}
                </h2>
                {!isSearching && (
                  <p className="text-muted">
                    {currentResults.length === 0 
                      ? 'По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос.'
                      : `Найдено результатов: ${currentResults.length}`
                    }
                  </p>
                )}
              </div>
            </div>
            
            {currentResults.length > 0 && (
              <div className="row">
                {currentResults.map((article, index) => (
                  <div key={article.id} className="col-lg-4 col-md-6 mb-4">
                    <article className="card h-100 shadow-sm border-0 hover-card">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="card-img-top news-image rounded-top"
                      />
                      <div className="card-body d-flex flex-column">
                        <div className="mb-2">
                          <span className="badge bg-primary mb-2 px-2 py-1 rounded-pill text-white" style={{fontSize: '0.8rem'}}>
                            {article.category}
                          </span>
                        </div>
                        <h5 className="card-title fw-bold mb-2">{article.title}</h5>
                        <div className="card-text text-muted flex-grow-1 mb-2">
                          <span dangerouslySetInnerHTML={{ __html: getShortDescription(article.excerpt, 20) }} />
                        </div>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-muted">
                              <i className={getIconClass('CALENDAR', 'XS') + ' me-1'}></i>
                              {article.date}
                            </small>
                            <small className="text-muted">
                              <i className={getIconClass('PERSON', 'XS') + ' me-1'}></i>
                              {article.author || 'Новости Иркутска'}
                            </small>
                          </div>
                          <Link 
                            href={`/article/${article.id}`}
                            className="btn btn-primary w-100 rounded-pill fw-bold"
                          >
                            Читать далее <i className={getIconClass('FORWARD', 'XS') + ' ms-1'}></i>
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Categories */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h3 className="fw-bold mb-4">Популярные категории</h3>
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                {categories.filter(cat => cat !== 'Все').map(category => (
                  <Link
                    key={category}
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-gradient text-white">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="fw-bold mb-3" style={{color: '#ffeb3b'}}>
                <i className={getIconClass('BRAND', 'MD') + ' me-2'}></i>Новости
              </h5>
              <p className="mb-3">
                Ваш надежный источник достоверных новостей и подробного анализа.
              </p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h6 className="fw-bold mb-3" style={{color: '#ffeb3b'}}>Быстрые ссылки</h6>
              <ul className="list-unstyled">
                <li><Link href="/" className="text-white text-decoration-none">Главная</Link></li>
                <li><Link href="/#news" className="text-white text-decoration-none">Новости</Link></li>
                <li><Link href="/#about" className="text-white text-decoration-none">О нас</Link></li>
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
              <p className="mb-0" style={{color: '#fff'}}>
                © 2025 Новости. Все права защищены.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-white text-decoration-none me-3">Политика конфиденциальности</a>
              <a href="#" className="text-white text-decoration-none me-3">Условия использования</a>
              <a href="#" className="text-white text-decoration-none">Политика файлов cookie</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { q } = context.query;
    const searchQuery = typeof q === 'string' ? q : '';
    
    // Fetch all news first
    const allNews = await fetchNews();
    let searchResults: NewsArticle[] = [];
    
    if (searchQuery.trim()) {
      searchResults = searchNewsLocally(searchQuery, allNews);
    }
    
    const categories = await fetchCategories();
    
    return {
      props: {
        searchResults,
        searchQuery,
        categories,
        allNews,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      props: {
        searchResults: [],
        searchQuery: '',
        categories: ['Все'],
        allNews: [],
      },
    };
  }
};
