import React, { useEffect, useState } from 'react';
import { NewsArticle } from './App';

interface RandomNewsProps {
  backendUrl: string;
}

const RandomNews: React.FC<RandomNewsProps> = ({ backendUrl }) => {
  const [randomNews, setRandomNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/random-news/`)
      .then(res => res.json())
      .then(data => {
        setRandomNews(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [backendUrl]);

  if (loading) return <div>Загрузка рекомендаций...</div>;
  if (error) return <div className="text-danger">Ошибка загрузки рекомендаций</div>;
  if (!randomNews.length) return null;

  return (
    <div className="mt-5">
      <div className="mb-4 ps-2 ps-md-4">
        <h4 className="fw-bold mb-0">Рекомендуем</h4>
      </div>
      <div className="px-3 px-md-5">
        <div className="row">
          {randomNews.map(news => (
            <div key={news.id} className="col-md-3 mb-3">
              <div className="card h-100 shadow-sm border-0">
                <img src={news.image || news.image_url || 'https://via.placeholder.com/300x180?text=Нет+фото'} alt={news.title} className="card-img-top rounded-top" style={{height: '180px', objectFit: 'cover', background: '#f8f9fa'}} />
                <div className="card-body">
                  <h6 className="card-title fw-bold mb-2">{news.title}</h6>
                  <button className="btn btn-outline-primary w-100 rounded-pill" onClick={() => window.location.href = `?id=${news.id}`}>Подробнее</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomNews;
