import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsArticle } from '../types';
import { fetchNews } from '../lib/api';
import { formatDateSafe, getIconClass } from '../lib/utils';

interface RandomNewsProps {
  backendUrl: string;
}

const RandomNews: React.FC<RandomNewsProps> = ({ backendUrl }) => {
  const [randomArticles, setRandomArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomNews = async () => {
      try {
        const allNews = await fetchNews();
        // Get 4 random articles
        const shuffled = allNews.sort(() => 0.5 - Math.random());
        setRandomArticles(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Error fetching random news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomNews();
  }, [backendUrl]);

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="loading-spinner"></div>
              <p className="mt-2 text-muted">Загрузка рекомендуемых новостей...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (randomArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h3 className="fw-bold mb-3">Рекомендуемые новости</h3>
            <p className="text-muted">Возможно, вас заинтересуют эти статьи</p>
          </div>
        </div>
        <div className="row">
          {randomArticles.map((article, index) => (
            <div key={article.id} className="col-lg-3 col-md-6 mb-4">
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
                  <h6 className="card-title fw-bold mb-2" style={{fontSize: '1rem'}}>
                    {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                  </h6>
                  <div className="card-text text-muted flex-grow-1 mb-2" style={{fontSize: '0.9rem'}}>
                    <span dangerouslySetInnerHTML={{ 
                      __html: article.excerpt.length > 80 ? article.excerpt.substring(0, 80) + '...' : article.excerpt 
                    }} />
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <i className={getIconClass('CALENDAR', 'XS') + ' me-1'}></i>
                        {article.date}
                      </small>
                    </div>
                    <Link 
                      href={`/article/${article.id}`}
                      className="btn btn-outline-primary btn-sm w-100"
                    >
                      Читать <i className={getIconClass('FORWARD', 'XS') + ' ms-1'}></i>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RandomNews;
