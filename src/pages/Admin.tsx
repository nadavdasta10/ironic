import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout, db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, ShoppingCart, Tag, Users, BarChart2, MessageSquare, Settings, Layout, Zap, Calendar } from 'lucide-react';

const mockChartData = [
  { name: '1 במאי', values: 1200 },
  { name: '4 במאי', values: 2100 },
  { name: '7 במאי', values: 1800 },
  { name: '10 במאי', values: 3200 },
  { name: '15 במאי', values: 4500 },
  { name: '20 במאי', values: 3900 },
  { name: '25 במאי', values: 5100 },
  { name: '30 במאי', values: 6500 },
];

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
  
  const [orders, setOrders] = useState<any[]>([]);

  // State for Store Config (Fonts, Global layout, Tracking)
  const [storeConfig, setStoreConfig] = useState<any>({
    fontDisplay: "'Bebas Neue', 'Assistant', sans-serif",
    fontBody: "'Assistant', sans-serif",
    gaId: '',
    gtmId: '',
    fbPixel: ''
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'blog' | 'products' | 'store'>('overview');

  const [dateRange, setDateRange] = useState<'day'|'week'|'month'|'custom'>('month');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  // Handle Image Conversion to Base64
  const processImageUpload = (file: File, callback: (base64: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => {
      const o: any[] = [];
      snap.forEach(doc => o.push({ id: doc.id, ...doc.data() }));
      setOrders(o);
    });
    
    // Listen to store config
    const unsubStore = onSnapshot(doc(db, 'storeConfig', 'global'), docSnap => {
      if (docSnap.exists()) {
        setStoreConfig(prev => ({...prev, ...docSnap.data()}));
      }
    });

    return () => { unsub(); unsubProducts(); unsubOrders(); unsubStore(); };
  }, [user]);

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        fontDisplay: storeConfig.fontDisplay,
        fontBody: storeConfig.fontBody,
        gaId: storeConfig.gaId || '',
        gtmId: storeConfig.gtmId || '',
        fbPixel: storeConfig.fbPixel || '',
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
        data.title = data.title || 'New Product';
        data.description = data.description || 'Description';
        data.imageUrl = data.imageUrl || '';
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
    try {
      const MOCK_POSTS = [
        { title: 'איך אנחנו מצילים חביות מפסולת?', tag: '// קיימות', excerpt: 'המסע של חבית מתחילה מערמות הברזל בחצרות מפעלים ועד למוצר המוגמר שמגיע לבר שלכם.', date: '12 באפריל, 2026', seed: 'factory', image: '', meta: '' },
        { title: 'פסיכולוגיה של צבע: למה ורוד?', tag: '// עיצוב ותכנון', excerpt: 'בחירת הצבעים שלנו לא מקרית. איך צבעים בוהקים משפיעים על אווירה, צריכת אלכוהול וצילום רשתות חברתיות.', date: '8 באפריל, 2026', seed: 'neon', image: '', meta: '' },
        { title: 'הטרנדים החמים למועדונים', tag: '// תעשייה', excerpt: 'מה נראה יותר השנה בברים המובילים בשוק? קווים גסים, תאורת ניאון, ואפס פשרות על איכות.', date: '30 במרץ, 2026', seed: 'club', image: '', meta: '' },
        { title: 'מאחורי הקלעים: סדנת העבודה', tag: '// אותנטיות', excerpt: 'רעש דיסק אל קול ריתוך. מבט בלעדי אל תוך בית המלאכה שבו כל הקסם והלכלוך קורה בפועל.', date: '22 במרץ, 2026', seed: 'welding', image: '', meta: '' }
      ];
      for(let p of MOCK_POSTS) {
        await addDoc(collection(db, 'blogPosts'), {
           ...p,
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp(),
           ownerId: user?.uid
        });
      }
      alert('הפוסטים יובאו בהצלחה!');
    } catch(err) {
      console.error(err);
      alert('שגיאה בייבוא פוסטים - ' + (err as Error).message);
    }
  };

  const seedProducts = async () => {
    if (!confirm('לייבא את מוצרי החנות הדיפולטיביים?')) return;
    try {
      const DEFAULT_PRODUCTS = [
        { title: 'סט מושלם לבר (יחידה אחת)', description: 'שולחן חבית מרכזי ו-2 כיסאות תואמים.', price: 1499, shippingPrice: 129, extraPrice: 199, imageUrl: '' },
        { title: 'סט זוגי - 3 יחידות', description: 'מושלם לפינות ישיבה נרחבות בחללים פתוחים. חסוך 10%.', price: 4047, shippingPrice: 200, extraPrice: 199, imageUrl: '' }
      ];
      for(let p of DEFAULT_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
           ...p,
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp(),
           ownerId: user?.uid
        });
      }
      alert('המוצרים יובאו בהצלחה!');
    } catch (err) {
      console.error(err);
      alert('שגיאה בייבוא מוצרים - ' + (err as Error).message);
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
        data.title = data.title || 'New Post';
        data.tag = data.tag || '// tag';
        data.meta = data.meta || '';
        data.excerpt = data.excerpt || 'Excerpt';
        data.date = data.date || new Date().toLocaleDateString('he-IL');
        data.seed = data.seed || 'factory';
        data.image = data.image || '';
        data.updatedAt = serverTimestamp();
        await updateDoc(ref, data);
      } else {
        // Create
        const data = {
          title: currentPost.title || 'New Post',
          tag: currentPost.tag || '// tag',
          meta: currentPost.meta || '',
          excerpt: currentPost.excerpt || 'Excerpt',
          date: currentPost.date || new Date().toLocaleDateString('he-IL'),
          seed: currentPost.seed || 'factory',
          image: currentPost.image || '',
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

  // Calculate filtered orders based on date range
  const filteredOrders = orders.filter(o => {
    if (!o.createdAt) return true; // fallback if no timestamp
    const date = o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
    const now = new Date();
    if (dateRange === 'day') {
      return date >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    if (dateRange === 'week') {
      const pastWeek = new Date();
      pastWeek.setDate(now.getDate() - 7);
      return date >= pastWeek;
    }
    if (dateRange === 'month') {
      const pastMonth = new Date();
      pastMonth.setDate(now.getDate() - 30);
      return date >= pastMonth;
    }
    if (dateRange === 'custom') {
      if (!customDates.start || !customDates.end) return true;
      const start = new Date(customDates.start);
      const end = new Date(customDates.end);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    return true;
  });

  const totalSales = filteredOrders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalSessions = Math.round(totalSales > 0 ? (totalSales / 1499) * 200 : 88009); // Fake mock multiplier based on sales

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">ironic.</div>
        
        <button className={`admin-sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <Home size={18} /> סקירה (Home)
        </button>
        <button className={`admin-sidebar-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          <ShoppingCart size={18} /> הזמנות
        </button>
        <button className={`admin-sidebar-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          <Tag size={18} /> מוצרים
        </button>
        <button className={`admin-sidebar-link`} onClick={() => alert('לקוחות - בפיתוח עתידי')}>
          <Users size={18} /> לקוחות
        </button>
        <button className={`admin-sidebar-link`} onClick={() => setActiveTab('overview')}>
          <BarChart2 size={18} /> נתונים ואנליטיקס
        </button>
        <button className={`admin-sidebar-link`} onClick={() => alert('שיווק - בפיתוח עתידי')}>
          <Zap size={18} /> שיווק ומבצעים
        </button>

        <div className="admin-sidebar-group">ניהול תוכן ועיצוב</div>
        
        <button className={`admin-sidebar-link ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
          <MessageSquare size={18} /> הבלוג של המותג
        </button>
        <button className={`admin-sidebar-link ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
          <Settings size={18} /> הגדרות חנות
        </button>
        
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button onClick={logout} style={{background: 'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'white', width: '100%', padding: '8px 12px', borderRadius: 4, cursor:'pointer'}}>התנתק</button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="admin-main">
        {activeTab === 'overview' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-header-title">סקירת נתונים (Overview)</h1>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                
                <select value={dateRange} onChange={e => setDateRange(e.target.value as any)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 8, outline: 'none' }}>
                  <option value="day" style={{color:'black'}}>היום</option>
                  <option value="week" style={{color:'black'}}>השבוע (7 ימים)</option>
                  <option value="month" style={{color:'black'}}>החודש (30 ימים)</option>
                  <option value="custom" style={{color:'black'}}>תאריכים ספציפיים</option>
                </select>

                {dateRange === 'custom' && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="date" value={customDates.start} onChange={e => setCustomDates({...customDates, start: e.target.value})} style={{ background: 'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding: '4px 8px', borderRadius:4 }} />
                    <input type="date" value={customDates.end} onChange={e => setCustomDates({...customDates, end: e.target.value})} style={{ background: 'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding: '4px 8px', borderRadius:4 }} />
                  </div>
                )}
                
                <div style={{ opacity: 0.5, fontSize: 13, marginRight: 15 }}>לעומת התקופה הקודמת</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 30, marginBottom: 40 }}>
              
              {/* TOTAL SALES CARD */}
              <div className="admin-card">
                <div className="admin-chart-title">
                  <h3>סה״כ מכירות ברוטו</h3>
                  <a href="#">הצג דוח מלא</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div className="admin-stat-main">
                    ₪{totalSales.toLocaleString()}
                  </div>
                  <div className="admin-stat-increase">↑ 1,046%</div>
                </div>
                
                <div className="admin-table-row">
                  <span>ערוץ החנות האינטרנטית</span>
                  <div>
                    <span style={{ marginLeft: 15 }}>₪{totalSales.toLocaleString()}</span>
                    <span style={{ color: '#4ade80', fontSize: 12 }}>↑ 1,046%</span>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 30, marginBottom: 15, letterSpacing: 1, textTransform: 'uppercase' }}>מכירות לאורך זמן</div>
                <div style={{ height: 200, width: '100%', marginLeft: '-15px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0f0520', border: '1px solid var(--pink)', borderRadius: 8 }}
                        itemStyle={{ color: 'var(--cyan)' }}
                      />
                      <Line type="monotone" dataKey="values" stroke="var(--pink)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SESSIONS CARD */}
              <div className="admin-card">
                <div className="admin-chart-title">
                  <h3>כניסות לחנות (Sessions)</h3>
                  <a href="#">הצג דוח מלא</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div className="admin-stat-main">{Math.round(totalSessions * 1.05).toLocaleString()}</div>
                  <div className="admin-stat-increase">↑ 438%</div>
                </div>
                
                <div className="admin-table-row">
                  <span>מבקרים ייחודיים</span>
                  <div>
                    <span style={{ marginLeft: 15 }}>{totalSessions.toLocaleString()}</span>
                    <span style={{ color: '#4ade80', fontSize: 12 }}>↑ 437%</span>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 30, marginBottom: 15, letterSpacing: 1, textTransform: 'uppercase' }}>כניסות לאורך זמן</div>
                <div style={{ height: 200, width: '100%', marginLeft: '-15px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#0f0520', border: '1px solid var(--cyan)', borderRadius: 8 }}
                        itemStyle={{ color: 'var(--pink)' }}
                      />
                      <Line type="monotone" dataKey="values" stroke="var(--cyan)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ... KEEP EXISTING ORDER CODE ... */}

        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}>
              <h2>ניהול הזמנות</h2>
              <div style={{ background: 'rgba(255,0,128,0.1)', color: 'var(--pink)', padding: '10px 16px', borderRadius: 8, fontSize: 14, maxWidth: 500, border: '1px solid var(--pink)' }}>
                <strong>שים לב (תקני אבטחה PCI-DSS):</strong> מערכת זו אינה שומרת ואינה מציגה פרטי אשראי מלאים (מספר כרטיס, תוקף, CVV). התשלום מעובד דרך שרתי הסליקה בלבד ואנו שומרים רק אסימון זיהוי (Token) ומזהה עסקה.
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
              {orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', opacity: 0.6 }}>אין הזמנות כרגע.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>מזהה / תאריך</th>
                      <th style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>פרטי לקוח</th>
                      <th style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>כתובת למשלוח</th>
                      <th style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>פריטים ותשלום</th>
                      <th style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>סטטוס</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: 16, verticalAlign: 'top' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)' }}>{o.id.substring(0,8)}...</div>
                          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('he-IL') : 'N/A'}</div>
                        </td>
                        <td style={{ padding: 16, verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 'bold' }}>{o.customerName || 'לא צוין'}</div>
                          <div style={{ fontSize: 14, opacity: 0.8 }}>{o.customerEmail}</div>
                          <div style={{ fontSize: 14, opacity: 0.8 }}>{o.customerPhone}</div>
                        </td>
                        <td style={{ padding: 16, verticalAlign: 'top', maxWidth: 200 }}>
                          <div style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>{o.shippingAddress || 'כתובת לא צוינה'}</div>
                        </td>
                        <td style={{ padding: 16, verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 'bold', fontSize: 18 }}>₪{(o.total || 0).toLocaleString()}</div>
                          <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{o.itemsDesc || 'סט ברקלאב'}</div>
                          <div style={{ fontSize: 12, color: 'var(--pink)', marginTop: 8, fontFamily: 'var(--font-mono)' }}>Token: {o.paymentToken || 'חסר'}</div>
                        </td>
                        <td style={{ padding: 16, verticalAlign: 'top' }}>
                          <span style={{ display: 'inline-block', background: o.status === 'paid' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)', color: o.status === 'paid' ? '#4ade80' : 'white', padding: '4px 10px', borderRadius: 20, fontSize: 12 }}>
                            {o.status === 'paid' ? 'שולם והוזמן' : (o.status || 'ממתין לתשלום')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 40 }}>
            <h2 style={{marginBottom: 30}}>הגדרות חנות, עיצוב וטראקינג</h2>
            <form onSubmit={handleSaveStore} style={{display:'flex', flexDirection:'column', gap: 30}}>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 12 }}>
                <h3 style={{ marginBottom: 20, color: 'var(--cyan)' }}>חיבור למערכות אנליטיקס ופיקסלים</h3>
                <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 20 }}>הכנס את מזהי המעקב שלך כאן. הקוד יוזרק אוטומטית לקוד האתר.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Google Analytics 4 (GA4) ID <span style={{opacity: 0.5}}>(למשל: G-XXXXXXXXXX)</span></label>
                    <input type="text" value={storeConfig.gaId || ''} onChange={e => setStoreConfig({...storeConfig, gaId: e.target.value})} placeholder="G-" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Google Tag Manager (GTM) ID <span style={{opacity: 0.5}}>(למשל: GTM-XXXXXXX)</span></label>
                    <input type="text" value={storeConfig.gtmId || ''} onChange={e => setStoreConfig({...storeConfig, gtmId: e.target.value})} placeholder="GTM-" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>Facebook Pixel ID <span style={{opacity: 0.5}}>(מספר בלבד)</span></label>
                    <input type="text" value={storeConfig.fbPixel || ''} onChange={e => setStoreConfig({...storeConfig, fbPixel: e.target.value})} placeholder="1234567890" style={inputStyle} />
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 24, borderRadius: 12 }}>
                <h3 style={{ marginBottom: 20, color: 'var(--cyan)' }}>הגדרות עיצוב ופונטים</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>פונט כותרות (Display)</label>
                    <input type="text" value={storeConfig.fontDisplay || ''} onChange={e => setStoreConfig({...storeConfig, fontDisplay: e.target.value})} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>פונט קריאה (Body)</label>
                    <input type="text" value={storeConfig.fontBody || ''} onChange={e => setStoreConfig({...storeConfig, fontBody: e.target.value})} required style={inputStyle} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-cart" style={{padding: '16px 24px', borderRadius: 8, marginTop: 10, alignSelf: 'flex-start', fontSize: 16}}>שמור שינויים</button>
            </form>
          </div>
        )}

      {activeTab === 'products' && (!productEditMode ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2>ניהול מוצרים</h2>
            <div style={{display:'flex', gap: 10}}>
              {products.length === 0 && (
                <button className="btn-ghost" style={{padding: '10px 20px', borderRadius: 8}} onClick={seedProducts}>ייבוא ראשוני למסד</button>
              )}
              <button className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}} onClick={() => { setCurrentProduct({}); setProductEditMode(true); }}>מוצר חדש +</button>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20 }}>
            {products.length === 0 && <p>אין מוצרים במסד. (מומלץ להוסיף את הסט הראשי כ-"barrel-set")</p>}
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                  {p.imageUrl && <img src={p.imageUrl} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />}
                  <div>
                    <h3 style={{marginBottom: 4}}>{p.title} <span style={{fontSize: 12, opacity: 0.5}}>({p.id})</span></h3>
                    <div style={{opacity: 0.6, fontSize: 13}}>₪{p.price} | משלוח: ₪{p.shippingPrice}</div>
                  </div>
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
            
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 8, display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{display:'block', marginBottom: 8, fontSize: 14}}>תמונת מוצר (העלאה או כתובת מאתר אחר)</label>
                <input type="file" accept="image/*" onChange={e => {
                  if (e.target.files?.[0]) processImageUpload(e.target.files[0], base64 => setCurrentProduct({...currentProduct, imageUrl: base64 }));
                }} style={{ display: 'block', marginBottom: 10 }} />
                <div style={{opacity: 0.5, fontSize: 12, marginBottom: 10}}>או הזן כתובת תמונה ידנית (URL):</div>
                <input placeholder="https://..." value={currentProduct.imageUrl || ''} onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} style={inputStyle} />
              </div>
              {currentProduct.imageUrl && (
                 <img src={currentProduct.imageUrl} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }} alt="" />
              )}
            </div>
            
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
              <input placeholder="תגית/קטגוריה (לדוגמה: // עיצוב)" value={currentPost.tag || ''} onChange={e => setCurrentPost({...currentPost, tag: e.target.value})} required style={inputStyle} />
              <input placeholder="תאריך" value={currentPost.date || ''} onChange={e => setCurrentPost({...currentPost, date: e.target.value})} required style={inputStyle} />
              
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 15, borderRadius: 8, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{display:'block', marginBottom: 8, fontSize: 14}}>תמונת נושא לפוסט (העלאה או כתובת מאתר אחר)</label>
                  <input type="file" accept="image/*" onChange={e => {
                    if (e.target.files?.[0]) processImageUpload(e.target.files[0], base64 => setCurrentPost({...currentPost, image: base64 }));
                  }} style={{ display: 'block', marginBottom: 10 }} />
                  <div style={{opacity: 0.5, fontSize: 12, marginBottom: 10}}>או הזן כתובת תמונה ידנית (URL):</div>
                  <input placeholder="https://..." value={currentPost.image || ''} onChange={e => setCurrentPost({...currentPost, image: e.target.value})} style={inputStyle} />
                  
                  <div style={{opacity: 0.5, fontSize: 12, marginTop: 10, marginBottom: 5}}>מזהה Seed גנרי (למקרה שאין תמונה):</div>
                  <input placeholder="מילה באנגלית, למשל factory או dark-bar" value={currentPost.seed || ''} onChange={e => setCurrentPost({...currentPost, seed: e.target.value})} style={inputStyle} />
                </div>
                {currentPost.image ? (
                   <img src={currentPost.image} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }} alt="" />
                ) : (
                  currentPost.seed && <img src={`https://picsum.photos/seed/${currentPost.seed}/100/100`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }} alt="seed" />
                )}
              </div>

              <textarea placeholder="תקציר הפוסט..." value={currentPost.excerpt || ''} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} required style={{...inputStyle, height: 100, fontFamily: 'inherit', resize: 'vertical'}} />
              <textarea placeholder="תיאור מטא למנועי חיפוש (SEO) - מומלץ 150-160 תווים..." value={currentPost.meta || ''} onChange={e => setCurrentPost({...currentPost, meta: e.target.value})} style={{...inputStyle, height: 80, fontFamily: 'inherit', resize: 'vertical'}} />
              
              <div style={{display:'flex', gap: 10, marginTop: 10}}>
                <button type="submit" className="btn-cart" style={{padding: '10px 20px', borderRadius: 8}}>שמור פוסט</button>
                <button type="button" onClick={() => setEditMode(false)} style={{background: 'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'white', padding: '10px 20px', borderRadius: 8, cursor:'pointer'}}>ביטול</button>
              </div>
            </form>
          </div>
      ))}
      </div>
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
