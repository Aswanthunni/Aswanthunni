import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-admission-trans',
  templateUrl: './admission-trans.page.html',
  styleUrls: ['./admission-trans.page.scss'],
})
export class AdmissionTransPage implements OnInit {
  dueData = [];
  cloneArray = [];
  constructor(private db: DbService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getTrans();
  }

  getTrans() {
    this.dueData = [];
    return this.db.storage.executeSql('SELECT regfeedue.id as id, name, mobile, totalpaid, paymentdate, comments FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueData.push(item);
      }
      this.dueData.sort((a, b) => new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime());
      this.cloneArray = this.dueData;
    },(err) => {
      alert(JSON.stringify(err));
    });
  }


  filterList(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.dueData = this.cloneArray;
      return;
    }
  
    this.dueData = this.cloneArray.filter(currentFood => {
      if (currentFood.name && searchTerm) {
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
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
            this.deleteAd(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAd(id) {
    return this.db.storage.executeSql('DELETE FROM regfeedue WHERE id = ?', [id])
    .then(_ => {
      this.getTrans();
    });
  }

}
