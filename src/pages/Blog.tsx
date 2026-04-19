import React, { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
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

const POSTS = [
  { 
    id: 1, 
    title: 'איך אנחנו מצילים חביות מפסולת?', 
    tag: '// קיימות', 
    excerpt: 'המסע של חבית מתחילה מערמות הברזל בחצרות מפעלים ועד למוצר המוגמר שמגיע לבר שלכם.', 
    date: '12 באפריל, 2026', 
    seed: 'factory' 
  },
  { 
    id: 2, 
    title: 'פסיכולוגיה של צבע: למה ורוד?', 
    tag: '// עיצוב ותכנון', 
    excerpt: 'בחירת הצבעים שלנו לא מקרית. איך צבעים בוהקים משפיעים על אווירה, צריכת אלכוהול וצילום רשתות חברתיות.', 
    date: '8 באפריל, 2026', 
    seed: 'neon' 
  },
  { 
    id: 3, 
    title: 'הטרנדים החמים למועדונים', 
    tag: '// תעשייה', 
    excerpt: 'מה נראה יותר השנה בברים המובילים בשוק? קווים גסים, תאורת ניאון, ואפס פשרות על איכות.', 
    date: '30 במרץ, 2026', 
    seed: 'club' 
  },
  { 
    id: 4, 
    title: 'מאחורי הקלעים: סדנת העבודה', 
    tag: '// אותנטיות', 
    excerpt: 'רעש דיסק אל קול ריתוך. מבט בלעדי אל תוך בית המלאכה שבו כל הקסם והלכלוך קורה בפועל.', 
    date: '22 במרץ, 2026', 
    seed: 'welding' 
  },
  { 
    id: 5, 
    title: 'אירוניה תעשייתית: סיפור המוצר ה-1', 
    tag: '// ההתחלה', 
    excerpt: 'איך סט כיסאות שנוצר בכלל למרפסת שלנו הפך לסט הראשון שייצרנו עבור לקוח.', 
    date: '15 במרץ, 2026', 
    seed: 'barrel' 
  },
  { 
    id: 6, 
    title: 'עיצוב שעובד קשה: למה ברזל?', 
    tag: '// חומרים', 
    excerpt: 'ריהוט לבר סופג מכות הולך להיהרס? לא אם הוא נבנה מהחומרים הנכונים מראש.', 
    date: '1 במרץ, 2026', 
    seed: 'metal' 
  },
  { 
    id: 7, 
    title: 'תאורה וברזל: השילוב המושלם', 
    tag: '// עיצוב חלל', 
    excerpt: 'איך משלבים תאורת לד נסתרת בתוך הריהוט התעשייתי שלנו ליצירת אווירה פסיכדלית ללקוחות במועדון.', 
    date: '28 בפברואר, 2026', 
    seed: 'led-lights' 
  },
  { 
    id: 8, 
    title: 'ריהוט חוץ מול פנים: מה באמת ההבדל?', 
    tag: '// מדריך פרקטי', 
    excerpt: 'חביות דלק נועדו לתנאי שטח קשים, אבל איך אנחנו מוודאים שהצבע יישאר בוהק ושלם גם אחרי חורף ושמש ישראלית קשה?', 
    date: '12 בפברואר, 2026', 
    seed: 'outdoor-bar' 
  }
];

export default function Blog() {
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  useEffect(() => {
    // Only fetch if available
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      const p: any[] = [];
      snap.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      setDbPosts(p);
    }, err => {
      console.log('Firebase posts read error - falling back strictly to local array:', err.message);
    });
    return () => unsub();
  }, []);

  // Use database posts if available, otherwise fallback to local hardcoded mock
  const postsToRender = dbPosts.length > 0 ? dbPosts : POSTS;

  return (
    <>
      <nav>
        <Link to="/" className="logo">ironic</Link>
        <ul>
          <li><Link to="/">הסיפור</Link></li>
          <li><Link to="/product">חנות</Link></li>
          <li><Link to="/projects">פרויקטים</Link></li>
          <li><Link to="/blog" className="active">בלוג</Link></li>
        </ul>
        <a href="#" style={{ color: 'var(--cyan)', fontSize: '13px' }}>צור קשר</a>
      </nav>

      {/* HERO SECTION */}
      <section className="blog-hero">
        <div className="hero-tag">// THE JOURNAL</div>
        <h1>ברזל, צבע,<br />ומה שביניהם.</h1>
        <p>היומן שלנו לתעשייה, עיצוב, קיימות ומה שקורה מאחורי הקלעים.</p>
      </section>

      <main className="blog-main" style={{ marginTop: '0', paddingTop: '0' }}>
        
        {/* FEATURED POST */}
        <RevealSection>
          <Link to="#" className="featured-post">
            <div className="featured-image">
              <img src="https://picsum.photos/seed/industrial/1000/800" alt="Featured Article" />
            </div>
            <div className="featured-content">
              <div className="blog-tag">// מומלץ החודש</div>
              <h2 className="blog-title">5 טעויות שבעלי ברים עושים בבחירת ריהוט</h2>
              <p className="blog-excerpt">מוציאים תקציב ענק על עיצוב פנים ונופלים בכיסאות שייהרסו תוך חודשיים? אנחנו רואים את זה קורה כל יום. הנה מה שאתם חייבים לדעת לפני שאתם קונים ריהוט למקום החדש שלכם.</p>
              <div className="blog-meta">
                <span className="blog-date">15 באפריל, 2026</span>
                <span className="blog-read-more">קרא עוד</span>
              </div>
            </div>
          </Link>
        </RevealSection>

        {/* POSTS GRID */}
        <RevealSection style={{ paddingTop: '20px' }}>
          <div className="section-label" style={{ textAlign: 'right' }}>// ALL ARCHIVES</div>
          <div className="blog-grid">
            {postsToRender.map(post => (
              <Link to="#" className="blog-card" key={post.id} style={{ display: 'flex' }}>
                <div className="blog-card-image">
                  <img src={`https://picsum.photos/seed/${post.seed}/600/400`} alt={post.title} />
                </div>
                <div className="blog-card-content">
                  <div className="blog-tag">{post.tag}</div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-more">קרא עוד</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>

      </main>

      <section className="cta-section" style={{ marginTop: '60px' }}>
         <div className="cta-inner">
           <h2 className="cta-title">מוכן לקבל<br />את שלך?</h2>
           <p className="cta-desc">בחר צבע. העלה לוגו. קבל סט שנועד להיות מצולם.</p>
           <div className="cta-buttons">
             <Link to="/product" className="btn-primary">אל החנות ←</Link>
             <a href="#" className="btn-ghost">יש לי פרויקט מיוחד</a>
           </div>
         </div>
       </section>

      <Footer />
    </>
  );
}
