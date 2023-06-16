import equal from "fast-deep-equal";
import defaultGames from "./DefaultGames";

export interface Game {
  name: string,
  position: 'top' | 'bottom' | 'auto',
  positionTop?: string,
  positionBottom?: string,
  left: string,
  boardPanel?: string;
  boardPanelOffset?: number;
  playerPanel: string,
  playerPanelOffset: number,
  bottomPanel?: string,
  bottomPanelOffset?: number,
  iconBackground: string,
  iconBorder: string,
  iconColor: string,
  iconShadow: string,
  customZoomContainer?: string,
  css?: string,
  menuCss?: string,
};

export interface Template {
  name: string,
  text: string,
  game: string
};

class Configuration {
  _defConfig: { games: Game[] };
  _customConfig: {
    games: Game[],
    disabled: string[],
    floating: string[],
    onlineMessages?: boolean,
    floatingRightMenu?: boolean,
    devTemplates?: Template[]
  };
  _config: { games: Game[] };

  constructor() {
    this._defConfig = {
      games: defaultGames.map(game => {
        return {
          iconBackground: '#ebd5bd',
          iconBorder: '#222222',
          iconColor: '#222222',
          iconShadow: '#000000',
          position: 'auto',
          positionTop: '75px',
          positionBottom: 'auto',
          playerPanelOffset: 5,
          left: '0.5em',
          ...game
        }
      }) as Game[]
    };
    this._customConfig = { games: [], disabled: [], floating: [] };
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
    if (!this._customConfig.floating) {
      this._customConfig.floating = [];
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

  setLeftMenuEnabled(name: string, enable: boolean) {
    this._customConfig.disabled = this._customConfig.disabled.filter(n => n !== name);

    if (!enable) {
      this._customConfig.disabled.push(name);
    }

    chrome.storage.sync.set({ disabled: this._customConfig.disabled });
  }

  isLeftMenuEnabled(name: string) {
    return !this._customConfig.disabled.includes(name);
  }

  setGameFloatingMenu(name: string, enable: boolean) {
    this._customConfig.floating = this._customConfig.floating.filter(n => n !== name);

    if (enable) {
      this._customConfig.floating.push(name);
    }

    chrome.storage.sync.set({ floating: this._customConfig.floating });
  }

  isGameFloatingMenu(name: string) {
    return this._customConfig.floating.includes(name);
  }

  setOnlineMessagesEnabled(enable: boolean) {
    this._customConfig.onlineMessages = enable;
    chrome.storage.sync.set({ onlineMessages: enable });
  }

  isOnlineMessagesEnabled() {
    return this._customConfig.onlineMessages || false;
  }

  setGlobalFloatingMenu(enable: boolean) {
    this._customConfig.floatingRightMenu = enable;
    chrome.storage.sync.set({ floatingRightMenu: enable });
  }

  isGlobalFloatingMenu() {
    return this._customConfig.floatingRightMenu === true;
  }

  listTemplates() {
    return [...(this._customConfig.devTemplates || [])];
  }

  saveTemplates(templates: Template[]) {
    this._customConfig.devTemplates = [...templates];
    chrome.storage.sync.set({ devTemplates: this._customConfig.devTemplates });
    return this.listTemplates();
  }

  addTemplate(template: Template) {
    this._customConfig.devTemplates = [...(this._customConfig.devTemplates || []), template];
    chrome.storage.sync.set({ devTemplates: this._customConfig.devTemplates });
    return this.listTemplates();
  }

  updateTemplate(oldName: string, oldGame: string, template: Template) {
    if (this._customConfig.devTemplates) {
      const oldTemplate = this._customConfig.devTemplates.find(t => t.name === oldName && t.game === oldGame);

      if (oldTemplate) {
        oldTemplate.game = template.game;
        oldTemplate.name = template.name;
        oldTemplate.text = template.text;

        chrome.storage.sync.set({ devTemplates: this._customConfig.devTemplates });
      }
    }

    return this.listTemplates();
  }

  removeTemplate(template: Template) {
    if (this._customConfig.devTemplates) {
      this._customConfig.devTemplates = this._customConfig.devTemplates.filter(t => t.name !== template.name || t.game !== template.game);
      chrome.storage.sync.set({ devTemplates: this._customConfig.devTemplates });
    }
    return this.listTemplates();
  }
}

export default Configuration;