import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MenuItemContainer = styled.a<{ active: boolean }>`
  display: flex;
  flex-flow: row;
  gap: 0.3em;
  margin-left: 10px;
  float: right;
  position: relative;
  top: 2px;
`;

const RightMenu = () => {
  const [logVisible, setLogVisible] = useState(true);
  const [scoreVisible, setScoreVisible] = useState(true);

  const scoreContent = document.getElementById('right-side-first-part');
  const logContent = document.getElementById('right-side-second-part');

  const setMenuPosition = () => {
    const menuHeader = document.getElementById('cde-floating-menu-score');
    const height = window.innerHeight;

    if (menuHeader && scoreContent && logContent) {
      const rect = menuHeader.getBoundingClientRect();
      const maxHeight = height - rect.top - 40;
      logContent.style.top = `${rect.top + 35}px`;
      logContent.style.maxHeight = `${maxHeight}px`;
      scoreContent.style.top = logContent.style.top;
      scoreContent.style.maxHeight = logContent.style.maxHeight;
      scoreContent.style.width = (scoreContent.scrollHeight > maxHeight) ? '260px' : '240px';
    } else {
      setTimeout(setMenuPosition, 100);
    }
  };

  const onClick = (evt: any) => {
    try {
      const eltId = evt.target.id || evt.target.parentNode.id;
      if (eltId === 'cde-floating-menu-log') {
        toggleLogVisible();
      } else if (eltId === 'cde-floating-menu-score') {
        toggleScoreVisible();
      }
    }
    catch (error) { }
  };

  useEffect(() => {
    if (scoreContent) {
      scoreContent.style.right = scoreVisible ? '5px' : '-500px';
    }
  }, [scoreContent, scoreVisible]);

  useEffect(() => {
    if (logContent) {
      logContent.style.right = logVisible ? '5px' : '-500px';
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
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('resize', setMenuPosition);
      window.removeEventListener('scroll', setMenuPosition);
      document.removeEventListener('click', onClick);
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
    <>
      <MenuItemContainer id='cde-floating-menu-log' className='bgabutton bgabutton_gray' active={logVisible}>
        <i className="fa fa-book" style={{ color: '#000000' }}></i>
        {logVisible && <i className="fa fa-caret-up" style={{ color: '#000000' }}></i>}
        {!logVisible && <i className="fa fa-caret-down" style={{ color: '#000000' }}></i>}
      </MenuItemContainer>
      <MenuItemContainer id='cde-floating-menu-score' className='bgabutton bgabutton_gray' active={scoreVisible}>
        <i className="fa fa-star" style={{ width: '14px', height: '14px' }}></i>
        {scoreVisible && <i className="fa fa-caret-up" style={{ color: '#000000' }}></i>}
        {!scoreVisible && <i className="fa fa-caret-down" style={{ color: '#000000' }}></i>}
      </MenuItemContainer>
    </>
  );
};

export default RightMenu;