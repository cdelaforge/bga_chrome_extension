import equal from "fast-deep-equal";
import defaultGames from "./DefaultGames";

export interface Game {
  name: string,
  position: 'top' | 'bottom' | 'auto',
  positionTop?: string,
  positionBottom?: string,
  left: string,
  playerPanel: string,
  playerPanelOffset: number,
  iconBackground: string,
  iconBorder: string,
  iconColor: string,
  iconShadow: string,
  css?: string
}

class Configuration {
  _defConfig: { games: Game[] };
  _customConfig: { games: Game[], disabled: string[], onlineMessages?: boolean, floatingRightMenu?: boolean };
  _config: { games: Game[] };

  constructor() {
    this._defConfig = { games: defaultGames };
    this._customConfig = { games: [], disabled: [] };
    this._config = { games: [] };
  }

  async init() {
    this._customConfig = (await chrome.storage.sync.get()) as any;
    if (!this._customConfig.games) {
      this._customConfig.games = [];
    }
    if (!this._customConfig.disabled) {
      this._customConfig.disabled = [];
    }
    this.merge();
  }

  private merge() {
    const customNames = this._customConfig.games.map(g => g.name);
    const defGames = this._defConfig.games.filter(g => !customNames.includes(g.name));

    this._config.games = [...defGames, ...this._customConfig.games];
  }

  getGameConfig(game: string): Game | undefined {
    return this._config.games.find((c: any) => c.name === game);
  }

  getGamesList(): Game[] {
    return this._config.games.sort((a, b) => a.name.localeCompare(b.name));
  }

  saveGame(name: string, game: Game) {
    const defGame = this._defConfig.games.find(g => g.name === name);

    if (defGame && equal(game, defGame)) {
      return this.resetGame(name);
    }

    this._customConfig.games = [...this._customConfig.games.filter(g => g.name !== name), game];
    chrome.storage.sync.set({ games: this._customConfig.games });
    this.merge();
    return this.getGamesList();
  }

  resetGame(name: string) {
    this._customConfig.games = this._customConfig.games.filter(g => g.name !== name);
    chrome.storage.sync.set({ games: this._customConfig.games });
    this.merge();
    return this.getGamesList();
  }

  isDefault(name: string) {
    const defGame = this._defConfig.games.find(g => g.name === name);
    return !!defGame;
  }

  isCustomized(name: string) {
    const custGame = this._customConfig.games.find(g => g.name === name);
    return !!custGame;
  }

  setGameEnabled(name: string, enable: boolean) {
    this._customConfig.disabled = this._customConfig.disabled.filter(n => n !== name);

    if (!enable) {
      this._customConfig.disabled.push(name);
    }

    chrome.storage.sync.set({ disabled: this._customConfig.disabled });
  }

  isGameEnabled(name: string) {
    return !this._customConfig.disabled.includes(name);
  }

  setOnlineMessagesEnabled(enable: boolean) {
    this._customConfig.onlineMessages = enable;
    chrome.storage.sync.set({ onlineMessages: enable });
  }

  isOnlineMessagesEnabled() {
    return this._customConfig.onlineMessages || false;
  }

  setFloatingRightMenu(enable: boolean) {
    this._customConfig.floatingRightMenu = enable;
    chrome.storage.sync.set({ floatingRightMenu: enable });
  }

  isFloatingRightMenu() {
    return this._customConfig.floatingRightMenu !== false;
  }
}

export default Configuration;