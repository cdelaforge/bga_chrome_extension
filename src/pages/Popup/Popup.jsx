import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Switch from "react-switch";

import { isNumber } from '../../helpers/Misc';
import Configuration from '../../config/Configuration';
import logo from '../../assets/img/icon-34.png';

const BGA_URL = 'https://boardgamearena.com/';
const config = new Configuration();

const Header = styled.div`
  width: 500px;
  font-size: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-weight: bold;
  & > img {
    padding-top: 5px;
  }
`;

const Body = styled.div`
  padding: 0.5em;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  line-height: 24px;
  gap: 0.5em;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
`;

const Popup = () => {
  const [url, setUrl] = useState(undefined);
  const [gameName, setGameName] = useState();
  const [gamesList, setGamesList] = useState();
  const [gameConfig, setGameConfig] = useState();
  const [activated, setActivated] = useState(true);
  const [dispMessage, setDispMessage] = useState(false);
  const [floatingMenu, setFloatingMenu] = useState(false);
  const [modification, setModification] = useState(false);

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (tabs.length > 0) {
          setUrl(tabs[0].url);
        } else {
          setUrl('other');
        }
      });

      config.init().then(() => {
        setDispMessage(config.isOnlineMessagesEnabled());
        setFloatingMenu(config.isFloatingRightMenu());
        setGamesList(config.getGamesList());
      }).error(() => setGamesList([]));
    }
    catch (error) { }
  }, []);

  useEffect(() => {
    if (url && url.startsWith(BGA_URL)) {
      const path = url.substring(BGA_URL.length).split('?')[0];
      const params = path.split('/');

      if (isNumber(params[0])) {
        setGameName(params[1]);
      }
    }
  }, [url]);

  useEffect(() => {
    if (gamesList) {
      const currentGame = gamesList.find(g => g.name === gameName);
      if (currentGame) {
        setGameConfig(currentGame);
        setActivated(config.isGameEnabled(gameName));
      }
    }
  }, [gamesList, gameName]);

  const toggleActivated = () => {
    setActivated(!activated);
    setModification(true);
    config.setGameEnabled(gameName, !activated);
  };

  const toggleDispMessage = () => {
    setDispMessage(!dispMessage);
    setModification(true);
    config.setOnlineMessagesEnabled(!dispMessage);
  };

  const toggleFloatingMenu = () => {
    setFloatingMenu(!floatingMenu);
    setModification(true);
    config.setFloatingRightMenu(!floatingMenu);
  };

  const getDispStatusConfig = () => {
    return (
      <>
        <span>{chrome.i18n.getMessage("popupDisplayStatusMessages")}</span>
        <Switch onChange={toggleDispMessage} checked={dispMessage} />
      </>
    );
  }

  const getFloatingMenuConfig = () => {
    return (
      <>
        <span>{chrome.i18n.getMessage("popupFloatingMenu")}</span>
        <Switch onChange={toggleFloatingMenu} checked={floatingMenu} />
      </>
    );
  }

  const getBody = () => {
    if (!gameName) {
      return (
        <>
          <span>{chrome.i18n.getMessage("popupNotAGame")}</span>
          <Switch checked={false} disabled={true} />
        </>
      );
    }

    if (gameConfig) {
      return (
        <>
          <span>{chrome.i18n.getMessage("popupDisplayLeftMenu")}</span>
          <Switch onChange={toggleActivated} checked={activated} />
        </>
      );
    }

    return (
      <>
        <span>{chrome.i18n.getMessage("popupNotAManagedGame")}</span>
        <Switch checked={false} disabled={true} />
      </>
    );
  };

  const getFooter = () => {
    if (modification) {
      return <span>{chrome.i18n.getMessage("popupReloadInstruction")}</span>;
    }

    return <></>;
  }

  return (
    <>
      <Header>
        <img src={logo} className="App-logo" alt="logo" />
        <span>BGA Extension</span>
      </Header>
      <Body>{getDispStatusConfig()}</Body>
      <Body>{getFloatingMenuConfig()}</Body>
      <Body>{getBody()}</Body>
      <Footer>{getFooter()}</Footer>
    </>
  );
};

export default Popup;