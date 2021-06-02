import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {Plugins} from '@capacitor/core';
import {HttpHeaders} from '@angular/common/http';
import {AES, enc} from 'crypto-js';

const { Storage } = Plugins;
const TOKEN = 'token';
const KEY = 'KEY';

var data = {
  fullName: '',
  age: '',
  sex: '',
  NIF: ''
};

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  credentialsSaveInfo: FormGroup;
  //TODO: por as variaveis em object e mandar isso em vez do credentialsSaveInfo

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentialsSaveInfo = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(1)]],
      age: ['', [Validators.required]],
      sex: ['', [Validators.required,Validators.minLength(1) ,Validators.maxLength(1)]],
      NIF: ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9)]]
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  async saveInfo() {
    if(!await this.keyGenerated()){
      const alert = await this.alertController.create({
        header: 'Key',
        message: 'Key not generated',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();
    const token = await Storage.get({ key: TOKEN });
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${token.value}`)
    };
    const body = await this.encryptData();
    console.log(this.credentialsSaveInfo.value);
    this.authService.saveInfo(body,header).subscribe(
      async (res) => {
        await loading.dismiss();
        console.log(res.patientFile);
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Saving information failed',
          message: res.error.error,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );

  }

  async keyGenerated(){
    const key = await Storage.get({ key: KEY });
    return key.value != null;
  }

  async encryptData(){
    data.fullName = await this.encrypt(this.credentialsSaveInfo.get('fullName'));
    data.age = await this.encrypt(this.credentialsSaveInfo.get('age'));
    data.sex = await this.encrypt(this.credentialsSaveInfo.get('sex'));
    data.NIF = await this.encrypt(this.credentialsSaveInfo.get('NIF'));
    console.log(data);
    return data;
  }

  async encrypt(texto){
    const key = await Storage.get({ key: KEY });
    return this.cryptoAES(texto, key.value);
  }

  cryptoAES(texto, key) {
    return AES.encrypt(enc.Utf8.parse(texto), key).toString();
  }

  decryptoAES(texto, key) {
    return AES.decrypt(texto, key).toString(enc.Utf8);
  }

  get fullName() {
    return this.credentialsSaveInfo.get('fullName');
  }

  get age() {
    return this.credentialsSaveInfo.get('age');
  }

  get sex() {
    return this.credentialsSaveInfo.get('sex');
  }

  get NIF() {
    return this.credentialsSaveInfo.get('NIF');
  }
}
