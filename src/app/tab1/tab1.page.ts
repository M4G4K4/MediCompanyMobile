import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController} from '@ionic/angular';
import {Plugins} from "@capacitor/core";
import {HttpHeaders} from "@angular/common/http";

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  credentialsSaveInfo: FormGroup;

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
    const loading = await this.loadingController.create();
    await loading.present();
    const token = await Storage.get({ key: TOKEN_KEY });
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${token.value}`)
    };
    this.authService.saveInfo(this.credentialsSaveInfo.value,header).subscribe(
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
