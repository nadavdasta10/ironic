import React, { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Search, Droplets, Zap, Hammer, Paintbrush } from 'lucide-react';

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
          <div className="story-split-container">
            <div className="story-split-text story-section" style={{ margin: 0 }}>
              <div className="section-label">// THE DISCOVERY</div>
              <h2 className="section-title">מהמסך למציאות –<br /><span className="cyan">הסיפור שמאחורי החבית.</span></h2>
              <p>זה התחיל כשנתקלנו בתמונות ברחבי הרשת – עיצובים תעשייתיים שהפכו חביות דלק ישנות לרהיטי יוקרה בערים כמו ברלין וניו יורק. נדלקנו על הקונספט, אבל ידענו שאנחנו רוצים לעשות את זה בדרך שלנו: יותר חזק, יותר אותנטי, ויותר ישראלי.</p>
              <p>יצאנו לחפש את חומרי הגלם הכי טובים שיש. מצאנו אותם במוסך של חבר, על ערימת פסולת בנמל אשדוד, ומאחורי מפעלים בנתניה. חביות דלק תעשייתיות בגודל מלא, עשויות פח איכותי בעובי מכובד, שפשוט חיכו לגריסה. עבור אחרים זה היה זבל, <span className="highlight">עבורנו זו הייתה הזדמנות ליצירה.</span></p>
              <p>החבית הזו נוצרה במקור להחזיק 200 ליטר דלק בלחץ תעשייתי ולשרוד שנים של שמש ישירה וטלטולים. הקימורים שלה (הקונטור) הם כאלו שאף מפעל רהיטים לא יכול לעצב בייצור המוני מבלי להתחיל מאפס. לקחנו את העמידות הבלתי מתפשרת הזו והפכנו אותה לסט בר מעוצב – שילוב מושלם בין השראה בינלאומית לחוזק תעשייתי כחול-לבן.</p>
            </div>
            <div className="story-split-visuals">
              <div className="showcase-wrapper">
                <div className="single-showcase">
                  <img src="/naked-barrel.jpg" alt="Naked Barrel" className="showcase-img" />
                </div>
                <div className="showcase-floating-title">ככה מתחיל התהליך</div>
              </div>
            </div>
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
          
          <div className="story-split-container" style={{ margin: '80px 0' }}>
            <div className="story-split-visuals">
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto', aspectRatio: '4/3', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(255, 0, 128, 0.3)' }}>
                <img src="/cutting.jpg" alt="Laser Cutting" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', borderRadius: '20px', pointerEvents: 'none' }}></div>
              </div>
            </div>
            <div className="story-split-text story-section" style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontFamily: 'var(--font-display)', marginBottom: '24px', lineHeight: 1, letterSpacing: '-1px' }}>
                <span className="gradient-text">אמנות</span><br/>המיחזור.
              </h3>
              <p style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                כל חבית שאנחנו בוחרים עוברת תהליך קפדני של ניקוי, חיתוך בלייזר, שיוף וצביעה בתנור. אנחנו לא רק בונים רהיטים - אנחנו יוצרים פריטי אספנות שיחזיקו מעמד לדורות.
              </p>
            </div>
          </div>

          <div className="snake-process hidden lg:block" dir="rtl">
            <div className="snake-row snake-row-1">
              <div className="snake-node">
                <div className="snake-icon"><Search size={36} /></div>
                <div className="snake-title">גיוס</div>
                <div className="snake-desc">מאתרים חביות תעשייתיות במפעלים, נמלים, ומוסכים. בוחרים רק את אלה שעוד שלמות מבפנים.</div>
              </div>
              <div className="snake-node">
                <div className="snake-icon"><Droplets size={36} /></div>
                <div className="snake-title">ניקוי</div>
                <div className="snake-desc">ניקוי כימי מלא לשאריות דלק, הסרת צבע ישן, והכנה לחיתוך. בלי זה אין ריתוך נקי.</div>
              </div>
              <div className="snake-node">
                <div className="snake-icon"><Zap size={36} /></div>
                <div className="snake-title">חיתוך</div>
                <div className="snake-desc">חיתוך ידני של החבית – שולחן מלמעלה, 2 כיסאות מהצדדים. כל חבית נחתכת בדיוק של מילימטרים.</div>
              </div>
            </div>
            
            <div className="snake-row snake-row-2">
              <div className="snake-node empty"></div>
              <div className="snake-node">
                <div className="snake-icon"><Paintbrush size={36} /></div>
                <div className="snake-title">צביעה</div>
                <div className="snake-desc">ציפוי אבקה בתנור בטמפרטורה של 200°C. צבע שעומד בשוליים רטובים, מכות ושמש.</div>
              </div>
              <div className="snake-node">
                <div className="snake-icon"><Hammer size={36} /></div>
                <div className="snake-title">ריתוך</div>
                <div className="snake-desc">הוספת רגליים, מושבים, משענות. ריתוך תעשייתי חזק שמחזיק עמידה בבר פעיל שנים.</div>
              </div>
            </div>
          </div>

          <div className="snake-mobile lg:hidden" dir="rtl">
            <div className="snake-m-node">
              <div className="snake-m-icon"><Search size={32} /></div>
              <div className="snake-m-content">
                <div className="snake-title">גיוס</div>
                <div className="snake-desc">מאתרים חביות תעשייתיות במפעלים, נמלים, ומוסכים. בוחרים רק את אלה שעוד שלמות מבפנים.</div>
              </div>
            </div>
            <div className="snake-m-node">
              <div className="snake-m-icon"><Droplets size={32} /></div>
              <div className="snake-m-content">
                <div className="snake-title">ניקוי</div>
                <div className="snake-desc">ניקוי כימי מלא לשאריות דלק, הסרת צבע ישן, והכנה לחיתוך. בלי זה אין ריתוך נקי.</div>
              </div>
            </div>
            <div className="snake-m-node">
              <div className="snake-m-icon"><Zap size={32} /></div>
              <div className="snake-m-content">
                <div className="snake-title">חיתוך</div>
                <div className="snake-desc">חיתוך ידני של החבית – שולחן מלמעלה, 2 כיסאות מהצדדים. כל חבית נחתכת בדיוק של מילימטרים.</div>
              </div>
            </div>
            <div className="snake-m-node">
              <div className="snake-m-icon"><Hammer size={32} /></div>
              <div className="snake-m-content">
                <div className="snake-title">ריתוך</div>
                <div className="snake-desc">הוספת רגליים, מושבים, משענות. ריתוך תעשייתי חזק שמחזיק עמידה בבר פעיל שנים.</div>
              </div>
            </div>
            <div className="snake-m-node">
              <div className="snake-m-icon"><Paintbrush size={32} /></div>
              <div className="snake-m-content">
                <div className="snake-title">צביעה</div>
                <div className="snake-desc">ציפוי אבקה בתנור בטמפרטורה של 200°C. צבע שעומד בשוליים רטובים, מכות ושמש.</div>
              </div>
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

      {/* THE RESULTS / PRODUCT SHOTS */}
      <RevealSection style={{ padding: '100px 40px', background: 'var(--deep)' }}>
        <div className="section-inner">
          <div className="section-label" style={{ textAlign: 'center' }}>// THE RESULT</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>איך זה נראה<br /><span className="cyan">במציאות.</span></h2>
          <div className="story-collage" style={{ marginTop: '60px' }}>
            <div className="story-circle-wrapper">
              <img src="/product-blue.jpg" alt="Blue Barrel Set" className="story-circle-img" />
            </div>
            <div className="story-circle-wrapper pink-theme">
              <img src="/product-green.jpg" alt="Green Barrel Set" className="story-circle-img" />
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
