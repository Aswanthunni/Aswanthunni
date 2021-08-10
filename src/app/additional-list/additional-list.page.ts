import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { DbService } from '../db.service';
import { PopupAddPackagePage } from '../popup-add-package/popup-add-package.page';

@Component({
  selector: 'app-additional-list',
  templateUrl: './additional-list.page.html',
  styleUrls: ['./additional-list.page.scss'],
})
export class AdditionalListPage implements OnInit {

  fetchAllPackage = [];
  AllPackage = [];
  packageId = [];
  balanceArray = [];
  constructor(private activatedRoute: ActivatedRoute, public db: DbService, public modalController: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  getLatestGymdata(id) {
    this.fetchAllPackage = [];
    this.packageId = [];
    return this.db.storage.executeSql('SELECT * FROM adpackagedue WHERE id IN (SELECT MAX(id) FROM adpackagedue where customerid = ? GROUP BY packageid)',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.packageId.push(item.packageid)
        this.fetchAllPackage.push(item);
      }
      this.sumtotalbal(id);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbal(id) {
    return this.db.storage.executeSql('SELECT packageid, SUM(totalpaid) as total, SUM(balance) as bal FROM adpackagedue where customerid = ? GROUP BY packageid',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray.push(item);
      }
      this.fetchPackageDetails();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  fetchPackageDetails() {
    return this.db.storage.executeSql('SELECT * FROM adpackagetable WHERE id IN (' + this.packageId.toString() + ')',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.AllPackage.push(item);
      }
      this.buildPackage();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  buildPackage() {
    this.fetchAllPackage.forEach((data) => {
      const index = this.AllPackage.findIndex( x => data.packageid == x.id);
      const index2 = this.balanceArray.findIndex( x => data.packageid == x.packageid);
      if (index > -1) {
        data.packageName = this.AllPackage[index].name;
        data.packageDetails = this.AllPackage[index].details;
        data.packageFees = this.AllPackage[index].fees;
      }

      if (index2 > -1) {
        data.paid = this.balanceArray[index2].total;
        data.balance = this.balanceArray[index2].bal;
      }
    })
  }

  async addPackage() {
    const modal = await this.modalController.create({
      component: PopupAddPackagePage,
      componentProps : {params : { type :'add', userId : this.activatedRoute.snapshot.paramMap.get('id')}},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'add') {
        this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
      }
    })

    return await modal.present()
  }

  async updatePackage(data) {
    const modal = await this.modalController.create({
      component: PopupAddPackagePage,
      componentProps : {params : 
        { type :'add', userId : this.activatedRoute.snapshot.paramMap.get('id'),
          action : 'update', updateData : data
        }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
      }
    })

    return await modal.present()
  }

  packdelete(pid) {
    return this.db.storage.executeSql('UPDATE adpackagedue SET isactive = 0 WHERE packageid = ?', [pid]).then(res => {
      this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
    }, (err) => {
      alert(JSON.stringify(err));
    });
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
            this.packdelete(id);
          }
        }
      ]
    });

    await alert.present();
  }

}
