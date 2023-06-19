import React from 'react';
import { createRoot } from 'react-dom/client';
import Configuration from '../../config/Configuration';
import shouldFilter from '../../config/FilteredLogs';
import SideMenu from './SideMenu';
import RightMenu from './RightMenu';
import Templates from './Templates';
import { isNumber } from '../../helpers/Misc';

const pageInfo = window.location.pathname.substring(1).split('/');
let gameConfig;
let playersData;

const buildLeftMenuCss = (enable) => {
  const menuStyleId = 'cde-left-menu-style';

  if (!enable) {
    const style = document.getElementById(menuStyleId);
    if (style) {
      style.parentNode.removeChild(style);
    }
  } else if (gameConfig.css) {
    const style = document.createElement('style');
    style.id = menuStyleId;
    style.innerHTML = gameConfig.css;
    document.head.appendChild(style);
  }
};

const setFloatingRightMenu = (gameConfig, val) => {
  const pageTitle = document.getElementById('gotonexttable_wrap');
  const menuContainerId = 'cde-floating-menu';
  const menuStyleId = 'cde-floating-menu-style';

  if (!pageTitle) {
    setTimeout(() => setFloatingRightMenu(gameConfig, val), 100);
    return;
  }

  let style = document.getElementById(menuStyleId);
  let container = document.getElementById(menuContainerId);

  if (style && container && !val) {
    style.parentNode.removeChild(style);
    container.parentNode.removeChild(container);

    document.getElementById('right-side-first-part').style.maxHeight = 'initial';
    document.getElementById('right-side-second-part').style.maxHeight = 'initial';
  }

  if (!style && !container && val) {
    style = document.createElement('style');
    style.id = menuStyleId;
    style.innerHTML = [
      '#left-side { margin-right: 0px !important; }',
      '#right-side-first-part, #right-side-second-part { position: fixed; right: -500px;  overflow-y: auto; overflow-x: hidden; z-index: 1000; }',
      '#right-side-second-part { border: 1px solid black; outline: 1px solid white; background-color: rgb(235, 213, 189); width: 260px !important; }',
      '#cde-floating-menu { display: inline; }',
      '#logs { margin-top: 0px; max-height: 100000px; }',
      '#seemorelogs { display: none !important; }',
      '#go_to_next_table_inactive_player { margin-left: 5px }',
      '.mobile_version #cde-floating-menu-log { display: none; }',
      gameConfig?.menuCss || ''
    ].join(' ');
    document.head.appendChild(style);

    container = document.createElement('span');
    container.id = menuContainerId;
    pageTitle.parentNode.appendChild(container);
    createRoot(container).render(<RightMenu />);
  }
};

const buildLeftMenu = (enable) => {
  const menuContainerId = 'bga_extension_sidebar';

  if (enable) {
    const container = document.createElement('div');
    container.id = menuContainerId;
    container.style.position = 'fixed';
    container.style.left = gameConfig.left;
    container.style.userSelect = 'none';
    container.style.zIndex = 1000;
    document.body.appendChild(container);

    createRoot(container).render(<SideMenu players={playersData} panel={gameConfig.playerPanel} gameConfig={gameConfig} />);
    return;
  }

  const container = document.getElementById(menuContainerId);
  if (container) {
    container.parentNode.removeChild(container);
  }
};

const initlogObserver = () => {
  const logsContainer = document.querySelector('#logs');

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

const initLeftMenu = (leftMenuEnable) => {
  const elements = document.querySelectorAll("div.player-name");

  if (elements && elements.length) {
    const playersIdList = Object.values(elements).filter(d => d.id).map(d => parseInt(d.id.substring(12), 10)).filter(id => !isNaN(id));

    playersData = playersIdList.map(id => {
      const userLink = document.getElementById(`player_name_${id}`).childNodes[1];

      return {
        id,
        name: userLink.innerText,
        avatar: document.getElementById(`avatar_${id}`).src,
        color: getComputedStyle(userLink).color
      };
    });

    console.log('[bga extension] players data', playersData);

    buildLeftMenuCss(leftMenuEnable);
    buildLeftMenu(leftMenuEnable);
  } else {
    setTimeout(() => initLeftMenu(leftMenuEnable), 100);
  }
};

const initDevelopperUI = () => {
  if (document.getElementById("cde_bga_ext")) {
    console.log('[bga extension] extension is deprecated => disabled');
    return;
  }

  if (document.getElementById('last_reports') || document.getElementById('ext_templates')) {
    // display of reports list, or templates list already displayed, nothing to do
    setTimeout(initDevelopperUI, 500);
    return;
  }

  const butStatus = document.getElementById('change_bug_status_awaiting') || document.getElementById('change_bug_status_open');
  const reportArea = document.getElementById('report_log');

  if (!butStatus || !reportArea || !reportArea.getBoundingClientRect().x) {
    console.log('[bga extension] page is loading...');
    setTimeout(initDevelopperUI, 100);
    return;
  }

  if (butStatus.getBoundingClientRect().x) {
    // the button 'awaiting' is displayed, we are a developper
    console.log('[bga extension] developper mode !');

    const container = document.createElement('div');
    container.id = 'ext_templates';
    reportArea.parentNode.insertBefore(container, reportArea);

    const reportName = document.getElementById('report_game_table').firstChild.innerText;
    const pos = reportName.lastIndexOf('#');
    const gameName = reportName.substring(0, pos - 1).trim();

    console.log(`[bga extension] this is a report for '${gameName}'`);

    createRoot(container).render(<Templates gameName={gameName} />);
  }

  setTimeout(initDevelopperUI, 500);
};

const buildOption = (title, text, inputId, inputValue, option1, option2, toggleFunc) => {
  const container = document.createElement('div');
  container.className = 'preference_choice';

  const row = document.createElement('div');
  row.className = 'row-data row-data-large';
  container.appendChild(row);

  const label = document.createElement('div');
  label.className = 'row-label';
  label.innerHTML = text;
  row.appendChild(label);

  const val = document.createElement('div');
  val.className = 'row-value';
  row.appendChild(val);

  const input = document.createElement('select');
  input.id = inputId;
  input.className = 'preference_control';
  input.addEventListener('click', (evt) => evt.stopPropagation());
  input.addEventListener('change', toggleFunc);
  val.appendChild(input)

  if (inputValue === '1') {
    input.insertAdjacentHTML('beforeend', '<option value="1" selected="selected">' + option1 + '</option>');
    input.insertAdjacentHTML('beforeend', '<option value="0">' + option2 + '</option>');
  } else {
    input.insertAdjacentHTML('beforeend', '<option value="1">' + option1 + '</option>');
    input.insertAdjacentHTML('beforeend', '<option value="0" selected="selected">' + option2 + '</option>');
  }

  title.parentNode.insertBefore(container, title.nextSibling);
};

const buildOptions = (config, gameName, gameConfig) => {
  const histoInputs = [document.getElementById('preference_global_control_logsSecondColumn'), document.getElementById('preference_global_fontrol_logsSecondColumn')].filter(elt => !!elt);
  const infobulleInput = document.getElementById('preference_control_200');
  const mainMenu = document.getElementById('ingame_menu_content');
  const settings = document.getElementById('pagesection_options');

  if (!settings || !mainMenu || !infobulleInput || histoInputs.length !== 2) {
    setTimeout(() => buildOptions(config, gameName, gameConfig), 500);
    return;
  }

  const mainPrefTitle = mainMenu.getElementsByTagName('h2')[0];
  const secondPrefTitle = settings.getElementsByTagName('h2')[0];

  // Add an option for floating menu
  const optionFloatingGameSelected = config.isGameFloatingMenu(gameName) ? ' selected="selected"' : ' ';
  const optionFloatingAlwaysSelected = config.isGlobalFloatingMenu() ? ' selected="selected"' : ' ';
  const optionFloatingGame = '<option value="2"' + optionFloatingGameSelected + '>' + chrome.i18n.getMessage("optionFloatingGame") + '</option>'
  const optionFloatingAlways = '<option value="3"' + optionFloatingAlwaysSelected + '>' + chrome.i18n.getMessage("optionFloatingAlways") + '</option>'
  const checkFloating = (evt) => {
    if (evt.target.value === '3') {
      setFloatingRightMenu(gameConfig, true);
      config.setGameFloatingMenu(gameName, false);
      config.setGlobalFloatingMenu(true);
    } else if (evt.target.value === '2') {
      setFloatingRightMenu(gameConfig, true);
      config.setGameFloatingMenu(gameName, true);
      config.setGlobalFloatingMenu(false);
    } else {
      setFloatingRightMenu(gameConfig, false);
      config.setGameFloatingMenu(gameName, false);
      config.setGlobalFloatingMenu(false);
    }
  };
  histoInputs.forEach(input => {
    input.insertAdjacentHTML('beforeend', optionFloatingGame);
    input.insertAdjacentHTML('beforeend', optionFloatingAlways);
    input.addEventListener('change', checkFloating);
    input.addEventListener('click', (evt) => evt.stopPropagation());
  });

  // Add a parameter for left menu
  if (gameConfig) {
    const displayMenu = config.isLeftMenuEnabled(gameName) ? '1' : '0';
    const toggleDisplayMenu = () => {
      const enable = !config.isLeftMenuEnabled(gameName);
      config.setLeftMenuEnabled(gameName, enable);
      buildLeftMenu(enable);
      buildLeftMenuCss(enable);
      document.getElementById('cde_menu_1').value = enable ? '1' : '0';
      document.getElementById('cde_menu_2').value = enable ? '1' : '0';
    };
    const displayLeftMenuText = chrome.i18n.getMessage("optionLeftMenu");
    buildOption(mainPrefTitle, displayLeftMenuText, 'cde_menu_1', displayMenu, infobulleInput[0].text, infobulleInput[1].text, toggleDisplayMenu);
    buildOption(secondPrefTitle, displayLeftMenuText, 'cde_menu_2', displayMenu, infobulleInput[0].text, infobulleInput[1].text, toggleDisplayMenu);
  }

  // Add a parameter for friends activity
  const displayActivity = config.isOnlineMessagesEnabled() ? '1' : '0';
  const toggleFriendsActivity = () => {
    const enable = !config.isOnlineMessagesEnabled();
    config.setOnlineMessagesEnabled(enable);
    document.getElementById('cde_activity_1').value = enable ? '1' : '0';
    document.getElementById('cde_activity_2').value = enable ? '1' : '0';
  };
  const displayActivityText = chrome.i18n.getMessage("optionFriendsActivity");
  buildOption(mainPrefTitle, displayActivityText, 'cde_activity_1', displayActivity, infobulleInput[0].text, infobulleInput[1].text, toggleFriendsActivity);
  buildOption(secondPrefTitle, displayActivityText, 'cde_activity_2', displayActivity, infobulleInput[0].text, infobulleInput[1].text, toggleFriendsActivity);
};

if (pageInfo[0].startsWith('bug')) {
  setTimeout(initDevelopperUI, 1000);
} else if (pageInfo.length >= 2 && isNumber(pageInfo[0])) {
  const gameName = pageInfo[1];
  const config = new Configuration();

  config.init().then(() => {
    gameConfig = config.getGameConfig(gameName);

    if (document.getElementById("cde_bga_ext")) {
      console.log('[bga extension] extension is deprecated => disabled');
      return;
    }

    const style = document.createElement('style');
    style.innerHTML = "#lrf-bga-extension { display: none; }";
    document.head.appendChild(style);

    if (!config.isOnlineMessagesEnabled()) {
      setTimeout(initlogObserver, 1000);
    }
    if (config.isGlobalFloatingMenu() || config.isGameFloatingMenu(gameName)) {
      setFloatingRightMenu(gameConfig, true);
    }

    buildOptions(config, gameName, gameConfig);

    if (!gameConfig) {
      console.log(`[bga extension] No configuration found for game ${gameName}`);
      return;
    }

    initLeftMenu(config.isLeftMenuEnabled(gameName));
  });
};