import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { supabase } from '../lib/supabase';

interface RegistrationModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ event, isOpen, onClose }) => {
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    specialNeeds: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const resetForm = () => {
    setRegistrationData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      organization: '',
      specialNeeds: ''
    });
    setSubmitMessage('');
  };

  const closeModal = () => {
    onClose();
    if (!submitMessage.includes('uspješno')) {
      resetForm();
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert([{
          event_id: event.id,
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone || null,
          organization: registrationData.organization || null,
          special_needs: registrationData.specialNeeds || null,
          status: 'pending'
        }]);

      if (error) {
        setSubmitMessage('Greška pri slanju prijave. Pokušajte ponovo.');
        console.error('Registration error:', error);
      } else {
        setSubmitMessage('Prijava je uspješno poslana! Kontaktiraćemo vas uskoro.');
        setRegistrationData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          specialNeeds: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
        }, 2000);
      }
    } catch (error) {
      setSubmitMessage('Greška pri slanju prijave. Pokušajte ponovo.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={closeModal}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-red to-amber-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Prijava za događaj</h2>
              <p className="text-orange-100 mt-1">{event.title}</p>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 text-3xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-xl ${submitMessage.includes('uspješno') ? 'bg-green-100 border border-green-200 text-green-800' : 'bg-red-100 border border-red-200 text-red-800'}`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {submitMessage.includes('uspješno') ? '✅' : '❌'}
                </span>
                {submitMessage}
              </div>
            </div>
          )}
          
          <form onSubmit={handleRegistrationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ime *</label>
                <input
                  type="text"
                  value={registrationData.firstName}
                  onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prezime *</label>
                <input
                  type="text"
                  value={registrationData.lastName}
                  onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email adresa *</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Organizacija/Ustanova</label>
              <input
                type="text"
                value={registrationData.organization}
                onChange={(e) => setRegistrationData({...registrationData, organization: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Posebne potrebe ili napomene</label>
              <textarea
                value={registrationData.specialNeeds}
                onChange={(e) => setRegistrationData({...registrationData, specialNeeds: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl h-32 focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all resize-none text-lg"
                placeholder="Opišite eventualne posebne potrebe ili dodatne informacije..."
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300"
              >
                Otkaži
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-indigo-600 hover:to-brand-blue text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Šalje se...
                  </div>
                ) : (
                  'Pošalji prijavu'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;