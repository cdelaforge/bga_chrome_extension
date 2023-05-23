import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.div`
  display: flex;
  flex-flow: row;
`;

const MenuItemContainer = styled.div<{ active: boolean }>`
  display: flex;
  flex-flow: row;
  gap: 0.3em;
  border: 1px solid black;
  border-radius: 5px;
  margin: 0.3em 0.3em 0 0;
  padding: 0.3em;
  cursor: pointer;
  box-shadow: black 2px 2px 5px 0px;
`;

const RightMenu = () => {
  const [logVisible, setLogVisible] = useState(true);
  const [scoreVisible, setScoreVisible] = useState(true);

  const scoreContent = document.getElementById('right-side-first-part');
  const logContent = document.getElementById('right-side-second-part');

  const setMenuPosition = () => {
    const menuHeader = document.getElementById('cde-floating-menu');
    const height = window.innerHeight;

    if (menuHeader && scoreContent && logContent) {
      const rect = menuHeader.getBoundingClientRect();
      const maxHeight = height - rect.top - 60;
      logContent.style.top = `${rect.top + 55}px`;
      logContent.style.maxHeight = `${maxHeight}px`;
      scoreContent.style.top = logContent.style.top;
      scoreContent.style.maxHeight = logContent.style.maxHeight;
      scoreContent.style.width = (scoreContent.scrollHeight > maxHeight) ? '260px' : '240px';
    } else {
      setTimeout(setMenuPosition, 100);
    }
  };

  useEffect(() => {
    if (scoreContent) {
      scoreContent.style.right = scoreVisible ? '5px' : '-500px';
    }
  }, [scoreContent, scoreVisible]);

  useEffect(() => {
    if (logContent) {
      logContent.style.display = logVisible ? '' : 'none';
    }
  }, [logContent, logVisible]);

  useEffect(() => {
    setLogVisible(false);
    setScoreVisible(false);
  }, []);

  useEffect(() => {
    setMenuPosition();
    window.addEventListener('resize', setMenuPosition);
    window.addEventListener('scroll', setMenuPosition);
    return () => {
      window.removeEventListener('resize', setMenuPosition);
      window.removeEventListener('scroll', setMenuPosition);
    };
  });

  const toggleLogVisible = () => {
    if (logVisible) {
      setLogVisible(false);
    } else {
      setLogVisible(true);
      setScoreVisible(false);
      setMenuPosition();
    }
  }

  const toggleScoreVisible = () => {
    if (scoreVisible) {
      setScoreVisible(false);
    } else {
      setScoreVisible(true);
      setLogVisible(false);
      setMenuPosition();
    }
  }

  return (
    <MenuContainer>
      <MenuItemContainer id='cde-floating-menu-log' onClick={toggleLogVisible} active={logVisible}>
        <i className="fa fa-book"></i>
        {logVisible && <i className="fa fa-caret-up"></i>}
        {!logVisible && <i className="fa fa-caret-down"></i>}
      </MenuItemContainer>
      <MenuItemContainer id='cde-floating-menu-score' onClick={toggleScoreVisible} active={scoreVisible}>
        <i className="fa fa-star"></i>
        {scoreVisible && <i className="fa fa-caret-up"></i>}
        {!scoreVisible && <i className="fa fa-caret-down"></i>}
      </MenuItemContainer>
    </MenuContainer>
  );

};

export default RightMenu;