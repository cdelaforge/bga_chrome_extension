import React, { useEffect, useState } from 'react';

const Popup = () => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      setUrl(tabs[0].url);
    });
  });

  return (
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React!
    </a>
  );
};

export default Popup;