import React from 'react';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = 'Dashboard',
  subtitle = 'Resumen general de hoy',
}) => {
  return (
    <section className="flex flex-col gap-base">
      <h2 className="font-h1 text-h1 text-on-background">{title}</h2>
      <p className="font-body-md text-body-md text-on-surface-variant">
        {subtitle}
      </p>
    </section>
  );
};

export default DashboardHeader;
