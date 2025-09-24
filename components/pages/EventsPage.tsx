import React from 'react';
import { useEvents } from '../../hooks/useSupabaseData';
import { Event } from '../../types';
import EventCard from '../EventCard';
import PageHeader from '../PageHeader';

interface EventsPageProps {
  onEventRegister: (event: Event) => void;
}

const EventsPage: React.FC<EventsPageProps> = ({ onEventRegister }) => {
  const { events, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Naši Događaji"
          subtitle="Pridružite se našim događajima posvećenim podršci djece sa invaliditetom i njihovih porodica. Zajedno gradimo inkluzivnu zajednicu."
        />
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>Učitavanje događaja...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader 
          title="Naši Događaji"
          subtitle="Pridružite se našim događajima posvećenim podršci djece sa invaliditetom i njihovih porodica. Zajedno gradimo inkluzivnu zajednicu."
        />
        <div className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-red-600">Greška pri učitavanju događaja. Molimo pokušajte ponovo.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Naši Događaji"
        subtitle="Pridružite se našim događajima posvećenim podršci djece sa invaliditetom i njihovih porodica. Zajedno gradimo inkluzivnu zajednicu."
      />

      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Trenutno nema dostupnih događaja</h3>
              <p className="text-gray-500">Provjerite ponovo uskoro za nove događaje i radionice.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRegisterClick={onEventRegister} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
