import React, { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';

function StatCounter({ target, suffix = '', text = '' }: { target?: number; suffix?: string; text?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (target === undefined) return;
    const el = ref.current;
    if (!el) return;
    let hasCounted = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCounted) {
          hasCounted = true;
          let current = 0;
          const increment = target / 60;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            setCount(Math.floor(current));
          }, 25);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat-number" ref={ref}>
      {target !== undefined ? `${count}${suffix}` : text}
    </div>
  );
}

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

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Story() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">// OUR STORY</div>
          <h1>trash to<br />table.</h1>
          <p>איך התחלנו עם ערימת חביות חלודות ובנינו את הריהוט שכולם מצלמים.</p>
        </div>
      </section>

      {/* STORY PART 1 */}
      <RevealSection>
        <div className="section-inner">
          <div className="story-section">
            <div className="section-label">// THE QUESTION</div>
            <h2 className="section-title">התחלנו עם<br /><span className="pink">שאלה אחת.</span></h2>
            <p className="lead">למה ריהוט של מקומות בילוי נראה תמיד אותו דבר?</p>
            <p>אותם שולחנות עץ תעשייתיים, אותם כיסאות מתכת מהסיטונאי, אותו רושם שנשכח ברגע שיוצאים מהמקום. בעולם שבו כל בר חדש מנסה להיות <span className="highlight">"המקום"</span>, הריהוט הוא הדבר הכי שכחוני שיש.</p>
            <p>בעל בר שפותח מקום חדש משקיע חצי מיליון שקלים בעיצוב, מיתוג, תאורה, תפריט. ואז שם בפנים 20 כיסאות זהים שאפשר למצוא בכל בר אחר בעיר. הפרט הכי נראה, זה שאנשים מחזיקים בידיים שלהם שעות – הוא הפרט שמעצבים מוותרים עליו.</p>
            <div className="pull-quote">זה לא הגיוני. ריהוט הוא לא דקורציה, הוא חלק מהחוויה.</div>
          </div>
        </div>
      </RevealSection>

      {/* STORY PART 2 */}
      <RevealSection style={{ paddingTop: '40px' }}>
        <div className="section-inner">
          <div className="story-section">
            <div className="section-label">// THE DISCOVERY</div>
            <h2 className="section-title">ואז ראינו את<br /><span className="cyan">החביות.</span></h2>
            <p>במוסך של חבר, על ערימת פסולת בנמל אשדוד, מאחורי מפעל בנתניה. חביות דלק תעשייתיות בגודל מלא, פח איכותי בעובי מכובד, מחכות שיגררו אותן לגריסה. זבל.</p>
            <p>היינו יכולים להשאיר את זה שם. אבל כשהסתכלנו על החבית הזאת, ראינו משהו אחר: <span className="highlight-cyan">שולחן בר</span>. <span className="highlight-cyan">גב של כיסא</span>. קונטור שאף מפעל בעולם לא מעצב – כי אין לו את היכולת לעצב בייצור המוני עקומות של חבית תעשייתית בלי להתחיל מאפס.</p>
            <p>החבית הזו נוצרה להחזיק 200 ליטר דלק בלחץ תעשייתי. היא עשויה מפח שעומד בטמפרטורות קיצוניות, הרעדות, שנים של שמש ישירה. מה שהיא יודעת לעשות הכי טוב – היא לעמוד. איזה חומר יותר טוב מזה לריהוט בר פעיל?</p>
          </div>
        </div>
      </RevealSection>

      {/* STORY PART 3 */}
      <RevealSection style={{ paddingTop: '40px' }}>
        <div className="section-inner">
          <div className="story-section">
            <div className="section-label">// THE NAME</div>
            <h2 className="section-title">ככה נולד<br /><span className="pink">ironic.</span></h2>
            <p>שם המותג הוא הבדיחה הפנימית שלנו. הדבר הכי תעשייתי, הכי מלוכלך, הכי נחשב "זבל" – חבית דלק שאיש לא רצה – הופך לחלק הכי מעוצב במקום שבו מבלים. <span className="highlight">זאת האירוניה.</span></p>
            <p>אנחנו בית מלאכה. לא מפעל, לא רשת, לא סטארט-אפ. בית מלאכה של אנשים שיודעים לעבוד עם ברזל – חיתוך, ריתוך, עיבוד, צביעה. כל חבית שמגיעה אלינו עוברת ניקוי כימי, חיתוך ידני, ריתוך מחזק, וצביעה תעשייתית בתנור.</p>
            <p>מה שיוצא – לא דומה לשום דבר אחר בשוק. כי <span className="highlight-cyan">אין שום דבר אחר בשוק</span>.</p>
          </div>
        </div>
      </RevealSection>

      {/* WORKSHOP STAGES */}
      <RevealSection className="workshop-section">
        <div className="section-inner">
          <div className="section-label">// THE PROCESS</div>
          <h2 className="section-title">מחבית ל<span className="pink">סט</span>.<br />5 שלבים, כמה ימים.</h2>
          <div className="stages-grid">
            <div className="stage-card">
              <div className="stage-number">01</div>
              <div className="stage-title">גיוס</div>
              <div className="stage-desc">מאתרים חביות תעשייתיות במפעלים, נמלים, ומוסכים. בוחרים רק את אלה שעוד שלמות מבפנים.</div>
            </div>
            <div className="stage-card">
              <div className="stage-number">02</div>
              <div className="stage-title">ניקוי</div>
              <div className="stage-desc">ניקוי כימי מלא לשאריות דלק, הסרת צבע ישן, והכנה לחיתוך. בלי זה אין ריתוך נקי.</div>
            </div>
            <div className="stage-card">
              <div className="stage-number">03</div>
              <div className="stage-title">חיתוך</div>
              <div className="stage-desc">חיתוך ידני של החבית – שולחן מלמעלה, 2 כיסאות מהצדדים. כל חבית נחתכת בעבודת יד בדיוק של מילימטרים.</div>
            </div>
            <div className="stage-card">
              <div className="stage-number">04</div>
              <div className="stage-title">ריתוך</div>
              <div className="stage-desc">הוספת רגליים, מושבים, משענות. ריתוך תעשייתי חזק שמחזיק עמידה בבר פעיל שנים.</div>
            </div>
            <div className="stage-card">
              <div className="stage-number">05</div>
              <div className="stage-title">צביעה</div>
              <div className="stage-desc">ציפוי אבקה בתנור בטמפרטורה של 200°C. צבע שעומד בשוליים רטובים, מכות, שמש, וכל מה שבר פעיל יכול לזרוק עליו.</div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* VALUES */}
      <RevealSection className="values-section">
        <div className="section-inner">
          <div className="section-label">// WHAT WE STAND FOR</div>
          <h2 className="section-title">4 עקרונות.<br /><span className="cyan">אפס פשרות.</span></h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">R</div>
              <h3 className="value-title">Reclaim</h3>
              <p className="value-desc">כל סט מציל חבית תעשייתית מהפסולת. זה לא שיווק ירוק, זה מה שאנחנו עושים בפועל.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">!</div>
              <h3 className="value-title">Stand Out</h3>
              <p className="value-desc">אם הלקוחות שלך לא מצלמים את הריהוט שלך, הוא עושה את העבודה שלו רע. הסטים שלנו נועדו להיות מצולמים.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">+</div>
              <h3 className="value-title">Built Tough</h3>
              <p className="value-desc">פח תעשייתי שנועד להחזיק 200 ליטר בלחץ. אם זה שרד עשור של דלק, זה ישרוד עשרים שנה של בירה.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">✱</div>
              <h3 className="value-title">Your Brand</h3>
              <p className="value-desc">כל חבית יכולה לשאת את הלוגו שלך. המקום שלך על הברזל, לנצח.</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* STATS */}
      <RevealSection className="stats-section">
        <div className="section-inner">
          <div className="section-label" style={{ textAlign: 'center' }}>// BY THE NUMBERS</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>המספרים<br />שמאחורינו.</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <StatCounter target={400} suffix="+" />
              <div className="stat-label">חביות תעשייתיות שהוצלנו מפסולת</div>
            </div>
            <div className="stat-item">
              <StatCounter text="1:1" />
              <div className="stat-label">כל סט שווה חבית אחת פחות בפסולת</div>
            </div>
            <div className="stat-item">
              <StatCounter text="100%" />
              <div className="stat-label">תוצרת ישראל, עבודת ידיים בבית מלאכה</div>
            </div>
            <div className="stat-item">
              <StatCounter target={14} />
              <div className="stat-label">ימי ייצור לכל סט מרגע ההזמנה</div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* GALLERY / WORKSHOP VIBE */}
      <RevealSection className="gallery-section">
        <div className="section-inner">
          <div className="section-label">// FROM THE WORKSHOP</div>
          <h2 className="section-title">מה קורה אצלנו<br /><span className="yellow">בסדנה.</span></h2>
          <div className="gallery-grid">
            <div className="gallery-item">
              <span className="gallery-icon">🛢️</span>
              <span className="gallery-caption">RAW BARREL</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-icon">🔥</span>
              <span className="gallery-caption">CUTTING</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-icon">⚡</span>
              <span className="gallery-caption">WELDING</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-icon">🎨</span>
              <span className="gallery-caption">PAINTING</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-icon">✨</span>
              <span className="gallery-caption">FINISHING</span>
            </div>
            <div className="gallery-item">
              <span className="gallery-icon">🚚</span>
              <span className="gallery-caption">DELIVERY</span>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* FOUNDER QUOTE */}
      <RevealSection className="founder-section">
        <div className="founder-inner">
          <div className="section-label" style={{ marginBottom: '30px' }}>// FROM THE FOUNDER</div>
          <div className="founder-quote">
            אנחנו לא מוכרים ריהוט. אנחנו מוכרים את הרגע שבו לקוח נכנס לבר שלך, רואה את הסט, ומוציא את הפלאפון.
          </div>
          <div className="founder-name">המייסדים של ironic</div>
          <div className="founder-title">בית מלאכה · ישראל</div>
        </div>
      </RevealSection>

      {/* CTA */}
      <section className="cta-section">
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
