import { movementService } from '@/services/movementService';
import { aggregateMovementsByDay } from '@/utils/movementUtils';
import { IonIcon, IonSpinner } from '@ionic/react';
import { ellipsisHorizontal } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import WeeklyMovementEmptyState from './WeeklyMovementEmptyState';
import WeeklyMovementErrorState from './WeeklyMovementErrorState';

interface ChartItem {
  day: string;
  value: number;
}

const PRIMARY_COLOR = '#3525cd';

const WeeklyMovementChart: React.FC = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const movements = await movementService.fetchWeeklyMovements();
        if (!active) return;

        const chartItems = aggregateMovementsByDay(movements);
        setData(chartItems);
        setHasError(false);
      } catch (err: any) {
        console.warn('Error al cargar movimientos semanales de Supabase:', err);
        if (!active) return;
        setHasError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-card min-h-[224px] justify-center items-center">
        <IonSpinner name="crescent" color="primary" />
        <p className="text-xs text-on-surface-variant font-medium mt-sm">
          Cargando movimientos...
        </p>
      </section>
    );
  }

  // Si hay error o todos los valores son 0, mostramos los estados vacíos
  const hasMovements = data.some((item) => item.value > 0);

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-card relative min-h-[224px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-h2 text-lg text-on-background font-semibold">
          Movimiento semanal
        </h3>
        <button className="text-on-surface-variant hover:bg-surface-container rounded-full p-1 transition-colors cursor-pointer">
          <IonIcon icon={ellipsisHorizontal} className="text-h2" />
        </button>
      </div>

      {/* Content */}
      {hasError ? (
        <WeeklyMovementErrorState />
      ) : !hasMovements ? (
        <WeeklyMovementEmptyState />
      ) : (
        <div className="w-full h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient
                  id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PRIMARY_COLOR} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={PRIMARY_COLOR} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#c7c4d8" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{
                  fontSize: 10,
                  fill: '#464555',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                }}
                dy={8}
              />
              <YAxis axisLine={false} tickLine={false} tick={{
                  fontSize: 10,
                  fill: '#464555',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #c7c4d8',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'Inter',
                  boxShadow: '0 4px 12px rgba(30,41,59,0.1)',
                }}
                labelStyle={{ color: '#464555', fontWeight: 600 }}
                itemStyle={{ color: PRIMARY_COLOR }}
              />
              <Area type="monotone" dataKey="value" stroke={PRIMARY_COLOR} strokeWidth={2.5} fill="url(#primaryGradient)"
                dot={{ r: 3, fill: '#ffffff', stroke: PRIMARY_COLOR, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: PRIMARY_COLOR, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default WeeklyMovementChart;
