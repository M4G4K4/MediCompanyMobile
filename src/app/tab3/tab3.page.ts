import {Component} from '@angular/core';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;
const KEY = 'KEY';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  title = 'app';
  elementType = 'url';
  value = 'key';


  constructor() {}

  // Ver como apenas chamar quando é aberta
  async ngOnInit() {
    const key = await Storage.get({ key: KEY });
    this.value = key.value;
    console.log('Elementype: ' + this.elementType);
  }

}
