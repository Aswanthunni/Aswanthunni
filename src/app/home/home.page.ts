import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, public nav: NavController, public platform: Platform, public alertCtrl: AlertController) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.activatedRoute.snapshot.paramMap.get('id'))
    // this.db.dbState().subscribe((res) => {
    //   if(res){
    //     this.db.fetchSongs().subscribe(item => {
    //       alert(item);
    //     })
    //   }
    // });
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.platform.backButton.subscribe(() => {
          if (window.location.pathname == "home/home") {
              this.delete();
          }
        });
      }
    });

  }

  navigate(route: string) {
    this.nav.navigateForward(route);
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are sure want to Exit App ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          cssClass: 'danger',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
}
