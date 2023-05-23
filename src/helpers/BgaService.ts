const BGA_URL = 'https://boardgamearena.com/';
const BGA_EXT = 'bgachromeext';

class BgaService {
  _token: string;

  constructor() {
    this._token = '';
    this.getToken();
  }

  private async getToken() {
    const url = `${BGA_URL}/account/account/getRequestToken.html?${BGA_EXT}`;

    const resp = await fetch(url);
    const body = await resp.json();
    this._token = body.data.request_token;
  }
};

export default BgaService;