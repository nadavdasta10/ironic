import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Story from './pages/Story';
import Product from './pages/Product';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import { db } from './lib/firebase';
import { onSnapshot, doc } from 'firebase/firestore';

export default function App() {
  const [fonts, setFonts] = useState<{display: string, body: string} | null>(null);

  useEffect(() => {
    // Listen to store config purely to load the global fonts
    const unsub = onSnapshot(doc(db, 'storeConfig', 'global'), docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.fontDisplay || data.fontBody) {
          setFonts({
            display: data.fontDisplay,
            body: data.fontBody
          });
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <HelmetProvider>
      <div style={{
         '--font-display': fonts?.display || "'Bebas Neue', 'Assistant', sans-serif",
         '--font-body': fonts?.body || "'Assistant', sans-serif"
      } as React.CSSProperties}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Story />} />
            <Route path="/product" element={<Product />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}
