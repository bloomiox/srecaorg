import React from 'react';
import { useEvents } from '../../hooks/useSupabaseData';
import EventCard from '../EventCard';
import PageHeader from '../PageHeader';

const EventsPage: React.FC = () => {
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

      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
