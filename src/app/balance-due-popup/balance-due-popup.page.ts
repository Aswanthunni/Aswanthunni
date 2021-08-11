import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { BalanceSettlePopupPage } from '../balance-settle-popup/balance-settle-popup.page';
import { DbService } from '../db.service';

@Component({
  selector: 'app-balance-due-popup',
  templateUrl: './balance-due-popup.page.html',
  styleUrls: ['./balance-due-popup.page.scss'],
})
export class BalanceDuePopupPage implements OnInit {
  params: any;
  balanceArray = []
  constructor(public navParams: NavParams, private db: DbService, private modalController : ModalController) { }

  ngOnInit() {
    this.params = this.navParams.get('params');
    this.sumtotalbalAd();
  }

  sumtotalbalAd() {
    this.balanceArray = [];
    return this.db.storage.executeSql('SELECT packageid, SUM(balance) as bal, name, createdate, duedate FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid where customerid = ? GROUP BY packageid HAVING SUM(balance) > 0',[this.params.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        item.type = 'ad';
        this.balanceArray.push(item);
      }
     this.sumtotalbalGym();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalGym() {
    return this.db.storage.executeSql('SELECT packageid, SUM(balance) as bal, name, createdate, duedate  FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid where customerid = ? GROUP BY packageid HAVING SUM(balance) > 0',[this.params.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        item.type = 'gym';
        this.balanceArray.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  async updatebalance(data) {
    data.userId = this.params.userId;
    const modal = await this.modalController.create({
      component: BalanceSettlePopupPage,
      componentProps : {params : { data }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.sumtotalbalAd();
      }
    })

    return await modal.present()
  }
}
