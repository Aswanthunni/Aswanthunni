import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';
import { TransNewPage } from '../trans-new/trans-new.page';

@Component({
  selector: 'app-trans-list',
  templateUrl: './trans-list.page.html',
  styleUrls: ['./trans-list.page.scss'],
})
export class TransListPage implements OnInit {
  history = [];
  params: any;
  userId: any;
  defaultType = 'gym';
  registerHistory = [];
  constructor(private db: DbService, public router: Router, public modalController: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    if (state) {
        this.userId = state.id;
        this.getLatestGymdata();
    }
  }

  getLatestAddata() {
    this.history = [];
    return this.db.storage.executeSql('SELECT adpackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details, fees, comments FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestGymdata() {
    this.history = [];
    return this.db.storage.executeSql('SELECT gympackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details, fees, comments FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sortBydate() {
    this.history.sort((a, b) => new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime());
  }

  getEvent(event) {
    this.defaultType = event;
    if (event === 'gym') {
      this.getLatestGymdata();
    } else if (event === 'add') {
      this.getLatestAddata();
    }
  }

  async newPackage() {
    const data = {id : this.userId, type: this.defaultType};
    const modal = await this.modalController.create({
      component: TransNewPage,
      componentProps : {params : data},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.getLatestGymdata();
      }
    })

    return await modal.present()
  }

  async delete(id) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are sure want to delete ?',
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
            this.deleteTrans(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteTrans(id) {
    if (this.defaultType === 'gym') {
        this.deleteGym(id)
    } else if (this.defaultType === 'add') {
        this.deleteAd(id)
    }
  }

  deleteAd(id) {
    return this.db.storage.executeSql('DELETE FROM adpackagedue WHERE id = ?', [id])
    .then(_ => {
      this.getLatestAddata();
    });
  }

  deleteGym(id) {
    return this.db.storage.executeSql('DELETE FROM gympackagedue WHERE id = ?', [id])
    .then(_ => {
      this.getLatestGymdata();
    });
  }

}
