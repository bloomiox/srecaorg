import { useState, useEffect } from 'react';
import { Event, NewsArticle, TeamMember } from '../types';
import { getEvents, getNews, getTeamMembers, getSiteSettings } from '../lib/supabase-utils';
import { EVENTS_DATA, TEAM_DATA } from '../constants';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(EVENTS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const supabaseEvents = await getEvents();
        if (supabaseEvents.length > 0) {
          setEvents(supabaseEvents);
        }
      } catch (err) {
        setError('Failed to load events');
        console.error('Error loading events:', err);
        // Keep using static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error, refetch: () => fetchEvents() };
};

export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const supabaseNews = await getNews();
      setNews(supabaseNews);
      setError(null);
    } catch (err) {
      setError('Failed to load news');
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, error, refetch: fetchNews };
};

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        const supabaseTeam = await getTeamMembers();
        if (supabaseTeam.length > 0) {
          setTeamMembers(supabaseTeam);
        }
      } catch (err) {
        setError('Failed to load team members');
        console.error('Error loading team members:', err);
        // Keep using static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error, refetch: () => fetchTeamMembers() };
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabaseSettings = await getSiteSettings();
        setSettings(supabaseSettings);
      } catch (err) {
        console.error('Error loading site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};