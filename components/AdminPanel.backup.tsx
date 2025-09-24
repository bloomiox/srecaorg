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
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getSiteSettings();
      console.log('Loaded settings in ContentManagement:', settingsData);
      setSettings(settingsData);
      setFormData(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    setSaveMessage('');
    try {
      console.log('Saving setting:', key, '=', value);
      await updateSiteSetting(key, value);
      setSettings({...settings, [key]: value});
      setSaveMessage(`Spremljeno: ${key}`);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving setting:', error);
      setSaveMessage('Greška pri spremanju!');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const promises = Object.entries(formData).map(([key, value]) => 
        updateSiteSetting(key, value)
      );
      await Promise.all(promises);
      setSettings({...formData});
      setSaveMessage('Sve promjene su spremljene!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving all settings:', error);
      setSaveMessage('Greška pri spremanju!');
    } finally {
      setSaving(false);
    }
  };



  if (loading) return <div className="p-6">Učitavanje sadržaja...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sadržaj stranica</h2>
        <div className="space-x-2">
          <button
            onClick={loadSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Osvježi
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {saving ? 'Spremanje...' : 'Spremi sve promjene'}
          </button>
        </div>
      </div>

      {/* Debug info */}


      {saveMessage && (
        <div className={`mb-4 p-3 rounded ${saveMessage.includes('Greška') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {saveMessage}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Osnovne informacije */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Osnovne informacije organizacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium mb-2">ID broj organizacije</label>
              <input
                type="text"
                defaultValue={settings.id_number || ''}
                onBlur={(e) => handleSave('id_number', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Kontakt informacije */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Kontakt informacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Glavni email</label>
              <input
                type="email"
                defaultValue={settings.contact_email || ''}
                onBlur={(e) => handleSave('contact_email', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sekundarni email</label>
              <input
                type="email"
                defaultValue={settings.contact_email_secondary || ''}
                onBlur={(e) => handleSave('contact_email_secondary', e.target.value)}
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
            <div>
              <label className="block text-sm font-medium mb-2">Grad</label>
              <input
                type="text"
                defaultValue={settings.city || ''}
                onBlur={(e) => handleSave('city', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Država</label>
              <input
                type="text"
                defaultValue={settings.country || ''}
                onBlur={(e) => handleSave('country', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Bankovni podaci */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Bankovni podaci za donacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Naziv banke</label>
              <input
                type="text"
                defaultValue={settings.bank_name || ''}
                onBlur={(e) => handleSave('bank_name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Broj računa</label>
              <input
                type="text"
                defaultValue={settings.bank_account || ''}
                onBlur={(e) => handleSave('bank_account', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Sadržaj početne stranice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sadržaj početne stranice</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hero naslov</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.hero_title || settings.hero_title || 'Sreca'}
                  onChange={(e) => handleInputChange('hero_title', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <button
                  onClick={() => handleSave('hero_title', formData.hero_title || settings.hero_title || 'Sreca')}
                  className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={saving}
                >
                  Spremi
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hero podnaslov</label>
              <div className="space-y-2">
                <textarea
                  value={formData.hero_subtitle || settings.hero_subtitle || 'Šest godina pružamo besplatnu podršku djeci s teškoćama u razvoju i njihovim porodicama. Kroz jedinstveni model samofinanciranja i inkluzivno zapošljavanje, gradimo zajednicu gdje svako dijete može ostvariti svoj puni potencijal.'}
                  onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  rows={3}
                />
                <button
                  onClick={() => handleSave('hero_subtitle', formData.hero_subtitle || settings.hero_subtitle || '')}
                  className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={saving}
                >
                  Spremi podnaslov
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Misija - kratki opis</label>
              <textarea
                defaultValue={settings.mission_short || 'Udruženje "Sreća za sve" osnovano je prije šest godina u Travniku s plemenitom misijom: poboljšati kvalitetu života djece s teškoćama u razvoju i osoba s invaliditetom te ih aktivno uključiti u zajednicu.'}
                onBlur={(e) => handleSave('mission_short', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Sadržaj o nama stranice */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sadržaj "O nama" stranice</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Puna misija organizacije</label>
              <textarea
                defaultValue={settings.mission_full || 'Naš rad se temelji na uvjerenju da svako ljudsko biće, bez obzira na izazove s kojima se suočava, zaslužuje priliku da razvije svoj puni potencijal i živi sretno. Od prvog dana našeg postojanja, fokusirani smo na pružanje besplatne podrške, svjesni da su takve usluge često financijski nedostupne porodicama kojima su najpotrebnije.'}
                onBlur={(e) => handleSave('mission_full', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opis samofinanciranja</label>
              <textarea
                defaultValue={settings.self_financing_desc || 'Uzgajamo i prodajemo povrće, a sav prihod usmjeravamo na financiranje naših aktivnosti. Ovaj model nam osigurava stabilnost i dokazuje da humanitarni rad može biti samoodrživ i transparentan.'}
                onBlur={(e) => handleSave('self_financing_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opis inkluzivnog zapošljavanja</label>
              <textarea
                defaultValue={settings.inclusive_employment_desc || 'Kroz saradnju s Fondom za profesionalnu rehabilitaciju, uspješno smo zaposlili osobe s invaliditetom. Oni su neprocjenjiv dio našeg tima, a njihov angažman je najbolji dokaz naše posvećenosti stvaranju jednakih mogućnosti za sve.'}
                onBlur={(e) => handleSave('inclusive_employment_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Programi i aktivnosti */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Programi i aktivnosti</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Individualni termini - opis</label>
              <textarea
                defaultValue={settings.individual_sessions_desc || 'Kroz personalizovani pristup, naši stručnjaci (psiholog, pedagog, defektolog) rade s djecom na razvoju specifičnih vještina. Svaki susret je prilagođen individualnim potrebama djeteta, s ciljem maksimalnog napretka.'}
                onBlur={(e) => handleSave('individual_sessions_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Grupne radionice - opis</label>
              <textarea
                defaultValue={settings.group_workshops_desc || 'Potičemo razvoj socijalnih vještina, kreativnosti i timskog rada. Kroz igru i interakciju, djeca uče kako se uključiti u grupu, izraziti se i graditi samopouzdanje.'}
                onBlur={(e) => handleSave('group_workshops_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Psihološka podrška - opis</label>
              <textarea
                defaultValue={settings.psychological_support_desc || 'Prepoznajemo izazove s kojima se suočavaju roditelji djece s poteškoćama. Zato nudimo besplatne psihoterapijske sesije i savjetovanja kako bismo im pružili emocionalnu podršku, alate za nošenje s izazovima i sigurno mjesto za razmjenu iskustava.'}
                onBlur={(e) => handleSave('psychological_support_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Terapijsko jahanje - opis</label>
              <textarea
                defaultValue={settings.therapeutic_riding_desc || 'Terapijsko jahanje je izuzetno korisna aktivnost za poboljšanje fizičkog i psihičkog stanja korisnika. I ovu aktivnost nudimo potpuno besplatno našim članovima.'}
                onBlur={(e) => handleSave('therapeutic_riding_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Izleti i putovanja - opis</label>
              <textarea
                defaultValue={settings.trips_desc || 'Redovito organiziramo izlete, rođendanske proslave i druženja. Posebno smo ponosni na besplatno putovanje na more koje smo organizovali za naše članove i njihove roditelje. Za mnoge od njih, to je bio prvi put da su vidjeli more.'}
                onBlur={(e) => handleSave('trips_desc', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Statistike */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Statistike organizacije</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Broj individualnih termina godišnje</label>
              <input
                type="text"
                defaultValue={settings.stats_individual_sessions || '800+'}
                onBlur={(e) => handleSave('stats_individual_sessions', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Broj zaposlenih osoba s invaliditetom</label>
              <input
                type="text"
                defaultValue={settings.stats_employed_disabled || '5'}
                onBlur={(e) => handleSave('stats_employed_disabled', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Broj organizovanih izleta</label>
              <input
                type="text"
                defaultValue={settings.stats_trips || '45+'}
                onBlur={(e) => handleSave('stats_trips', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Društvene mreže */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Društvene mreže</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-2">YouTube URL</label>
              <input
                type="url"
                defaultValue={settings.youtube_url || ''}
                onBlur={(e) => handleSave('youtube_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Pozivi na akciju</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Poziv za partnerstvo</label>
              <textarea
                defaultValue={settings.partnership_cta || 'Vaša pomoć nije samo donacija, već investicija u svjetliju budućnost za našu djecu. Postanite dio promjene, dio priče o uspjehu.'}
                onBlur={(e) => handleSave('partnership_cta', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Poruka o podršci</label>
              <textarea
                defaultValue={settings.support_message || 'Naša plastenička proizvodnja osigurava nam dio financijske stabilnosti, ali kontinuiran rast i širenje programa zahtijeva pouzdanu i dugoročnu podršku.'}
                onBlur={(e) => handleSave('support_message', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
                rows={3}
              />
            </div>
          </div>
        </div>

        {saving && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800">Spremanje sadržaja...</p>
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

// Document Generator Component
const DocumentGenerator: React.FC<{
  registrations: any[];
  donors: any[];
  donations: any[];
}> = ({ registrations, donors, donations }) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamData, settingsData] = await Promise.all([
          getTeamMembers(),
          getSiteSettings()
        ]);
        setTeamMembers(teamData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading document data:', error);
      }
    };
    loadData();
  }, []);
  const [documentType, setDocumentType] = useState<'certificate' | 'thank_you'>('certificate');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = (registration: any) => {
    const director = teamMembers.find(member => member.role.toLowerCase().includes('direktor') || member.role.toLowerCase().includes('osnivač')) || teamMembers[0];
    const organizationName = settings.site_title || 'Udruženje "Sreća za sve"';
    const address = settings.address || 'Pasamahala br. 272';
    const city = settings.city || '72270 Travnik';
    
    const certificateHTML = `
      <div style="width: 800px; height: 600px; margin: 0 auto; padding: 40px; border: 3px solid #1e40af; font-family: 'Times New Roman', serif; text-align: center; background: white;">
        <div style="border: 1px solid #1e40af; padding: 30px; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <img src="/sreca-logo.png" alt="Logo" style="height: 60px; margin-right: 20px;" onerror="this.style.display='none'">
            <div>
              <h1 style="color: #1e40af; font-size: 36px; margin: 0; font-weight: bold;">POTVRDA O UČEŠĆU</h1>
            </div>
          </div>
          
          <div style="margin: 30px 0;">
            <p style="font-size: 18px; margin-bottom: 10px;">Ovim potvrđujemo da je</p>
            <h2 style="color: #dc2626; font-size: 28px; margin: 20px 0; text-decoration: underline;">${registration.first_name} ${registration.last_name}</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">uspješno učestvovao/la na događaju</p>
            <h3 style="color: #1e40af; font-size: 24px; margin: 20px 0; font-style: italic;">"${registration.events?.title || 'Događaj'}"</h3>
          </div>
          
          <div style="margin-top: 40px;">
            <p style="font-size: 16px; margin-bottom: 30px;">Datum izdavanja: ${new Date().toLocaleDateString('bs-BA')}</p>
            
            <div style="display: flex; justify-content: space-between; margin-top: 60px;">
              <div style="text-align: center;">
                <div style="border-top: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
                <p style="font-size: 14px;">${director?.name || 'Direktor'}</p>
                <p style="font-size: 12px; color: #666;">${director?.role || 'Direktor'}</p>
              </div>
              <div style="text-align: center;">
                <div style="border-top: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
                <p style="font-size: 14px;">Pečat organizacije</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>${organizationName}</p>
            <p>${address}, ${city}</p>
          </div>
        </div>
      </div>
    `;
    return certificateHTML;
  };

  const generateThankYouLetter = (donor: any, donation: any) => {
    const director = teamMembers.find(member => member.role.toLowerCase().includes('direktor') || member.role.toLowerCase().includes('osnivač')) || teamMembers[0];
    const organizationName = settings.site_title || 'Udruženje "Sreća za sve"';
    const address = settings.address || 'Pasamahala br. 272';
    const city = settings.city || '72270 Travnik';
    const phone = settings.contact_phone || '062 338 910';
    const email = settings.contact_email || 'info@sreca.org';
    
    const letterHTML = `
      <div style="width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: white; line-height: 1.6;">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 30px;">
          <img src="/sreca-logo.png" alt="Logo" style="height: 50px; margin-right: 20px;" onerror="this.style.display='none'">
          <div style="text-align: center;">
            <h1 style="color: #1e40af; font-size: 28px; margin: 0;">${organizationName}</h1>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">${address}, ${city}, Bosna i Hercegovina</p>
            <p style="color: #666; font-size: 14px; margin: 5px 0;">Tel: ${phone} | Email: ${email}</p>
          </div>
        </div>
        
        <div style="margin-bottom: 30px;">
          <p style="text-align: right; color: #666;">${city}, ${new Date().toLocaleDateString('bs-BA')}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <p><strong>${donor.first_name} ${donor.last_name}</strong></p>
          ${donor.address ? `<p>${donor.address}</p>` : ''}
          ${donor.city ? `<p>${donor.city}</p>` : ''}
        </div>
        
        <h2 style="color: #1e40af; font-size: 24px; text-align: center; margin: 30px 0;">ZAHVALNICA</h2>
        
        <div style="margin: 30px 0; font-size: 16px;">
          <p>Poštovani/a ${donor.first_name} ${donor.last_name},</p>
          
          <p style="margin: 20px 0;">
            Ovim putem Vam se najsrdačnije zahvaljujemo na Vašoj velikodušnoj donaciji u iznosu od 
            <strong>${donation.amount} ${donation.currency}</strong> koju ste uplatili/la dana 
            ${new Date(donation.donation_date).toLocaleDateString('bs-BA')}.
          </p>
          
          <p style="margin: 20px 0;">
            Vaša podrška omogućava nam da nastavimo sa našom misijom pružanja besplatne podrške djeci s teškoćama u razvoju i njihovim porodicama. Svaki doprinos, bez obzira na veličinu, čini značajnu razliku u životima djece kojima pomagamo.
          </p>
          
          <p style="margin: 20px 0;">
            ${donation.purpose === 'equipment' ? 'Vaša donacija će biti korištena za nabavku terapijske opreme.' : 
              donation.purpose === 'programs' ? 'Vaša donacija će biti korištena za finansiranje naših programa.' :
              'Vaša donacija će biti korištena za opće potrebe organizacije.'}
          </p>
          
          <p style="margin: 20px 0;">
            Još jednom Vam se zahvaljujemo na Vašoj podršci i povjerenju koje ste nam ukazali.
          </p>
          
          <p style="margin: 30px 0;">S poštovanjem,</p>
        </div>
        
        <div style="margin-top: 50px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div style="border-top: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
              <p style="font-size: 14px;">${director?.name || 'Direktor'}</p>
              <p style="font-size: 12px; color: #666;">${director?.role || 'Direktor'}</p>
            </div>
            <div style="text-align: center;">
              <div style="border-top: 1px solid #000; width: 150px; margin-bottom: 5px;"></div>
              <p style="font-size: 12px; color: #666;">Pečat organizacije</p>
            </div>
          </div>
        </div>
      </div>
    `;
    return letterHTML;
  };

  const printDocument = (htmlContent: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Dokument</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; padding: 0; }
                @page { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToPDF = async (htmlContent: string, filename: string) => {
    // For PDF export, we'll use the browser's print to PDF functionality
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${filename}</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; padding: 0; }
                @page { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleGenerateDocument = async (item: any) => {
    setIsGenerating(true);
    
    try {
      let htmlContent = '';
      let filename = '';
      
      if (documentType === 'certificate') {
        htmlContent = generateCertificate(item);
        filename = `Potvrda_${item.first_name}_${item.last_name}.pdf`;
      } else {
        const donation = donations.find(d => d.donor_id === item.id);
        if (donation) {
          htmlContent = generateThankYouLetter(item, donation);
          filename = `Zahvalnica_${item.first_name}_${item.last_name}.pdf`;
        }
      }
      
      // Show preview and options
      const action = confirm('Kliknite OK za štampanje ili Cancel za PDF export');
      if (action) {
        printDocument(htmlContent);
      } else {
        exportToPDF(htmlContent, filename);
      }
      
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Greška pri generiranju dokumenta');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Generator dokumenata</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Tip dokumenta</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as 'certificate' | 'thank_you')}
            className="w-full p-2 border rounded"
          >
            <option value="certificate">Potvrda o učešću (za učesnike događaja)</option>
            <option value="thank_you">Zahvalnica (za donatore)</option>
          </select>
        </div>
        
        {documentType === 'certificate' && (
          <div>
            <h4 className="font-medium mb-3">Učesnici događaja</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {registrations.map((registration) => (
                <div key={registration.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{registration.first_name} {registration.last_name}</p>
                    <p className="text-sm text-gray-600">{registration.events?.title || 'Događaj'}</p>
                    <p className="text-sm text-gray-500">{registration.email}</p>
                  </div>
                  <button
                    onClick={() => handleGenerateDocument(registration)}
                    disabled={isGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                  >
                    {isGenerating ? 'Generiše...' : 'Generiši potvrdu'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {documentType === 'thank_you' && (
          <div>
            <h4 className="font-medium mb-3">Donatori</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {donors.map((donor) => {
                const donorDonations = donations.filter(d => d.donor_id === donor.id);
                return donorDonations.map((donation) => (
                  <div key={`${donor.id}-${donation.id}`} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{donor.first_name} {donor.last_name}</p>
                      <p className="text-sm text-gray-600">
                        Donacija: {donation.amount} {donation.currency}
                      </p>
                      <p className="text-sm text-gray-500">
                        Datum: {new Date(donation.donation_date).toLocaleDateString('bs-BA')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateDocument(donor)}
                      disabled={isGenerating}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                      {isGenerating ? 'Generiše...' : 'Generiši zahvalnicu'}
                    </button>
                  </div>
                ));
              })}
            </div>
          </div>
        )}
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
  const [activeTab, setActiveTab] = useState<'attendees' | 'donors' | 'contacts' | 'documents'>('attendees');
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [editingDonor, setEditingDonor] = useState<any>(null);
  
  // Filter and search states
  const [kpiFilter, setKpiFilter] = useState<'7d' | '30d' | '3m' | 'custom' | 'all'>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [donorSortBy, setDonorSortBy] = useState<'name' | 'email' | 'created_at' | 'total_donated'>('name');
  const [donorSortOrder, setDonorSortOrder] = useState<'asc' | 'desc'>('asc');
  const [donationSortBy, setDonationSortBy] = useState<'date' | 'amount' | 'donor' | 'purpose'>('date');
  const [donationSortOrder, setDonationSortOrder] = useState<'asc' | 'desc'>('desc');
  const [donorTypeFilter, setDonorTypeFilter] = useState<'all' | 'individual' | 'organization' | 'foundation'>('all');
  const [donationStatusFilter, setDonationStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [donationPurposeFilter, setDonationPurposeFilter] = useState<'all' | 'general' | 'equipment' | 'programs' | 'event_support'>('all');
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

  // Filter data based on KPI filter
  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (kpiFilter) {
      case '7d':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '30d':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '3m':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return {
            registrations: registrations.filter(r => {
              const date = new Date(r.registration_date);
              return date >= startDate && date <= endDate;
            }),
            donations: donations.filter(d => {
              const date = new Date(d.donation_date);
              return date >= startDate && date <= endDate;
            }),
            contacts: contacts.filter(c => {
              const date = new Date(c.submitted_at);
              return date >= startDate && date <= endDate;
            })
          };
        }
        return { registrations, donations, contacts };
      default:
        return { registrations, donations, contacts };
    }
    
    if (kpiFilter === 'all') {
      return { registrations, donations, contacts };
    }
    
    return {
      registrations: registrations.filter(r => new Date(r.registration_date) >= startDate),
      donations: donations.filter(d => new Date(d.donation_date) >= startDate),
      contacts: contacts.filter(c => new Date(c.submitted_at) >= startDate)
    };
  };

  const filteredData = getFilteredData();

  // Calculate KPIs with filtering
  const totalRegistrations = filteredData.registrations.length;
  const totalDonors = donors.length; // Keep total donors as overall count
  const totalContacts = filteredData.contacts.length;
  const pendingRegistrations = filteredData.registrations.filter(r => r.status === 'pending').length;
  const newContacts = filteredData.contacts.filter(c => c.status === 'new').length;
  const filteredDonationsAmount = filteredData.donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

  // Filter and sort donors
  const getFilteredDonors = () => {
    let filtered = donors.filter(donor => {
      const matchesSearch = searchTerm === '' || 
        donor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = donorTypeFilter === 'all' || donor.donor_type === donorTypeFilter;
      
      return matchesSearch && matchesType;
    });

    // Calculate total donated for each donor
    filtered = filtered.map(donor => ({
      ...donor,
      total_donated: donations.filter(d => d.donor_id === donor.id).reduce((sum, d) => sum + parseFloat(d.amount), 0)
    }));

    // Sort donors
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (donorSortBy) {
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'total_donated':
          aValue = a.total_donated;
          bValue = b.total_donated;
          break;
        default:
          return 0;
      }
      
      if (donorSortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  // Filter and sort donations
  const getFilteredDonations = () => {
    let filtered = donations.filter(donation => {
      const donor = donors.find(d => d.id === donation.donor_id);
      const matchesSearch = searchTerm === '' || 
        (donor && (donor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   donor.last_name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        donation.amount.toString().includes(searchTerm) ||
        (donation.purpose && donation.purpose.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = donationStatusFilter === 'all' || donation.payment_status === donationStatusFilter;
      const matchesPurpose = donationPurposeFilter === 'all' || donation.purpose === donationPurposeFilter;
      
      return matchesSearch && matchesStatus && matchesPurpose;
    });

    // Sort donations
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (donationSortBy) {
        case 'date':
          aValue = new Date(a.donation_date);
          bValue = new Date(b.donation_date);
          break;
        case 'amount':
          aValue = parseFloat(a.amount);
          bValue = parseFloat(b.amount);
          break;
        case 'donor':
          const donorA = donors.find(d => d.id === a.donor_id);
          const donorB = donors.find(d => d.id === b.donor_id);
          aValue = donorA ? `${donorA.first_name} ${donorA.last_name}`.toLowerCase() : '';
          bValue = donorB ? `${donorB.first_name} ${donorB.last_name}`.toLowerCase() : '';
          break;
        case 'purpose':
          aValue = a.purpose || '';
          bValue = b.purpose || '';
          break;
        default:
          return 0;
      }
      
      if (donationSortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  };

  const filteredDonors = getFilteredDonors();
  const filteredDonationsForTable = getFilteredDonations();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">CRM - Upravljanje korisnicima</h2>
      
      {/* KPI Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Vremenski period:</label>
            <select
              value={kpiFilter}
              onChange={(e) => setKpiFilter(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">Sve vrijeme</option>
              <option value="7d">Zadnjih 7 dana</option>
              <option value="30d">Zadnjih 30 dana</option>
              <option value="3m">Zadnja 3 mjeseca</option>
              <option value="custom">Prilagođeni period</option>
            </select>
          </div>
          
          {kpiFilter === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                className="px-2 py-1 border rounded text-sm"
              />
              <span className="text-sm text-gray-500">do</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                className="px-2 py-1 border rounded text-sm"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Pretraži:</label>
            <input
              type="text"
              placeholder="Ime, email, iznos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded text-sm w-48"
            />
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Ukupno registracija</p>
              <p className="text-3xl font-bold">{totalRegistrations}</p>
              {pendingRegistrations > 0 && (
                <p className="text-blue-200 text-xs mt-1">{pendingRegistrations} na čekanju</p>
              )}
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Ukupno donatori</p>
              <p className="text-3xl font-bold">{totalDonors}</p>
              <p className="text-green-200 text-xs mt-1">{donations.length} donacija</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">💝</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">
                {kpiFilter === 'all' ? 'Ukupno donacije' : 'Donacije (filtrirano)'}
              </p>
              <p className="text-2xl font-bold">{filteredDonationsAmount.toFixed(2)} BAM</p>
              <p className="text-purple-200 text-xs mt-1">{filteredData.donations.length} donacija</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Kontakt poruke</p>
              <p className="text-3xl font-bold">{totalContacts}</p>
              {newContacts > 0 && (
                <p className="text-orange-200 text-xs mt-1">{newContacts} nove poruke</p>
              )}
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-full">
              <span className="text-2xl">📧</span>
            </div>
          </div>
        </div>
      </div>
      
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
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-4 border-b-2 ${
              activeTab === 'documents'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500'
            }`}
          >
            Dokumenti
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
          {/* Donors Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Tip donatora:</label>
                  <select
                    value={donorTypeFilter}
                    onChange={(e) => setDonorTypeFilter(e.target.value as any)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="all">Svi tipovi</option>
                    <option value="individual">Pojedinac</option>
                    <option value="organization">Organizacija</option>
                    <option value="foundation">Fondacija</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Sortiraj po:</label>
                  <select
                    value={donorSortBy}
                    onChange={(e) => setDonorSortBy(e.target.value as any)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="name">Ime</option>
                    <option value="email">Email</option>
                    <option value="created_at">Datum registracije</option>
                    <option value="total_donated">Ukupno donirano</option>
                  </select>
                  <button
                    onClick={() => setDonorSortOrder(donorSortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                  >
                    {donorSortOrder === 'asc' ? '↑' : '↓'}
                  </button>
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
          </div>

          {/* Donors Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Filtrirani donatori</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredDonors.length}</p>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ukupno donacija</p>
                  <p className="text-2xl font-bold text-green-600">{totalDonations.toFixed(2)} BAM</p>
                </div>
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Broj donacija</p>
                  <p className="text-2xl font-bold text-purple-600">{donations.length}</p>
                </div>
                <span className="text-2xl">📊</span>
              </div>
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
                {filteredDonors.map((donor) => (
                  <div key={donor.id} className="p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {donor.donor_type === 'individual' 
                          ? `${donor.first_name} ${donor.last_name}`
                          : donor.organization_name || `${donor.first_name} ${donor.last_name}`
                        }
                      </h4>
                      <p className="text-sm text-gray-600">{donor.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500 capitalize">{donor.donor_type}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs font-medium text-green-600">
                          Ukupno: {donor.total_donated.toFixed(2)} BAM
                        </p>
                      </div>
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
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Donacije</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={donationStatusFilter}
                      onChange={(e) => setDonationStatusFilter(e.target.value as any)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="all">Svi statusi</option>
                      <option value="completed">Završeno</option>
                      <option value="pending">Na čekanju</option>
                      <option value="failed">Neuspješno</option>
                    </select>
                    
                    <select
                      value={donationPurposeFilter}
                      onChange={(e) => setDonationPurposeFilter(e.target.value as any)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="all">Sve namjene</option>
                      <option value="general">Opće</option>
                      <option value="equipment">Oprema</option>
                      <option value="programs">Programi</option>
                      <option value="event_support">Podrška događajima</option>
                    </select>
                    
                    <select
                      value={donationSortBy}
                      onChange={(e) => setDonationSortBy(e.target.value as any)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="date">Datum</option>
                      <option value="amount">Iznos</option>
                      <option value="donor">Donator</option>
                      <option value="purpose">Namjena</option>
                    </select>
                    
                    <button
                      onClick={() => setDonationSortOrder(donationSortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
                    >
                      {donationSortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredDonationsForTable.map((donation) => (
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
                    {contact.phone && (
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    )}
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

      {activeTab === 'documents' && (
        <DocumentGenerator 
          registrations={registrations}
          donors={donors}
          donations={donations}
        />
      )}
    </div>
  );
};

// Analytics Management Component
const AnalyticsManagement: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalNews: 0,
    totalRegistrations: 0,
    totalContacts: 0,
    totalDonors: 0,
    totalDonations: 0,
    monthlyRegistrations: [],
    monthlyDonations: [],
    eventPopularity: [],
    donationsByPurpose: [],
    recentActivity: [],
    growthMetrics: {
      registrationsGrowth: 0,
      donationsGrowth: 0,
      contactsGrowth: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const [events, news, registrations, contacts, donors, donations] = await Promise.all([
        getEvents(),
        getNews(),
        getEventRegistrations(),
        getContactSubmissions(),
        getDonors(),
        getDonations()
      ]);

      // Calculate date ranges
      const now = new Date();
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
      const previousStartDate = new Date(startDate.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      // Filter data by time range
      const recentRegistrations = registrations.filter(r => new Date(r.registration_date) >= startDate);
      const recentDonations = donations.filter(d => new Date(d.donation_date) >= startDate);
      const recentContacts = contacts.filter(c => new Date(c.submitted_at) >= startDate);

      // Previous period data for growth calculation
      const prevRegistrations = registrations.filter(r => {
        const date = new Date(r.registration_date);
        return date >= previousStartDate && date < startDate;
      });
      const prevDonations = donations.filter(d => {
        const date = new Date(d.donation_date);
        return date >= previousStartDate && date < startDate;
      });
      const prevContacts = contacts.filter(c => {
        const date = new Date(c.submitted_at);
        return date >= previousStartDate && date < startDate;
      });

      // Calculate growth metrics
      const registrationsGrowth = prevRegistrations.length > 0 
        ? ((recentRegistrations.length - prevRegistrations.length) / prevRegistrations.length) * 100 
        : 0;
      const donationsGrowth = prevDonations.length > 0 
        ? ((recentDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0) - prevDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0)) / prevDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0)) * 100 
        : 0;
      const contactsGrowth = prevContacts.length > 0 
        ? ((recentContacts.length - prevContacts.length) / prevContacts.length) * 100 
        : 0;

      // Monthly data for charts
      const monthlyRegistrations = [];
      const monthlyDonations = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthRegs = registrations.filter(r => {
          const date = new Date(r.registration_date);
          return date >= monthStart && date <= monthEnd;
        });
        
        const monthDons = donations.filter(d => {
          const date = new Date(d.donation_date);
          return date >= monthStart && date <= monthEnd;
        });

        monthlyRegistrations.push({
          month: monthStart.toLocaleDateString('bs-BA', { month: 'short', year: 'numeric' }),
          count: monthRegs.length
        });

        monthlyDonations.push({
          month: monthStart.toLocaleDateString('bs-BA', { month: 'short', year: 'numeric' }),
          amount: monthDons.reduce((sum, d) => sum + parseFloat(d.amount), 0)
        });
      }

      // Event popularity
      const eventPopularity = events.map(event => ({
        name: event.title,
        registrations: registrations.filter(r => r.event_id === event.id).length
      })).sort((a, b) => b.registrations - a.registrations).slice(0, 5);

      // Donations by purpose
      const purposeMap = {};
      donations.forEach(d => {
        const purpose = d.purpose || 'general';
        purposeMap[purpose] = (purposeMap[purpose] || 0) + parseFloat(d.amount);
      });
      const donationsByPurpose = Object.entries(purposeMap).map(([purpose, amount]) => ({
        purpose: purpose === 'general' ? 'Opće' : purpose === 'equipment' ? 'Oprema' : purpose === 'programs' ? 'Programi' : purpose,
        amount: amount as number
      }));

      // Recent activity
      const recentActivity = [
        ...recentRegistrations.slice(0, 5).map(r => ({
          type: 'registration',
          description: `Nova registracija: ${r.first_name} ${r.last_name}`,
          date: r.registration_date,
          icon: '👥'
        })),
        ...recentDonations.slice(0, 5).map(d => ({
          type: 'donation',
          description: `Nova donacija: ${d.amount} ${d.currency}`,
          date: d.donation_date,
          icon: '💰'
        })),
        ...recentContacts.slice(0, 5).map(c => ({
          type: 'contact',
          description: `Nova poruka od: ${c.name}`,
          date: c.submitted_at,
          icon: '📧'
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

      setAnalytics({
        totalEvents: events.length,
        totalNews: news.length,
        totalRegistrations: registrations.length,
        totalContacts: contacts.length,
        totalDonors: donors.length,
        totalDonations: donations.reduce((sum, d) => sum + parseFloat(d.amount), 0),
        monthlyRegistrations,
        monthlyDonations,
        eventPopularity,
        donationsByPurpose,
        recentActivity,
        growthMetrics: {
          registrationsGrowth,
          donationsGrowth,
          contactsGrowth
        }
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Učitavanje analitike...</div>;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analitika i izvještaji</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="7d">Zadnjih 7 dana</option>
            <option value="30d">Zadnjih 30 dana</option>
            <option value="90d">Zadnjih 90 dana</option>
            <option value="1y">Zadnja godina</option>
          </select>
        </div>

      {/* Enhanced KPI Cards with Growth */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xs text-gray-500">Događaji</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalEvents}</p>
          <p className="text-xs text-gray-600">Ukupno događaja</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">👥</span>
            <span className={`text-xs px-2 py-1 rounded ${analytics.growthMetrics.registrationsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {analytics.growthMetrics.registrationsGrowth >= 0 ? '+' : ''}{analytics.growthMetrics.registrationsGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalRegistrations}</p>
          <p className="text-xs text-gray-600">Registracije</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <span className={`text-xs px-2 py-1 rounded ${analytics.growthMetrics.donationsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {analytics.growthMetrics.donationsGrowth >= 0 ? '+' : ''}{analytics.growthMetrics.donationsGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900">{analytics.totalDonations.toFixed(0)} BAM</p>
          <p className="text-xs text-gray-600">Ukupno donacije</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💝</span>
            <span className="text-xs text-gray-500">Donatori</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalDonors}</p>
          <p className="text-xs text-gray-600">Ukupno donatori</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📧</span>
            <span className={`text-xs px-2 py-1 rounded ${analytics.growthMetrics.contactsGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {analytics.growthMetrics.contactsGrowth >= 0 ? '+' : ''}{analytics.growthMetrics.contactsGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalContacts}</p>
          <p className="text-xs text-gray-600">Kontakt poruke</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">📰</span>
            <span className="text-xs text-gray-500">Novosti</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalNews}</p>
          <p className="text-xs text-gray-600">Objavljene novosti</p>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Registrations Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Mjesečne registracije</h3>
          <div className="space-y-2">
            {analytics.monthlyRegistrations.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.max(5, (item.count / Math.max(...analytics.monthlyRegistrations.map(m => m.count))) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Donations Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Mjesečne donacije</h3>
          <div className="space-y-2">
            {analytics.monthlyDonations.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.max(5, (item.amount / Math.max(...analytics.monthlyDonations.map(m => m.amount))) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16">{item.amount.toFixed(0)} BAM</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Popularity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Najpopularniji događaji</h3>
          <div className="space-y-3">
            {analytics.eventPopularity.map((event, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍'}</span>
                  <span className="text-sm font-medium truncate max-w-48">{event.name}</span>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.registrations} registracija</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donations by Purpose */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Donacije po namjeni</h3>
          <div className="space-y-3">
            {analytics.donationsByPurpose.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.purpose}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(item.amount / Math.max(...analytics.donationsByPurpose.map(d => d.amount))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-20">{item.amount.toFixed(0)} BAM</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Nedavna aktivnost</h3>
        <div className="space-y-3">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString('bs-BA')}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.type === 'registration' ? 'bg-blue-100 text-blue-800' :
                activity.type === 'donation' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {activity.type === 'registration' ? 'Registracija' :
                 activity.type === 'donation' ? 'Donacija' : 'Kontakt'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
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

  if (loading) {
    return <div className="p-6">Učitavanje postavki...</div>;
  }

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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Upravljanje sadržajem</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('content')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    📝 Uredi postavke sajta
                  </button>
                  <button 
                    onClick={() => setActiveTab('news')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    📰 Upravljaj novostima
                  </button>
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    🎓 Upravljaj događajima
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Tim i kontakti</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('team')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    👥 Upravljaj timom
                  </button>
                  <button 
                    onClick={() => setActiveTab('crm')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    📧 Kontakt poruke
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Analitika</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    📊 Statistike
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded"
                  >
                    ⚙️ Sistemske postavke
                  </button>
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