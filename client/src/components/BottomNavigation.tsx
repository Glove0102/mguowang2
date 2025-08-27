import React from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: '首页' },
    { path: '/news', icon: 'fas fa-compass', label: '探索' },
    { path: '/lottery', icon: 'fas fa-dice', label: '抽奖', notification: true },
    { path: '/dating', icon: 'fas fa-comment', label: '消息', badge: 3 },
    { path: '/profile', icon: 'fas fa-user', label: '我的' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="grid grid-cols-5 max-w-6xl mx-auto">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button 
              className={`flex flex-col items-center py-3 px-2 transition-colors bottom-nav-item ${
                location === item.path ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
              data-testid={`button-nav-${item.label}`}
            >
              <div className="relative">
                <i className={`${item.icon} text-lg mb-1`}></i>
                {item.notification && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    !
                  </div>
                )}
                {item.badge && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </div>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
