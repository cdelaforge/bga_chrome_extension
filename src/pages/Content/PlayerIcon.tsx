import React, { useState } from 'react';
import styled from 'styled-components';
import fontColorContrast from "font-color-contrast";
import rgbHex from "rgb-hex";

import { Game } from "../../config/Configuration";
import Avatar from "./Avatar";
import SideMenuItem from "./SideMenuItem";
import { Player, getPlayerPanelId } from "./Misc";
import BoardIcon from "./Icons/BoardIcon";

const PlayerName = styled.div<{ backColor: string, borderColor: string, shadowColor: string, textColor: string, hover: boolean }>`
  background-color: ${(props) => props.backColor};
  border-radius: 25px;
  height: 32px;
  line-height: 32px;
  border: 3px solid ${(props) => props.borderColor};
  color: ${(props) => props.textColor};
  font-weight: bold;
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
  gameConfig: Game,
  index: number
}

const PlayerIcon = (props: PlayerIconProps) => {
  const [over, setOver] = useState(false);
  const { player, gameConfig, index } = props;
  const eltId = player.fake ? player.id : getPlayerPanelId(gameConfig, player, index);

  const scrollToPlayer = () => {
    const id = eltId;
    const element = document.getElementById(id);
    const titleBar = document.getElementById("page-title");
    const topBar = document.getElementById("topbar");
    let zoom = (document.getElementById('page-content')?.style as any).zoom || 1;
    let customZoom = 1;

    if (!Number(zoom)) {
      zoom = 1;
    }

    try {
      if (gameConfig.customZoomContainer) {
        customZoom = (getComputedStyle(document.getElementById(gameConfig.customZoomContainer) as any) as any).zoom || 1;
      }
    }
    catch (error) {
      console.error('[bga extension] Error getting custom zoom', error);
    }

    if (!element || !topBar || !titleBar) {
      return;
    }

    const currentPos = window.scrollY;
    const minTop = topBar.getBoundingClientRect().height + 20;
    if (currentPos < minTop) {
      setTimeout(scrollToPlayer, 500);
    }

    const offset = player.fake ? gameConfig.boardPanelOffset : gameConfig.playerPanelOffset;

    window.scrollTo({
      behavior: 'smooth',
      top: (((element.getBoundingClientRect().top - titleBar.getBoundingClientRect().height) * customZoom) - (offset / customZoom)) * zoom - document.body.getBoundingClientRect().top,
    });
  };

  const getTextColor = (playerColor: string | undefined) => {
    if (playerColor) {
      try {
        return fontColorContrast(rgbHex(playerColor));
      } catch (error) { }
    }

    return '#000000';
  };

  return (
    <SideMenuItem onClick={scrollToPlayer}>
      <Avatar backColor={gameConfig.iconBackground} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow} onMouseOver={() => setOver(true)} onMouseOut={() => setOver(false)}>
        {player.fake ? <BoardIcon /> : <img src={`${player.avatar}`} alt={player.name} />}
      </Avatar>
      <PlayerName backColor={player.color} borderColor={gameConfig.iconBorder} shadowColor={gameConfig.iconShadow} textColor={getTextColor(player.color)} hover={over}>{player.name}</PlayerName>
    </SideMenuItem>
  );
};

export default PlayerIcon;