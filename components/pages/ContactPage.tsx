import React, { useRef, useState } from 'react';
import PageHeader from '../PageHeader';
import { supabase } from '../../lib/supabase';

// EmailJS je učitan putem script taga u index.html,
// ova deklaracija obavještava TypeScript o njegovom postojanju.
declare const emailjs: {
  sendForm: (serviceID: string, templateID: string, form: HTMLFormElement, publicKey: string) => Promise<{ status: number; text: string }>;
};

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.current) return;

    setStatus('sending');
    setFeedbackMessage('');

    // Get form data
    const formData = new FormData(form.current);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      // Save to database first
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([{
          name: name,
          email: email,
          phone: phone || null,
          subject: subject,
          message: message,
          status: 'new'
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        setStatus('error');
        setFeedbackMessage('Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte ponovo.');
        return;
      }

      // Then send email via EmailJS
      const serviceID = 'service_pfzs5ul';
      const templateID = 'template_lhxqaas';
      const publicKey = 'mfhzwFF820NKsSaWk';

      await emailjs.sendForm(serviceID, templateID, form.current, publicKey);
      
      setStatus('success');
      setFeedbackMessage('Vaša poruka je uspješno poslana! Javit ćemo vam se uskoro.');
      form.current?.reset();
      
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setFeedbackMessage('Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte ponovo.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-2xl shadow-2xl border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-blue mb-4">Pošaljite nam poruku</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto"></div>
      </div>
      <form ref={form} onSubmit={sendEmail} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-3 text-lg">Ime i prezime</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            className="w-full px-5 py-4 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg" 
            required 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 font-bold mb-3 text-lg">Email adresa</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            className="w-full px-5 py-4 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg" 
            required 
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-3 text-lg">Telefon (opcionalno)</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="w-full px-5 py-4 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg" 
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-gray-700 font-bold mb-3 text-lg">Naslov</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            className="w-full px-5 py-4 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg" 
            required 
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 font-bold mb-3 text-lg">Vaša poruka</label>
          <textarea 
            id="message" 
            name="message" 
            rows={6} 
            className="w-full px-5 py-4 border bg-white border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg resize-none" 
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-indigo-600 hover:to-brand-blue text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Slanje...' : 'Pošalji poruku'}
        </button>
        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-xl text-center">
            <p className="text-green-800 font-semibold text-lg">{feedbackMessage}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-xl text-center">
            <p className="text-red-800 font-semibold text-lg">{feedbackMessage}</p>
          </div>
        )}
      </form>
    </div>
  );
};

const ContactInfo: React.FC = () => (
  <div className="space-y-10">
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-4">📍</span>
        <h3 className="text-3xl font-bold text-brand-blue">Kontakt informacije</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🏠</span>
          <div>
            <p className="text-gray-800 font-semibold text-lg">Pasamahala br. 272</p>
            <p className="text-gray-600">72270 Travnik, Bosna i Hercegovina</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📞</span>
          <p className="text-gray-800 font-semibold text-lg">062 338 910</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">✉️</span>
          <div>
            <p className="text-gray-800 font-semibold text-lg">info@sreca.org</p>
            <p className="text-gray-600">husrecazasve@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🆔</span>
          <p className="text-gray-800 font-semibold text-lg">4236699600006</p>
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-4">💝</span>
        <h3 className="text-3xl font-bold text-brand-blue">Donacije</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏦</span>
          <p className="text-gray-800 font-semibold text-lg">UniCredit Bank</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-green-200">
          <p className="text-gray-700 font-semibold mb-2">Broj računa:</p>
          <p className="text-2xl font-mono font-bold text-brand-blue">3386702240352380</p>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Vaše donacije omogućavaju nam da nastavimo pružati besplatnu podršku djeci s teškoćama u razvoju.
        </p>
      </div>
    </div>

    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-4">🕒</span>
        <h3 className="text-3xl font-bold text-brand-blue">Radno vrijeme</h3>
      </div>
      <div className="space-y-2">
        <p className="text-gray-800 font-semibold text-lg">Ponedjeljak - Petak: 08:00 - 16:00</p>
        <p className="text-gray-600">Vikendom po dogovoru</p>
      </div>
    </div>
    
    <div className="h-80 rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.123456789!2d17.6666667!3d44.2333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDE0JzAwLjAiTiAxN8KwNDAnMDAuMCJF!5e0!3m2!1sen!2s!4v1689253483321!5m2!1sen!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokacija Travnik"
      ></iframe>
    </div>
  </div>
);

const ContactPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Kontaktirajte Nas"
        subtitle="Imate pitanje o našim programima, želite se uključiti kao volonter ili podržati naš rad? Javite nam se!"
      />

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;