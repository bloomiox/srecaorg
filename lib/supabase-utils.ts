import { supabase } from './supabase';
import { Event, NewsArticle, TeamMember } from '../types';

// Helper function to check if user is authenticated admin
const checkAdminAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user || session.user.email !== 'admin@sreca.org') {
    throw new Error('Unauthorized: Admin access required');
  }
  return session.user;
};

// Events functions
export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data?.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    audience: event.audience,
    imageUrl: event.image_url,
    details: {
      duration: event.duration,
      location: event.location,
      topics: event.topics || []
    }
  })) || [];
};

export const createEvent = async (event: Omit<Event, 'id'>) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { data, error } = await supabase
    .from('events')
    .insert([{
      title: event.title,
      description: event.description,
      audience: event.audience,
      image_url: event.imageUrl,
      duration: event.details.duration,
      location: event.details.location,
      topics: event.details.topics
    }])
    .select();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return data?.[0];
};

export const updateEvent = async (id: number, event: Partial<Event>) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { data, error } = await supabase
    .from('events')
    .update({
      title: event.title,
      description: event.description,
      audience: event.audience,
      image_url: event.imageUrl,
      duration: event.details?.duration,
      location: event.details?.location,
      topics: event.details?.topics
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteEvent = async (id: number) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { error } = await supabase
    .from('events')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// News functions
export const getNews = async (): Promise<NewsArticle[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data?.map(article => ({
    id: article.id,
    title: article.title,
    publishDate: new Date(article.publish_date).toLocaleDateString('bs-BA'),
    shortDescription: article.short_description,
    fullContent: article.full_content,
    imageUrl: article.image_url
  })) || [];
};

export const createNews = async (article: Omit<NewsArticle, 'id'>) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { data, error } = await supabase
    .from('news')
    .insert([{
      title: article.title,
      publish_date: new Date(article.publishDate.split('.').reverse().join('-')),
      short_description: article.shortDescription,
      full_content: article.fullContent,
      image_url: article.imageUrl
    }])
    .select();

  if (error) {
    console.error('Error creating news:', error);
    throw error;
  }

  return data?.[0];
};

export const updateNews = async (id: number, article: Partial<NewsArticle>) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { data, error } = await supabase
    .from('news')
    .update({
      title: article.title,
      publish_date: article.publishDate ? new Date(article.publishDate.split('.').reverse().join('-')) : undefined,
      short_description: article.shortDescription,
      full_content: article.fullContent,
      image_url: article.imageUrl
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating news:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteNews = async (id: number) => {
  await checkAdminAuth(); // Ensure admin is authenticated
  const { error } = await supabase
    .from('news')
    .update({ is_published: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

// Team functions
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data?.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    spec: member.specialization,
    imageUrl: member.image_url
  })) || [];
};

export const createTeamMember = async (member: Omit<TeamMember, 'id'>) => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      name: member.name,
      role: member.role,
      specialization: member.spec,
      image_url: member.imageUrl
    }])
    .select();

  if (error) {
    console.error('Error creating team member:', error);
    throw error;
  }

  return data?.[0];
};

export const updateTeamMember = async (id: number, member: Partial<TeamMember>) => {
  const { data, error } = await supabase
    .from('team_members')
    .update({
      name: member.name,
      role: member.role,
      specialization: member.spec,
      image_url: member.imageUrl
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating team member:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteTeamMember = async (id: number) => {
  const { error } = await supabase
    .from('team_members')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

// Event registration functions
export const registerForEvent = async (registration: {
  eventId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  specialNeeds?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  dietaryRequirements?: string;
}) => {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([{
      event_id: registration.eventId,
      first_name: registration.firstName,
      last_name: registration.lastName,
      email: registration.email,
      phone: registration.phone,
      organization: registration.organization,
      special_needs: registration.specialNeeds,
      emergency_contact: registration.emergencyContact,
      emergency_phone: registration.emergencyPhone,
      dietary_requirements: registration.dietaryRequirements
    }])
    .select();

  if (error) {
    console.error('Error registering for event:', error);
    throw error;
  }

  return data?.[0];
};

export const getEventRegistrations = async (eventId?: number) => {
  let query = supabase
    .from('event_registrations')
    .select(`
      *,
      events (
        title
      )
    `)
    .order('registration_date', { ascending: false });

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching registrations:', error);
    return [];
  }

  return data || [];
};

// Contact form functions
export const submitContactForm = async (contact: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([contact])
    .select();

  if (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }

  return data?.[0];
};

export const getContactSubmissions = async () => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }

  return data || [];
};

// Site settings functions
export const getSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  const settings: Record<string, string> = {};
  data?.forEach(setting => {
    settings[setting.setting_key] = setting.setting_value;
  });

  return settings;
};

export const updateSiteSetting = async (key: string, value: string) => {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert([{
      setting_key: key,
      setting_value: value
    }])
    .select();

  if (error) {
    console.error('Error updating site setting:', error);
    throw error;
  }

  return data?.[0];
};

// Donor management functions
export const getDonors = async () => {
  const { data, error } = await supabase
    .from('donors')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching donors:', error);
    return [];
  }

  return data || [];
};

export const createDonor = async (donor: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  preferredContact?: string;
  communicationPreferences?: string[];
  donorType?: string;
  organizationName?: string;
  taxId?: string;
  notes?: string;
}) => {
  await checkAdminAuth();
  const { data, error } = await supabase
    .from('donors')
    .insert([{
      first_name: donor.firstName,
      last_name: donor.lastName,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      city: donor.city,
      postal_code: donor.postalCode,
      country: donor.country || 'Bosna i Hercegovina',
      date_of_birth: donor.dateOfBirth ? new Date(donor.dateOfBirth) : null,
      preferred_contact: donor.preferredContact || 'email',
      communication_preferences: donor.communicationPreferences || [],
      donor_type: donor.donorType || 'individual',
      organization_name: donor.organizationName,
      tax_id: donor.taxId,
      notes: donor.notes
    }])
    .select();

  if (error) {
    console.error('Error creating donor:', error);
    throw error;
  }

  return data?.[0];
};

export const updateDonor = async (id: number, donor: any) => {
  await checkAdminAuth();
  const { data, error } = await supabase
    .from('donors')
    .update({
      first_name: donor.firstName,
      last_name: donor.lastName,
      email: donor.email,
      phone: donor.phone,
      address: donor.address,
      city: donor.city,
      postal_code: donor.postalCode,
      country: donor.country,
      date_of_birth: donor.dateOfBirth ? new Date(donor.dateOfBirth) : null,
      preferred_contact: donor.preferredContact,
      communication_preferences: donor.communicationPreferences,
      donor_type: donor.donorType,
      organization_name: donor.organizationName,
      tax_id: donor.taxId,
      notes: donor.notes
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating donor:', error);
    throw error;
  }

  return data?.[0];
};

export const deleteDonor = async (id: number) => {
  await checkAdminAuth();
  const { error } = await supabase
    .from('donors')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting donor:', error);
    throw error;
  }
};

// Donation management functions
export const getDonations = async (donorId?: number) => {
  let query = supabase
    .from('donations')
    .select(`
      *,
      donors (
        first_name,
        last_name,
        email,
        donor_type,
        organization_name
      )
    `)
    .order('donation_date', { ascending: false });

  if (donorId) {
    query = query.eq('donor_id', donorId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching donations:', error);
    return [];
  }

  return data || [];
};

export const createDonation = async (donation: {
  donorId?: number;
  amount: number;
  currency?: string;
  donationType?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  transactionId?: string;
  purpose?: string;
  campaign?: string;
  isAnonymous?: boolean;
  donationDate?: string;
  receiptSent?: boolean;
  taxDeductible?: boolean;
  notes?: string;
}) => {
  await checkAdminAuth();
  const { data, error } = await supabase
    .from('donations')
    .insert([{
      donor_id: donation.donorId,
      amount: donation.amount,
      currency: donation.currency || 'BAM',
      donation_type: donation.donationType || 'one_time',
      payment_method: donation.paymentMethod,
      payment_status: donation.paymentStatus || 'completed',
      transaction_id: donation.transactionId,
      purpose: donation.purpose || 'general',
      campaign: donation.campaign,
      is_anonymous: donation.isAnonymous || false,
      donation_date: donation.donationDate ? new Date(donation.donationDate) : new Date(),
      receipt_sent: donation.receiptSent || false,
      tax_deductible: donation.taxDeductible !== false,
      notes: donation.notes
    }])
    .select();

  if (error) {
    console.error('Error creating donation:', error);
    throw error;
  }

  return data?.[0];
};

export const updateDonation = async (id: number, donation: any) => {
  await checkAdminAuth();
  const { data, error } = await supabase
    .from('donations')
    .update({
      donor_id: donation.donorId,
      amount: donation.amount,
      currency: donation.currency,
      donation_type: donation.donationType,
      payment_method: donation.paymentMethod,
      payment_status: donation.paymentStatus,
      transaction_id: donation.transactionId,
      purpose: donation.purpose,
      campaign: donation.campaign,
      is_anonymous: donation.isAnonymous,
      donation_date: donation.donationDate ? new Date(donation.donationDate) : null,
      receipt_sent: donation.receiptSent,
      tax_deductible: donation.taxDeductible,
      notes: donation.notes
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating donation:', error);
    throw error;
  }

  return data?.[0];
};

// Attendee details functions
export const getAttendeeDetails = async (registrationId?: number) => {
  let query = supabase
    .from('attendee_details')
    .select(`
      *,
      event_registrations (
        first_name,
        last_name,
        email,
        events (
          title
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (registrationId) {
    query = query.eq('registration_id', registrationId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching attendee details:', error);
    return [];
  }

  return data || [];
};

export const createAttendeeDetails = async (details: {
  registrationId: number;
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  childAge?: number;
  disabilityType?: string;
  supportNeeds?: string;
  medicalConditions?: string;
  medications?: string;
  mobilityRequirements?: string;
  communicationPreferences?: string;
  previousParticipation?: boolean;
  howHeardAboutUs?: string;
  consentPhoto?: boolean;
  consentNewsletter?: boolean;
  additionalNotes?: string;
}) => {
  await checkAdminAuth();
  const { data, error } = await supabase
    .from('attendee_details')
    .insert([{
      registration_id: details.registrationId,
      guardian_name: details.guardianName,
      guardian_phone: details.guardianPhone,
      guardian_email: details.guardianEmail,
      child_age: details.childAge,
      disability_type: details.disabilityType,
      support_needs: details.supportNeeds,
      medical_conditions: details.medicalConditions,
      medications: details.medications,
      mobility_requirements: details.mobilityRequirements,
      communication_preferences: details.communicationPreferences,
      previous_participation: details.previousParticipation || false,
      how_heard_about_us: details.howHeardAboutUs,
      consent_photo: details.consentPhoto || false,
      consent_newsletter: details.consentNewsletter || false,
      additional_notes: details.additionalNotes
    }])
    .select();

  if (error) {
    console.error('Error creating attendee details:', error);
    throw error;
  }

  return data?.[0];
};