import { useState, useEffect } from 'react';
import { Event, NewsArticle, TeamMember } from '../types';
import { getEvents, getNews, getTeamMembers } from '../lib/supabase-utils';
import { EVENTS_DATA, NEWS_DATA, TEAM_DATA } from '../constants';

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
  const [news, setNews] = useState<NewsArticle[]>(NEWS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const supabaseNews = await getNews();
        if (supabaseNews.length > 0) {
          setNews(supabaseNews);
        }
      } catch (err) {
        setError('Failed to load news');
        console.error('Error loading news:', err);
        // Keep using static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading, error, refetch: () => fetchNews() };
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