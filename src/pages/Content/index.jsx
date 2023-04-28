import React from 'react';
import { createRoot } from 'react-dom/client';
import Configuration from '../../config/Configuration';
import SideMenu from './SideMenu';

const pageInfo = window.location.pathname.substring(1).split('/');
let gameConfig;
let playersData;

const isNumber = (val) => {
  return /^[0-9]*$/.exec(val) != null;
};

const buildCss = () => {
  if (gameConfig.css) {
    const style = document.createElement('style');
    style.innerHTML = gameConfig.css;
    document.head.appendChild(style);
  }
};

const buildMenu = () => {
  const container = document.createElement('div');
  container.id = 'bga_extension_sidebar';

  container.style.position = "fixed";
  /*
  if (gameConfig.position === "top") {
    container.style.top = gameConfig.positionOffset;
  } else {
    container.style.bottom = gameConfig.positionOffset;
  }*/
  container.style.left = gameConfig.left;
  container.style.userSelect = "none";
  container.style.zIndex = 5;

  document.body.appendChild(container);

  createRoot(container).render(<SideMenu players={playersData} panel={gameConfig.playerPanel} gameConfig={gameConfig} />);
};

const init = () => {
  const elements = document.querySelectorAll("div.player-name");

  if (elements && elements.length) {
    const playersIdList = Object.values(elements).map(d => parseInt(d.id.substring(12), 10));

    playersData = playersIdList.map(id => {
      const userLink = document.getElementById(`player_name_${id}`).childNodes[1];

      return {
        id,
        name: userLink.innerText,
        avatar: document.getElementById(`avatar_${id}`).src,
        color: userLink.style.color,
      };
    });

    buildCss();
    buildMenu();
  } else {
    setTimeout(init, 100);
  }
}

if (pageInfo.length >= 2 && isNumber(pageInfo[0])) {
  const gameName = pageInfo[1];
  const config = new Configuration();

  config.init().then(() => {
    gameConfig = config.getGameConfig(gameName);

    if (!gameConfig) {
      console.log(`[bga extension] No configuration found for game ${gameName}`);
      return;
    }

    init();
  });
}