-- Enable Row Level Security
-- JWT secret is automatically managed by Supabase

-- Create tables for Sreca organization

-- Events table (replaces courses)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    audience VARCHAR(255) NOT NULL,
    image_url TEXT,
    duration VARCHAR(100),
    location VARCHAR(255),
    topics TEXT[], -- Array of topics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- News articles table
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publish_date DATE NOT NULL,
    short_description TEXT NOT NULL,
    full_content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true
);

-- Team members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    image_url TEXT,
    bio TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Event registrations table
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    organization VARCHAR(255),
    special_needs TEXT,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(50),
    dietary_requirements TEXT,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled
    notes TEXT
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'new', -- new, read, responded
    admin_notes TEXT
);

-- Donors table
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Bosna i Hercegovina',
    date_of_birth DATE,
    preferred_contact VARCHAR(50) DEFAULT 'email', -- email, phone, mail
    communication_preferences TEXT[], -- newsletter, event_updates, donation_receipts
    donor_type VARCHAR(50) DEFAULT 'individual', -- individual, organization, foundation
    organization_name VARCHAR(255),
    tax_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Donations table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES donors(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BAM',
    donation_type VARCHAR(50) DEFAULT 'one_time', -- one_time, monthly, yearly
    payment_method VARCHAR(50), -- card, bank_transfer, cash, paypal, stripe
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(255),
    purpose VARCHAR(255), -- general, event_support, equipment, programs
    campaign VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    receipt_sent BOOLEAN DEFAULT false,
    receipt_sent_at TIMESTAMP WITH TIME ZONE,
    tax_deductible BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendee details (extended information for event participants)
CREATE TABLE attendee_details (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER REFERENCES event_registrations(id) ON DELETE CASCADE,
    guardian_name VARCHAR(255), -- For children participants
    guardian_phone VARCHAR(50),
    guardian_email VARCHAR(255),
    child_age INTEGER,
    disability_type VARCHAR(255),
    support_needs TEXT,
    medical_conditions TEXT,
    medications TEXT,
    mobility_requirements TEXT,
    communication_preferences TEXT,
    previous_participation BOOLEAN DEFAULT false,
    how_heard_about_us VARCHAR(255),
    consent_photo BOOLEAN DEFAULT false,
    consent_newsletter BOOLEAN DEFAULT false,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Admin authentication is handled by Supabase Auth
-- Admin user: admin@sreca.org with UID: d0c52635-6856-43cb-bb33-dd76c186172c

-- Insert initial data

-- Sample events
INSERT INTO events (title, description, audience, image_url, duration, location, topics) VALUES
('Radionica inkluzivne igre', 'Edukativna radionica za roditelje i djecu o važnosti inkluzivne igre i kako kreirati okruženje gdje se sva djeca osjećaju dobrodošla.', 'Roditelji, djeca, odgajatelji', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '3 sata', 'Centar Sreca, Sarajevo', ARRAY['Principi inkluzivne igre', 'Adaptacija igara za djecu sa različitim potrebama', 'Kreiranje sigurnog prostora za igru', 'Podrška vršnjačkoj interakciji', 'Praktične aktivnosti i demonstracije']),
('Seminar o pravima djece sa invaliditetom', 'Informativni seminar o pravima djece sa invaliditetom, dostupnim uslugama i načinima zagovaranja za bolje uslove.', 'Roditelji, stručnjaci, aktivisti', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '4 sata', 'Online i uživo', ARRAY['Konvencija UN o pravima djece sa invaliditetom', 'Pravo na obrazovanje i inkluziju', 'Pristup zdravstvenim uslugama', 'Socijalna zaštita i podrška porodicama', 'Zagovaranje i aktivizam']),
('Kreativna radionica za djecu', 'Zabavna kreativna radionica prilagođena djeci sa različitim sposobnostima, fokusirana na umjetnost, muziku i izražavanje.', 'Djeca sa invaliditetom, braća i sestre', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', '2 sata', 'Kreativni centar Sreca', ARRAY['Slikanje i crtanje prilagođenim tehnikama', 'Muzička terapija i ritam', 'Kreiranje sa prirodnim materijalima', 'Grupne kreativne aktivnosti', 'Izložba radova djece']);

-- Sample news
INSERT INTO news (title, publish_date, short_description, full_content, image_url) VALUES
('Osnivanje organizacije Sreca', '2025-01-15', 'S ponosom objavljujemo osnivanje organizacije Sreca - podrška djeci sa invaliditetom i njihovim porodicama.', 'Službeno je osnovana organizacija Sreca dana 15.01.2025. godine u Sarajevu.

Naša misija je pružanje sveobuhvatne podrške djeci sa invaliditetom i njihovim porodicama kroz edukaciju, zagovaranje i kreiranje inkluzivnih programa. Vjerujemo da svako dijete zaslužuje priliku da ostvari svoj puni potencijal u podržavajućem okruženju.

Radujemo se budućim projektima i suradnji sa svim zainteresiranim stranama u svrhu izgradnje inkluzivnije zajednice za svu djecu.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
('Pokretanje programa inkluzivne igre', '2025-02-20', 'Sreca pokreće novi program inkluzivne igre koji omogućava djeci sa i bez invaliditeta da se igraju zajedno.', 'Ponosni smo što najavljujemo pokretanje našeg novog programa inkluzivne igre. Ovaj program je dizajniran da omogući djeci sa različitim sposobnostima da se igraju, uče i rastu zajedno.

Program uključuje prilagođene igre, kreativne radionice i aktivnosti koje promiču razumijevanje, empatiju i prijateljstvo među djecom. Naši stručnjaci rade na kreiranju sigurnog i podržavajućeg okruženja gdje se svako dijete osjeća cijenjeno i uključeno.

Pozivamo sve zainteresirane porodice da se pridruže našem programu i budu dio ove važne inicijative.', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
('Važnost rane intervencije kod djece sa invaliditetom', '2025-03-10', 'Rana intervencija je ključna za razvoj djece sa invaliditetom. Saznajte zašto je važno djelovati na vrijeme.', 'Rana intervencija predstavlja skup usluga i podrške koje se pružaju djeci sa invaliditetom i njihovim porodicama u najranijim godinama života. Istraživanja pokazuju da je period od rođenja do treće godine života kritičan za razvoj mozga.

Ključne prednosti rane intervencije uključuju:
- Poboljšanje kognitivnih i motoričkih vještina
- Bolje socijalne i komunikacijske sposobnosti  
- Veću nezavisnost u svakodnevnim aktivnostima
- Podršku porodicama u razumijevanju potreba djeteta

Naša organizacija radi na povećanju dostupnosti programa rane intervencije i edukaciji roditelja o važnosti pravovremenog djelovanja.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'),
('Kreiranje inkluzivnih zajednica - vodič za roditelje', '2025-03-25', 'Kako možemo zajedno kreirati zajednice gdje se sva djeca osjećaju prihvaćeno i cijenjeno.', 'Kreiranje inkluzivnih zajednica zahtijeva angažman svih članova društva. Evo kako roditelji mogu doprinijeti:

1. **Edukacija i osvještavanje:** Učite o različitim vrstama invaliditeta i načinima podrške.
2. **Modeliranje ponašanja:** Pokažite svojoj djeci kako da budu inkluzivni i prihvatajući.
3. **Zagovaranje:** Zagovarajte za inkluzivne politike u školama i zajednici.
4. **Volontiranje:** Pridružite se organizacijama koje rade na promociji inkluzije.

Zajedno možemo kreirati svijet gdje svako dijete ima priliku da uspije i bude srećno.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');

-- Sample team members
INSERT INTO team_members (name, role, specialization, image_url, bio, email) VALUES
('Ana Marić', 'Osnivačica i direktorica', 'Specijalna pedagoginja', 'https://images.unsplash.com/photo-1494790108755-2616c6d4e6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Ana je specijalna pedagoginja sa više od 10 godina iskustva u radu sa djecom sa invaliditetom. Osnovala je Srecu sa vizijom kreiranja inkluzivnije zajednice.', 'ana@sreca.org'),
('Marko Petrović', 'Koordinator programa', 'Socijalni radnik', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 'Marko je socijalni radnik specijalizovan za rad sa porodicama djece sa invaliditetom. Koordinira sve programe i aktivnosti organizacije.', 'marko@sreca.org');

-- Sample site settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_title', 'Udruženje "Sreća za sve" - Travnik', 'Naslov sajta'),
('contact_email', 'info@sreca.org', 'Glavni email za kontakt'),
('contact_email_secondary', 'husrecazasve@gmail.com', 'Sekundarni email za kontakt'),
('contact_phone', '062 338 910', 'Glavni telefon za kontakt'),
('address', 'Pasamahala br. 272', 'Adresa organizacije'),
('city', '72270 Travnik', 'Grad organizacije'),
('country', 'Bosna i Hercegovina', 'Država'),
('id_number', '4236699600006', 'ID broj organizacije'),
('bank_name', 'UniCredit Bank', 'Naziv banke'),
('bank_account', '3386702240352380', 'Broj računa'),
('facebook_url', 'https://facebook.com/sreca', 'Facebook stranica'),
('linkedin_url', 'https://linkedin.com/company/sreca', 'LinkedIn stranica');

-- Sample donors
INSERT INTO donors (first_name, last_name, email, phone, address, city, postal_code, donor_type, communication_preferences, notes) VALUES
('Marija', 'Petrović', 'marija.petrovic@email.com', '+387 61 123 456', 'Zmaja od Bosne 12', 'Sarajevo', '71000', 'individual', ARRAY['newsletter', 'donation_receipts'], 'Redovni donator, majka djeteta sa invaliditetom'),
('Aleksandar', 'Marić', 'aleksandar.maric@email.com', '+387 62 234 567', 'Titova 45', 'Banja Luka', '78000', 'individual', ARRAY['event_updates', 'donation_receipts'], 'Volonter i donator'),
('Fondacija Pomoć', '', 'info@fondacijapomoc.ba', '+387 33 345 678', 'Ferhadija 20', 'Sarajevo', '71000', 'foundation', ARRAY['newsletter', 'event_updates'], 'Partnerska fondacija za projekte inkluzije'),
('BH Telecom', '', 'csr@bhtelecom.ba', '+387 33 123 123', 'Obala Kulina bana 8', 'Sarajevo', '71000', 'organization', ARRAY['newsletter'], 'Korporativni sponzor');

-- Sample donations
INSERT INTO donations (donor_id, amount, currency, donation_type, payment_method, payment_status, purpose, donation_date, receipt_sent, tax_deductible, notes) VALUES
(1, 100.00, 'BAM', 'monthly', 'card', 'completed', 'general', '2025-01-15 10:30:00', true, true, 'Mjesečna donacija preko kartice'),
(2, 250.00, 'BAM', 'one_time', 'bank_transfer', 'completed', 'equipment', '2025-02-01 14:20:00', true, true, 'Donacija za nabavku terapijske opreme'),
(3, 5000.00, 'BAM', 'one_time', 'bank_transfer', 'completed', 'programs', '2025-02-10 09:15:00', true, true, 'Godišnja donacija za programe rane intervencije'),
(4, 2000.00, 'BAM', 'one_time', 'bank_transfer', 'completed', 'event_support', '2025-03-01 16:45:00', true, false, 'Sponzorstvo za radionicu inkluzivne igre'),
(1, 100.00, 'BAM', 'monthly', 'card', 'completed', 'general', '2025-02-15 10:30:00', true, true, 'Mjesečna donacija preko kartice'),
(2, 500.00, 'BAM', 'one_time', 'cash', 'completed', 'general', '2025-03-15 12:00:00', true, true, 'Gotovinska donacija na događaju');

-- Create indexes for better performance
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_news_date ON news(publish_date DESC);
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_status ON event_registrations(status);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_donors_email ON donors(email);
CREATE INDEX idx_donors_active ON donors(is_active);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_date ON donations(donation_date DESC);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_attendee_registration ON attendee_details(registration_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendee_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view active team members" ON team_members FOR SELECT USING (is_active = true);

-- Create policies for event registrations (users can insert their own registrations)
CREATE POLICY "Anyone can register for events" ON event_registrations FOR INSERT WITH CHECK (true);

-- Create policies for contact submissions (anyone can submit)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Create policies for site settings (public read access)
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);

-- Admin policies - only admin@sreca.org can modify data
CREATE POLICY "Admin can manage events" ON events 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage news" ON news 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage team" ON team_members 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can view registrations" ON event_registrations 
FOR SELECT USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage contacts" ON contact_submissions 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage settings" ON site_settings 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

-- Donor and donation policies
CREATE POLICY "Admin can manage donors" ON donors 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage donations" ON donations 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');

CREATE POLICY "Admin can manage attendee details" ON attendee_details 
FOR ALL USING (auth.jwt() ->> 'email' = 'admin@sreca.org');
-- Admin policies are now handled through Supabase Auth
-- Only authenticated admin@sreca.org can perform admin operations

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendee_updated_at BEFORE UPDATE ON attendee_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();