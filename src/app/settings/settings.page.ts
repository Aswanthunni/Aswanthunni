import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  adFees = 0;
  constructor(private db: DbService) { }

  ngOnInit() {
    this.getLatestAdFees();
  }

  getLatestAdFees() {
    return this.db.storage.executeSql('SELECT fees FROM admission WHERE id IN (SELECT MAX(id) FROM admission)',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.adFees = +item.fees
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  saveFees() {
    return this.db.storage.executeSql('INSERT into admission (fees) VALUES (?)',[this.adFees]).then(data => { 
      alert('Added Successfully');
      this.getLatestAdFees();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

}
