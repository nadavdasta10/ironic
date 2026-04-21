import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isProductPage = location.pathname.includes('/product');

  return (
    <>
      <nav className={isProductPage ? 'sticky-nav' : ''}>
        <Link to="/" className="logo-container">
          <div className="logo">ironic</div>
          <div className="logo-design">design</div>
        </Link>
        
        {/* Desktop Breadcrumb for product, or standard menu otherwise */}
        {!isProductPage ? (
          <ul className="desktop-menu">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>הסיפור</Link></li>
            <li><Link to="/product" className={location.pathname.startsWith('/product') ? 'active' : ''}>חנות</Link></li>
            <li><Link to="/projects" className={location.pathname.startsWith('/projects') ? 'active' : ''}>פרויקטים</Link></li>
            <li><Link to="/blog" className={location.pathname.startsWith('/blog') ? 'active' : ''}>בלוג</Link></li>
          </ul>
        ) : (
          <div className="breadcrumb desktop-only">
            <Link to="/product">חנות</Link> / <Link to="/product">סטים</Link> / <span style={{ color: 'var(--white)' }}>סט ברקלאב</span>
          </div>
        )}

        <div className="nav-actions">
           {!isProductPage && (
            <Link to="/contact" className="desktop-menu-contact" style={{ color: 'var(--cyan)', fontSize: '13px', marginLeft: '20px', textDecoration: 'none' }}>צור קשר</Link>
           )}
           {isProductPage && (
             <a href="#" className="cart desktop-only" style={{ marginLeft: '16px' }}>עגלה (0)</a>
           )}
           <button className="mobile-menu-btn" onClick={() => setIsOpen(true)}>
             <Menu size={28} color="var(--white)" />
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        <button className="close-mobile-menu" onClick={() => setIsOpen(false)}>
          <X size={36} color="var(--white)" />
        </button>
        <div className="mobile-menu-content">
          <Link to="/" onClick={() => setIsOpen(false)}>הסיפור</Link>
          <Link to="/product" onClick={() => setIsOpen(false)}>חנות</Link>
          <Link to="/projects" onClick={() => setIsOpen(false)}>פרויקטים</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>בלוג</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} style={{ color: 'var(--cyan)' }}>צור קשר</Link>
          {isProductPage && (
            <a href="#" className="cart" onClick={() => setIsOpen(false)} style={{ display: 'inline-block', marginTop: '20px' }}>עגלה (0)</a>
          )}
        </div>
      </div>
    </>
  );
}
