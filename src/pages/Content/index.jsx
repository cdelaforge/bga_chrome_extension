import React from 'react';
import { createRoot } from 'react-dom/client';
import Configuration from '../../config/Configuration';
import shouldFilter from '../../config/FilteredLogs';
import SideMenu from './SideMenu';
import RightMenu from './RightMenu';
import { isNumber } from '../../helpers/Misc';

const pageInfo = window.location.pathname.substring(1).split('/');
let gameConfig;
let playersData;

const buildCss = () => {
  if (gameConfig.css) {
    const style = document.createElement('style');
    style.innerHTML = gameConfig.css;
    document.head.appendChild(style);
  }
};

const setFloatingRightMenu = () => {
  const pageTitle = document.getElementById('page-title');

  if (pageTitle) {
    const style = document.createElement('style');
    style.innerHTML = [
      '#left-side { margin-right: 0px !important; }',
      '#right-side-first-part, #right-side-second-part { position: fixed; right: 5px;  overflow-y: auto; overflow-x: hidden; z-index: 1000; }',
      '#right-side-second-part { border: 1px solid black; outline: 1px solid white; background-color: rgb(235, 213, 189); width: 260px !important; }',
      '#cde-floating-menu { position: absolute; top: 0px; right: 0px; }',
      '#logs { margin-top: 0px; max-height: 100000px; }',
      '#seemorelogs { display: none !important; }',
      '#pagemaintitletext { padding-right: 80px; }',
      '.mobile_version #cde-floating-menu-log { display: none; }',
      '.mobile_version #pagemaintitletext { padding-right: 40px; }',
    ].join(' ');
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'cde-floating-menu';
    pageTitle.appendChild(container);
    createRoot(container).render(<RightMenu />);
  } else {
    setTimeout(setFloatingRightMenu, 100);
  }
};

const buildMenu = () => {
  const container = document.createElement('div');
  container.id = 'bga_extension_sidebar';
  container.style.position = "fixed";
  container.style.left = gameConfig.left;
  container.style.userSelect = "none";
  container.style.zIndex = 5;
  document.body.appendChild(container);

  createRoot(container).render(<SideMenu players={playersData} panel={gameConfig.playerPanel} gameConfig={gameConfig} />);
};

const initlogObserver = () => {
  const logsContainer = document.querySelector("#logs");

  if (!logsContainer) {
    setTimeout(initlogObserver, 100);
    return;
  }

  const observer = new MutationObserver(() => {
    logsContainer.childNodes.forEach((elt, index) => {
      const text = elt.innerHTML;
      if (text && text.indexOf('<!--PNS-->') >= 0 && shouldFilter(text)) {
        logsContainer.removeChild(elt);
      }
      if (index > 20) {
        return;
      }
    });
  });

  observer.observe(logsContainer, { childList: true, subtree: true });
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

    const style = document.createElement('style');
    style.innerHTML = "#lrf-bga-extension { display: none; }";
    document.head.appendChild(style);

    if (!config.isOnlineMessagesEnabled()) {
      setTimeout(initlogObserver, 1000);
    }
    if (config.isFloatingRightMenu()) {
      setFloatingRightMenu();
    }

    // left-side => margin-right: 0px
    //right-side-first-part
    //right-side-second-part

    if (!gameConfig) {
      console.log(`[bga extension] No configuration found for game ${gameName}`);
      return;
    }

    if (!config.isGameEnabled(gameName)) {
      console.log(`[bga extension] Menu disabled for game ${gameName}`);
      return;
    }

    init();
  });
};