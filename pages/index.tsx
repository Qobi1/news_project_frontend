import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { NewsArticle } from '../types';
import { fetchNews, fetchCategories, fetchNewsByCategory, searchNewsLocally } from '../lib/api';
import { defaultSEO, generateWebsiteJSONLD } from '../lib/seo';
import { formatDateSafe, getShortDescription, getIconClass } from '../lib/utils';
import SearchComponent from '../components/SearchComponent';
import RandomNews from '../components/RandomNews';

interface HomePageProps {
  newsData: NewsArticle[];
  categories: string[];
  initialCategory?: string;
  searchQuery?: string;
  searchResults?: NewsArticle[];
}

export default function HomePage({ 
  newsData, 
  categories, 
  initialCategory = 'Все',
  searchQuery,
  searchResults 
}: HomePageProps) {
  const [currentNewsData, setCurrentNewsData] = useState<NewsArticle[]>(newsData);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [articlesToShow, setArticlesToShow] = useState(8);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchQuery);
  const [currentSearchResults, setCurrentSearchResults] = useState<NewsArticle[]>(searchResults || []);

  const handleLoadMore = () => {
    setArticlesToShow(prev => prev + 4);
  };

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setHasSearched(false);
      setCurrentSearchResults([]);
      setSelectedCategory('Все');
      handleCategoryClick('Все');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Use local search with the current news data
      const searchResults = searchNewsLocally(query, newsData);
      setCurrentSearchResults(searchResults);
      setCurrentNewsData(searchResults);
      setSelectedCategory('Поиск');
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setHasSearched(false);
    setCurrentSearchResults([]);
    setSelectedCategory('Все');
    handleCategoryClick('Все');
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    setArticlesToShow(8);
    
    if (category === 'Все') {
      try {
        const allNews = await fetchNews();
        setCurrentNewsData(allNews);
      } catch (error) {
        console.error('Error fetching all news:', error);
      }
    } else if (category === 'Поиск') {
      // Don't fetch new data for search category, use existing search results
      setCurrentNewsData(currentSearchResults);
    } else {
      try {
        const categoryNews = await fetchNewsByCategory(category);
        setCurrentNewsData(categoryNews);
      } catch (error) {
        console.error('Error fetching category news:', error);
      }
    }
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const websiteJsonLd = generateWebsiteJSONLD(baseUrl);

  return (
    <>
      <Head>
        <title>{defaultSEO.title}</title>
        <meta name="description" content={defaultSEO.description} />
        <meta name="keywords" content={defaultSEO.keywords} />
        <meta name="author" content={defaultSEO.author} />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="yandex" content="index,follow" />
        
        {/* Language and locale */}
        <meta httpEquiv="content-language" content="ru" />
        <meta name="language" content="Russian" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={defaultSEO.title} />
        <meta property="og:description" content={defaultSEO.description} />
        <meta property="og:type" content={defaultSEO.type} />
        <meta property="og:image" content={defaultSEO.image} />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:site_name" content={defaultSEO.siteName} />
        <meta property="og:locale" content={defaultSEO.locale} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaultSEO.title} />
        <meta name="twitter:description" content={defaultSEO.description} />
        <meta name="twitter:image" content={defaultSEO.image} />
        
        {/* Yandex specific meta tags */}
        <meta name="yandex-verification" content="" />
        <meta name="yandex" content="all" />
        
        {/* Google specific meta tags */}
        <meta name="google-site-verification" content="" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={baseUrl} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </Head>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg sticky-top shadow">
        <div className="container d-flex align-items-center justify-content-between">
          <Link href="/" className="navbar-brand fw-bold">
            <i className={getIconClass('BRAND', 'MD') + ' me-2'}></i>Новости
          </Link>
          <div className="d-flex gap-2">
            <button className="nav-link btn btn-gradient" onClick={() => handleSmoothScroll('home')}>Главная</button>
            <button className="nav-link btn btn-gradient" onClick={() => handleSmoothScroll('news')}>Новости</button>
            <button className="nav-link btn btn-gradient" onClick={() => handleSmoothScroll('about')}>О нас</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section bg-gradient text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4 fade-in">Добро пожаловать в Новости</h1>
              <p className="lead mb-4 fade-in">
                Ваш надежный источник последних новостей в области технологий, науки, бизнеса, спорта и многого другого.
                Будьте в курсе событий с обновления в реальном времени и подробным анализом от наших экспертов.
              </p>
              <button 
                className="btn btn-light btn-lg fade-in shadow-lg px-4 py-2 rounded-pill"
                onClick={() => handleSmoothScroll('news')}
              >
                Смотреть последние новости <i className={getIconClass('DOWN', 'SM') + ' ms-2'}></i>
              </button>
            </div>
            <div className="col-lg-4 text-center">
              <img 
                src="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg" 
                alt="Новости и медиа"
                className="img-fluid rounded shadow-lg fade-in"
                style={{maxHeight: '340px', objectFit: 'cover'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">Последние новости</h2>
              <p className="lead text-muted">Будьте в курсе самых свежих событий</p>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-lg-8 mx-auto">
              <SearchComponent
                onSearch={handleSearch}
                onClear={clearSearch}
                isLoading={isSearching}
                hasSearched={hasSearched}
                resultsCount={currentSearchResults.length}
                searchTerm={searchQuery || ''}
                placeholder="Поиск новостных статей..."
                className="search-main"
              />
            </div>
          </div>
          <div className="row">
            {currentNewsData.slice(0, articlesToShow).map((article, index) => (
              <div key={article.id} className="col-lg-3 col-md-6 mb-4">
                <article className="card h-100 shadow-lg border-0 hover-card fade-in-article" style={{animationDelay: `${index * 0.1}s`}}>
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="card-img-top news-image rounded-top"
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <span className="badge bg-gradient mb-2 px-3 py-2 rounded-pill text-white" style={{fontSize: '0.9rem'}}>{article.category}</span>
                    </div>
                    <h5 className="card-title fw-bold mb-2">{article.title}</h5>
                    <div className="card-text text-muted flex-grow-1 mb-2" style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
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
            {currentNewsData.length === 0 && (
              <div className="col-12 text-center py-5">
                <i className={getIconClass(hasSearched ? 'SEARCH' : 'NEWS', 'DISPLAY', 'MUTED')}></i>
                <h3 className="mt-3 text-muted">
                  {hasSearched ? 'По вашему запросу ничего не найдено' : 'Статьи не найдены'}
                </h3>
                <p className="text-muted">
                  {hasSearched ? (
                    <>
                      Попробуйте изменить поисковый запрос или{' '}
                      <button 
                        className="btn btn-link p-0 text-decoration-none" 
                        onClick={clearSearch}
                        style={{color: '#007bff'}}
                      >
                        очистить поиск
                      </button>
                    </>
                  ) : (
                    'Попробуйте изменить критерии поиска.'
                  )}
                </p>
                {hasSearched && (
                  <div className="mt-4">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={clearSearch}
                    >
                      <i className={getIconClass('BACK', 'SM') + ' me-2'}></i>
                      Показать все новости
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {articlesToShow < currentNewsData.length && (
            <div className="row">
              <div className="col-12 text-center">
                <button 
                  className="btn btn-outline-primary btn-lg rounded-pill px-5"
                  onClick={handleLoadMore}
                >
                  Загрузить еще статьи <i className="bi bi-plus-circle ms-2"></i>
                </button>
              </div>
            </div>
          )}
          {/* Category Buttons after news list */}
          <div className="row mt-4">
            <div className="col-12 d-flex flex-wrap gap-2 justify-content-center">
              {/* Add search category if we have search results */}
              {hasSearched && (
                <button
                  className={`btn btn-outline-primary btn-sm rounded-pill ${selectedCategory === 'Поиск' ? 'active' : ''}`}
                  style={{
                    background: selectedCategory === 'Поиск' ? '#007bff' : '',
                    color: selectedCategory === 'Поиск' ? 'white' : '#007bff',
                    fontWeight: selectedCategory === 'Поиск' ? 'bold' : 'normal'
                  }}
                  onClick={() => handleCategoryClick('Поиск')}
                >
                  <i className={getIconClass('SEARCH', 'SM') + ' me-1'}></i>
                  Поиск ({currentSearchResults.length})
                </button>
              )}
              
              {/* Regular categories */}
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn btn-outline-secondary btn-sm rounded-pill ${selectedCategory === cat ? 'active' : ''}`}
                  style={{
                    background: selectedCategory === cat ? '#6c757d' : '',
                    color: selectedCategory === cat ? 'white' : '#6c757d',
                    fontWeight: selectedCategory === cat ? 'bold' : 'normal'
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-gradient text-white">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">О нас</h2>
              <p className="lead">Новости — ваш надежный источник свежих новостей, аналитики и событий Иркутска и региона. Мы стремимся предоставлять только проверенную информацию, помогать быть в курсе важных событий и поддерживать связь с нашей аудиторией.</p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card shadow-lg border-0 bg-white text-dark">
                <div className="card-body p-5">
                  <h4 className="fw-bold mb-3">Наша миссия</h4>
                  <p>Мы работаем для того, чтобы вы всегда были информированы о главных событиях города и области. Наша команда журналистов и редакторов ежедневно следит за новостями, чтобы вы получали только актуальную и достоверную информацию.</p>
                  <h4 className="fw-bold mb-3 mt-4">Наши ценности</h4>
                  <ul className="mb-4">
                    <li>Объективность и честность</li>
                    <li>Оперативность и актуальность</li>
                    <li>Открытость для обратной связи</li>
                    <li>Поддержка местного сообщества</li>
                  </ul>
                  <p className="mb-0">Спасибо, что выбираете нас!</p>
                </div>
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
                <li><a href="#home" className="text-white text-decoration-none" onClick={() => handleSmoothScroll('home')}>Главная</a></li>
                <li><a href="#news" className="text-white text-decoration-none" onClick={() => handleSmoothScroll('news')}>Новости</a></li>
                <li><a href="#contact" className="text-white text-decoration-none" onClick={() => handleSmoothScroll('about')}>О нас</a></li>
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
    const { category, search } = context.query;
    
    let newsData;
    let categories;
    let searchResults;
    
    // Fetch categories
    categories = await fetchCategories();
    
    // Always fetch all news first
    const allNews = await fetchNews();
    
    // Handle search - now done on frontend
    if (search && typeof search === 'string') {
      searchResults = searchNewsLocally(search, allNews);
      newsData = searchResults;
    }
    // Handle category filter
    else if (category && typeof category === 'string' && category !== 'Все') {
      newsData = await fetchNewsByCategory(category);
    }
    // Default: use all news
    else {
      newsData = allNews;
    }
    
    return {
      props: {
        newsData,
        categories,
        initialCategory: category || 'Все',
        searchQuery: search || null,
        searchResults: searchResults || null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    // Return empty data on error
    return {
      props: {
        newsData: [],
        categories: ['Все'],
        initialCategory: 'Все',
        searchQuery: null,
        searchResults: null,
      },
    };
  }
};
