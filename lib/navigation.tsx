export type NavItem = {
  id: string;
  label: string;
  href?: string;

  icon?: string;
  children?: NavItem[];
};

export const mainMenu: NavItem[] = [
  { id: 'home', label: 'Inicio', href: '/', icon: 'home' },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'grid',
    children: [
      { id: 'reports', label: 'Reportes', href: '/reports', icon: 'file' },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'bar-chart' },
    ],
  },
  { id: 'settings', label: 'Ajustes', href: '/settings', icon: 'settings' },
];
