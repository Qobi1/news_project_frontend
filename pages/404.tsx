import Head from 'next/head';
import Link from 'next/link';
import { getIconClass } from '../lib/utils';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Страница не найдена — Новости Иркутска</title>
        <meta name="description" content="Запрашиваемая страница не найдена. Вернитесь на главную страницу новостей Иркутска." />
        <meta name="robots" content="noindex,follow" />
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

      {/* 404 Content */}
      <section className="py-5 bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <div className="mb-4">
                <i className={getIconClass('NEWS', 'DISPLAY', 'MUTED')}></i>
              </div>
              <h1 className="display-1 fw-bold text-muted mb-3">404</h1>
              <h2 className="h3 fw-bold mb-3">Страница не найдена</h2>
              <p className="lead text-muted mb-4">
                К сожалению, запрашиваемая страница не существует или была перемещена.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link href="/" className="btn btn-primary btn-lg">
                  <i className={getIconClass('BACK', 'SM') + ' me-2'}></i>
                  На главную
                </Link>
                <Link href="/#news" className="btn btn-outline-primary btn-lg">
                  <i className={getIconClass('NEWS', 'SM') + ' me-2'}></i>
                  Последние новости
                </Link>
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
