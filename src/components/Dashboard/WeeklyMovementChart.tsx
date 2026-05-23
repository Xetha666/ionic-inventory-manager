import { IonIcon } from '@ionic/react';
import { ellipsisHorizontal } from 'ionicons/icons';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CHART_DATA = [
  { day: 'LUN', value: 120 },
  { day: 'MAR', value: 180 },
  { day: 'MIÉ', value: 150 },
  { day: 'JUE', value: 220 },
  { day: 'VIE', value: 190 },
  { day: 'SÁB', value: 310 },
  { day: 'DOM', value: 270 },
];

const PRIMARY_COLOR = '#3525cd';

const WeeklyMovementChart: React.FC = () => {
  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-md shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-h2 text-lg text-on-background font-semibold">
          Movimiento semanal
        </h3>
        <button className="text-on-surface-variant hover:bg-surface-container rounded-full p-1 transition-colors cursor-pointer">
          <IonIcon icon={ellipsisHorizontal} className="text-h2" />
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={CHART_DATA}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={PRIMARY_COLOR}
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor={PRIMARY_COLOR}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#c7c4d8"
              strokeOpacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: '#464555',
                fontFamily: 'Inter',
                fontWeight: 500,
              }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={PRIMARY_COLOR}
              strokeWidth={2.5}
              fill="url(#primaryGradient)"
              dot={{
                r: 3,
                fill: '#ffffff',
                stroke: PRIMARY_COLOR,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: PRIMARY_COLOR,
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default WeeklyMovementChart;
