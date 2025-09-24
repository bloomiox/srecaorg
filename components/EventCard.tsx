
import React, { useState } from 'react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onRegisterClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegisterClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 border border-gray-100">
      {event.imageUrl ? (
        <div className="relative overflow-hidden">
          <img className="h-64 w-full object-cover transition-transform duration-300 hover:scale-110" src={event.imageUrl} alt={event.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      ) : (
        <div className="h-64 w-full bg-gradient-to-br from-brand-lightblue to-blue-600 flex items-center justify-center">
          <span className="text-white text-6xl">📅</span>
        </div>
      )}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="inline-block bg-gradient-to-r from-brand-red to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {event.audience}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-brand-blue mb-4 leading-tight">{event.title}</h3>
        <p className="text-gray-600 flex-grow leading-relaxed text-lg">{event.description}</p>

        {/* Expanded Details Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 mt-6' : 'max-h-0'}`}
        >
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="font-bold text-gray-800">Trajanje</p>
                  <p className="text-gray-600">{event.details.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-bold text-gray-800">Lokacija</p>
                  <p className="text-gray-600">{event.details.location}</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-brand-blue mb-3 flex items-center">
                  <span className="text-2xl mr-2">📚</span>
                  Teme koje pokrivamo:
                </h4>
                <ul className="space-y-2">
                  {event.details.topics.map((topic, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-brand-red mt-1">•</span>
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 bg-gradient-to-r from-brand-lightblue to-blue-600 hover:from-blue-600 hover:to-brand-lightblue text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            aria-expanded={isExpanded}
            aria-controls={`event-details-${event.id}`}
          >
            {isExpanded ? 'Zatvori' : 'Saznaj više'}
          </button>
          
          <button
            onClick={() => onRegisterClick(event)}
            className="flex-1 bg-gradient-to-r from-brand-red to-amber-500 hover:from-amber-500 hover:to-brand-red text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Prijavi se
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
