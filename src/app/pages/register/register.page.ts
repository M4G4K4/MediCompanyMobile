import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {AlertController, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentialsRegister: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentialsRegister = this.fb.group({
      //name: ['', [Validators.required, Validators.minLength(1)]],
      email: ['eve.holt@reqres.in', [Validators.required, Validators.email]],
      password: ['pistol', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    console.log('Register');
    //console.log('Name: ' + this.name.value);
    console.log('Email: ' + this.email.value);
    console.log('Password: ' + this.password.value);

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.register(this.credentialsRegister.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Register failed',
          message: res.error.error,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

  get name() {
    return this.credentialsRegister.get('name');
  }

  get email() {
    return this.credentialsRegister.get('email');
  }

  get password() {
    return this.credentialsRegister.get('password');
  }


}
