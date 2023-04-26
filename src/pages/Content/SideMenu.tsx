import React, { useState } from 'react';
import styled from 'styled-components';

import { Game } from "../../config/Configuration";
import SideMenuItem from "./SideMenuItem";
import PlayerIcon from "./PlayerIcon";
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

const SandwichIcon = () => {
  return (
    <svg width="32" height="32" viewBox="-30 -50 160 180">
      <rect fill="#222222" width="100" height="20"></rect>
      <rect fill="#222222" y="30" width="100" height="20"></rect>
      <rect fill="#222222" y="60" width="100" height="20"></rect>
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg width="32" height="32" viewBox="-40 -40 200 200">
      <g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M90.914,5.296c6.927-7.034,18.188-7.065,25.154-0.068 c6.961,6.995,6.991,18.369,0.068,25.397L85.743,61.452l30.425,30.855c6.866,6.978,6.773,18.28-0.208,25.247 c-6.983,6.964-18.21,6.946-25.074-0.031L60.669,86.881L30.395,117.58c-6.927,7.034-18.188,7.065-25.154,0.068 c-6.961-6.995-6.992-18.369-0.068-25.397l30.393-30.827L5.142,30.568c-6.867-6.978-6.773-18.28,0.208-25.247 c6.983-6.963,18.21-6.946,25.074,0.031l30.217,30.643L90.914,5.296L90.914,5.296z" />
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
  const [visible, setVisible] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    });
  };

  const toggleMenu = () => {
    setVisible(!visible);
  };

  return (
    <Container>
      {props.gameConfig.position === 'top' && <SideMenuItem onClick={toggleMenu}>
        <Avatar backColor={props.gameConfig.iconBackground} borderColor={props.gameConfig.iconBorder} shadowColor={props.gameConfig.iconShadow}>
          {visible && <CloseIcon />}
          {!visible && <SandwichIcon />}
        </Avatar>
      </SideMenuItem>}
      {visible && <SideMenuItem onClick={scrollToTop}>
        <Avatar backColor={props.gameConfig.iconBackground} borderColor={props.gameConfig.iconBorder} shadowColor={props.gameConfig.iconShadow}>
          <TopArrowIcon />
        </Avatar>
      </SideMenuItem>}
      {visible && props.players.map((p) => <PlayerIcon key={`item_${p.id}`} player={p} gameConfig={props.gameConfig} />)}
      {props.gameConfig.position === 'bottom' && <SideMenuItem onClick={toggleMenu}>
        <Avatar backColor={props.gameConfig.iconBackground} borderColor={props.gameConfig.iconBorder} shadowColor={props.gameConfig.iconShadow}>
          {visible && <CloseIcon />}
          {!visible && <SandwichIcon />}
        </Avatar>
      </SideMenuItem>}
    </Container>
  );
};

export default SideMenu;