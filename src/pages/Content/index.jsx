import React from 'react';
import { createRoot } from 'react-dom/client';
import Configuration from '../../config/Configuration';
import shouldFilter from '../../config/FilteredLogs';
import SideMenu from './SideMenu';
import RightMenu from './RightMenu';
import Templates from './Templates';
import { isNumber, addLocationChangeListener } from '../../helpers/Misc';

let gameConfig;
let playersData;
let currentObserver;

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

  currentObserver = new MutationObserver(() => {
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

  currentObserver.observe(logsContainer, { childList: true, subtree: true });
};

const createHiddenGameStyle = (content) => {
  const hiddenStyleId = 'cde-hidden-games-style';

  let style = document.getElementById(hiddenStyleId);

  if (!style) {
    style = document.createElement('style');
    style.id = hiddenStyleId;
    document.head.appendChild(style);
  }

  style.innerHTML = content;
  return style;
};

const initGameListObserver = (config, page) => {
  const mainElt = document.querySelector('#overall-content');

  if (!mainElt) {
    setTimeout(() => initGameListObserver(config, page), 100);
    return;
  }

  const style = createHiddenGameStyle(config.getHiddenGamesStyle(page));
  const updateHiddenGameStyle = () => style.innerHTML = config.getHiddenGamesStyle(page);

  const hideGame = (name) => {
    config.hideGame(name);
    updateHiddenGameStyle();
  };

  currentObserver = new MutationObserver(() => {
    const buttons = document.querySelectorAll('.bgabutton_blue[href*="/gamepanel?game="]');

    buttons.forEach(but => {
      const container = but.parentNode;

      if (!but.classList.contains('bgabutton_medium') && !container.lastChild.classList.contains('bgabutton_red')) {
        but.style.minWidth = '100px';
        container.style.boxShadow = 'none';

        const removeBut = document.createElement('a');
        removeBut.className = 'bgabutton bgabutton_red bga-button-inner flex-1 truncate';
        removeBut.style.padding = '5px 0px 0px 10px';
        removeBut.style.margin = '0px 0px 0px 5px';
        removeBut.style.minWidth = '32px';
        removeBut.innerHTML = '<div class="flex items-center"><div class="text-center"><i class="fa fa-trash"/></div></div>';
        removeBut.onclick = (evt) => { hideGame(but.href.split('=')[1]); evt.stopPropagation(); }
        container.appendChild(removeBut);
      }
    });
  });

  currentObserver.observe(mainElt, { childList: true, subtree: true });
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

const initDevelopperUI = (config) => {
  if (document.getElementById('last_reports') || document.getElementById('ext_templates')) {
    // display of reports list, or templates list already displayed, nothing to do
    return;
  }

  const butStatus = document.getElementById('change_bug_status_awaiting') || document.getElementById('change_bug_status_open');
  const reportArea = document.getElementById('report_log');

  if (!butStatus || !reportArea || !reportArea.getBoundingClientRect().x) {
    console.log('[bga extension] page is loading...');
    setTimeout(() => initDevelopperUI(config), 100);
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

    createRoot(container).render(<Templates config={config} gameName={gameName} />);
  }
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

const initChatIcon = (config) => {
  const chatIconId = 'bga_extension_chat_icon';
  const friendsElt = document.querySelector('.bga-friends-icon');

  if (!friendsElt) {
    setTimeout(() => initChatIcon(config), 100);
    return;
  }

  const container = friendsElt.parentNode;

  if (!document.getElementById(chatIconId)) {
    const chatElt = document.createElement('div');
    chatElt.id = chatIconId;
    chatElt.innerHTML = '<i class="fa fa-comments" style="font-size: 32px; cursor: pointer;"></i>';
    chatElt.onclick = () => config.toggleGeneralChatHidden();
    container.parentNode.insertBefore(chatElt, container);

    const sepElt = document.createElement('div');
    sepElt.className = 'ml-1 tablet:ml-6';
    container.parentNode.insertBefore(sepElt, container);

    setChatStyle(config);
  }
};

const setChatStyle = (config) => {
  const chatStyleId = 'cde-chat-style';

  let style = document.getElementById(chatStyleId);

  if (!style) {
    style = document.createElement('style');
    style.id = chatStyleId;
    document.head.appendChild(style);
  }

  style.innerHTML = config.getChatStyle();
};

const manageLocationChange = (pathname) => {
  console.log('[bga extension] load path', pathname);

  const pageInfo = pathname.substring(1).split('/');

  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }

  if (pageInfo.length >= 2 && isNumber(pageInfo[0])) {
    const gameName = pageInfo[1];
    gameConfig = config.getGameConfig(gameName);

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
  } else {
    initChatIcon(config);

    if (pageInfo[0].startsWith('gamelist')) {
      initGameListObserver(config, 'gamelist');
    } else if (pageInfo[0].startsWith('lobby')) {
      initGameListObserver(config, 'lobby');
    } else if (pageInfo[0].startsWith('bug')) {
      initGameListObserver(config, 'other');
      initDevelopperUI(config);
    } else {
      initGameListObserver(config, 'other');
    }
  }
};

const config = new Configuration();

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

config.init().then(() => {
  if (!getCookie("deprecation_message")) {
    const style = document.createElement('style');
    style.innerHTML = ".deprecation-banner { position: relative; margin: 1em; background: #fff; color:#000; } .darkmode .deprecation-banner {  background: #000; color:#fff; }";
    document.head.appendChild(style);

    const div = document.createElement("DIV");
    div.id = "lrf-bga-extension";
    div.style.position = "relative";
    div.style.margin = "1em";
    div.style.paddingRight = "30px";
    div.className = "deprecation-banner ";

    const uninstallLink = `<a target="_blank" href="https://chromewebstore.google.com/detail/boardgamearena-extension/jdiekdaapekbemobdeacplcfmignidoc?hl=fr">${chrome.i18n.getMessage("thisLink")}</a>`;
    const installLink = `<a target="_blank" href="https://chromewebstore.google.com/detail/bga-chrome-extension/kchnhmpeopknjdjejognciimepllkacb?hl=fr">${chrome.i18n.getMessage("thisExtension")}</a>`;
    const forumLink = `<a href="https://boardgamearena.com/forum/viewtopic.php?t=30509">${chrome.i18n.getMessage("onTheForum")}</a>`;
    const warningMessage = chrome.i18n.getMessage("deprecatedWarning").replace("{0}", uninstallLink).replace("{1}", installLink).replace("{2}", forumLink);

    const warning = document.createElement("DIV");
    warning.style.textAlign = "center";
    warning.style.lineHeight = "32px";
    warning.innerHTML = '<span style="color: red; font-size: 32px;">⚠</span>&nbsp;' + warningMessage;
    div.appendChild(warning);

    const closeButton = document.createElement("DIV");
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "24px";
    closeButton.style.cursor = "pointer";
    closeButton.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true"></i>';
    div.appendChild(closeButton);

    const content = document.getElementById("overall-content");
    content.insertBefore(div, content.firstChild);

    closeButton.onclick = () => {
      div.style.display = "none";
      setCookie("deprecation_message", "displayed", 1);
    };
  }

  if (document.getElementById("cde_bga_ext")) {
    console.log('[bga extension] extension is deprecated => disabled');
    return;
  }

  document.addEventListener('bga_ext_update_config', (data) => {
    if (data.detail.key === 'hideGeneralChat') {
      setChatStyle(config);
    }
  });

  addLocationChangeListener(manageLocationChange);
  manageLocationChange(window.location.pathname);
});

document.addEventListener('bga_ext_get_config', () => {
  const exportConfig = () => {
    if (config.isInitialized()) {
      const jsonData = config.export();
      console.log('[bga extension] export data from deprecated extension', jsonData);
      document.dispatchEvent(new CustomEvent('bga_ext_set_config', { detail: jsonData }));
    } else {
      setTimeout(exportConfig, 100);
    }
  };
  exportConfig();
});