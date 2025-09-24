import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-gradient-to-br from-brand-blue via-indigo-600 to-brand-blue text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">{title}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-red to-amber-500 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl mt-4 max-w-4xl mx-auto leading-relaxed drop-shadow-md font-medium">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
