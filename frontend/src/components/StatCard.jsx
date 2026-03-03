import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend, trendValue, iconColor = 'green' }) => {
  const iconColors = {
    green: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    blue: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group">
      {/* Hover effect gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[iconColor]}`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>

        {trend !== undefined && trendValue !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              trend === 'up'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-semibold text-slate-600">{label}</div>
    </div>
  );
};

export default StatCard;