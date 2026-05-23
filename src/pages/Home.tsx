import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import ValorizationCard from '@/components/dashboard/ValorizationCard';
import WeeklyMovementChart from '@/components/dashboard/WeeklyMovementChart';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { IonContent, IonPage } from '@ionic/react';
import { cubeOutline, warningOutline } from 'ionicons/icons';
import React from 'react';

const Home: React.FC = () => {
  return (
    <IonPage>
      {/* Main Canvas */}
      <IonContent scrollY={true}>
        <main className="px-container-padding pt-lg pb-bottom-nav-safe flex flex-col gap-lg">
          {/* Header Section */}
          <DashboardHeader />

          {/* Bento Grid Metrics */}
          <section className="flex flex-col gap-sm">
            {/* Main Valorization Card */}
            <ValorizationCard />

            {/* Split Metric Cards */}
            <div className="grid grid-cols-2 gap-sm">
              <MetricCard
                icon={cubeOutline}
                value="8,402"
                label="Productos totales"
              />
              <MetricCard
                icon={warningOutline}
                value="24"
                label="Alertas de stock"
                variant="error"
              />
            </div>
          </section>

          {/* Chart Section */}
          <WeeklyMovementChart />
        </main>
      </IonContent>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activePath="/home" />
    </IonPage>
  );
};

export default Home;
