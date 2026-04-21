import React, { useEffect, useRef, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

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

const CUSTOM_ARTS = [
  { 
    id: 1, 
    title: 'דמות צמה בעבודת יד', 
    material: '// תיל נחושת קלוע', 
    desc: 'פיסול מינימליסטי מדויק של דמות בצללית, עם דגש על הטקסטורה של הצמה. פריט יוקרתי ועוצמתי שמשתלב בכל חלל מודרני.', 
    image: 'sculpture-braid.jpg',
    message: 'היי, אשמח לקבל פרטים על עבודת התיל: דמות צמה'
  },
  { 
    id: 2, 
    title: 'פרופיל אישה בתיל', 
    material: '// תיל מתכת כהה', 
    desc: 'אמנות חוטים ייחודית היוצרת רישום תלת-ממדי באוויר. קווי מתאר אלגנטיים של פרופיל נשי המעניקים עומק ותחכום לחלל.', 
    image: 'sculpture-woman.jpg',
    message: 'היי, אשמח לקבל פרטים על עבודת התיל: פרופיל אישה'
  },
  { 
    id: 3, 
    title: 'עץ החיים ממסובב', 
    material: '// חוטי ברונזה משולבים', 
    desc: 'פסל מרשים של עץ שורשי עשוי מאות נתיבי תיל בודדים השזורים זה בזה בעבודת כפיים מוקפדת, מעוגן לבסיס עץ מלא.', 
    image: 'sculpture-tree.png',
    message: 'היי, אשמח לקבל פרטים על עבודת התיל: עץ החיים'
  },
  { 
    id: 4, 
    title: 'כינור קלאסי מתיל', 
    material: '// מתכת שחורה בחיתוך ליניארי', 
    desc: 'הומאז\' מרגש לכלי הנגינה הקלאסי עשוי קווי מתאר בלבד. עיצוב מינימליסטי ומרשים ששומר על פרופורציות קלאסיות מדויקות.', 
    image: 'sculpture-violin.jpg',
    message: 'היי, אשמח לקבל פרטים על עבודת התיל: כינור קלאסי'
  }
];

// WhatsApp Icon SVG
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Projects() {
  const phoneNumber = "972501234567"; // Replace with actual business number

  return (
    <>
      <Navbar />

      <section className="blog-hero" style={{ background: 'var(--deep-2)' }}>
        <div className="hero-tag">// CUSTOM ARTWORKS</div>
        <h1>אמנות תיל<br />בהזמנה אישית.</h1>
        <p>מעבר לחביות הציבוריות שלנו, אנחנו מייצרים עבודות יד חד-פעמיות מתיל ומתכת. כל פסל הוא יצירת אמנות בלעדית שעוברת תהליך קפדני של כיפוף, ריתוך ושזירה – מותאם אישית לחלל שלכם.</p>
      </section>

      <main className="blog-main" style={{ marginTop: '0', paddingTop: '0' }}>
        
        <RevealSection>
          <div className="projects-grid">
            {CUSTOM_ARTS.map(art => (
              <div className="project-card" key={art.id} style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                <div className="project-image-wrap">
                  <img src={`/${art.image}`} alt={art.title} style={{ objectPosition: 'center 20%' }} />
                </div>
                <div className="project-info" style={{ flex: 1, padding: '24px 24px 0 24px' }}>
                  <div className="project-location" style={{ color: 'var(--cyan)' }}>{art.material}</div>
                  <h3 className="project-client">{art.title}</h3>
                  <p className="project-desc">{art.desc}</p>
                </div>
                <a 
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(art.message)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-auto bg-[#25D366] text-white px-5 py-4 w-full font-semibold text-base hover:bg-[#20bd5c] transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <WhatsAppIcon />
                  להזמנה אישית
                </a>
              </div>
            ))}
          </div>
        </RevealSection>

      </main>

      {/* CTA */}
      <section className="cta-section" style={{ marginTop: '60px' }}>
        <div className="cta-inner">
          <h2 className="cta-title">יש לכם חזון<br />ליצירה משלכם?</h2>
          <p className="cta-desc">אנחנו הופכים כל רעיון לפסל מתכת מרשים או עבודת תיל דקורטיבית. צרו איתנו קשר ונתחיל ליצור.</p>
          <div className="cta-buttons">
            <a 
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent('היי, אשמח להתייעץ על עיצוב אמנות אישית מתכת/תיל.')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-[0_4px_25px_rgba(37,211,102,0.4)] hover:-translate-y-1"
              style={{ textDecoration: 'none' }}
            >
              <WhatsAppIcon />
              יצירת קשר בווסטאפ
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
