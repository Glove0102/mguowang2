import React from 'react';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  bgColor: string;
  iconColor: string;
  onClick: () => void;
  testId?: string;
}

export function ServiceCard({ 
  icon, 
  title, 
  description, 
  badge, 
  badgeColor = 'green', 
  bgColor,
  iconColor,
  onClick,
  testId
}: ServiceCardProps) {
  return (
    <div 
      className="service-card bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-border" 
      onClick={onClick}
      data-testid={testId}
    >
      <div className="text-center">
        <div className={`${bgColor} p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {badge && (
          <div className={`mt-2 text-xs bg-${badgeColor}-100 text-${badgeColor}-700 px-2 py-1 rounded`}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
