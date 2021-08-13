import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BalanceDuePopupPage } from '../balance-due-popup/balance-due-popup.page';
import { DbService } from '../db.service';

@Component({
  selector: 'app-balance-due',
  templateUrl: './balance-due.page.html',
  styleUrls: ['./balance-due.page.scss'],
})
export class BalanceDuePage implements OnInit {
  balanceArray = [];
  cloneArray = [];
  constructor(public db: DbService, public modalController: ModalController) { }

  ngOnInit() {
    this.sumtotalbalAd();
  }

  sumtotalbalAd() {
    this.balanceArray = [];
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , customertable.id as id, img, customertable.isactive as active FROM adpackagedue INNER JOIN customertable on customertable.id = adpackagedue.customerid GROUP BY customerid HAVING SUM(balance) > 0',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray.push(item);
      }
      this.sumtotalbalGym();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalGym() {
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , customertable.id as id, img, customertable.isactive as active FROM gympackagedue INNER JOIN customertable on customertable.id = gympackagedue.customerid GROUP BY customerid HAVING SUM(balance) > 0',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray.push(item);
      }
      this.reduceArray();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  reduceArray() {
    const mutate = this.balanceArray.reduce((obj, item) => {
      obj[item.id] ? obj[item.id].bal = +obj[item.id].bal + +item.bal : (obj[item.id] = { ...item });
      return obj;
    }, {});

    this.splitArray(mutate);
  }

  splitArray(mutate) {
    this.balanceArray = [];
  for (let key in mutate) {
    this.balanceArray.push(mutate[key])
  }
  this.balanceArray.sort((a, b) => b.active - a.active || a.name.localeCompare(b.name));
  this.cloneArray = this.balanceArray;
  }

  filterList(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.balanceArray = this.cloneArray;
      return;
    }
  
    this.balanceArray = this.cloneArray.filter(currentFood => {
      if (currentFood.name && searchTerm) {
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  async openpopoup(id) {
    const modal = await this.modalController.create({
      component: BalanceDuePopupPage,
      componentProps : {params : { userId : id}},
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
