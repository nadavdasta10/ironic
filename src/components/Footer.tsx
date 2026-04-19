import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <Link to="/terms">תקנון ותנאי שימוש</Link>
        <Link to="/privacy">מדיניות פרטיות</Link>
        <Link to="/shipping">מדיניות משלוחים</Link>
        <Link to="/returns">מדיניות ביטולים והחזרות</Link>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} ironic · בית מלאכה ישראלי · כל הזכויות שמורות
      </div>
    </footer>
  );
}
