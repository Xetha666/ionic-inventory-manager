import BottomNavBar from '@/components/Navigation/BottomNavBar';
import NavBar from '@/components/Navigation/NavBar';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  trendingUpOutline,
  walletOutline,
  cubeOutline,
  warningOutline,
  ellipsisHorizontal
} from 'ionicons/icons';
import React from 'react';

const Home: React.FC = () => {
  return (
    <IonPage>
      {/* TopAppBar */}
      <NavBar />

      {/* Main Canvas */}
      <IonContent className="ion-no-padding" scrollY={true}>
        <main className="px-container-padding pt-lg pb-[100px] flex flex-col gap-lg">
          {/* Header Section */}
          <section className="flex flex-col gap-base">
            <h2 className="font-h1 text-h1 text-on-background">Dashboard</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              General overview for today
            </p>
          </section>

          {/* Bento Grid Metrics */}
          <section className="flex flex-col gap-sm">
            {/* Main Valorization Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-sm shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Valorización
                </span>
                <IonIcon icon={walletOutline} className="text-primary text-[20px]" />
              </div>
              <div className="flex flex-col gap-xs">
                <span className="font-h1 text-h1 text-on-background">$2,450,180</span>
                <div className="flex items-center gap-xs text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-sm">
                  <IonIcon icon={trendingUpOutline} className="text-[14px]" />
                  <span className="font-data-tabular text-data-tabular text-xs">+4.2%</span>
                </div>
              </div>
            </div>

            {/* Split Metric Cards */}
            <div className="grid grid-cols-2 gap-sm">
              {/* Productos Totales */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
                <div className="flex w-10 h-10 rounded-full bg-surface-container items-center justify-center">
                  <IonIcon icon={cubeOutline} className="text-primary text-[22px]" />
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-h2 text-h2 text-on-background">8,402</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                    Productos totales
                  </span>
                </div>
              </div>

              {/* Alertas de Stock */}
              <div className="bg-error-container/30 border border-error/20 rounded-xl p-md flex flex-col gap-md shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
                <div className="flex w-10 h-10 rounded-full bg-error-container items-center justify-center">
                  <IonIcon icon={warningOutline} className="text-error text-[22px]" />
                </div>
                <div className="flex flex-col gap-xs">
                  <span className="font-h2 text-h2 text-error">24</span>
                  <span className="font-label-caps text-label-caps text-error uppercase">
                    Alertas de stock
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Chart Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-[0_4px_12px_rgba(30,41,59,0.05)]">
            <div className="flex items-center justify-between">
              <h3 className="font-h2 text-lg text-on-background font-semibold">
                Weekly movement
              </h3>
              <button className="text-on-surface-variant hover:bg-surface-container rounded-full p-1 transition-colors cursor-pointer">
                <IonIcon icon={ellipsisHorizontal} className="text-[22px]" />
              </button>
            </div>

            {/* Simple SVG Chart */}
            <div className="w-full h-32 relative mt-sm">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between border-l border-b border-outline-variant/30 pb-6 pl-2">
                <div className="w-full border-t border-outline-variant/20 border-dashed"></div>
                <div className="w-full border-t border-outline-variant/20 border-dashed"></div>
                <div className="w-full border-t border-outline-variant/20 border-dashed"></div>
              </div>

              {/* Line Chart Path */}
              <svg
                className="w-full h-[calc(100%-24px)] text-primary overflow-visible absolute top-0 left-2"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <path
                  d="M0,35 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                {/* Data Points */}
                <circle cx="20" cy="25" r="1.5" fill="currentColor" />
                <circle cx="40" cy="15" r="1.5" fill="currentColor" />
                <circle cx="60" cy="20" r="1.5" fill="currentColor" />
                <circle cx="80" cy="5" r="1.5" fill="currentColor" />
                <circle cx="100" cy="10" r="1.5" fill="currentColor" />
              </svg>

              {/* X Axis Labels */}
              <div className="absolute bottom-0 left-2 right-0 flex justify-between text-[10px] font-data-tabular text-on-surface-variant uppercase px-2">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>
          </section>
        </main>
      </IonContent>

      {/* Bottom Navigation Bar */}
      <BottomNavBar activePath="/home" />
    </IonPage>
  );
};

export default Home;
