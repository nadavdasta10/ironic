import React, { useEffect, useRef, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function RevealSection({ children, className = '', style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) el.classList.add('visible');
      });
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </section>
  );
}

const PROJECTS = [
  { 
    id: 1, 
    client: 'Kuli Alma', 
    location: '// תל אביב', 
    desc: 'שילוב של צבעי ניאון ועיצוב תעשייתי מחוספס. חביות צהובות וסגולות הפזורות ברחבי המועדון, משמשות כשולחנות עמידה לבליינים בשעות העומס בחצר.', 
    featured: true, 
    seed: 'neon-club' 
  },
  { 
    id: 2, 
    client: 'Sputnik Bar', 
    location: '// תל אביב', 
    desc: 'עיצוב רטרו-עתידני. שימוש בחביות שחורות פחם עם גימור מאט, נטמעות בצורה מושלמת באפלוליות החדרים הפנימיים יחד עם הצמחייה העשירה.', 
    featured: false, 
    seed: 'dark-bar' 
  },
  { 
    id: 3, 
    client: 'WeWork', 
    location: '// חיפה', 
    desc: 'עמדות קפה ומפגש סביב חביות בצבע תכלת וקרם. הכנסת קריצה של פאב והרבה צבע לחלל העבודה המשותף, תוך פרקטיקה ועמידות גבוהה.', 
    featured: false, 
    seed: 'office-space' 
  },
  { 
    id: 4, 
    client: 'The Block', 
    location: '// תל אביב', 
    desc: 'עמדות מנוחה ושתייה בחללי העישון. חביות מחוזקות העמידות לשימוש מאסיבי ביותר, שריטות וסיגריות בסביבה אינטנסיבית של חיות הלילה.', 
    featured: true, 
    seed: 'dj-booth' 
  },
  { 
    id: 5, 
    client: 'Beer Bazaar', 
    location: '// ירושלים', 
    desc: 'שולחנות בר ליושבי הרחוב בחוץ. צבעי כתום עז, ממותגות בלוגו הדפס משי אישי לצילומים חברתיים ולנוכחות מיתוגית שלא מפספסים.', 
    featured: false, 
    seed: 'craft-beer' 
  },
  { 
    id: 6, 
    client: 'Teder.fm', 
    location: '// תל אביב', 
    desc: 'פשוט, נקי וגולמי. חביות פלדה בצבען החלק שמשתלבות בצורה טבעית עם קירות הבטון הברוטליסטיים ורחבת האספלט של בית רומנו.', 
    featured: false, 
    seed: 'urban-pub' 
  }
];

export default function Projects() {
  return (
    <>
      <nav>
        <Link to="/" className="logo">ironic</Link>
        <ul>
          <li><Link to="/">הסיפור</Link></li>
          <li><Link to="/product">חנות</Link></li>
          <li><Link to="/projects" className="active">פרויקטים</Link></li>
          <li><Link to="/blog">בלוג</Link></li>
        </ul>
        <a href="#" style={{ color: 'var(--cyan)', fontSize: '13px' }}>צור קשר</a>
      </nav>

      <section className="blog-hero">
        <div className="hero-tag">// OUR WORK</div>
        <h1>חיים בלילה,<br />מככבים ביום.</h1>
        <p>המוסדות השווים בישראל כבר הבינו – ריהוט תעשייתי זה חלק מחוויית הלקוח. בואו לראות איפה החביות שלנו חיות היום.</p>
      </section>

      <main className="blog-main" style={{ marginTop: '0', paddingTop: '0' }}>
        
        <RevealSection>
          <div className="projects-grid">
            {PROJECTS.map(proj => (
              <a href="#" className={`project-card ${proj.featured ? 'featured' : ''}`} key={proj.id}>
                <div className="project-image-wrap">
                  <img src={`https://picsum.photos/seed/${proj.seed}/800/600`} alt={proj.client} />
                </div>
                <div className="project-info">
                  <div className="project-location">{proj.location}</div>
                  <h3 className="project-client">{proj.client}</h3>
                  <p className="project-desc">{proj.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </RevealSection>

      </main>

      {/* CTA */}
      <section className="cta-section" style={{ marginTop: '60px' }}>
        <div className="cta-inner">
          <h2 className="cta-title">יש לך מתחם<br />שזקוק לשדרוג?</h2>
          <p className="cta-desc">אנחנו עובדים מול אדריכלים, בעלי ברים, ומסעדות לייצר סדרות מותאמות וייחודיות בכל צבע.</p>
          <div className="cta-buttons">
            <Link to="/product" className="btn-primary">הזמן מהחנות ←</Link>
            <a href="#" className="btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}>יצירת קשר בכמויות</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
