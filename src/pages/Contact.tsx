import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  return (
    <>
      <Navbar />
      <main className="contact-main">
         <section className="contact-hero">
            <div className="hero-tag">// LET'S TALK</div>
            <h1>צור קשר.</h1>
            <p>שאלות? רעיונות מיוחדים ללוגו? הזמנות כמות גדולות?<br/>השאירו לנו הודעה ונחזור אליכם בהקדם.</p>
         </section>

         <section className="contact-content">
            <div className="contact-card">
              {submitted ? (
                <div className="contact-success">
                  <div className="success-icon">✓</div>
                  <h3>תודה על פנייתך!</h3>
                  <p>ההודעה שלך נשלחה בהצלחה. הצוות שלנו יחזור אליך ממש בקרוב.</p>
                  <button className="btn-primary" onClick={() => setSubmitted(false)} style={{marginTop: '20px'}}>שליחת הודעה נוספת</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                   <div className="form-group">
                     <label>שם מלא</label>
                     <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="שם מלא" />
                   </div>
                   <div className="form-row">
                     <div className="form-group">
                       <label>טלפון</label>
                       <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="050-0000000" />
                     </div>
                     <div className="form-group">
                       <label>אימייל</label>
                       <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email@address.com" />
                     </div>
                   </div>
                   <div className="form-group">
                     <label>הודעה</label>
                     <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="איך נוכל לעזור?"></textarea>
                   </div>
                   <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>שלח הודעה</button>
                </form>
              )}
            </div>
            
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h4>הסטודיו שלנו</h4>
                  <p>רחוב המלאכה 14, תל אביב</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h4>טלפון ובוואטסאפ</h4>
                  <p>053-7174555</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div>
                  <h4>אימייל</h4>
                  <p>hello@ironic.co.il</p>
                </div>
              </div>
            </div>
         </section>
      </main>
      <Footer />
    </>
  );
}
