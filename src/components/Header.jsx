import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header = ({ onOpenForm }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language.startsWith('uk') ? 'en' : 'uk');

  const navLinks = [
    { to: '/', label: t('header.map') },
    { to: '/gallery', label: t('header.gallery') },
    { to: '/about', label: t('header.about') },
  ];

  return (
    <header className="backdrop-blur-xl bg-white/70 border-b border-ukr-blue/30 sticky top-0 z-[1000] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group select-none">
          <div className="flex flex-col leading-none w-full transition-transform duration-300 group-hover:scale-105">
            <div className="flex items-center gap-2 justify-between">
              <p className="font-black text-xl md:text-2xl tracking-tight text-ukr-blue">Digital Archive</p>
              <span className="inline-flex items-center rounded-sm overflow-hidden ring-1 ring-white/40 shadow-sm"><svg viewBox="0 0 36 24" className="w-8 h-5 md:w-10 md:h-6"><rect width="36" height="12" y="0" fill="#0057B8" /><rect width="36" height="12" y="12" fill="#FFD700" /></svg></span>
            </div>
            <p className="font-semibold text-xs md:text-sm tracking-widest text-ukr-yellow uppercase mt-1">{t('header.heritage')}</p>
            <div className="mt-1 h-1 w-full rounded-full bg-gradient-to-r from-ukr-blue via-ukr-yellow to-ukr-blue opacity-80 group-hover:opacity-100 transition-all"></div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={`transition border-b-2 pb-1 ${isActive(link.to) ? 'text-ukr-blue border-ukr-yellow font-semibold' : 'text-gray-600 border-transparent hover:text-ukr-blue hover:border-ukr-yellow'}`}>{link.label}</Link>
          ))}
          <button onClick={toggleLanguage} className="w-10 h-10 rounded-full border-2 border-slate-200 text-slate-600 font-bold text-xs hover:border-ukr-blue hover:text-ukr-blue transition-colors ml-2">
            {i18n.language.startsWith('uk') ? 'EN' : 'UA'}
          </button>
          <a href="https://send.monobank.ua/jar/3CkgiNtqFv" target="_blank" rel="noopener noreferrer" className="bg-ukr-yellow text-ukr-blue px-5 py-2 rounded-full shadow-md font-bold hover:bg-yellow-400 transition">{t('header.support')}</a>
          <button onClick={onOpenForm} className="bg-ukr-blue text-white px-5 py-2 rounded-full shadow-md font-semibold hover:bg-ukr-blue/90 transition">{t('header.add_object')}</button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLanguage} className="text-xs font-bold text-slate-600 border border-slate-200 rounded-md px-2 py-1 mr-1">{i18n.language.startsWith('uk') ? 'EN' : 'UA'}</button>
          <button onClick={onOpenForm} className="bg-ukr-blue text-white px-3 py-2 rounded-full shadow-md font-semibold text-sm">+ {t('header.add_object').split(' ')[0]}</button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-ukr-blue p-2 rounded-md hover:bg-gray-100 transition"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m0 6H8'} /></svg></button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade border-t border-gray-200 bg-white shadow-xl flex flex-col p-4 space-y-2">
          {navLinks.map((link) => (<Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className={`rounded-lg py-2 text-center font-medium ${isActive(link.to) ? 'bg-ukr-yellow/40 text-ukr-blue' : 'text-gray-700 hover:bg-gray-100'}`}>{link.label}</Link>))}
          <a href="https://send.monobank.ua/jar/3CkgiNtqFv" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 rounded-lg py-3 text-center font-bold bg-ukr-yellow text-ukr-blue shadow-sm hover:bg-yellow-400 transition">{t('header.support')}</a>
        </div>
      )}
    </header>
  );
};
export default Header;