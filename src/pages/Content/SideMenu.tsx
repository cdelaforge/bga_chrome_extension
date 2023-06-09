import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Game } from "../../config/Configuration";
import SideMenuItem from "./SideMenuItem";
import PlayerIcon from "./PlayerIcon";
import CloseIcon from "./Icons/CloseIcon";
import SandwichIcon from "./Icons/SandwitchIcon";
import Avatar from "./Avatar";
import { Player } from "./Misc";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  gap: 0.8em;
`;

const TopArrowIcon = () => {
  return (
    <svg width="32" height="32" viewBox="-60 0 640 540">
      <g xmlns="http://www.w3.org/2000/svg" transform="translate(0,-540.3622)">
        <path fill="#222222" stroke="#222222" strokeWidth={38.88000107} d="M 439.28228,860.51096 256.00063,677.22934 72.71772,860.51096 l 54.98539,54.9841 128.29752,-128.29752 128.29622,128.29752 z" id="path3766-1" inkscape:connector-curvature="0" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" sodipodi:nodetypes="ccccccc" />
      </g>
    </svg>
  );
};

interface SideMenuProps {
  players: [Player],
  panel: string,
  gameConfig: Game,
}

const SideMenu = (props: SideMenuProps) => {
  const { players, gameConfig } = props;
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState(gameConfig.position === 'bottom' ? 'bottom' : 'top');
  const [zoomVisible, setZoomVisible] = useState(false);
  const [buttonsOrder, setButtonsOrder] = useState('');

  const setMenuPosition = () => {
    if (gameConfig.position === 'auto') {
      const isMobile = document.body.classList.contains('mobile_version');
      setPosition(isMobile ? 'bottom' : 'top');
    }

    const isZoomVisible = document.getElementById('globalaction_zoom_wrap')?.style.display === 'inline-block';
    setZoomVisible(isZoomVisible);
  };

  useEffect(() => {
    setMenuPosition();
    window.addEventListener('resize', setMenuPosition);
    const timer = setInterval(getButtonsOrder, 1000);
    return () => {
      window.removeEventListener('resize', setMenuPosition);
      clearInterval(timer);
    };
  });

  useEffect(() => {
    const barContainer = document.getElementById('bga_extension_sidebar');

    if (barContainer) {
      if (position === 'top') {
        barContainer.style.top = gameConfig.positionTop || '150px';
        barContainer.style.bottom = '';
      } else if (gameConfig.positionBottom === 'auto') {
        barContainer.style.top = '';
        barContainer.style.bottom = zoomVisible ? '70px' : '10px';
      } else {
        barContainer.style.top = '';
        barContainer.style.bottom = gameConfig.positionBottom || '70px';
      }
    }
  }, [position, zoomVisible, gameConfig.positionTop, gameConfig.positionBottom]);

  const scrollToTop = () => {
    const element = document.getElementById("page-content");
    const topBar = document.getElementById("topbar");
    element && topBar && console.log(element.getBoundingClientRect().top + " " + document.body.getBoundingClientRect().top + " " + topBar.getBoundingClientRect().height);
    element && topBar && window.scrollTo({
      behavior: 'smooth',
      top: topBar.getBoundingClientRect().height + 2,
    });
  };

  const toggleMenu = () => setVisible(!visible);

  const getButtonsOrder = () => {
    const toSort = players.map(p => {
      const id = gameConfig.playerPanel.replace('{{player_id}}', p.id);
      const element = document.getElementById(id);
      return {
        id,
        pos: element?.getBoundingClientRect().top || 0,
      }
    });

    if (gameConfig.boardPanel) {
      toSort.push({
        id: gameConfig.boardPanel,
        pos: document.getElementById(gameConfig.boardPanel)?.getBoundingClientRect().top || 0
      });
    }

    toSort.sort((a, b) => a.pos < b.pos ? - 1 : 1);
    setButtonsOrder(toSort.map(a => a.id).join('|'))
  };

  const getButtons = () => {
    const elements: Record<string, JSX.Element> = {};

    players.forEach(p => {
      elements[gameConfig.playerPanel.replace('{{player_id}}', p.id)] = <PlayerIcon key={`item_${p.id}`} player={p} gameConfig={gameConfig} />;
    });

    if (gameConfig.boardPanel) {
      const fakePlayer = {
        fake: true,
        id: gameConfig.boardPanel,
        name: chrome.i18n.getMessage('sideMenuMainBoard'),
        avatar: 'board',
        color: '#ffffff'
      }

      elements[gameConfig.boardPanel] = <PlayerIcon key={gameConfig.boardPanel} player={fakePlayer} gameConfig={gameConfig} />;
    }

    return buttonsOrder.split('|').map(id => elements[id]);
  };

  return (
    <Container key={`menu_${buttonsOrder}`}>
      {position === 'top' && <SideMenuItem onClick={toggleMenu}>
        <Avatar backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow}>
          {visible && <CloseIcon />}
          {!visible && <SandwichIcon />}
        </Avatar>
      </SideMenuItem>}
      {visible && <SideMenuItem onClick={scrollToTop}>
        <Avatar backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow}>
          <TopArrowIcon />
        </Avatar>
      </SideMenuItem>}
      {visible && getButtons()}
      {position === 'bottom' && <SideMenuItem onClick={toggleMenu}>
        <Avatar backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow}>
          {visible && <CloseIcon />}
          {!visible && <SandwichIcon />}
        </Avatar>
      </SideMenuItem>}
    </Container>
  );
};

export default SideMenu;