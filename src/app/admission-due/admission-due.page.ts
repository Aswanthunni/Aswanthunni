import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AdmissionSettlePage } from '../admission-settle/admission-settle.page';
import { DbService } from '../db.service';

@Component({
  selector: 'app-admission-due',
  templateUrl: './admission-due.page.html',
  styleUrls: ['./admission-due.page.scss'],
})
export class AdmissionDuePage implements OnInit {
  dueData = [];
  cloneArray = [];
  constructor(private db: DbService, private modalController: ModalController) { }

  ngOnInit() {
    this.getGymData();
  }

  getGymData() {
    this.dueData = [];
    return this.db.storage.executeSql('SELECT SUM(balance) as due, name, img, fees, mobile, customertable.id as userId FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid GROUP BY regfeedue.customerid HAVING SUM(balance) > 0 ',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueData.push(item);
      }
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

  async settle(data) {
    const modal = await this.modalController.create({
      component: AdmissionSettlePage,
      componentProps : {params : { data }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'updated') {
        this.getGymData()
      }
    })

    return await modal.present();
  }

}
