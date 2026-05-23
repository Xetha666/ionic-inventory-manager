import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import MetricCard from '@/components/Dashboard/MetricCard';
import ValorizationCard from '@/components/Dashboard/ValorizationCard';
import WeeklyMovementChart from '@/components/Dashboard/WeeklyMovementChart';
import BottomNavBar from '@/components/Navigation/BottomNavBar';
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
