import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Switch from "react-switch";

import { isNumber } from '../../helpers/Misc';
import Configuration from "../../config/Configuration";
import logo from '../../assets/img/icon-34.png';

const BGA_URL = 'https://boardgamearena.com/';
const config = new Configuration();

const Header = styled.div`
  width: 350px;
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
  justify-content: center;
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

  useEffect(() => {
    try {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        if (tabs.length > 0) {
          setUrl(tabs[0].url);
        } else {
          setUrl('other');
        }
      });

      config.init().then(() => setGamesList(config.getGamesList())).error(() => setGamesList([]));
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
        if (!config.isGameEnabled(gameName)) {
          setActivated(false);
        }
      }
    }
  }, [gamesList, gameName]);

  const toggleActivated = () => {
    setActivated(!activated);
    config.setGameEnabled(gameName, !activated);
  };

  const getBody = () => {
    if (!gameName) {
      return <span>The current page is not a BGA game</span>
    }

    if (gameConfig) {
      return (
        <>
          <span>Display menu for this game</span>
          <Switch onChange={toggleActivated} checked={activated} />
        </>
      );
    }

    return <span>The current page is not a managed BGA game</span>
  };

  const getFooter = () => {
    if (gameConfig) {
      return <span>You must reload the page if you change the configuration</span>;
    }

    return <></>;
  }

  return (
    <>
      <Header>
        <img src={logo} className="App-logo" alt="logo" />
        <span>BGA Extension</span>
      </Header>
      <Body>
        {getBody()}
      </Body>
      <Footer>
        {getFooter()}
      </Footer>
    </>
  );
};

export default Popup;