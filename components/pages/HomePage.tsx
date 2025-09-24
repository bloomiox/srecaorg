import React from 'react';
import { Page, Event } from '../../types';
import { useEvents } from '../../hooks/useSupabaseData';
import EventCard from '../EventCard';

interface PageSetterProps {
  setCurrentPage: (page: Page) => void;
}

const HeroSection: React.FC<PageSetterProps> = ({ setCurrentPage }) => (
  <section
    className="relative bg-cover bg-center text-white py-32 md:py-48"
    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80)' }}
    aria-labelledby="hero-title"
  >
    <div className="absolute inset-0 bg-brand-blue bg-opacity-60"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h1 id="hero-title" className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Sreca</h1>
      <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
        Šest godina pružamo besplatnu podršku djeci s teškoćama u razvoju i njihovim porodicama. 
        Kroz jedinstveni model samofinanciranja i inkluzivno zapošljavanje, gradimo zajednicu gdje svako dijete može ostvariti svoj puni potencijal.
      </p>
      <button
        onClick={() => setCurrentPage(Page.Events)}
        className="bg-brand-red hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
      >
        Pogledajte naše događaje
      </button>
    </div>
  </section>
);

const MissionSection: React.FC = () => (
  <section className="py-16 bg-brand-white" aria-labelledby="mission-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 id="mission-title" className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Naša Misija</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Udruženje "Sreća za sve" osnovano je prije šest godina u Travniku s plemenitom misijom: 
          poboljšati kvalitetu života djece s teškoćama u razvoju i osoba s invaliditetom te ih 
          aktivno uključiti u zajednicu.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="text-center">
          <div className="bg-brand-lightblue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🤝</span>
          </div>
          <h3 className="text-xl font-bold text-brand-blue mb-2">Besplatna podrška</h3>
          <p className="text-gray-600">
            Sve naše usluge su potpuno besplatne, jer vjerujemo da svako dijete zaslužuje podršku 
            bez obzira na financijske mogućnosti porodice.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-brand-red rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🌱</span>
          </div>
          <h3 className="text-xl font-bold text-brand-blue mb-2">Samofinanciranje</h3>
          <p className="text-gray-600">
            Kroz plasteniču proizvodnju povrća finansiramo naše aktivnosti, 
            dokazujući da humanitarni rad može biti samoodrživ.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-brand-blue rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">💼</span>
          </div>
          <h3 className="text-xl font-bold text-brand-blue mb-2">Inkluzivno zapošljavanje</h3>
          <p className="text-gray-600">
            Zapošljavamo osobe s invaliditetom, stvarajući jednake mogućnosti 
            i dokazujući našu posvećenost inkluziji.
          </p>
        </div>
      </div>
    </div>
  </section>
);

interface FeaturedEventsProps extends PageSetterProps {
  events: Event[];
}

const FeaturedEventsSection: React.FC<FeaturedEventsProps> = ({ setCurrentPage, events }) => (
  <section className="py-16 bg-brand-gray" aria-labelledby="featured-events-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="featured-events-title" className="text-3xl md:text-4xl font-bold text-brand-blue mb-8 text-center">Izdvojeni Događaji</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={() => setCurrentPage(Page.Events)}
          className="bg-brand-lightblue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Svi događaji
        </button>
      </div>
    </div>
  </section>
);

const StatsSection: React.FC = () => (
  <section className="py-16 bg-brand-gray" aria-labelledby="stats-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="stats-title" className="text-3xl font-bold text-brand-blue text-center mb-12">Naš utjecaj u brojkama</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl font-bold text-brand-blue mb-2">800+</div>
          <p className="text-gray-600">besplatnih individualnih termina godišnje</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl font-bold text-brand-blue mb-2">5</div>
          <p className="text-gray-600">zaposlenih osoba s invaliditetom</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-4xl font-bold text-brand-blue mb-2">45+</div>
          <p className="text-gray-600">organizovanih izleta i druženja</p>
        </div>
      </div>
    </div>
  </section>
);

const CallToActionSection: React.FC<PageSetterProps> = ({ setCurrentPage }) => (
  <section className="bg-brand-lightblue text-white" aria-labelledby="cta-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 id="cta-title" className="text-3xl font-bold mb-4">Postanite naš partner</h2>
      <p className="text-lg max-w-2xl mx-auto mb-8">
        Vaša pomoć nije samo donacija, već investicija u svjetliju budućnost za našu djecu. 
        Postanite dio promjene, dio priče o uspjehu.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setCurrentPage(Page.Contact)}
          className="bg-brand-white text-brand-blue hover:bg-gray-200 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          Kontaktirajte nas
        </button>
        <button
          onClick={() => setCurrentPage(Page.About)}
          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-lightblue font-bold py-3 px-8 rounded-full text-lg transition-all"
        >
          Saznajte više o nama
        </button>
      </div>
    </div>
  </section>
);


const HomePage: React.FC<PageSetterProps> = ({ setCurrentPage }) => {
  const { events } = useEvents();
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <HeroSection setCurrentPage={setCurrentPage} />
      <MissionSection />
      <StatsSection />
      <FeaturedEventsSection setCurrentPage={setCurrentPage} events={featuredEvents} />
      <CallToActionSection setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default HomePage;