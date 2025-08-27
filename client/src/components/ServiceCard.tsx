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
      className="service-card p-4 rounded-lg cursor-pointer" 
      onClick={onClick}
      data-testid={testId}
    >
      <div className="text-center">
        <div className={`${bgColor} p-3 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg`}>
          <i className={`${icon} ${iconColor} text-xl`}></i>
        </div>
        <h3 className="font-bold text-sm mb-1 text-gray-800">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
        {badge && (
          <div className={`mt-2 text-xs vip-badge px-2 py-1 rounded-full font-bold`}>
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
