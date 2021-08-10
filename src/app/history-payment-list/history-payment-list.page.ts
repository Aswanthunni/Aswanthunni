import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-history-payment-list',
  templateUrl: './history-payment-list.page.html',
  styleUrls: ['./history-payment-list.page.scss'],
})
export class HistoryPaymentListPage implements OnInit {
  history = [];
  params: any;
  userId: any;
  constructor(public navParams: NavParams, public db: DbService) { }

  ngOnInit() {
    this.params = this.navParams.get('params');
    this.userId = this.params.userId;
    if (this.params.type === 'gym') {
        this.getLatestGymdata();
    } else if (this.params.type === 'add') {
        this.getLatestAddata();
    }
  }

  getLatestAddata() {
    return this.db.storage.executeSql('SELECT * FROM adpackagedue WHERE customerid = ? and packageid = ?',[this.params.userId, this.params.pkgId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestGymdata() {
    return this.db.storage.executeSql('SELECT * FROM gympackagedue WHERE customerid = ? and packageid = ?',[this.params.userId, this.params.pkgId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

}
