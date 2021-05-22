import {Component} from '@angular/core';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;
const HASH = 'hash';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor() {}

  // Tab3
  async displayQRCode() {
    const hash = await Storage.get({ key: HASH });
    console.log(hash.value);
  }
}
