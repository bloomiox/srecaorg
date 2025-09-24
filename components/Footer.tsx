import React, { useState } from 'react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';
import AdminPanel from './AdminPanel';

const Footer: React.FC = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  return (
    <>
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      <footer className="bg-gradient-to-br from-brand-blue via-indigo-700 to-brand-blue text-brand-white mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-3">Udruženje "Sreća za sve"</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto md:mx-0"></div>
              </div>
              <p className="text-lg text-blue-100 mb-2">Podrška djeci sa invaliditetom.</p>
              <p className="text-sm text-blue-200">ID broj: 4236699600006</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <span className="text-2xl mr-2">📞</span>
                Kontakt
              </h3>
              <div className="space-y-2">
                <p className="text-blue-100 flex items-center justify-center md:justify-start">
                  <span className="mr-2">🏠</span>
                  Pasamahala br. 272
                </p>
                <p className="text-blue-100">72270 Travnik, Bosna i Hercegovina</p>
                <p className="text-blue-100 flex items-center justify-center md:justify-start">
                  <span className="mr-2">📱</span>
                  062 338 910
                </p>
                <p className="text-blue-100 flex items-center justify-center md:justify-start">
                  <span className="mr-2">✉️</span>
                  info@sreca.org
                </p>
                <p className="text-blue-200">husrecazasve@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start">
                <span className="text-2xl mr-2">💝</span>
                Donacije
              </h3>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <p className="text-blue-100 mb-2">UniCredit Bank</p>
                <p className="text-xl font-mono font-bold text-white">3386702240352380</p>
              </div>
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3">Pratite nas</h4>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a
                    href="https://www.facebook.com/people/Udru%C5%BEenje-Sre%C4%87a-za-sve/100070186659022"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-white transition-all duration-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transform hover:scale-110"
                  >
                    <FaFacebook size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/sreca.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-white transition-all duration-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transform hover:scale-110"
                  >
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/20 pt-8 text-center">
            <p className="text-blue-200">
              <span
                onClick={() => setShowAdminPanel(true)}
                className="cursor-pointer hover:text-white transition-colors font-semibold"
                title="Admin Panel"
              >
                &copy; {new Date().getFullYear()}
              </span>
              {' '}Sreca - Organizacija za djecu sa invaliditetom. Sva prava pridržana.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;