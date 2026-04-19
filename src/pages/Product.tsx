import React, { useState, useRef, useEffect, DragEvent, ChangeEvent, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { onSnapshot, doc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const DEFAULT_COLORS = [
  { hex: '#DC2626', glow: 'rgba(220,38,38,0.3)', name: 'Red' },
  { hex: '#FF0080', glow: 'rgba(255,0,128,0.3)', name: 'Hot Pink' },
  { hex: '#00F0FF', glow: 'rgba(0,240,255,0.3)', name: 'Cyan' },
  { hex: '#FFE500', glow: 'rgba(255,229,0,0.3)', name: 'Yellow' },
  { hex: '#9D00FF', glow: 'rgba(157,0,255,0.3)', name: 'Violet' },
  { hex: '#16a34a', glow: 'rgba(22,163,74,0.3)', name: 'Green' },
  { hex: '#EA580C', glow: 'rgba(234,88,12,0.3)', name: 'Orange' },
  { hex: '#F5F1E8', glow: 'rgba(245,241,232,0.25)', name: 'Cream' },
  { hex: '#111111', glow: 'rgba(17,17,17,0.5)', name: 'Black' },
  { hex: '#FFFFFF', glow: 'rgba(255,255,255,0.5)', name: 'White' },
  { hex: '#1E3A8A', glow: 'rgba(30,58,138,0.3)', name: 'Navy' },
];

const LIGHT_COLORS = ['#FFE500', '#F5F1E8', '#00F0FF', '#FFFFFF'];

const DEFAULT_BASE_PRICE = 1499;
const DEFAULT_LOGO_PRICE = 199;
const DEFAULT_SHIPPING_PRICE = 129;

const BUNDLES = [
  { qty: 1, title: 'יחידה אחת', subtitle: 'סט מושלם לבר', badge: null, discount: 0 },
  { qty: 3, title: '3 יחידות', subtitle: 'חסוך 5%', badge: 'הנמכר ביותר', badgeBg: '#FFE500', badgeText: '#000', discount: 0.05 },
  { qty: 5, title: '5 יחידות', subtitle: 'חסוך 10%', badge: 'המשתלם ביותר', badgeBg: 'var(--cyan)', badgeText: '#0f0520', discount: 0.10 },
];

export default function Product() {
  const [storeConfig, setStoreConfig] = useState<any>({
    basePrice: DEFAULT_BASE_PRICE,
    logoPrice: DEFAULT_LOGO_PRICE,
    shippingPrice: DEFAULT_SHIPPING_PRICE,
    colors: DEFAULT_COLORS
  });
  const [color, setColor] = useState(DEFAULT_COLORS[0]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'storeConfig', 'global'), docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStoreConfig(data);
        if (data.colors && data.colors.length > 0) {
          // If current color is not in the new list, update it
          setColor(prev => data.colors.find((c:any) => c.hex === prev.hex) || data.colors[0]);
        }
      }
    });
    return () => unsub();
  }, []);

  const COLORS = storeConfig.colors && storeConfig.colors.length > 0 ? storeConfig.colors : DEFAULT_COLORS;
  const BASE_PRICE = storeConfig.basePrice || DEFAULT_BASE_PRICE;
  const LOGO_PRICE = storeConfig.logoPrice || DEFAULT_LOGO_PRICE;
  const SHIPPING_PRICE = storeConfig.shippingPrice || DEFAULT_SHIPPING_PRICE;

  const [logoEnabled, setLogoEnabled] = useState(false);
  const [logoData, setLogoData] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [bundleQty, setBundleQty] = useState(1);
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showBitModal, setShowBitModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const logoSlotRef = useRef<HTMLDivElement>(null);

  const isLight = LIGHT_COLORS.includes(color.hex);
  const placeholderColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
  const placeholderBorder = isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.2)';

  const currentImageSrc = color.hex === '#EA580C' ? '/orange-set.jpg' :
                          color.hex === '#111111' ? '/black-set.jpg' :
                          color.hex === '#FFFFFF' ? '/white-set.jpg' :
                          color.hex === '#DC2626' ? '/coca-cola-set.jpg' :
                          '/cream-set.jpg';

  useEffect(() => {
    setImageLoading(true);
  }, [currentImageSrc]);

  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      displayToast('הקובץ גדול מדי. מקסימום 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setLogoData(e.target.result as string);
        setLogoName(file.name);
        if (logoSlotRef.current) {
          logoSlotRef.current.classList.add('landing');
          setTimeout(() => {
            if (logoSlotRef.current) {
              logoSlotRef.current.classList.remove('landing');
            }
          }, 500);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoData(null);
    setLogoName('');
  };

  const displayToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCheckoutClick = () => {
    if (logoEnabled && !logoData) {
      displayToast('בחרת להוסיף לוגו – אנא העלה קובץ לוגו');
      return;
    }
    setShowPayment(true);
  };

  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14 days supply time
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' });
  };

  const selectedBundle = BUNDLES.find(b => b.qty === bundleQty) || BUNDLES[0];
  const basePriceCalc = BASE_PRICE * bundleQty;
  const subtotal = Math.round(basePriceCalc * (1 - selectedBundle.discount));
  const finalShippingPrice = shippingEnabled ? SHIPPING_PRICE : 0;
  const logoPriceCalc = logoEnabled ? LOGO_PRICE : 0;
  const totalCalc = subtotal + logoPriceCalc + finalShippingPrice;

  return (
    <>
      <Navbar />

      <main className="product-main">
        <div className="product-grid">

          {/* ============ LEFT: PRODUCT IMAGE ============ */}
          <div className="preview-wrap">
            <div className="preview-stage" style={{ background: 'transparent' }}>
              
              <div 
                className="product-image-container"
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* 
                  Since we don't have the uploaded files yet, I'm setting up the logic:
                  If it's Orange/Cream/Black, we try to show the specific uploaded image.
                  Otherwise, we use the cream one as a base and tint it using CSS mix-blend-mode!
                */}
                <div 
                  className="dynamic-tint-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: color.hex,
                    mixBlendMode: 'multiply',
                    opacity: ['#EA580C', '#F5F1E8', '#111111', '#FFFFFF', '#DC2626'].includes(color.hex) ? 0 : 0.6,
                    borderRadius: '20px',
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s ease, background-color 0.3s ease'
                  }}
                />
                <img 
                  src={currentImageSrc}
                  alt={`סט ריהוט בצבע ${color.name}`}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    borderRadius: '20px',
                    boxShadow: `0 20px 60px ${color.glow}`,
                    opacity: imageLoading ? 0 : 1,
                    transition: 'opacity 0.4s ease'
                  }} 
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('picsum')) {
                      target.src = color.hex === '#DC2626' ? 'https://picsum.photos/seed/cocacola/600/800' : `https://picsum.photos/seed/barrel-${color.hex.replace('#','')}/600/800`;
                    } else {
                      setImageLoading(false);
                    }
                  }}
                />
                
                {imageLoading && (
                  <div className="image-loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}

                <div className="barrel" id="barrel" style={{ position: 'absolute', width: '100px', height: '100px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: logoData ? 1 : 0, pointerEvents: 'none' }}>
                  <div className="logo-slot" id="logoSlot" ref={logoSlotRef} style={{ border: 'none', background: 'transparent' }}>
                    {logoData && (
                      <img id="logoImage" src={logoData} alt="Your logo" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ RIGHT: CONFIG ============ */}
          <div className="config">
            <div className="config-tag" style={{ marginBottom: '8px' }}>// סדרת קוקה-קולה מיוחדת</div>
            <h1 className="config-title" style={{ marginBottom: '10px' }}>סט ברקלאב קוקה-קולה</h1>
            
            <div className="price-initial" style={{ borderBottom: 'none', paddingBottom: '0', marginBottom: '20px' }}>
              {selectedBundle.discount > 0 && <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through', marginLeft: '10px' }}>₪{basePriceCalc.toLocaleString()}</span>}
              <strong style={{ fontSize: '36px' }}>₪{subtotal.toLocaleString()}</strong>
            </div>

            <p className="product-desc" style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px', color: 'rgba(248,243,255,0.85)' }}>
              שולחן ו-2 כיסאות בר ממותגים כקוקה-קולה, מיוצרים מחבית דלק תעשייתית ממוחזרת. הפלדה מעניקה חוזק ויציבות מקסימלית, בתוספת ציפוי צבע תעשייתי העמיד בפני נוזלים, מכות וטמפרטורות קיצוניות.
            </p>

            {/* BUNDLES */}
            <div className="options-section" style={{ marginBottom: '30px' }}>
              <div style={{ textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>מבצעי חבילות</div>
              <div className="bundles-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BUNDLES.map(b => {
                  const isSelected = bundleQty === b.qty;
                  const bBase = b.qty * BASE_PRICE;
                  const bTotal = Math.round(bBase * (1 - b.discount));
                  
                  return (
                    <div 
                      key={b.qty} 
                      className={`bundle-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setBundleQty(b.qty)}
                      style={{
                        position: 'relative',
                        border: isSelected ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'rgba(0,240,255,0.05)' : 'rgba(255,255,255,0.02)',
                        padding: '16px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        marginTop: b.badge ? '8px' : '0'
                      }}
                    >
                      {b.badge && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '-12px', 
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: b.badgeBg || '#FFE500', 
                          color: b.badgeText || '#000', 
                          fontSize: '12.5px', 
                          fontWeight: '900', 
                          padding: '4px 16px',
                          borderRadius: '8px', 
                          textAlign: 'center',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          letterSpacing: '0.5px',
                          zIndex: 5,
                          whiteSpace: 'nowrap'
                        }}>
                          {b.badge}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}>
                        <img src="/coca-cola-set.jpg" alt="Icon" style={{ width: '40px', height: '40px', objectFit: 'contain', mixBlendMode: 'screen', opacity: isSelected ? 1 : 0.6 }} />
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{b.title}</div>
                          {b.subtitle && <div style={{ fontSize: '14.5px', color: isSelected ? '#4ade80' : '#22c55e', fontWeight: 'bold', marginTop: '4px' }}>{b.subtitle}</div>}
                        </div>
                      </div>
                      <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>₪{bTotal.toLocaleString()}</div>
                        {b.discount > 0 && <div style={{ fontSize: '12px', textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)' }}>₪{bBase.toLocaleString()}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <div style={{ 
                  background: 'rgba(22,163,74,0.15)', 
                  border: '1px solid rgba(22,163,74,0.3)',
                  color: '#4ade80', 
                  padding: '8px 20px', 
                  borderRadius: '999px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '14px'
                }}>
                  <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }}></div>
                  <span>הזמן עכשיו וקבל עד ה- <strong>{getDeliveryDate()}</strong></span>
                </div>
              </div>
            </div>

            {/* COLOR OPTIONS */}
            <div className="options-section" style={{ marginBottom: '30px' }}>
              <div className="options-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', fontSize: '15px' }}>צבע גימור</span>
                <span style={{ color: 'var(--cyan)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{color.name}</span>
              </div>
              <div className="color-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {COLORS.map((c: any) => (
                  <div 
                    key={c.hex}
                    className={`color-option ${color.hex === c.hex ? 'active' : ''}`}
                    onClick={() => setColor(c)}
                    title={c.name}
                    style={{
                       width: '44px', height: '44px', cursor: 'pointer',
                       borderRadius: '50%', padding: '3px',
                       border: color.hex === c.hex ? '2px solid var(--cyan)' : '2px solid transparent',
                       transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ background: c.hex, width: '100%', height: '100%', borderRadius: '50%', boxShadow: `0 2px 8px ${c.glow}` }}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGO ADD-ON */}
            <div className="options-section" style={{ marginBottom: '30px' }}>
              <span style={{ fontWeight: '600', fontSize: '15px', display: 'block', marginBottom: '12px' }}>התאמה אישית</span>
              <div 
                className={`logo-option ${logoEnabled ? 'checked' : ''}`} 
                style={{ padding: '16px', borderRadius: '12px' }}
                onClick={(e) => {
                  if ((e.target as Element).closest('.logo-upload-wrap')) return;
                  if (logoEnabled) {
                    setLogoData(null);
                    setLogoName('');
                  }
                  setLogoEnabled(!logoEnabled);
                }}
              >
                <div className="logo-checkbox"></div>
                <div className="logo-option-text">
                  <div className="logo-option-title" style={{ fontSize: '14px' }}>הוסף לוגו משלך</div>
                  <div className="logo-option-hint" style={{ fontSize: '13px' }}>יוטבע בחזית החבית</div>
                </div>
                <div className="logo-option-price">+₪199</div>
              </div>

              {/* Upload area */}
              <div className={`logo-upload-wrap ${logoEnabled ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {!logoData ? (
                  <label 
                    className={`upload-area ${isDragOver ? 'dragover' : ''}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    style={{ padding: '20px', marginTop: '10px' }}
                  >
                    <div className="upload-icon" style={{ width: '36px', height: '36px', fontSize: '20px' }}>+</div>
                    <div className="upload-text" style={{ fontSize: '13px' }}>העלה סמל חברה / לוגו</div>
                    <input type="file" accept="image/png,image/svg+xml,image/jpeg" onChange={onFileChange} />
                  </label>
                ) : (
                  <div className="uploaded-info show" style={{ marginTop: '10px' }}>
                    <div className="uploaded-check">✓</div>
                    <div className="uploaded-name">{logoName}</div>
                    <button className="remove-logo" onClick={removeLogo} title="הסר לוגו">×</button>
                  </div>
                )}
              </div>
            </div>

            {/* SHIPPING OPTION */}
            <div className="options-section" style={{ marginBottom: '30px' }}>
              <span style={{ fontWeight: '600', fontSize: '15px', display: 'block', marginBottom: '12px' }}>אפשרויות שילוח</span>
              <div 
                className={`logo-option ${shippingEnabled ? 'checked' : ''}`} 
                style={{ padding: '16px', borderRadius: '12px', transition: 'all 0.3s' }}
                onClick={() => setShippingEnabled(!shippingEnabled)}
              >
                <div className="logo-checkbox"></div>
                <div className="logo-option-text">
                  <div className="logo-option-title" style={{ fontSize: '14px' }}>משלוח עד העסק</div>
                  <div className="logo-option-hint" style={{ fontSize: '13px' }}>הסרת הסימון במידה ומעוניינים באיסוף עצמי מבית המלאכה</div>
                </div>
                <div className="logo-option-price">
                  +₪{SHIPPING_PRICE}
                </div>
              </div>
            </div>

            {/* QUANTITY AND CHECKOUT ROW */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'stretch' }}>
              
              <div style={{ flex: 1 }}>
                {!showPayment ? (
                  <button className="btn-cart" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={handleCheckoutClick}>
                    <span>הוסף לעגלה</span> 
                    <span style={{ opacity: 0.5 }}>|</span>
                    <span>₪{totalCalc.toLocaleString()}</span>
                  </button>
                ) : (
                  <div className="payment-options" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px' }}>
                    <PayPalScriptProvider options={{ clientId: "test", currency: "ILS" }}>
                      <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill", height: 45 }}
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{ amount: { currency_code: "ILS", value: totalCalc.toString() } }]
                          });
                        }}
                        onApprove={async (data, actions) => {
                          if (actions.order) {
                            try {
                              const details = await actions.order.capture();
                              
                              // Save to database
                              await addDoc(collection(db, 'orders'), {
                                status: 'paid',
                                total: totalCalc,
                                itemsDesc: `סט ברקלאב - ${color.name} (x${bundleQty}) ${logoEnabled ? '+ לוגו' : ''}`,
                                customerName: details.payer?.name?.given_name + ' ' + (details.payer?.name?.surname || ''),
                                customerEmail: details.payer?.email_address,
                                customerPhone: '', 
                                shippingAddress: details.purchase_units[0]?.shipping?.address?.address_line_1 || 'נלקח מ-PayPal',
                                paymentToken: details.id,
                                createdAt: serverTimestamp()
                              });

                              displayToast("התשלום עבר בהצלחה!");
                              setShowPayment(false);
                            } catch (err) {
                              displayToast("שגיאה בתהליך התשלום.");
                            }
                          }
                        }}
                      />
                    </PayPalScriptProvider>
                    <button className="btn-bit" onClick={() => setShowBitModal(true)} style={{ marginTop: '10px', height: '45px' }}>
                      תשלום ב- <strong style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginLeft: '4px' }}>bit</strong>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ACCORDION TABS / DETAILS */}
            <div className="product-accordions" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }} open>
                <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '16px', display: 'flex', justifyContent: 'space-between', outline: 'none' }}>
                  מפרט טכני ומידות
                  <span style={{ opacity: 0.5 }}>+</span>
                </summary>
                <div style={{ paddingTop: '16px', color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: '1.8' }}>
                  <ul style={{ paddingRight: '20px', margin: 0 }}>
                    <li><strong>גובה השולחן:</strong> 105 ס״מ</li>
                    <li><strong>קוטר השולחן:</strong> 60 ס״מ</li>
                    <li><strong>כיסאות בר:</strong> גובה ישיבה 75 ס״מ עם משענת גב מעוקלת</li>
                    <li><strong>משקל:</strong> כ-15 ק״ג לשולחן, 6 ק״ג לכיסא</li>
                    <li><strong>תוספות:</strong> רגליות גומי סיליקון נגד שריטות והחלקה</li>
                  </ul>
                </div>
              </details>
              <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '16px', display: 'flex', justifyContent: 'space-between', outline: 'none' }}>
                  משלוחים והחזרות
                  <span style={{ opacity: 0.5 }}>+</span>
                </summary>
                <div style={{ paddingTop: '16px', color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: '1.8' }}>
                  עלות המשלוח היא ₪129 לכל חלקי הארץ. זמן האספקה המשוער הוא עד 14 ימי עסקים מאחר וכל פריט מיוצר במיוחד עבורך (Custom Made). ניתן לבצע איסוף עצמי מבית המלאכה ללא עלות נוספת בתיאום מראש.
                </div>
              </details>
              <details style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 0' }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', fontSize: '16px', display: 'flex', justifyContent: 'space-between', outline: 'none' }}>
                  אחריות מקיפה
                  <span style={{ opacity: 0.5 }}>+</span>
                </summary>
                <div style={{ paddingTop: '16px', color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: '1.8' }}>
                  אנו מעניקים 24 חודשי אחריות מלאים על קילוף צבע תעשייתי, חלודה או שבר בריתוכים. האחריות לא מכסה נזק בזדון או שחיקה טבעית עקב המרחב הפתוח ללא כיסוי הולם.
                </div>
              </details>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🛡️</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>קנייה מאובטחת</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🚚</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>משלוח ארצי</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>🛠️</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>תוצרת הארץ</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`toast ${showToast ? 'show' : ''}`}>{toastMsg}</div>
      
      {/* BIT MODAL */}
      <div className={`bit-modal-overlay ${showBitModal ? 'show' : ''}`} onClick={() => setShowBitModal(false)}>
        <div className="bit-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={() => setShowBitModal(false)}>×</button>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Bit_logo.svg?" alt="bit" style={{ width: '80px', marginBottom: '10px' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '15px' }}>העברה ב-bit</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px' }}>
            אנא העבר סכום של <strong style={{ color: 'var(--white)', fontSize: '22px' }}>{totalCalc.toLocaleString()} ₪</strong><br />
            למספר הטלפון הבא:
          </p>
          <div className="bit-phone">053-717-4555</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.6' }}>
            לאחר ביצוע ההעברה, על מנת שנוכל לקלוט ולייצר את ההזמנה שלך - שלח לנו אישור מסודר בוואטסאפ:
          </p>
          <a 
            href={`https://wa.me/972537174555?text=${encodeURIComponent(`היי, ביצעתי העברה בביט על סך ${totalCalc} ₪ עבור סט ברקלאב. אשמח לעדכון!`)}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-btn"
            onClick={() => {
              // Simulate saving pending order
              addDoc(collection(db, 'orders'), {
                status: 'ממתין לאישור ביט',
                total: totalCalc,
                itemsDesc: `סט ברקלאב - ${color.name} (x${bundleQty}) ${logoEnabled ? '+ לוגו' : ''}`,
                customerName: 'לקוח מקור: וואטסאפ',
                paymentToken: 'BIT-' + Math.floor(Math.random()*10000),
                createdAt: serverTimestamp()
              });
              setShowBitModal(false);
            }}
          >
            אישור ותחילת ייצור בוואטסאפ →
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}
