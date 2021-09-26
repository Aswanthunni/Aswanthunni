import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-due-extend',
  templateUrl: './due-extend.page.html',
  styleUrls: ['./due-extend.page.scss'],
})
export class DueExtendPage implements OnInit {
  fetchAllPackage = [];
  userId = '';
  type = 'gym';
  constructor(private db: DbService, private router: Router, private datePicker: DatePicker, private alertCtrl: AlertController) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    if (state) {
        this.userId = state.id;
        this.getLatestGymdata(this.userId);
    }
  }

  getEvent(event) {
    this.type = event;
    if (event === 'gym') {
      this.getLatestGymdata(this.userId);
    } else if (event === 'add') {
      this.getLatestAddata(this.userId);
    }
  }

  getLatestGymdata(id) {
    this.fetchAllPackage = [];
    return this.db.storage.executeSql('SELECT gympackagedue.id, gympackagedue.duedate, gympackagedue.paymentdate, name, details, fees FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE gympackagedue.id IN (SELECT MAX(id) FROM gympackagedue where customerid = ? GROUP BY packageid) and gympackagedue.isactive = 1',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.fetchAllPackage.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestAddata(id) {
    this.fetchAllPackage = [];
    return this.db.storage.executeSql('SELECT adpackagedue.id, adpackagedue.duedate, adpackagedue.paymentdate, name, details, fees FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE adpackagedue.id IN (SELECT MAX(id) FROM adpackagedue where customerid = ? GROUP BY packageid) and adpackagedue.isactive = 1',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.fetchAllPackage.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  updateDue(id) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      (dateTime) => {
        const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
        this.delete(id, dFormat)
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  async delete(id, date) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Due date will be changed to '+date,
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
            this.type === 'gym' ? this.updateGymDueDate(id, date) : this.updateAdDueDate(id, date);
          }
        }
      ]
    });

    await alert.present();
  }

  updateAdDueDate(id, date) {
    let data2 = [date];
    return this.db.storage.executeSql(`UPDATE adpackagedue SET duedate = ? WHERE id = ${id}`, data2)
    .then(res => {
      if (res) {
        this.getLatestAddata(this.userId);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  updateGymDueDate(id, date) {
    let data2 = [date];
    return this.db.storage.executeSql(`UPDATE gympackagedue SET duedate = ? WHERE id = ${id}`, data2)
    .then(res => {
      if (res) {
        this.getLatestGymdata(this.userId);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

}
