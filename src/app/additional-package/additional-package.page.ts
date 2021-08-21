import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-additional-package',
  templateUrl: './additional-package.page.html',
  styleUrls: ['./additional-package.page.scss'],
})
export class AdditionalPackagePage implements OnInit {

  constructor(private alertCtrl: AlertController, public db: DbService) { }
  packageResults = [];
  ngOnInit() {
    this.fetchPackage();
  }

  async presentPrompt(data = { name : '', details: '', fees: '', month: '', id: ''}, type = 'add') {
    const alert = await this.alertCtrl.create({
      header: 'Add Package',
      backdropDismiss : false,
      inputs: [
        {
          name: 'pkgname',
          placeholder: 'Package Name',
          type: 'text',
          value : data.name
        },
        {
          name: 'pkgdetails',
          placeholder: 'Package Details',
          type: 'text',
          value: data.details
        },
        {
          name: 'month',
          placeholder: 'Package Duration (In Months)',
          type: 'number',
          value: data.month
        },
        {
          name: 'fees',
          placeholder: 'Fees',
          type: 'number',
          value: data.fees
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: type === 'add' ? 'Add' : 'Update',
          handler: res => {
            if (this.isValid(res)) {
              res['id'] = data.id;
              type === 'add' ? this.addPackage(res) : this.updatePackage(res);
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  isValid(data) {
    if (data.pkgname && data.pkgdetails && data.fees) {
      return true;
    } else {
      return false;
    }
  }

  addPackage(data) {
    let data2 = [data.pkgname, data.pkgdetails, data.fees, data.month, 1];
    return this.db.storage.executeSql('INSERT INTO adpackagetable (name, details, fees, month, isactive) VALUES (?, ?, ?, ?, ?)', data2)
    .then(res => {
      if (res) {
        this.fetchPackage();
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  updatePackage(data) {
    let data2 = [data.pkgname, data.pkgdetails, data.fees, data.month];
    return this.db.storage.executeSql(`UPDATE adpackagetable SET name = ?, details = ?, fees = ?, month = ? WHERE id = ${data.id}`, data2)
    .then(res => {
      if (res) {
        this.fetchPackage();
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  fetchPackage() {
    this.packageResults = [];
    return this.db.storage.executeSql('SELECT * FROM adpackagetable where isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.packageResults.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  edit(data) {
    this.presentPrompt({ name : data.name, details: data.details, fees: data.fees, month: data.month, id: data.id}, 'update')
  }

  deletePack(id) {
    return this.db.storage.executeSql(`UPDATE adpackagetable SET isactive = ? WHERE id = ${id}`, [0])
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
            this.deletePack(id);
          }
        }
      ]
    });

    await alert.present();
  }


}
