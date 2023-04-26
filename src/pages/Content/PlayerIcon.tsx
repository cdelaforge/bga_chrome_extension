import React, { useState } from 'react';
import styled from 'styled-components';
import { Game } from "../../config/Configuration";
import Avatar from "./Avatar";
import SideMenuItem from "./SideMenuItem";
import { Player } from "./Misc";

const PlayerName = styled.div<{ backColor: string, borderColor: string, shadowColor: string, textColor: string, hover: boolean }>`
  background-color: #ffffff;
  border-radius: 25px;
  height: 32px;
  line-height: 32px;
  border: 3px solid${(props) => props.borderColor};
  color: ${(props) => props.textColor};
  box-shadow: 0px 0px 10px 0px ${(props) => props.shadowColor};
  position: relative;
  left: -32px;
  z-index: 1;
  box-sizing: content-box;
  overflow: hidden;
  ${(props) => props.hover ? 'padding-left: 40px; padding-right: 16px; width: auto; visibility: visible;' : 'padding-left: 0px; padding-right: 0px; width: 0px; visibility: hidden;'}
  transition: all .3s linear;
`;

interface PlayerIconProps {
  player: Player,
  gameConfig: Game
}

const PlayerIcon = (props: PlayerIconProps) => {
  const [over, setOver] = useState(false);
  const { player, gameConfig } = props;

  const scrollToPlayer = () => {
    const id = gameConfig.playerPanel.replace('{{player_id}}', player.id);
    const element = document.getElementById(id);

    element && window.scrollTo({
      behavior: 'smooth',
      top: element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - gameConfig.playerPanelOffset,
    });
  };

  return (
    <SideMenuItem title={player.name} onClick={() => scrollToPlayer()}>
      <Avatar backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow} onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)}>
        <img src={`${player.avatar}`} alt={player.name} />
      </Avatar>
      <PlayerName backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow} textColor={player.color} hover={over}>{player.name}</PlayerName>
    </SideMenuItem>
  );
};

export default PlayerIcon;