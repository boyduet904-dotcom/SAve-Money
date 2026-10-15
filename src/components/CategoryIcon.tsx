import React from 'react';
import {
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  Coffee,
  BookOpen,
  Wifi,
  Zap,
  HeartPulse,
  Shirt,
  CircleEllipsis,
  Briefcase,
  Gift,
  ArrowDownLeft,
  Wallet,
  DollarSign,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  Coffee,
  BookOpen,
  Wifi,
  Zap,
  HeartPulse,
  Shirt,
  CircleEllipsis,
  Briefcase,
  Gift,
  ArrowDownLeft,
  Wallet,
  DollarSign,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = ICON_MAP[name] || CircleEllipsis;
  return <IconComponent className={className} />;
};
