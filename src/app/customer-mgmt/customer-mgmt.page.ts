import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-customer-mgmt',
  templateUrl: './customer-mgmt.page.html',
  styleUrls: ['./customer-mgmt.page.scss'],
})
export class CustomerMgmtPage implements OnInit {
  customerData = [];
  cloneArray = [];
  constructor(private nav: NavController, private db: DbService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.fetchPackage();
  }

  addCustomer() {
    this.nav.navigateForward('/add-customer')
  }

  fetchPackage() {
  //  this.db.showLoader();
    this.customerData = [];
    return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1',[]).then(data => { 
   //   this.db.dismissLoader();
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.customerData.push(item);
      }
      this.cloneArray = this.customerData;
    },(err) => {
      alert(JSON.stringify(err));
    //  this.db.dismissLoader();
    });
  }

  filterList(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.customerData = this.cloneArray;
      return;
    }
  
    this.customerData = this.cloneArray.filter(currentFood => {
      if (currentFood.name && searchTerm) {
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  navigateEdit(id) {
    const params = { type : 'update', id }
    this.nav.navigateForward('/add-customer', { state: params })
  }

  deleteCustomer(id) {
    return this.db.storage.executeSql(`UPDATE customertable SET isactive = ? WHERE id = ${id}`, [0])
    .then(_ => {
      this.fetchPackage();
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  async presentAlertConfirm(id) {
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
            this.deleteCustomer(id);
          }
        }
      ]
    });

    await alert.present();
  }
  
  navigatePackage(id) {
    const params = { type : 'update', id }
    this.nav.navigateForward('/package-manager', { state: params });
  }


}
