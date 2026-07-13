import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import ValorizationCard from '@/components/dashboard/ValorizationCard';
import WeeklyMovementChart from '@/components/dashboard/WeeklyMovementChart';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import { Product } from '@/data/productsData';
import { productService } from '@/services/productService';
import { calculateDashboardMetrics } from '@/utils/dashboardUtils';
import { IonContent, IonPage } from '@ionic/react';
import { cubeOutline, warningOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error al cargar productos en Home:', err);
        throw new Error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const { totalStockUnits, stockAlerts, valuation } = calculateDashboardMetrics(products);

  return (
    <IonPage>
      <IonContent scrollY={true}>
        <main className="px-container-padding pt-lg pb-bottom-nav-safe flex flex-col gap-lg">
          <DashboardHeader />

          <section className="flex flex-col gap-sm">
            <ValorizationCard
              value={valuation}
              loading={loading}
            />

            <div className="grid grid-cols-2 gap-sm">
              <MetricCard
                icon={cubeOutline}
                value={totalStockUnits}
                label="Productos en stock"
                loading={loading}
              />
              <MetricCard
                icon={warningOutline}
                value={stockAlerts}
                label="Alertas de stock"
                variant="error"
                loading={loading}
              />
            </div>
          </section>

          <WeeklyMovementChart />
        </main>
      </IonContent>

      <BottomNavBar activePath="/home" />
    </IonPage>
  );
};

export default Home;
