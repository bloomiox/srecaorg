
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

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    title: 'Osnivanje organizacije Sreca',
    publishDate: '15.01.2025.',
    shortDescription: 'S ponosom objavljujemo osnivanje organizacije Sreca - podrška djeci sa invaliditetom i njihovim porodicama.',
    fullContent: `Službeno je osnovana organizacija Sreca dana 15.01.2025. godine u Sarajevu.

Naša misija je pružanje sveobuhvatne podrške djeci sa invaliditetom i njihovim porodicama kroz edukaciju, zagovaranje i kreiranje inkluzivnih programa. Vjerujemo da svako dijete zaslužuje priliku da ostvari svoj puni potencijal u podržavajućem okruženju.

Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu izgradnje inkluzivnije zajednice za svu djecu.`,
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
   {
    id: 2,
    title: 'Pokretanje programa inkluzivne igre',
    publishDate: '20.02.2025.',
    shortDescription: 'Sreca pokreće novi program inkluzivne igre koji omogućava djeci sa i bez invaliditeta da se igraju zajedno.',
    fullContent: `Ponosni smo što najavljujemo pokretanje našeg novog programa inkluzivne igre. Ovaj program je dizajniran da omogući djeci sa različitim sposobnostima da se igraju, uče i rastu zajedno.

Program uključuje prilagođene igre, kreativne radionice i aktivnosti koje promiču razumijevanje, empatiju i prijateljstvo među djecom. Naši stručnjaci rade na kreiranju sigurnog i podržavajućeg okruženja gdje se svako dijete osjeća cijenjeno i uključeno.

Pozivamo sve zainteresirane porodice da se pridruže našem programu i budu dio ove važne inicijative.`,
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    title: 'Važnost rane intervencije kod djece sa invaliditetom',
    publishDate: '10.03.2025.',
    shortDescription: 'Rana intervencija je ključna za razvoj djece sa invaliditetom. Saznajte zašto je važno djelovati na vrijeme.',
    fullContent: `Rana intervencija predstavlja skup usluga i podrške koje se pružaju djeci sa invaliditetom i njihovim porodicama u najranijim godinama života. Istraživanja pokazuju da je period od rođenja do treće godine života kritičan za razvoj mozga.

Ključne prednosti rane intervencije uključuju:
- Poboljšanje kognitivnih i motoričkih vještina
- Bolje socijalne i komunikacijske sposobnosti  
- Veću nezavisnost u svakodnevnim aktivnostima
- Podršku porodicama u razumijevanju potreba djeteta

Naša organizacija radi na povećanju dostupnosti programa rane intervencije i edukaciji roditelja o važnosti pravovremenog djelovanja.`,
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    title: 'Kreiranje inkluzivnih zajednica - vodič za roditelje',
    publishDate: '25.03.2025',
    shortDescription: 'Kako možemo zajedno kreirati zajednice gdje se sva djeca osjećaju prihvaćeno i cijenjeno.',
    fullContent: `Kreiranje inkluzivnih zajednica zahtijeva angažman svih članova društva. Evo kako roditelji mogu doprinijeti:

1. **Edukacija i osvještavanje:** Učite o različitim vrstama invaliditeta i načinima podrške.
2. **Modeliranje ponašanja:** Pokažite svojoj djeci kako da budu inkluzivni i prihvatajući.
3. **Zagovaranje:** Zagovarajte za inkluzivne politike u školama i zajednici.
4. **Volontiranje:** Pridružite se organizacijama koje rade na promociji inkluzije.

Zajedno možemo kreirati svijet gdje svako dijete ima priliku da uspije i bude srećno.`,
    imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
].sort((a, b) => new Date(b.publishDate.split('.').reverse().join('-')).getTime() - new Date(a.publishDate.split('.').reverse().join('-')).getTime());
