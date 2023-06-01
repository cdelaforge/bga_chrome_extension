import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Switch from "react-switch";

import { isNumber } from '../../helpers/Misc';
import Configuration from '../../config/Configuration';
import logo from '../../assets/img/icon-34.png';

const BGA_URL = 'https://boardgamearena.com/';
const config = new Configuration();

const Header = styled.div`
  width: 600px;
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

const Label = styled.span`
  color: #000000;
`;

const LabelGrey = styled.span`
  color: #D3D3D3;
`;

const Popup = () => {
  const [url, setUrl] = useState(undefined);
  const [gameName, setGameName] = useState();
  const [gamesList, setGamesList] = useState();
  const [gameConfig, setGameConfig] = useState();
  const [activated, setActivated] = useState(true);
  const [dispMessage, setDispMessage] = useState(false);
  const [floatingMenuGlobal, setFloatingMenuGlobal] = useState(false);
  const [floatingMenuGame, setFloatingMenuGame] = useState(false);
  const [modification, setModification] = useState(false);

  useEffect(() => {
    try {
      config.init().then(() => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
          if (tabs.length > 0) {
            setUrl(tabs[0].url);
          } else {
            setUrl('other');
          }
        });

        setDispMessage(config.isOnlineMessagesEnabled());
        setFloatingMenuGlobal(config.isGlobalFloatingMenu());
        setGamesList(config.getGamesList());
      }).error(() => setGamesList([]));
    }
    catch (error) { }
  }, []);

  useEffect(() => {
    if (url && url.startsWith(BGA_URL)) {
      const path = url.substring(BGA_URL.length).split('?')[0];
      const params = path.split('/');
      console.log("url", url);
      if (isNumber(params[0])) {
        setGameName(params[1]);
        setFloatingMenuGame(config.isGameFloatingMenu(params[1]));
      }
    }
  }, [url]);

  useEffect(() => {
    if (gamesList) {
      const currentGame = gamesList.find(g => g.name === gameName);
      if (currentGame) {
        setGameConfig(currentGame);
        setActivated(config.isLeftMenuEnabled(gameName));
      }
    }
  }, [gamesList, gameName]);

  const toggleLeftMenu = () => {
    setActivated(!activated);
    setModification(true);
    config.setLeftMenuEnabled(gameName, !activated);
  };

  const toggleDispMessage = () => {
    setDispMessage(!dispMessage);
    setModification(true);
    config.setOnlineMessagesEnabled(!dispMessage);
  };

  const toggleFloatingMenuGlobal = () => {
    setFloatingMenuGlobal(!floatingMenuGlobal);
    setModification(true);
    config.setGlobalFloatingMenu(!floatingMenuGlobal);
  };

  const toggleFloatingMenuGame = () => {
    setFloatingMenuGame(!floatingMenuGame);
    setModification(true);
    config.setGameFloatingMenu(gameName, !floatingMenuGame);
  };

  const getDispStatusConfig = () => {
    return (
      <>
        <span>{chrome.i18n.getMessage("popupDisplayStatusMessages")}</span>
        <Switch onChange={toggleDispMessage} checked={dispMessage} />
      </>
    );
  }

  const getFloatingMenuConfigGlobal = () => {
    return (
      <>
        <Label>{chrome.i18n.getMessage("popupFloatingMenu")}</Label>
        <Switch onChange={toggleFloatingMenuGlobal} checked={floatingMenuGlobal} />
      </>
    );
  }

  const getFloatingMenuConfigForGame = () => {
    if (gameName && !floatingMenuGlobal) {
      return (
        <>
          <Label>{chrome.i18n.getMessage("popupFloatingMenuGame")}</Label>
          <Switch onChange={toggleFloatingMenuGame} checked={floatingMenuGame} />
        </>
      );
    }

    return (
      <>
        <LabelGrey>{chrome.i18n.getMessage("popupFloatingMenuGame")}</LabelGrey>
        <Switch checked={gameName && floatingMenuGlobal} disabled={true} />
      </>
    );
  };

  const getLeftMenuConfigForGame = () => {
    if (gameConfig) {
      return (
        <>
          <Label>{chrome.i18n.getMessage("popupDisplayLeftMenu")}</Label>
          <Switch onChange={toggleLeftMenu} checked={activated} />
        </>
      );
    }

    return (
      <>
        <LabelGrey>{chrome.i18n.getMessage("popupDisplayLeftMenu")}</LabelGrey>
        <Switch checked={false} disabled={true} />
      </>
    );
  };

  const getFooter = () => {
    if (modification) {
      return <Label>{chrome.i18n.getMessage("popupReloadInstruction")}</Label>;
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
      <Body>{getFloatingMenuConfigGlobal()}</Body>
      <Body>{getFloatingMenuConfigForGame()}</Body>
      <Body>{getLeftMenuConfigForGame()}</Body>
      <Footer>{getFooter()}</Footer>
    </>
  );
};

export default Popup;