import React from 'react';
import { Page, Event } from '../../types';
import { useEvents, useSiteSettings } from '../../hooks/useSupabaseData';
import EventCard from '../EventCard';

interface PageSetterProps {
  setCurrentPage: (page: Page) => void;
  onEventRegister?: (event: Event) => void;
}

interface HeroSectionProps extends PageSetterProps {
  settings: Record<string, string>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setCurrentPage, settings }) => (
  <section
    className="relative bg-cover bg-center text-white py-32 md:py-48 overflow-hidden"
    style={{ backgroundImage: 'url(/seaside-group-photo.jpg)' }}
    aria-labelledby="hero-title"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-blue/70 to-brand-lightblue/60"></div>
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="animate-fade-in">
        <h1 id="hero-title" className="text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-lg">
          {settings.hero_title || settings.site_title || 'Sreca'}
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed drop-shadow-md font-medium">
          {settings.hero_subtitle || 'Šest godina pružamo besplatnu podršku djeci s teškoćama u razvoju i njihovim porodicama. Kroz jedinstveni model samofinanciranja i inkluzivno zapošljavanje, gradimo zajednicu gdje svako dijete može ostvariti svoj puni potencijal.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setCurrentPage(Page.Events)}
            className="bg-gradient-to-r from-brand-red to-amber-500 hover:from-amber-500 hover:to-brand-red text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            Pogledajte naše događaje
          </button>
          <button
            onClick={() => setCurrentPage(Page.About)}
            className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Saznajte više o nama
          </button>
        </div>
      </div>
    </div>
  </section>
);

interface MissionSectionProps {
  settings: Record<string, string>;
}

const MissionSection: React.FC<MissionSectionProps> = ({ settings }) => (
  <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="mission-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 id="mission-title" className="text-4xl md:text-5xl font-bold text-brand-blue mb-6 tracking-tight">Naša Misija</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto mb-6"></div>
        <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          {settings.mission_short || 'Udruženje "Sreća za sve" osnovano je prije šest godina u Travniku s plemenitom misijom: poboljšati kvalitetu života djece s teškoćama u razvoju i osoba s invaliditetom te ih aktivno uključiti u zajednicu.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
        <div className="text-center group">
          <div className="bg-gradient-to-br from-brand-lightblue to-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
            <span className="text-3xl text-white">🤝</span>
          </div>
          <h3 className="text-2xl font-bold text-brand-blue mb-4">Besplatna podrška</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            Sve naše usluge su potpuno besplatne, jer vjerujemo da svako dijete zaslužuje podršku 
            bez obzira na financijske mogućnosti porodice.
          </p>
        </div>
        
        <div className="text-center group">
          <div className="bg-gradient-to-br from-brand-red to-amber-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
            <span className="text-3xl text-white">🌱</span>
          </div>
          <h3 className="text-2xl font-bold text-brand-blue mb-4">Samofinanciranje</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            {settings.self_financing_desc || 'Kroz plasteniču proizvodnju povrća finansiramo naše aktivnosti, dokazujući da humanitarni rad može biti samoodrživ.'}
          </p>
        </div>
        
        <div className="text-center group">
          <div className="bg-gradient-to-br from-brand-blue to-indigo-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
            <span className="text-3xl text-white">💼</span>
          </div>
          <h3 className="text-2xl font-bold text-brand-blue mb-4">Inkluzivno zapošljavanje</h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            {settings.inclusive_employment_desc || 'Zapošljavamo osobe s invaliditetom, stvarajući jednake mogućnosti i dokazujući našu posvećenost inkluziji.'}
          </p>
        </div>
      </div>
    </div>
  </section>
);

interface FeaturedEventsProps extends PageSetterProps {
  events: Event[];
}

const FeaturedEventsSection: React.FC<FeaturedEventsProps> = ({ setCurrentPage, events, onEventRegister }) => (
  <section className="py-20 bg-gradient-to-b from-gray-50 to-white" aria-labelledby="featured-events-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 id="featured-events-title" className="text-4xl md:text-5xl font-bold text-brand-blue mb-6 tracking-tight">Izdvojeni Događaji</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Pridružite se našim događajima i budite dio zajednice koja mijenja živote</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {events.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onRegisterClick={onEventRegister || (() => {})} 
          />
        ))}
      </div>
      <div className="text-center mt-16">
        <button
          onClick={() => setCurrentPage(Page.Events)}
          className="bg-gradient-to-r from-brand-lightblue to-blue-600 hover:from-blue-600 hover:to-brand-lightblue text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Svi događaji
        </button>
      </div>
    </div>
  </section>
);

interface StatsSectionProps {
  settings: Record<string, string>;
}

const StatsSection: React.FC<StatsSectionProps> = ({ settings }) => (
  <section className="py-20 bg-gradient-to-br from-brand-blue to-indigo-700 text-white" aria-labelledby="stats-title">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 id="stats-title" className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Naš utjecaj u brojkama</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
            {settings.stats_individual_sessions || '800+'}
          </div>
          <p className="text-white/90 text-lg font-medium">besplatnih individualnih termina godišnje</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
            {settings.stats_employed_disabled || '5'}
          </div>
          <p className="text-white/90 text-lg font-medium">zaposlenih osoba s invaliditetom</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
          <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
            {settings.stats_trips || '45+'}
          </div>
          <p className="text-white/90 text-lg font-medium">organizovanih izleta i druženja</p>
        </div>
      </div>
    </div>
  </section>
);

interface CallToActionSectionProps extends PageSetterProps {
  settings: Record<string, string>;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ setCurrentPage, settings }) => (
  <section className="bg-gradient-to-r from-brand-lightblue via-blue-600 to-brand-blue text-white relative overflow-hidden" aria-labelledby="cta-title">
    <div className="absolute inset-0 bg-black/10"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
      <div className="max-w-4xl mx-auto">
        <h2 id="cta-title" className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Postanite naš partner</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto mb-8"></div>
        <p className="text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
          {settings.partnership_cta || 'Vaša pomoć nije samo donacija, već investicija u svjetliju budućnost za našu djecu. Postanite dio promjene, dio priče o uspjehu.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => setCurrentPage(Page.Contact)}
            className="bg-white text-brand-blue hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Kontaktirajte nas
          </button>
          <button
            onClick={() => setCurrentPage(Page.About)}
            className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Saznajte više o nama
          </button>
        </div>
      </div>
    </div>
  </section>
);


const HomePage: React.FC<PageSetterProps> = ({ setCurrentPage, onEventRegister }) => {
  const { events } = useEvents();
  const { settings } = useSiteSettings();
  const featuredEvents = events.slice(0, 3);

  return (
    <div className="animate-fade-in">
      <HeroSection setCurrentPage={setCurrentPage} settings={settings} />
      <MissionSection settings={settings} />
      <StatsSection settings={settings} />
      <FeaturedEventsSection setCurrentPage={setCurrentPage} events={featuredEvents} onEventRegister={onEventRegister} />
      <CallToActionSection setCurrentPage={setCurrentPage} settings={settings} />
    </div>
  );
};

export default HomePage;