import React, { useState, useEffect } from 'react';
import { updateSiteSetting, getSiteSettings } from '../lib/supabase-utils';

interface SimpleAdminPanelProps {
  onClose: () => void;
}

const SimpleAdminPanel: React.FC<SimpleAdminPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await getSiteSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async (key: string, value: string) => {
    try {
      await updateSiteSetting(key, value);
      setSaveMessage('Spremljeno!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      setSaveMessage('Greška pri spremanju');
      console.error('Error saving setting:', error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel - Postavke</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {saveMessage}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Naslov sajta</label>
            <input
              type="text"
              value={settings.site_title || ''}
              onChange={(e) => handleInputChange('site_title', e.target.value)}
              onBlur={(e) => handleSave('site_title', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Udruženje Sreća za sve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hero naslov</label>
            <input
              type="text"
              value={settings.hero_title || ''}
              onChange={(e) => handleInputChange('hero_title', e.target.value)}
              onBlur={(e) => handleSave('hero_title', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Sreća za sve"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hero podnaslov</label>
            <textarea
              value={settings.hero_subtitle || ''}
              onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
              onBlur={(e) => handleSave('hero_subtitle', e.target.value)}
              className="w-full p-2 border rounded h-20"
              placeholder="Šest godina pružamo besplatnu podršku djeci s teškoćama u razvoju."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kratka misija</label>
            <textarea
              value={settings.mission_short || ''}
              onChange={(e) => handleInputChange('mission_short', e.target.value)}
              onBlur={(e) => handleSave('mission_short', e.target.value)}
              className="w-full p-2 border rounded h-20"
              placeholder="Naša misija je..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminPanel;