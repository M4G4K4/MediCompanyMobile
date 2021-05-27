import {Component} from '@angular/core';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;
const HASH = 'hash';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';


  constructor() {}

  // Ver como apenas chamar quando é aberta
  ngOnInit() {
  }

}
