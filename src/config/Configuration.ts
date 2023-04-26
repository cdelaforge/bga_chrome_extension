import equal from "fast-deep-equal";

export interface Game {
  "name": string,
  "position": 'top' | 'bottom',
  "positionOffset": string,
  "playerPanel": string,
  "playerPanelOffset": number,
  "iconBackground": string,
  "iconBorder": string,
  "iconColor": string,
  "iconShadow": string
}

class Configuration {
  _defConfig: { games: Game[] };
  _customConfig: { games: Game[] };
  _config: { games: Game[] };

  constructor() {
    this._defConfig = { games: [] };
    this._customConfig = { games: [] };
    this._config = { games: [] };
  }

  async init() {
    this._defConfig = require(`./configuration.json`);
    this._customConfig = (await chrome.storage.sync.get('games')) as any;

    this.merge();

    console.log("Configuration", this._config);
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
}

export default Configuration;