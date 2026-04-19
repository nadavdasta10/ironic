import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout, db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);

  // State for Editor
  const [editMode, setEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>({});

  const [products, setProducts] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<any>({});
  const [productEditMode, setProductEditMode] = useState(false);

  // State for Store Config (Fonts, Global layout)
  const [storeConfig, setStoreConfig] = useState<any>({
    fontDisplay: "'Bebas Neue', 'Assistant', sans-serif",
    fontBody: "'Assistant', sans-serif"
  });
  const [activeTab, setActiveTab] = useState<'blog' | 'products' | 'store'>('blog');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, 'blogPosts'), snap => {
      const p: any[] = [];
      snap.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      setPosts(p);
    });
    
    const unsubProducts = onSnapshot(collection(db, 'products'), snap => {
      const p: any[] = [];
      snap.forEach(doc => p.push({ id: doc.id, ...doc.data() }));
      setProducts(p);
    });
    
    // Listen to store config
    const unsubStore = onSnapshot(doc(db, 'storeConfig', 'global'), docSnap => {
      if (docSnap.exists()) {
        setStoreConfig(docSnap.data());
      }
    });

    return () => { unsub(); unsubProducts(); unsubStore(); };
  }, [user]);

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        fontDisplay: storeConfig.fontDisplay,
        fontBody: storeConfig.fontBody,
        updatedAt: serverTimestamp(),
        ownerId: user?.uid
      };
      await setDoc(doc(db, 'storeConfig', 'global'), data, { merge: true });
      alert('הגדרות החנות עודכנו!');
    } catch (err) {
      console.error(err);
      alert('שגיאה בשמירה – ' + (err as Error).message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        const ref = doc(db, 'products', currentProduct.id);
        const data = { ...currentProduct };
        delete data.id;
        delete data.createdAt;
        data.updatedAt = serverTimestamp();
        data.price = Number(data.price || 0);
        data.shippingPrice = Number(data.shippingPrice || 0);
        data.extraPrice = Number(data.extraPrice || 0);
        await updateDoc(ref, data);
      } else {
        const data = {
          title: currentProduct.title || 'New Product',
          description: currentProduct.description || 'Description',
          price: Number(currentProduct.price || 0),
          shippingPrice: Number(currentProduct.shippingPrice || 0),
          extraPrice: Number(currentProduct.extraPrice || 0),
          imageUrl: currentProduct.imageUrl || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerId: user?.uid
        };
        await addDoc(collection(db, 'products'), data);
      }
      setProductEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Error saving product: ' + (err as Error).message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error(err);
    }
  };

  const seedBlogPosts = async () => {
    if (!confirm('לייבא את הפוסטים לדוגמה לתוך מסד הנתונים?')) return;
    const MOCK_POSTS = [
      { title: 'איך אנחנו מצילים חביות מפסולת?', tag: '// קיימות', excerpt: 'המסע של חבית מתחילה מערמות הברזל בחצרות מפעלים ועד למוצר המוגמר שמגיע לבר שלכם.', date: '12 באפריל, 2026', seed: 'factory' },
      { title: 'פסיכולוגיה של צבע: למה ורוד?', tag: '// עיצוב ותכנון', excerpt: 'בחירת הצבעים שלנו לא מקרית. איך צבעים בוהקים משפיעים על אווירה, צריכת אלכוהול וצילום רשתות חברתיות.', date: '8 באפריל, 2026', seed: 'neon' },
      { title: 'הטרנדים החמים למועדונים', tag: '// תעשייה', excerpt: 'מה נראה יותר השנה בברים המובילים בשוק? קווים גסים, תאורת ניאון, ואפס פשרות על איכות.', date: '30 במרץ, 2026', seed: 'club' },
      { title: 'מאחורי הקלעים: סדנת העבודה', tag: '// אותנטיות', excerpt: 'רעש דיסק אל קול ריתוך. מבט בלעדי אל תוך בית המלאכה שבו כל הקסם והלכלוך קורה בפועל.', date: '22 במרץ, 2026', seed: 'welding' }
    ];
    for(let p of MOCK_POSTS) {
      await addDoc(collection(db, 'blogPosts'), {
         ...p,
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp(),
         ownerId: user?.uid
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPost.id) {
        // Update
        const ref = doc(db, 'blogPosts', currentPost.id);
        const data = { ...currentPost };
        delete data.id;
        delete data.createdAt; // Cannot update strict creation
        data.updatedAt = serverTimestamp();
        await updateDoc(ref, data);
      } else {
        // Create
        const data = {
          title: currentPost.title || 'New Post',
          tag: currentPost.tag || '// tag',
          excerpt: currentPost.excerpt || 'Excerpt',
          date: currentPost.date || new Date().toLocaleDateString('he-IL'),
          seed: currentPost.seed || 'factory',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ownerId: user?.uid
        };
        await addDoc(collection(db, 'blogPosts'), data);
      }
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert('Error saving. Are you an admin? ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  if (loading) return <div style={{color:'white', padding: 40}}>טוען...</div>;

  if (!user) {
    return (
      <div style={{ color: 'white', padding: 100, textAlign: 'center' }}>
        <h1 style={{fontFamily: 'var(--font-display)', fontSize: 40, marginBottom: 20}}>ironic admin</h1>
        <button className="btn-cart" onClick={loginWithGoogle}>התחבר עם מערכת גוגל</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, color: 'white', maxWidth: 800, margin: '0 auto', fontFamily: 'var(--font-body)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <h1 style={{fontFamily: 'var(--font-display)', fontSize: 40}}>מערכת ניהול</h1>
        <div style={{display:'flex', gap: 10}}>
           <button onClick={() => setActiveTab('blog')} style={{background: activeTab === 'blog' ? 'var(--pink)' : 'transparent', color: 'white', border:'1px solid var(--pink)', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>פוסטים בבלוג</button>
           <button onClick={() => setActiveTab('products')} style={{background: activeTab === 'products' ? 'var(--pink)' : 'transparent', color: 'white', border:'1px solid var(--pink)', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>מוצרים בחנות</button>
           <button onClick={() => setActiveTab('store')} style={{background: activeTab === 'store' ? 'var(--pink)' : 'transparent', color: 'white', border:'1px solid var(--pink)', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>הגדרות כלליות</button>
        </div>
        <div>
          <span style={{marginLeft: 20}}>{user.user?.email || user.email}</span>
          <button onClick={logout} style={{background: 'transparent', border:'1px solid white', color:'white', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>התנתק</button>
        </div>
      </div>

      {activeTab === 'store' && (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 30 }}>
          <h2 style={{marginBottom: 20}}>הגדרות פונטים (CSS)</h2>
          <form onSubmit={handleSaveStore} style={{display:'flex', flexDirection:'column', gap: 15}}>
            <div>
              <label>פונט כותרות (Display)</label>
              <input type="text" value={storeConfig.fontDisplay || ''} onChange={e => setStoreConfig({...storeConfig, fontDisplay: e.target.value})} required style={inputStyle} />
            </div>
            <div>
              <label>פונט קריאה (Body)</label>
              <input type="text" value={storeConfig.fontBody || ''} onChange={e => setStoreConfig({...storeConfig, fontBody: e.target.value})} required style={inputStyle} />
            </div>

            <button type="submit" className="btn-cart" style={{padding: '10px 20px', borderRadius: 8, marginTop: 10}}>שמור פונטים</button>
          </form>
        </div>
      )}

      {activeTab === 'products' && (!productEditMode ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2>ניהול מוצרים</h2>
            <button className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}} onClick={() => { setCurrentProduct({}); setProductEditMode(true); }}>מוצר חדש +</button>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20 }}>
            {products.length === 0 && <p>אין מוצרים במסד. (מומלץ להוסיף את הסט הראשי כ-"barrel-set")</p>}
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <h3 style={{marginBottom: 4}}>{p.title} <span style={{fontSize: 12, opacity: 0.5}}>({p.id})</span></h3>
                  <div style={{opacity: 0.6, fontSize: 13}}>₪{p.price} | משלוח: ₪{p.shippingPrice}</div>
                </div>
                <div>
                  <button onClick={() => { setCurrentProduct(p); setProductEditMode(true); }} style={{background:'var(--cyan)', color:'black', border:'none', padding: '6px 12px', borderRadius: 4, marginLeft: 10, cursor:'pointer'}}>ערוך</button>
                  <button onClick={() => handleDeleteProduct(p.id)} style={{background:'var(--pink)', color:'white', border:'none', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>מחק</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 30 }}>
          <h2 style={{marginBottom: 20}}>{currentProduct.id ? 'ערוך מוצר' : 'מוצר חדש'}</h2>
          <form onSubmit={handleSaveProduct} style={{display:'flex', flexDirection:'column', gap: 15}}>
            <input placeholder="שם המוצר" value={currentProduct.title || ''} onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} required style={inputStyle} />
            <textarea placeholder="תיאור..." value={currentProduct.description || ''} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} required style={{...inputStyle, height: 100, fontFamily: 'inherit', resize: 'vertical'}} />
            <input placeholder="כתובת תמונה מ-unsplash/picsum או מתיקיית public" value={currentProduct.imageUrl || ''} onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} required style={inputStyle} />
            
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
              <div>
                <label>מחיר בסיס (₪)</label>
                <input type="number" value={currentProduct.price || 0} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label>עלות משלוח (₪)</label>
                <input type="number" value={currentProduct.shippingPrice || 0} onChange={e => setCurrentProduct({...currentProduct, shippingPrice: e.target.value})} required style={inputStyle} />
              </div>
              <div>
                <label>עלות תוספת (לדוג' לוגו) (₪)</label>
                <input type="number" value={currentProduct.extraPrice || 0} onChange={e => setCurrentProduct({...currentProduct, extraPrice: e.target.value})} required style={inputStyle} />
              </div>
            </div>

            <div style={{display:'flex', gap: 10, marginTop: 10}}>
              <button type="submit" className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}}>שמור מוצר</button>
              <button type="button" onClick={() => setProductEditMode(false)} style={{background: 'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'white', padding: '10px 20px', borderRadius: 8, cursor:'pointer'}}>ביטול</button>
            </div>
          </form>
        </div>
      ))}

      {activeTab === 'blog' && (!editMode ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2>פוסטים בבלוג</h2>
            <div style={{display:'flex', gap: 10}}>
              {posts.length === 0 && (
                 <button className="btn-ghost" style={{padding: '10px 20px', borderRadius: 8}} onClick={seedBlogPosts}>ייבוא ראשוני למסד</button>
              )}
              <button className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}} onClick={() => { setCurrentPost({}); setEditMode(true); }}>הוסף פוסט +</button>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20 }}>
            {posts.length === 0 && <p>אין פוסטים במסד הנתונים עדיין.</p>}
            {posts.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <h3 style={{marginBottom: 4}}>{p.title}</h3>
                  <div style={{opacity: 0.6, fontSize: 13, fontFamily: 'var(--font-mono)'}}>{p.tag} · {p.date}</div>
                </div>
                <div>
                  <button onClick={() => { setCurrentPost(p); setEditMode(true); }} style={{background:'var(--cyan)', color:'black', border:'none', padding: '6px 12px', borderRadius: 4, marginLeft: 10, cursor:'pointer'}}>ערוך</button>
                  <button onClick={() => handleDelete(p.id)} style={{background:'var(--pink)', color:'white', border:'none', padding: '6px 12px', borderRadius: 4, cursor:'pointer'}}>מחק</button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 30 }}>
          <h2 style={{marginBottom: 20}}>{currentPost.id ? 'ערוך פוסט' : 'פוסט חדש'}</h2>
          <form onSubmit={handleSave} style={{display:'flex', flexDirection:'column', gap: 15}}>
            <input placeholder="כותרת" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} required style={inputStyle} />
            <input placeholder="תגית (לדוגמה: // עיצוב)" value={currentPost.tag || ''} onChange={e => setCurrentPost({...currentPost, tag: e.target.value})} required style={inputStyle} />
            <input placeholder="תאריך" value={currentPost.date || ''} onChange={e => setCurrentPost({...currentPost, date: e.target.value})} required style={inputStyle} />
            <input placeholder="Seed לתמונה (מילה באנגלית, למשל factory או dark-bar)" value={currentPost.seed || ''} onChange={e => setCurrentPost({...currentPost, seed: e.target.value})} required style={inputStyle} />
            <textarea placeholder="תקציר הפוסט..." value={currentPost.excerpt || ''} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} required style={{...inputStyle, height: 100, fontFamily: 'inherit', resize: 'vertical'}} />
            
            <div style={{display:'flex', gap: 10, marginTop: 10}}>
              <button type="submit" className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}}>שמור</button>
              <button type="button" onClick={() => setEditMode(false)} style={{background: 'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'white', padding: '10px 20px', borderRadius: 8, cursor:'pointer'}}>ביטול</button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  background: 'rgba(0,0,0,0.5)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'white',
  padding: '12px 16px',
  borderRadius: 8,
  outline: 'none',
  width: '100%',
  fontSize: 16
};
