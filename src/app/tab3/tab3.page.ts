import {Component} from '@angular/core';
import {Plugins} from '@capacitor/core';
import {environment} from '../../environments/environment';

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

  async ngOnInit() {
    const key = await Storage.get({ key: KEY });
    const id = await Storage.get({key: 'id'});
    this.value = environment.baseURL + '/view/' + key.value + '/' + id.value;
  }

}
