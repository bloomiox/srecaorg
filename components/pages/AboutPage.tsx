import React from 'react';
import { useTeamMembers, useSiteSettings } from '../../hooks/useSupabaseData';
import TeamMemberCard from '../TeamMemberCard';
import PageHeader from '../PageHeader';

const AboutPage: React.FC = () => {
  const { teamMembers } = useTeamMembers();
  const { settings } = useSiteSettings();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="O Nama"
        subtitle="Udruženje 'Sreća za sve' - posvećeni poboljšanju kvaliteta života djece s teškoćama u razvoju i osoba s invaliditetom."
      />

      {/* Naša misija */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16">
            <div className="text-gray-700 space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6 tracking-tight">O nama i našoj misiji</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mb-8"></div>
              </div>
              <p className="text-xl leading-relaxed text-gray-600">
                {settings.mission_short || 'Udruženje "Sreća za sve" osnovano je prije šest godina u Travniku s plemenitom misijom: poboljšati kvalitetu života djece s teškoćama u razvoju i osoba s invaliditetom te ih aktivno uključiti u zajednicu.'}
              </p>
              <p className="text-lg leading-relaxed">
                {settings.mission_full || 'Naš rad se temelji na uvjerenju da svako ljudsko biće, bez obzira na izazove s kojima se suočava, zaslužuje priliku da razvije svoj puni potencijal i živi sretno. Od prvog dana našeg postojanja, fokusirani smo na pružanje besplatne podrške, svjesni da su takve usluge često financijski nedostupne porodicama kojima su najpotrebnije.'}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-blue to-brand-lightblue rounded-2xl opacity-20 blur-lg"></div>
              <img
                src="https://scontent.fach1-1.fna.fbcdn.net/v/t39.30808-6/484325498_938795348470012_5494970943350995240_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=WXTjeBBupC4Q7kNvwHmOM93&_nc_oc=AdnwSM3n5WPFSgSnhxk-q4YZRUqnFxiNKn90-gCh1_Q1iGkfco5PEJoFO0pv7UiJcs4&_nc_zt=23&_nc_ht=scontent.fach1-1.fna&_nc_gid=DRGTWUo7vvPczFJyAJxUww&oh=00_AfashmNjaVJvQim4YguCOoq74US0ERDV0DNMeGesy0W12A&oe=68D9DF1D"
                alt="Djeca u inkluzivnom okruženju"
                className="relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistike */}
      <section className="py-20 bg-gradient-to-br from-brand-blue to-indigo-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Brojke koje govore za nas</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
                {settings.stats_individual_sessions || '800+'}
              </div>
              <p className="text-white/90 text-lg font-medium">besplatnih individualnih termina godišnje</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
                {settings.stats_employed_disabled || '5'}
              </div>
              <p className="text-white/90 text-lg font-medium">zaposlenih osoba s invaliditetom</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl md:text-6xl font-black text-white mb-4 bg-gradient-to-r from-brand-red to-amber-400 bg-clip-text text-transparent">
                {settings.stats_trips || '45+'}
              </div>
              <p className="text-white/90 text-lg font-medium">organizovanih izleta i druženja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Naši programi */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-6 tracking-tight">Naši ključni programi i aktivnosti</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">🎯</span>
                  <h3 className="text-2xl font-bold text-brand-blue">Besplatne terapije i radionice</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Individualni termini:</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {settings.individual_sessions_desc || 'Kroz personalizovani pristup, naši stručnjaci (psiholog, pedagog, defektolog) rade s djecom na razvoju specifičnih vještina.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Grupne radionice:</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {settings.group_workshops_desc || 'Potičemo razvoj socijalnih vještina, kreativnosti i timskog rada kroz igru i interakciju.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">💚</span>
                  <h3 className="text-2xl font-bold text-brand-blue">Psihološka podrška za roditelje</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.psychological_support_desc || 'Prepoznajemo izazove s kojima se suočavaju roditelji djece s poteškoćama. Nudimo besplatne psihoterapijske sesije i savjetovanja za emocionalnu podršku.'}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">🐎</span>
                  <h3 className="text-2xl font-bold text-brand-blue">Terapijsko jahanje</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.therapeutic_riding_desc || 'Terapijsko jahanje je izuzetno korisna aktivnost za poboljšanje fizičkog i psihičkog stanja korisnika. I ovu aktivnost nudimo potpuno besplatno našim članovima.'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">🎉</span>
                  <h3 className="text-2xl font-bold text-brand-blue">Izleti, druženja i putovanja</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {settings.trips_desc || 'Redovito organiziramo izlete, rođendanske proslave i druženja. Posebno smo ponosni na besplatno putovanje na more - za mnoge je to bio prvi put da su vidjeli more.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model samofinanciranja */}
      <section className="py-16 bg-brand-lightblue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Naš model samofinanciranja i inkluzivnosti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Plastenička proizvodnja</h3>
                <p>
                  {settings.self_financing_desc || 'Uzgajamo i prodajemo povrće, a sav prihod usmjeravamo na financiranje naših aktivnosti. Ovaj model nam osigurava stabilnost i dokazuje da humanitarni rad može biti samoodrživ.'}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Inkluzivno zapošljavanje</h3>
                <p>
                  {settings.inclusive_employment_desc || 'Kroz saradnju s Fondom za profesionalnu rehabilitaciju, uspješno smo zaposlili osobe s invaliditetom. Oni su neprocjenjiv dio našeg tima.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Poziv na akciju */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-blue mb-6">Postanite naš partner</h2>
            <p className="text-lg text-gray-600 mb-8">
              {settings.support_message || 'Naša plastenička proizvodnja osigurava nam dio financijske stabilnosti, ali kontinuiran rast i širenje programa zahtijeva pouzdanu i dugoročnu podršku.'} {settings.partnership_cta || 'Vaša pomoć nije samo donacija, već investicija u svjetliju budućnost za našu djecu.'}
            </p>
            <div className="bg-brand-gray p-8 rounded-lg">
              <h3 className="text-xl font-bold text-brand-blue mb-4">Pridružite nam se u našoj misiji!</h3>
              <p className="text-gray-700 mb-6">
                Spremni smo Vam detaljnije predstaviti naš rad i pokazati kako se svaki vaš doprinos
                pretvara u osmijeh i napredak. Vaša podrška bi značila da ne samo pomažete, već
                postajete dio promjene, dio priče o uspjehu.
              </p>
              <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                <h4 className="text-lg font-bold text-brand-blue mb-3">Kontakt informacije</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Adresa:</strong> {settings.address || 'Pasamahala br. 272'}, {settings.city || '72270 Travnik'}</p>
                  <p><strong>Telefon:</strong> {settings.contact_phone || '062 338 910'}</p>
                  <p><strong>Email:</strong> {settings.contact_email || 'info@sreca.org'}</p>
                  {settings.contact_email_secondary && <p><strong>Email:</strong> {settings.contact_email_secondary}</p>}
                  <p><strong>ID broj:</strong> {settings.id_number || '4236699600006'}</p>
                  <p><strong>Račun za donacije:</strong> {settings.bank_name || 'UniCredit Bank'} {settings.bank_account || '3386702240352380'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tim */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-brand-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-brand-blue text-center mb-12">Naš tim</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {teamMembers.map(member => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;