import React from 'react';
import { TeamMember } from '../types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100 group">
    <div className="relative overflow-hidden">
      <img src={member.imageUrl} alt={member.name} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold text-brand-blue mb-2 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
      <div className="space-y-1">
        <p className="text-brand-lightblue text-lg font-semibold">{member.spec}</p>
        <p className="text-gray-600 font-medium">{member.role}</p>
      </div>
      <div className="w-16 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
);

export default TeamMemberCard;