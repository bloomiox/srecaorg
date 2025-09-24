import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  getNews, createNews, updateNews, deleteNews,
  getEvents, createEvent, updateEvent, deleteEvent,
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
  getEventRegistrations, getContactSubmissions,
  getSiteSettings, updateSiteSetting,
  getDonors, createDonor, updateDonor, deleteDonor,
  getDonations, createDonation,
  getAttendeeDetails, createAttendeeDetails
} from '../lib/supabase-utils';
import { Event, NewsArticle, TeamMember } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

// News Management Component
const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    publishDate: '',
    shortDescription: '',
    fullContent: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const newsData = await getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await updateNews(editingNews.id, formData);
      } else {
        await createNews(formData as Omit<NewsArticle, 'id'>);
      }
      await loadNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingNews(article);
    setFormData({
      title: article.title,
      publishDate: article.publishDate,
      shortDescription: article.shortDescription,
      fullContent: article.fullContent,
      imageUrl: article.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Da li ste sigurni da želite obrisati ovu novost?')) {
      try {
        await deleteNews(id);
        await loadNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      publishDate: '',
      shortDescription: '',
      fullContent: '',
      imageUrl: ''
    });
    setEditingNews(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6">Učitavanje novosti...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upravljanje novostima</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj novost
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingNews ? 'Uredi novost' : 'Dodaj novu novost'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Naslov</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Datum objave</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kratki opis</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Puni sadržaj</label>
              <textarea
                value={formData.fullContent}
                onChange={(e) => setFormData({...formData, fullContent: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={8}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL slike</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingNews ? 'Ažuriraj' : 'Dodaj'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Otkaži
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Sve novosti ({news.length})</h3>
        </div>
        <div className="divide-y">
          {news.map((article) => (
            <div key={article.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{article.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{article.shortDescription}</p>
                <p className="text-xs text-gray-500 mt-2">Objavljeno: {article.publishDate}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(article)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Uredi
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Events Management Component
const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audience: '',
    imageUrl: '',
    duration: '',
    location: '',
    topics: ['']
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        ...formData,
        details: {
          duration: formData.duration,
          location: formData.location,
          topics: formData.topics.filter(topic => topic.trim() !== '')
        }
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData as Omit<Event, 'id'>);
      }
      await loadEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      audience: event.audience,
      imageUrl: event.imageUrl || '',
      duration: event.details.duration,
      location: event.details.location,
      topics: event.details.topics.length > 0 ? event.details.topics : ['']
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Da li ste sigurni da želite obrisati ovaj događaj?')) {
      try {
        await deleteEvent(id);
        await loadEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      audience: '',
      imageUrl: '',
      duration: '',
      location: '',
      topics: ['']
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const addTopic = () => {
    setFormData({...formData, topics: [...formData.topics, '']});
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({...formData, topics: newTopics});
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({...formData, topics: newTopics});
  };

  if (loading) return <div className="p-6">Učitavanje događaja...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upravljanje događajima</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj događaj
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingEvent ? 'Uredi događaj' : 'Dodaj novi događaj'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Naslov</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opis</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ciljna grupa</label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Trajanje</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lokacija</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL slike</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Teme</label>
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Unesite temu"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-r hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTopic}
                className="text-brand-blue hover:text-blue-700 text-sm"
              >
                + Dodaj temu
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingEvent ? 'Ažuriraj' : 'Dodaj'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Otkaži
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Svi događaji ({events.length})</h3>
        </div>
        <div className="divide-y">
          {events.map((event) => (
            <div key={event.id} className="p-4 flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {event.details.duration} • {event.details.location} • {event.audience}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Uredi
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Content Management Component
const ContentManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getSiteSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      await updateSiteSetting(key, value);
      setSettings({...settings, [key]: value});
    } catch (error) {
      console.error('Error saving setting:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Učitavanje sadržaja...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Sadržaj stranica</h2>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Osnovne informacije</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Naslov sajta</label>
              <input
                type="text"
                defaultValue={settings.site_title || ''}
                onBlur={(e) => handleSave('site_title', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email za kontakt</label>
              <input
                type="email"
                defaultValue={settings.contact_email || ''}
                onBlur={(e) => handleSave('contact_email', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefon</label>
              <input
                type="text"
                defaultValue={settings.contact_phone || ''}
                onBlur={(e) => handleSave('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Adresa</label>
              <input
                type="text"
                defaultValue={settings.address || ''}
                onBlur={(e) => handleSave('address', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Društvene mreže</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook URL</label>
              <input
                type="url"
                defaultValue={settings.facebook_url || ''}
                onBlur={(e) => handleSave('facebook_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                defaultValue={settings.linkedin_url || ''}
                onBlur={(e) => handleSave('linkedin_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {saving && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800">Spremanje...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Team Management Component
const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    spec: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const teamData = await getTeamMembers();
      setTeamMembers(teamData);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData);
      } else {
        await createTeamMember(formData as Omit<TeamMember, 'id'>);
      }
      await loadTeamMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      spec: member.spec,
      imageUrl: member.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Da li ste sigurni da želite obrisati ovog člana tima?')) {
      try {
        await deleteTeamMember(id);
        await loadTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      spec: '',
      imageUrl: ''
    });
    setEditingMember(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-6">Učitavanje tima...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upravljanje timom</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Dodaj člana tima
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingMember ? 'Uredi člana tima' : 'Dodaj novog člana tima'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ime i prezime</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pozicija</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Specijalizacija</label>
              <input
                type="text"
                value={formData.spec}
                onChange={(e) => setFormData({...formData, spec: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL slike</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingMember ? 'Ažuriraj' : 'Dodaj'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Otkaži
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Članovi tima ({teamMembers.length})</h3>
        </div>
        <div className="divide-y">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {member.imageUrl && (
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.spec}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Uredi
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Obriši
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CRM Management Component
const CRMManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [attendeeDetails, setAttendeeDetails] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attendees' | 'donors' | 'contacts'>('attendees');
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  const [donorFormData, setDonorFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    donorType: 'individual',
    organizationName: '',
    notes: ''
  });
  const [donationFormData, setDonationFormData] = useState({
    donorId: '',
    amount: '',
    currency: 'BAM',
    donationType: 'one_time',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'completed',
    purpose: 'general',
    donationDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [registrationsData, attendeeDetailsData, donorsData, donationsData, contactsData] = await Promise.all([
        getEventRegistrations(),
        getAttendeeDetails(),
        getDonors(),
        getDonations(),
        getContactSubmissions()
      ]);
      setRegistrations(registrationsData);
      setAttendeeDetails(attendeeDetailsData);
      setDonors(donorsData);
      setDonations(donationsData);
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDonor) {
        await updateDonor(editingDonor.id, donorFormData);
      } else {
        await createDonor(donorFormData);
      }
      await loadData();
      resetDonorForm();
    } catch (error) {
      console.error('Error saving donor:', error);
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDonation({
        ...donationFormData,
        donorId: donationFormData.donorId ? parseInt(donationFormData.donorId) : undefined,
        amount: parseFloat(donationFormData.amount)
      });
      await loadData();
      resetDonationForm();
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  };

  const handleEditDonor = (donor: any) => {
    setEditingDonor(donor);
    setDonorFormData({
      firstName: donor.first_name,
      lastName: donor.last_name,
      email: donor.email,
      phone: donor.phone || '',
      address: donor.address || '',
      city: donor.city || '',
      postalCode: donor.postal_code || '',
      donorType: donor.donor_type,
      organizationName: donor.organization_name || '',
      notes: donor.notes || ''
    });
    setShowDonorForm(true);
  };

  const handleDeleteDonor = async (id: number) => {
    if (confirm('Da li ste sigurni da želite obrisati ovog donatora?')) {
      try {
        await deleteDonor(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting donor:', error);
      }
    }
  };

  const resetDonorForm = () => {
    setDonorFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      donorType: 'individual',
      organizationName: '',
      notes: ''
    });
    setEditingDonor(null);
    setShowDonorForm(false);
  };

  const resetDonationForm = () => {
    setDonationFormData({
      donorId: '',
      amount: '',
      currency: 'BAM',
      donationType: 'one_time',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'completed',
      purpose: 'general',
      donationDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowDonationForm(false);
  };

  if (loading) return <div className="p-6">Učitavanje CRM podataka...</div>;

  const totalDonations = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">CRM - Upravljanje korisnicima</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('attendees')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'attendees'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Polaznici ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('donors')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'donors'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Donatori ({donors.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'contacts'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Kontakt poruke ({contacts.length})
          </button>
        </div>
      </div>

      {activeTab === 'attendees' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Registracije za događaje</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ime</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Događaj</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((registration) => {
                    const hasDetails = attendeeDetails.some(detail => detail.registration_id === registration.id);
                    return (
                      <tr key={registration.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {registration.first_name} {registration.last_name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">{registration.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap">{registration.phone || 'N/A'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {registration.events?.title || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {new Date(registration.registration_date).toLocaleDateString('bs-BA')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : registration.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {hasDetails ? (
                            <span className="text-green-600 text-sm">✓ Kompletni</span>
                          ) : (
                            <span className="text-gray-500 text-sm">Osnovni</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {attendeeDetails.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Detaljni podaci polaznika</h3>
              </div>
              <div className="divide-y">
                {attendeeDetails.map((detail) => (
                  <div key={detail.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">
                          {detail.event_registrations?.first_name} {detail.event_registrations?.last_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {detail.event_registrations?.events?.title}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(detail.created_at).toLocaleDateString('bs-BA')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {detail.guardian_name && (
                        <div>
                          <span className="font-medium">Staratelj:</span> {detail.guardian_name}
                        </div>
                      )}
                      {detail.child_age && (
                        <div>
                          <span className="font-medium">Uzrast djeteta:</span> {detail.child_age} godina
                        </div>
                      )}
                      {detail.disability_type && (
                        <div>
                          <span className="font-medium">Tip invaliditeta:</span> {detail.disability_type}
                        </div>
                      )}
                      {detail.support_needs && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Potrebe za podrškom:</span> {detail.support_needs}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'donors' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                <span className="text-sm text-gray-600">Ukupno donacija:</span>
                <span className="ml-2 font-bold text-green-600">{totalDonations.toFixed(2)} BAM</span>
              </div>
              <div className="bg-white rounded-lg shadow-sm px-4 py-2">
                <span className="text-sm text-gray-600">Broj donacija:</span>
                <span className="ml-2 font-bold">{donations.length}</span>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowDonorForm(true)}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Dodaj donatora
              </button>
              <button
                onClick={() => setShowDonationForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Dodaj donaciju
              </button>
            </div>
          </div>

          {showDonorForm && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingDonor ? 'Uredi donatora' : 'Dodaj novog donatora'}
              </h3>
              <form onSubmit={handleDonorSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ime</label>
                    <input
                      type="text"
                      value={donorFormData.firstName}
                      onChange={(e) => setDonorFormData({...donorFormData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prezime</label>
                    <input
                      type="text"
                      value={donorFormData.lastName}
                      onChange={(e) => setDonorFormData({...donorFormData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={donorFormData.email}
                      onChange={(e) => setDonorFormData({...donorFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon</label>
                    <input
                      type="text"
                      value={donorFormData.phone}
                      onChange={(e) => setDonorFormData({...donorFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tip donatora</label>
                    <select
                      value={donorFormData.donorType}
                      onChange={(e) => setDonorFormData({...donorFormData, donorType: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="individual">Pojedinac</option>
                      <option value="organization">Organizacija</option>
                      <option value="foundation">Fondacija</option>
                    </select>
                  </div>
                  {donorFormData.donorType !== 'individual' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Naziv organizacije</label>
                      <input
                        type="text"
                        value={donorFormData.organizationName}
                        onChange={(e) => setDonorFormData({...donorFormData, organizationName: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Napomene</label>
                  <textarea
                    value={donorFormData.notes}
                    onChange={(e) => setDonorFormData({...donorFormData, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingDonor ? 'Ažuriraj' : 'Dodaj'}
                  </button>
                  <button
                    type="button"
                    onClick={resetDonorForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Otkaži
                  </button>
                </div>
              </form>
            </div>
          )}

          {showDonationForm && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Dodaj novu donaciju</h3>
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Donator</label>
                    <select
                      value={donationFormData.donorId}
                      onChange={(e) => setDonationFormData({...donationFormData, donorId: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="">Anonimna donacija</option>
                      {donors.map((donor) => (
                        <option key={donor.id} value={donor.id}>
                          {donor.donor_type === 'individual' 
                            ? `${donor.first_name} ${donor.last_name}`
                            : donor.organization_name || `${donor.first_name} ${donor.last_name}`
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Iznos</label>
                    <input
                      type="number"
                      step="0.01"
                      value={donationFormData.amount}
                      onChange={(e) => setDonationFormData({...donationFormData, amount: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Način plaćanja</label>
                    <select
                      value={donationFormData.paymentMethod}
                      onChange={(e) => setDonationFormData({...donationFormData, paymentMethod: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="bank_transfer">Bankovni transfer</option>
                      <option value="cash">Gotovina</option>
                      <option value="card">Kartica</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Svrha</label>
                    <select
                      value={donationFormData.purpose}
                      onChange={(e) => setDonationFormData({...donationFormData, purpose: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <option value="general">Opća podrška</option>
                      <option value="programs">Programi</option>
                      <option value="equipment">Oprema</option>
                      <option value="event_support">Podrška događajima</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Datum donacije</label>
                    <input
                      type="date"
                      value={donationFormData.donationDate}
                      onChange={(e) => setDonationFormData({...donationFormData, donationDate: e.target.value})}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Napomene</label>
                  <textarea
                    value={donationFormData.notes}
                    onChange={(e) => setDonationFormData({...donationFormData, notes: e.target.value})}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Dodaj donaciju
                  </button>
                  <button
                    type="button"
                    onClick={resetDonationForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Otkaži
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Donatori ({donors.length})</h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {donors.map((donor) => (
                  <div key={donor.id} className="p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {donor.donor_type === 'individual' 
                          ? `${donor.first_name} ${donor.last_name}`
                          : donor.organization_name || `${donor.first_name} ${donor.last_name}`
                        }
                      </h4>
                      <p className="text-sm text-gray-600">{donor.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{donor.donor_type}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEditDonor(donor)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Uredi
                      </button>
                      <button
                        onClick={() => handleDeleteDonor(donor.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Nedavne donacije</h3>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {donations.map((donation) => (
                  <div key={donation.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-green-600">
                          {parseFloat(donation.amount).toFixed(2)} {donation.currency}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {donation.donors 
                            ? (donation.donors.donor_type === 'individual'
                                ? `${donation.donors.first_name} ${donation.donors.last_name}`
                                : donation.donors.organization_name || `${donation.donors.first_name} ${donation.donors.last_name}`
                              )
                            : 'Anonimna donacija'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(donation.donation_date).toLocaleDateString('bs-BA')}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.payment_status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : donation.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.payment_status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">
                      {donation.purpose} • {donation.payment_method}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Kontakt poruke</h3>
          </div>
          <div className="divide-y">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(contact.submitted_at).toLocaleDateString('bs-BA')}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contact.status === 'responded' 
                        ? 'bg-green-100 text-green-800'
                        : contact.status === 'read'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
                {contact.subject && (
                  <p className="text-sm font-medium mb-1">{contact.subject}</p>
                )}
                <p className="text-sm text-gray-700">{contact.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Management Component
const AnalyticsManagement: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalNews: 0,
    totalRegistrations: 0,
    totalContacts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [events, news, registrations, contacts] = await Promise.all([
        getEvents(),
        getNews(),
        getEventRegistrations(),
        getContactSubmissions()
      ]);

      setStats({
        totalEvents: events.length,
        totalNews: news.length,
        totalRegistrations: registrations.length,
        totalContacts: contacts.length,
        recentActivity: [
          ...registrations.slice(0, 5).map(r => ({
            type: 'registration',
            description: `Nova registracija: ${r.first_name} ${r.last_name}`,
            date: r.registration_date
          })),
          ...contacts.slice(0, 5).map(c => ({
            type: 'contact',
            description: `Nova poruka od: ${c.name}`,
            date: c.submitted_at
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Učitavanje analitike...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analitika</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ukupno događaja</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ukupno novosti</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <span className="text-2xl">📰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Registracije</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kontakt poruke</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📧</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Nedavna aktivnost</h3>
        </div>
        <div className="divide-y">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'registration' 
                  ? 'bg-teal-100' 
                  : 'bg-blue-100'
              }`}>
                <span className="text-sm">
                  {activity.type === 'registration' ? '👤' : '📧'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleString('bs-BA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Management Component
const SettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getSiteSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    try {
      await updateSiteSetting(key, value);
      setSettings({...settings, [key]: value});
    } catch (error) {
      console.error('Error saving setting:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Učitavanje postavki...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Postavke sajta</h2>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Opće postavke</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Naslov sajta</label>
              <input
                type="text"
                defaultValue={settings.site_title || ''}
                onBlur={(e) => handleSave('site_title', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opis sajta</label>
              <textarea
                defaultValue={settings.site_description || ''}
                onBlur={(e) => handleSave('site_description', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Kontakt informacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={settings.contact_email || ''}
                onBlur={(e) => handleSave('contact_email', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefon</label>
              <input
                type="text"
                defaultValue={settings.contact_phone || ''}
                onBlur={(e) => handleSave('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Adresa</label>
              <input
                type="text"
                defaultValue={settings.address || ''}
                onBlur={(e) => handleSave('address', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Društvene mreže</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook URL</label>
              <input
                type="url"
                defaultValue={settings.facebook_url || ''}
                onBlur={(e) => handleSave('facebook_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
              <input
                type="url"
                defaultValue={settings.linkedin_url || ''}
                onBlur={(e) => handleSave('linkedin_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram URL</label>
              <input
                type="url"
                defaultValue={settings.instagram_url || ''}
                onBlur={(e) => handleSave('instagram_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {saving && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800">Spremanje postavki...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'events' | 'content' | 'team' | 'crm' | 'analytics' | 'settings'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Check for existing session on component mount
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === 'admin@sreca.org') {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
        } else if (event === 'SIGNED_IN' && session?.user?.email === 'admin@sreca.org') {
          setIsAuthenticated(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoginLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError('Neispravni podaci za prijavu');
        return;
      }

      if (data.user) {
        // Check if user is admin
        if (data.user.email === 'admin@sreca.org') {
          setIsAuthenticated(true);
        } else {
          setError('Nemate administratorske privilegije');
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setError('Greška pri prijavi');
      console.error('Login error:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Loading state while checking session
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-brand-blue mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          </div>
          <p className="text-gray-600">Provjera sesije...</p>
        </div>
      </div>
    );
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-blue mb-2">SRECA</h1>
            <p className="text-gray-600">Admin Panel - Dobrodošli, admin@sreca.org</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="admin@sreca.org"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lozinka
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between items-center space-x-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                disabled={loginLoading}
              >
                Otkaži
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loginLoading}
              >
                {loginLoading ? 'Prijavljivanje...' : 'Prijavi se'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="fixed inset-0 bg-gray-100 z-50">
      {/* Header */}
      <div className="bg-brand-blue text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">SRECA</h1>
          <p className="text-sm opacity-90">Admin Panel - Dobrodošli, admin@sreca.org</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm flex items-center">
            <span className="mr-2">👁</span>
            Pregled sajta
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Odjava
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex space-x-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'news', label: 'Novosti', icon: '📰' },
            { key: 'events', label: 'Događaji', icon: '🎓' },
            { key: 'content', label: 'Sadržaj stranica', icon: '📄' },
            { key: 'team', label: 'Tim', icon: '👥' },
            { key: 'crm', label: 'CRM', icon: '👤' },
            { key: 'analytics', label: 'Analitika', icon: '📈' },
            { key: 'settings', label: 'Postavke', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-2 border-b-2 text-sm font-medium flex items-center space-x-2 ${activeTab === tab.key
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
        {activeTab === 'dashboard' && (
          <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Dobrodošli u Admin Panel</h2>
              <p>Upravljajte sadržajem vašeg sajta, pratite statistike i održavajte kvalitet informacija.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ukupno novosti</p>
                    <p className="text-3xl font-bold text-gray-900">4</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <span className="text-2xl">📰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Aktivni događaji</p>
                    <p className="text-3xl font-bold text-gray-900">3</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <span className="text-2xl">🎓</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Polaznici</p>
                    <p className="text-3xl font-bold text-gray-900">5</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-full">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Članovi tima</p>
                    <p className="text-3xl font-bold text-gray-900">2</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest News */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Najnovije novosti</h3>
                  <button className="text-brand-blue text-sm hover:underline">Prikaži sve →</button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <span className="text-sm">📰</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Osnivanje organizacije Sreca</p>
                      <p className="text-xs text-gray-500">15.01.2025.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <span className="text-sm">📰</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pokretanje programa inkluzivne igre</p>
                      <p className="text-xs text-gray-500">20.02.2025.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded">
                      <span className="text-sm">📰</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Važnost rane intervencije</p>
                      <p className="text-xs text-gray-500">10.03.2025.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Events */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Popularni događaji</h3>
                  <button className="text-brand-blue text-sm hover:underline">Prikaži sve →</button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <span className="text-sm">🎓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Radionica inkluzivne igre</p>
                      <p className="text-xs text-gray-500">3 sata</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <span className="text-sm">🎓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Seminar o pravima djece</p>
                      <p className="text-xs text-gray-500">4 sata</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded">
                      <span className="text-sm">🎓</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Kreativna radionica za djecu</p>
                      <p className="text-xs text-gray-500">2 sata</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Participants */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Novi polaznici</h3>
                  <button className="text-brand-blue text-sm hover:underline">Prikaži sve →</button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marija Petrović</p>
                      <p className="text-xs text-gray-500">Radionica inkluzivne igre</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ana Marić</p>
                      <p className="text-xs text-gray-500">Seminar o pravima djece</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded">
                      <span className="text-sm">👤</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Stefan Nikolić</p>
                      <p className="text-xs text-gray-500">Kreativna radionica</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Brze akcije</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('news')}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <span className="text-xl">➕</span>
                    </div>
                    <span className="font-medium">Dodaj novost</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-xl">🎓</span>
                    </div>
                    <span className="font-medium">Novi događaj</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <span className="text-xl">👤</span>
                    </div>
                    <span className="font-medium">Dodaj polaznika</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && <NewsManagement />}

        {activeTab === 'events' && <EventsManagement />}

        {activeTab === 'content' && <ContentManagement />}

        {activeTab === 'team' && <TeamManagement />}

        {activeTab === 'crm' && <CRMManagement />}

        {activeTab === 'analytics' && <AnalyticsManagement />}

        {activeTab === 'settings' && <SettingsManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;