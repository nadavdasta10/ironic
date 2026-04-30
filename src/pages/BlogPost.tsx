import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { POSTS } from '../data/blog';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<typeof POSTS[0] | null>(null);

  useEffect(() => {
    // Find the post by ID
    const foundPost = POSTS.find(p => p.id === Number(id));
    if (foundPost) {
      setPost(foundPost);
    }
    // Scroll to top when opening post
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="blog-main flex items-center justify-center min-h-[50vh]">
          <h2>המאמר לא נמצא</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${post.title} | מותג החביות הברזל Ironic`}</title>
        <meta name="description" content={post.metaDesc || post.excerpt} />
        <meta name="keywords" content={post.keywords || "עיצוב תעשייתי, חביות, סטודיו רהיטים, ברזל, Ironic"} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDesc || post.excerpt} />
        {post.image && <meta property="og:image" content={`https://ironic-lake.vercel.app/${post.image}`} />}
      </Helmet>

      <Navbar />

      <article className="blog-post-article">
        <header className="blog-post-header" style={{ padding: '120px 20px 60px', textAlign: 'center', background: 'var(--deep-2)' }}>
          <div className="hero-tag" style={{ justifyContent: 'center' }}>{post.tag}</div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontFamily: 'var(--font-display)', marginBottom: '24px', letterSpacing: '-1px' }}>
            {post.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px' }}>פורסם בתאריך: {post.date}</p>
        </header>

        <div className="blog-post-image-hero" style={{ maxWidth: '800px', margin: '-40px auto 40px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          <img 
            src={post.image ? `/${post.image}` : `https://picsum.photos/seed/${post.seed || 'factory'}/1000/600`} 
            alt={post.title}
            style={{ width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', objectFit: 'cover', aspectRatio: '21/9' }}
          />
        </div>

        <div className="blog-post-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 60px', fontSize: '18px', lineHeight: '1.8', color: 'rgba(255,255,255,0.85)' }}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div style={{ marginTop: '20px', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--white)', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>אהבתם את המאמר?</h3>
            <p style={{ marginBottom: '20px' }}>שתפו אותו או בואו לעצב את פריט האמנות הייחודי שלכם.</p>
            <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex' }}>חזרה לכלל העבודות שלנו ←</Link>
          </div>
        </div>
      </article>

      <Footer />
    </>
  );
}
