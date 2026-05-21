import React from 'react';
import { Sidebar } from './Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
};

export const Default = () => (
  <Sidebar>
    <div style={{ padding: 20 }}>Main content area (Default)</div>
  </Sidebar>
);

export const Collapsed = () => (
  <Sidebar defaultCollapsed>
    <div style={{ padding: 20 }}>Main content area (Collapsed)</div>
  </Sidebar>
);
