import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Plugins} from '@capacitor/core';

const { Storage } = Plugins;
const KEY = 'KEY';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  credentialsGenerate: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentialsGenerate = this.fb.group({
      phrase1: ['', [Validators.required, Validators.minLength(1)]],
      phrase2: ['', [Validators.required, Validators.minLength(1)]],
      phrase3: ['', [Validators.required, Validators.minLength(1)]],
      phrase4: ['', [Validators.required, Validators.minLength(1)]],
      phrase5: ['', [Validators.required, Validators.minLength(1)]],
      phrase6: ['', [Validators.required, Validators.minLength(1)]],
    });
  }


  async generateKey() {
    if(await this.keyAlreadyGenerated()){
      console.log('Key already generated');
      const alert = await this.alertController.create({
        header: 'Generate Key',
        message: 'Key already generated',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }
    const key = this.credentialsGenerate.get('phrase1').value +
                this.credentialsGenerate.get('phrase2').value +
                this.credentialsGenerate.get('phrase3').value +
                this.credentialsGenerate.get('phrase4').value +
                this.credentialsGenerate.get('phrase5').value +
                this.credentialsGenerate.get('phrase6').value;

    console.log('KEY: ' + key);
    await Storage.set({key: KEY, value: key});
    // alert
  }

  async keyAlreadyGenerated(){
    const key = await Storage.get({key: KEY});
    console.log(key);
    return key.value != null;
  }

  // Not needed , remove this after
  /*
  cryptoAES(texto, key) {
    return AES.encrypt(enc.Utf8.parse(texto), key).toString();
  }

  decryptoAES(texto, key) {
    return AES.decrypt(texto, key).toString(enc.Utf8);
  }
   */

}
