import React, { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { POSTS } from '../data/blog';

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

  // Render local POSTS explicitly for now as requested with the new images and content.
  const postsToRender = POSTS;

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="blog-hero">
        <div className="hero-tag">// THE JOURNAL</div>
        <h1>ברזל, צבע,<br />ומה שביניהם.</h1>
        <p>היומן שלנו לתעשייה, עיצוב, קיימות ומה שקורה מאחורי הקלעים.</p>
      </section>

      <main className="blog-main" style={{ marginTop: '0', paddingTop: '0' }}>
        
        {/* FEATURED POST */}
        <RevealSection>
          {postsToRender.length > 0 && (
            <Link to={`/blog/${postsToRender[0].id}`} className="featured-post">
              <div className="featured-image">
                <img src={postsToRender[0].image ? `/${postsToRender[0].image}` : `https://picsum.photos/seed/${postsToRender[0].seed || 'industrial'}/1000/800`} alt={postsToRender[0].title} />
              </div>
              <div className="featured-content">
                <div className="blog-tag">{postsToRender[0].tag || '// מומלץ החודש'}</div>
                <h2 className="blog-title">{postsToRender[0].title}</h2>
                <p className="blog-excerpt">{postsToRender[0].excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-date">{postsToRender[0].date}</span>
                  <span className="blog-read-more">לחץ כאן למאמר המלא ←</span>
                </div>
              </div>
            </Link>
          )}
        </RevealSection>

        {/* POSTS GRID */}
        <RevealSection style={{ paddingTop: '20px' }}>
          <div className="section-label" style={{ textAlign: 'right' }}>// ALL ARCHIVES</div>
          <div className="blog-grid">
            {postsToRender.slice(1).map(post => (
              <Link to={`/blog/${post.id}`} className="blog-card" key={post.id} style={{ display: 'flex' }}>
                <div className="blog-card-image">
                  <img src={post.image ? `/${post.image}` : `https://picsum.photos/seed/${post.seed || 'factory'}/600/400`} alt={post.title} />
                </div>
                <div className="blog-card-content">
                  <div className="blog-tag">{post.tag}</div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-more">קרא עוד ←</span>
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
             <Link to="/contact" className="btn-ghost">יש לי פרויקט מיוחד</Link>
           </div>
         </div>
       </section>

      <Footer />
    </>
  );
}
