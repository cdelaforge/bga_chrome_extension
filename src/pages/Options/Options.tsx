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

const Title = styled.div`
  width: 100%;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1em;
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

const GameList = styled.div`
  display: flex;
  flex-flow: column;
`;

const GameItem = styled.div<{ selected: boolean }>`
  line-height: 24px;
  padding-left: 1em;
  cursor: pointer;
  ${(props) => props.selected ? 'background: #c0c4d1;' : ''}
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

  const serialize = (game: Game) => {
    return JSON.stringify(game, ['name', 'position', 'positionTop', 'positionBottom', 'left', 'boardPanel', 'boardPanelOffset', 'playerPanel', 'playerPanelOffset', 'iconBackground', 'iconBorder', 'iconColor', 'iconShadow', 'customZoomContainer', 'css'], 2);
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

  return (
    <Main>
      <GameConfigArea>
        <Title>Navigation between players' boards - Managed games list</Title>
        <Container>
          <GameListContainer>
            <GameList>{list.map((g, i) => <GameItem key={`game_${i}`} selected={selected.name === g.name} onClick={() => setSelected(g)}>{g.name}</GameItem>)}</GameList>
          </GameListContainer>
          <ColContainer>
            <GameConfigContainer>
              <TextArea value={text} onChange={(evt) => setText(evt.target.value)} />
            </GameConfigContainer>
            <RowContainer>
              <button style={{ width: '100px' }} onClick={duplicate}>Duplicate</button>
              <button disabled={!couldReset} style={{ width: '100px' }} onClick={reset}>Reset</button>
              <button disabled={!couldDelete} style={{ width: '100px' }} onClick={reset}>Delete</button>
              <button disabled={!changed} style={{ width: '100px' }} onClick={save}>Save</button>
            </RowContainer>
          </ColContainer>
        </Container>
        <Warning>
          Warning: only change the configuration on this screen if you really know what you're doing ;)
        </Warning>
      </GameConfigArea>
    </Main>
  );
};

export default Options;
