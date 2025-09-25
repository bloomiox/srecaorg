
import { Page, Event, TeamMember, NewsArticle } from './types';
import { getEvents, getNews, getTeamMembers } from './lib/supabase-utils';

export const NAV_LINKS = [
  { name: 'Početna', page: Page.Home },
  { name: 'O nama', page: Page.About },
  { name: 'Događaji', page: Page.Events },
  { name: 'Novosti', page: Page.News },
  { name: 'Kontakt', page: Page.Contact },
];

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    title: 'Radionica inkluzivne igre',
    description: 'Edukativna radionica za roditelje i djecu o važnosti inkluzivne igre i kako kreirati okruženje gdje se sva djeca osjećaju dobrodošla.',
    audience: 'Roditelji, djeca, odgajatelji',
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    details: {
      duration: '3 sata',
      location: 'Centar Sreca, Sarajevo',
      topics: [
        'Principi inkluzivne igre',
        'Adaptacija igara za djecu sa različitim potrebama',
        'Kreiranje sigurnog prostora za igru',
        'Podrška vršnjačkoj interakciji',
        'Praktične aktivnosti i demonstracije'
      ]
    }
  },
  {
    id: 2,
    title: 'Seminar o pravima djece sa invaliditetom',
    description: 'Informativni seminar o pravima djece sa invaliditetom, dostupnim uslugama i načinima zagovaranja za bolje uslove.',
    audience: 'Roditelji, stručnjaci, aktivisti',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    details: {
      duration: '4 sata',
      location: 'Online i uživo',
      topics: [
        'Konvencija UN o pravima djece sa invaliditetom',
        'Pravo na obrazovanje i inkluziju',
        'Pristup zdravstvenim uslugama',
        'Socijalna zaštita i podrška porodicama',
        'Zagovaranje i aktivizam'
      ]
    }
  },
  {
    id: 3,
    title: 'Kreativna radionica za djecu',
    description: 'Zabavna kreativna radionica prilagođena djeci sa različitim sposobnostima, fokusirana na umjetnost, muziku i izražavanje.',
    audience: 'Djeca sa invaliditetom, braća i sestre',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    details: {
      duration: '2 sata',
      location: 'Kreativni centar Sreca',
      topics: [
        'Slikanje i crtanje prilagođenim tehnikama',
        'Muzička terapija i ritam',
        'Kreiranje sa prirodnim materijalima',
        'Grupne kreativne aktivnosti',
        'Izložba radova djece'
      ]
    }
  },
];

export const TEAM_DATA: TeamMember[] = [
  {
    id: 1,
    name: 'Ana Marić',
    spec: 'Specijalna pedagoginja',
    role: 'Osnivačica i direktorica',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Marko Petrović',
    spec: 'Socijalni radnik',
    role: 'Koordinator programa',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

// News data is now managed through Supabase - see lib/supabase-utils.ts getNews() function
