export enum Page {
  Home = 'Home',
  About = 'About',
  Events = 'Events',
  News = 'News',
  Contact = 'Contact',
}

export interface EventDetails {
  duration: string;
  location: string;
  topics: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  audience: string;
  imageUrl: string;
  details: EventDetails;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  spec: string;
  imageUrl: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  publishDate: string;
  shortDescription: string;
  fullContent: string;
  imageUrl?: string;
}