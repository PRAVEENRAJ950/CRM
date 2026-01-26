/**
 * Dashboard Cards Component
 * Displays key metrics in card format
 */

import React from 'react';

/**
 * DashboardCards Component
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 */
const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Leads',
      value: stats?.leads?.total || 0,
      icon: '👥',
      color: '#3b82f6',
      change: stats?.leads?.new || 0,
      changeLabel: 'New',
    },
    {
      title: 'Open Deals',
      value: stats?.deals?.open || 0,
      icon: '💼',
      color: '#10b981',
      change: `$${stats?.deals?.totalValue?.toLocaleString() || 0}`,
      changeLabel: 'Total Value',
    },
    {
      title: 'Pending Activities',
      value: stats?.activities?.pending || 0,
      icon: '📅',
      color: '#f59e0b',
      change: stats?.activities?.overdue || 0,
      changeLabel: 'Overdue',
    },
    {
      title: 'Conversion Rate',
      value: `${stats?.leads?.conversionRate || 0}%`,
      icon: '📈',
      color: '#8b5cf6',
      change: stats?.leads?.qualified || 0,
      changeLabel: 'Qualified',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="card"
          style={{
            borderLeft: `4px solid ${card.color}`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {card.changeLabel}: {card.change}
              </div>
            </div>
            <div
              style={{
                fontSize: '40px',
                opacity: 0.2,
              }}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
