import { getLocalUserSession, UserSession } from '@/services/authService';
import React, { useEffect, useState } from 'react';

const DashboardHeader: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    setSession(getLocalUserSession());
  }, []);

  const greetingName = session ? session.name.split(' ')[0] : 'Usuario';
  const roleName = session ? session.role : 'Usuario';

  const title = `¡Hola, ${greetingName}!`;
  const subtitle = `Resumen general de hoy (Rol: ${roleName})`;

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
