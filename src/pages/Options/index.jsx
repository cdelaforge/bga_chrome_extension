import React from 'react';
import { createRoot } from 'react-dom/client';

import Options from './Options';
import Configuration from "../../config/Configuration";

const config = new Configuration();
const container = document.getElementById('app-container');
const root = createRoot(container);

config.init().then(() => {
  root.render(<Options config={config} />);
});