import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { BalanceDuePopupPage } from '../balance-due-popup/balance-due-popup.page';
import { BalanceSettlePopupPage } from '../balance-settle-popup/balance-settle-popup.page';
import { DbService } from '../db.service';
import { PopupAddPackagePage } from '../popup-add-package/popup-add-package.page';
import { TransNewPage } from '../trans-new/trans-new.page';
import { File } from '@ionic-native/file/ngx';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.page.html',
  styleUrls: ['./package-list.page.scss'],
})
export class PackageListPage implements OnInit {
  fetchAllPackage = [];
  AllPackage = [];
  packageId = [];
  balanceArray = [];
  userId: any;
  constructor(public db: DbService, public modalController: ModalController, private alertCtrl: AlertController, private file: File, private dom: DomSanitizer) { }

  ngOnInit() {
    this.userId = this.db.userId
    this.getLatestGymdata(this.userId);
  }

  getLatestGymdata(id) {
    this.fetchAllPackage = [];
    this.packageId = [];
    this.packageId = [];
    this.balanceArray = [];
    return this.db.storage.executeSql('SELECT gympackagedue.id, customerid, packageid, totalpaid, balance, paymentdate, duedate, gympackagedue.createdate,comments,gympackagedue.isactive, img FROM gympackagedue inner join customertable on customertable.id = gympackagedue.customerid WHERE gympackagedue.id IN (SELECT MAX(id) FROM gympackagedue where customerid = ? GROUP BY packageid)',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.packageId.push(item.packageid)
        this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
        this.fetchAllPackage.push(item);
      }
      this.sumtotalbal(id);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbal(id) {
    return this.db.storage.executeSql('SELECT packageid, SUM(totalpaid) as total, SUM(balance) as bal FROM gympackagedue where customerid = ? GROUP BY packageid',[id]).then(data => { 
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
    return this.db.storage.executeSql('SELECT * FROM packagetable WHERE id IN (' + this.packageId.toString() + ')',[]).then(data => { 
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
        data.bal = this.balanceArray[index2].bal;
      }
    })

    this.fetchAllPackage.sort((a, b) => {
      return b.isactive - a.isactive;
    });
  }

  async addPackage() {
    const modal = await this.modalController.create({
      component: PopupAddPackagePage,
      componentProps : {params : { type :'gym', userId : this.userId,
      packageId : this.packageId
    }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'add') {
        this.getLatestGymdata(this.userId);
      }
    })

    return await modal.present()
  }

  async updatePackage(data) {
    const modal = await this.modalController.create({
      component: PopupAddPackagePage,
      componentProps : {params : 
        { type :'gym', userId : this.userId ,
          action : 'update', updateData : data
        }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.getLatestGymdata(this.userId);
      }
    })

    return await modal.present()
  }

  packdelete(pid) {
    return this.db.storage.executeSql('UPDATE gympackagedue SET isactive = 0 WHERE packageid = ?', [pid]).then(res => {
      this.getLatestGymdata(this.userId);
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

  async updatebalance(data) {
    data.userId = this.userId;
    data.type = 'gym';
    data.page = 'customerlist';
    const modal = await this.modalController.create({
      component: BalanceSettlePopupPage,
      componentProps : {params : { data }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });
    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.getLatestGymdata(this.userId);
      }
    })
    return await modal.present()
  }

  async newPackage() {
    const data = {id : this.userId, type: 'gym'};
    const modal = await this.modalController.create({
      component: TransNewPage,
      componentProps : {params : data},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.getLatestGymdata(this.userId);
      }
    })

    return await modal.present()
  }

  getSanitizedImage(path, imageName, item){
    this.file.readAsDataURL(path, imageName)
    .then((data)=>{
      item.img = this.dom.sanitize(SecurityContext.RESOURCE_URL, this.dom.bypassSecurityTrustResourceUrl(data));
    })
    .catch((err)=>{
    //  alert(JSON.stringify(err));
    });
}

async imagePreview(data) {
  const modal = await this.modalController.create({
    component: ImagePreviewPage,
    componentProps : {params : data},
    swipeToClose: true,
    presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
  });

  modal.onDidDismiss().then((data) => {
    
  })

  return await modal.present()
}



}
