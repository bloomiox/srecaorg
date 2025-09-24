
import React, { useState } from 'react';
import { Page, Event } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import EventsPage from './components/pages/EventsPage';
import ContactPage from './components/pages/ContactPage';
import NewsPage from './components/pages/NewsPage';
import RegistrationModal from './components/RegistrationModal';
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const handleEventRegistration = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
    setSelectedEvent(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage} onEventRegister={handleEventRegistration} />;
      case Page.About:
        return <AboutPage />;
      case Page.Events:
        return <EventsPage onEventRegister={handleEventRegistration} />;
      case Page.News:
        return <NewsPage />;
      case Page.Contact:
        return <ContactPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} onEventRegister={handleEventRegistration} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800">
      <Header 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
      
      {/* Registration Modal */}
      <RegistrationModal
        event={selectedEvent}
        isOpen={showRegistrationModal}
        onClose={closeRegistrationModal}
      />
    </div>
  );
};

export default App;
