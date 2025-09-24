import React from 'react';
import { useTeamMembers } from '../../hooks/useSupabaseData';
import TeamMemberCard from '../TeamMemberCard';
import PageHeader from '../PageHeader';

const AboutPage: React.FC = () => {
  const { teamMembers } = useTeamMembers();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="O Nama"
        subtitle="Udruženje 'Sreća za sve' - posvećeni poboljšanju kvaliteta života djece s teškoćama u razvoju i osoba s invaliditetom."
      />

      {/* Naša misija */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="text-gray-700 space-y-6">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">O nama i našoj misiji</h2>
              <p className="text-lg leading-relaxed">
                Udruženje "Sreća za sve" osnovano je prije šest godina u Travniku s plemenitom misijom: 
                poboljšati kvalitetu života djece s teškoćama u razvoju i osoba s invaliditetom te ih 
                aktivno uključiti u zajednicu.
              </p>
              <p>
                Naš rad se temelji na uvjerenju da svako ljudsko biće, bez obzira na izazove s kojima se 
                suočava, zaslužuje priliku da razvije svoj puni potencijal i živi sretno.
              </p>
              <p>
                Od prvog dana našeg postojanja, fokusirani smo na pružanje <strong>besplatne podrške</strong>, 
                svjesni da su takve usluge često financijski nedostupne porodicama kojima su najpotrebnije.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Djeca u inkluzivnom okruženju"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistike */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-12">Brojke koje govore za nas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-brand-blue mb-2">800+</div>
              <p className="text-gray-600">besplatnih individualnih termina godišnje</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-brand-blue mb-2">5</div>
              <p className="text-gray-600">zaposlenih osoba s invaliditetom</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-brand-blue mb-2">45+</div>
              <p className="text-gray-600">organizovanih izleta i druženja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Naši programi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-blue text-center mb-12">Naši ključni programi i aktivnosti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-brand-gray p-6 rounded-lg">
                <h3 className="text-xl font-bold text-brand-blue mb-3">Besplatne terapije i radionice</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Individualni termini:</h4>
                    <p className="text-gray-600">
                      Kroz personalizovani pristup, naši stručnjaci (psiholog, pedagog, defektolog) 
                      rade s djecom na razvoju specifičnih vještina.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Grupne radionice:</h4>
                    <p className="text-gray-600">
                      Potičemo razvoj socijalnih vještina, kreativnosti i timskog rada kroz igru i interakciju.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-gray p-6 rounded-lg">
                <h3 className="text-xl font-bold text-brand-blue mb-3">Psihološka podrška za roditelje</h3>
                <p className="text-gray-600">
                  Prepoznajemo izazove s kojima se suočavaju roditelji djece s poteškoćama. 
                  Nudimo besplatne psihoterapijske sesije i savjetovanja za emocionalnu podršku.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-brand-gray p-6 rounded-lg">
                <h3 className="text-xl font-bold text-brand-blue mb-3">Terapijsko jahanje</h3>
                <p className="text-gray-600">
                  Terapijsko jahanje je izuzetno korisna aktivnost za poboljšanje fizičkog i 
                  psihičkog stanja korisnika. I ovu aktivnost nudimo potpuno besplatno našim članovima.
                </p>
              </div>

              <div className="bg-brand-gray p-6 rounded-lg">
                <h3 className="text-xl font-bold text-brand-blue mb-3">Izleti, druženja i putovanja</h3>
                <p className="text-gray-600">
                  Redovito organiziramo izlete, rođendanske proslave i druženja. Posebno smo ponosni 
                  na besplatno putovanje na more - za mnoge je to bio prvi put da su vidjeli more.
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
                  Uzgajamo i prodajemo povrće, a sav prihod usmjeravamo na financiranje naših aktivnosti. 
                  Ovaj model nam osigurava stabilnost i dokazuje da humanitarni rad može biti samoodrživ.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Inkluzivno zapošljavanje</h3>
                <p>
                  Kroz saradnju s Fondom za profesionalnu rehabilitaciju, uspješno smo zaposlili osobe 
                  s invaliditetom. Oni su neprocjenjiv dio našeg tima.
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
              Naša plastenička proizvodnja osigurava nam dio financijske stabilnosti, ali kontinuiran 
              rast i širenje programa zahtijeva pouzdanu i dugoročnu podršku. Vaša pomoć nije samo 
              donacija, već investicija u svjetliju budućnost za našu djecu.
            </p>
            <div className="bg-brand-gray p-8 rounded-lg">
              <h3 className="text-xl font-bold text-brand-blue mb-4">Pridružite nam se u našoj misiji!</h3>
              <p className="text-gray-700 mb-6">
                Spremni smo Vam detaljnije predstaviti naš rad i pokazati kako se svaki vaš doprinos 
                pretvara u osmijeh i napredak. Vaša podrška bi značila da ne samo pomažete, već 
                postajete dio promjene, dio priče o uspjehu.
              </p>
              <button className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">
                Kontaktirajte nas
              </button>
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