import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Plugins} from '@capacitor/core';
import {AES, enc} from 'crypto-js';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const HASH = 'hash';

var hash;

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
    console.log('Phrase3: ' + this.credentialsGenerate.get('phrase3').value);

    const token = await Storage.get({ key: TOKEN_KEY });
    const key = this.credentialsGenerate.get('phrase1').value +
                this.credentialsGenerate.get('phrase2').value +
                this.credentialsGenerate.get('phrase3').value +
                this.credentialsGenerate.get('phrase4').value +
                this.credentialsGenerate.get('phrase5').value +
                this.credentialsGenerate.get('phrase6').value;

    console.log('Key: ' + key);
    console.log('Token: ' + token.value);

    const encrypted = this.cryptoAES(token.value, key);
    console.log('Encrypted: ' + encrypted);

    const decrypted = this.decryptoAES(encrypted,key);
    console.log('Decrypted: ' + decrypted);

    Storage.set({key: HASH, value: encrypted});
  }

  cryptoAES(texto, key) {
    return AES.encrypt(enc.Utf8.parse(texto), key).toString();
  }

  decryptoAES(texto, key) {
    return AES.decrypt(texto, key).toString(enc.Utf8);
  }

}
