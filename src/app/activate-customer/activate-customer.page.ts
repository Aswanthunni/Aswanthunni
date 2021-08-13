import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-activate-customer',
  templateUrl: './activate-customer.page.html',
  styleUrls: ['./activate-customer.page.scss'],
})
export class ActivateCustomerPage implements OnInit {
  customerData = [];
  cloneArray = [];
  constructor(private db: DbService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.fetchPackage();
  }

  fetchPackage() {
    //  this.db.showLoader();
      this.customerData = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 0',[]).then(data => { 
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

    activateCustomer(id) {
      return this.db.storage.executeSql('UPDATE customertable set isactive = 1 where id = ?',[id]).then(data => { 
        this.fetchPackage();
         },(err) => {
           alert(JSON.stringify(err));
         //  this.db.dismissLoader();
         });
    }

    async presentAlertConfirm(id) {
      const alert = await this.alertCtrl.create({
        header: 'Confirm!',
        message: 'Are sure want to Activate ?',
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
              this.activateCustomer(id);
            }
          }
        ]
      });
  
      await alert.present();
    }

}
