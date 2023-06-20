import React, { useEffect, useState } from 'react';
import styled from "styled-components";

import Configuration, { Game } from "../../config/Configuration";

const Main = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GameConfigArea = styled.div`
  border: 1px solid #aaaaaa;
  border-radius: 8px;
  width: 860px;
  height: 560px;
  display: flex;
  flex-flow: column;
  gap: 1em;
`;

const LinkArea = styled.div`
  display: flex;
  flex-flow: row;
  gap: 1em;
  padding: 0.5em 0em 0em 2em;
`;

const Link = styled.a<{ selected: boolean }>`
  line-height: 24px;
  text-decoration: none;
  padding: 0px 10px;

  color: rgb(96, 107, 133);
  font-size: 0.875rem;
  ${props => props.selected ? 'border-bottom: 3px solid #0263e0; color: #0263e0;' : ''}
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #aaaaaa;
  box-sizing: border-box;
  margin: 0em 1em;
  line-height: 36px;
`;

const Container = styled.div`
  display: flex;
  flex-flow: row;
  gap: 1em;
  justify-content: center;
`;

const ColContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
  gap: 0.5em;
`;

const RowContainer = styled.div`
  display: flex;
  flex-flow: row;
  gap: 0.5em;
`;

const GameListContainer = styled.div`
  width: 200px;
  height: 400px;
  border: 1px solid #aaaaaa;
  overflow: auto;
`;

const HiddenGameListContainer = styled.div`
  max-height: 400px;
  box-sizing: border-box;
  border: 1px solid #aaaaaa;
  margin: 0em 2em;
  display: flex;
  flex-flow: row wrap;
  justify-content: start;
  padding: 1em;
`;

const HiddenGame = styled.div`
  position: relative;
  margin-right: 5px;
  margin-top: 5px;
  font-size: 13px;
  border: 1px solid #bcd1e1;
  border-radius: 4px;
  line-height: 30px;
  color: #666666;
  background: #cee7f9;
  padding-left: 1em;
  padding-right: 0.5em;
  cursor: default;
  height: 32px;
  gap: 0.5em;
  display: flex;
`;

const HiddenGameClose = styled.div`
  font-weight: bold;
  cursor: pointer;
`;

const GameList = styled.div`
  display: flex;
  flex-flow: column;
`;

const GameItem = styled.div<{ selected: boolean }>`
  line-height: 24px;
  padding-left: 1em;
  cursor: pointer;
  ${(props) => props.selected ? 'background: #cee7f9;' : ''}
`;

const GameConfigContainer = styled.div`
  width: 600px;
  height: 400px;
  border: 1px solid #aaaaaa;
  box-sizing: border-box;
  overflow: hidden;
  padding: 1em;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  box-shadow: none !important;
  outline: none !important;
`;

const Warning = styled.div`
  padding-right: 2em;
  text-align: right;
`;

const Options = (props: { config: Configuration }) => {
  const { config } = props;
  const [list, setList] = useState<Game[]>(config.getGamesList());
  const [selected, setSelected] = useState(list[0]);
  const [changed, setChanged] = useState(false);
  const [text, setText] = useState("");
  const [tabSelected, setTabSelected] = useState('hidden');
  const [hiddenGames, setHiddenGames] = useState<string[]>(config.getHiddenGames());

  const serialize = (game: Game) => {
    return JSON.stringify(game, ['name', 'position', 'top', 'bottom', 'left', 'boardPanel', 'boardPanelOffset', 'playerPanel', 'playerPanelOffset', 'bottomPanel', 'bottomPanelOffset', 'iconBackground', 'iconBorder', 'iconColor', 'iconShadow', 'customZoomContainer', 'css', 'menuCss'], 2);
  };

  useEffect(() => setText(serialize(selected)), [selected])
  useEffect(() => setChanged(serialize(selected) !== text), [selected, text]);
  useEffect(() => {
    const newSelected = list.find(g => g.name === selected.name);
    if (newSelected) {
      setSelected({ ...newSelected });
    } else {
      setSelected(list[0]);
    }
  }, [list, selected.name]);

  const reset = () => {
    setList(config.resetGame(selected.name));
  };

  const save = () => {
    const game = JSON.parse(text);
    setList(config.saveGame(selected.name, game));
    setSelected(game);
  };

  const duplicate = () => {
    const newGame = { ...selected, name: `${selected.name}_copy` };
    setList(config.saveGame(newGame.name, newGame));
    setSelected(newGame);
  };

  const isCustomized = config.isCustomized(selected.name);
  const isDefault = config.isDefault(selected.name);
  const couldReset = changed || (isCustomized && isDefault);
  const couldDelete = isCustomized && !isDefault;

  const getHiddenConfiguration = () => {
    return (
      <>
        <Title>{chrome.i18n.getMessage('optionHiddenTitle')}</Title>
        <HiddenGameListContainer>
          {!hiddenGames.length && <span>{chrome.i18n.getMessage('optionNoHiddenGames')}</span>}
          {hiddenGames.length && hiddenGames.map((game, index) => (
            <HiddenGame key={`game_${index}`}>
              {game}
              <HiddenGameClose onClick={() => setHiddenGames(config.displayGame(game))}>🗙</HiddenGameClose>
            </HiddenGame>
          ))}
        </HiddenGameListContainer>
        <Warning>{chrome.i18n.getMessage('optionHiddenGamesWarning')}</Warning>
      </>
    );
  };

  const getNavigationConfiguration = () => {
    return (
      <>
        <Title>{chrome.i18n.getMessage('optionNavigationTitle')}</Title>
        <Container>
          <GameListContainer>
            <GameList>{list.map((g, i) => <GameItem key={`game_${i}`} selected={selected.name === g.name} onClick={() => setSelected(g)}>{g.name}</GameItem>)}</GameList>
          </GameListContainer>
          <ColContainer>
            <GameConfigContainer>
              <TextArea value={text} onChange={(evt) => setText(evt.target.value)} />
            </GameConfigContainer>
            <RowContainer>
              <button style={{ width: '100px' }} onClick={duplicate}>{chrome.i18n.getMessage('optionDuplicate')}</button>
              <button disabled={!couldReset} style={{ width: '100px' }} onClick={reset}>{chrome.i18n.getMessage('optionReset')}</button>
              <button disabled={!couldDelete} style={{ width: '100px' }} onClick={reset}>{chrome.i18n.getMessage('optionDelete')}</button>
              <button disabled={!changed} style={{ width: '100px' }} onClick={save}>{chrome.i18n.getMessage('optionSave')}</button>
            </RowContainer>
          </ColContainer>
        </Container>
        <Warning>{chrome.i18n.getMessage('optionNavigationWarning')}</Warning>
      </>
    );
  };

  return (
    <Main>
      <GameConfigArea>
        <LinkArea>
          <Link href="#" selected={tabSelected === 'hidden'} onClick={() => setTabSelected('hidden')}>
            {chrome.i18n.getMessage('optionHiddenTab')}
          </Link>
          <Link href="#" selected={tabSelected === 'navigation'} onClick={() => setTabSelected('navigation')}>
            {chrome.i18n.getMessage('optionNavigationTab')}
          </Link>
        </LinkArea>
        {tabSelected === 'hidden' ? getHiddenConfiguration() : getNavigationConfiguration()}
      </GameConfigArea>
    </Main>
  );
};

export default Options;
