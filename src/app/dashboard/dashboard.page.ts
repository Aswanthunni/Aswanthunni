import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  totalCustomer = 0;
  earn = 0;
  due = 0;
  dueData = [];
  overdueCount = 0;
  updueCount = 0;
  constructor(private db: DbService) { }

  ngOnInit() {
    this.getTotalCustomer();
    this.getTotalEarnDue();
    this.getTotalDueCount();
  }

  getTotalCustomer() {
    return this.db.storage.executeSql('SELECT COUNT(id) as count FROM customertable where isactive = 1',[]).then(data => { 
         for (let i = 0; i < data.rows.length; i++) {
           let item = data.rows.item(i);
           this.totalCustomer = item.count;
         }
       },(err) => {
         alert(JSON.stringify(err));
       });
  }

  getTotalEarnDue() {
    let gym: any;
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, SUM(totalpaid) as earn FROM gympackagedue ',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        gym = data.rows.item(i);
      }
      this.getTotalAdDue(gym)
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getTotalAdDue(gymData) {
    let add: any;
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, SUM(totalpaid) as earn FROM adpackagedue ',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        add = data.rows.item(i);
      }
      this.calculateTotalEarn(gymData, add);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  calculateTotalEarn(gym, add) {
    gym.bal ? gym.bal : gym.bal = 0;
    gym.earn ? gym.earn : gym.earn = 0;
    add.bal ? add.bal : add.bal = 0;
    add.earn ? add.earn : add.earn = 0;
    this.earn = +gym.earn + +add.earn;
    this.due = +gym.bal + +add.bal;
  }

  getTotalDueCount() {
    this.dueData = [];
    return this.db.storage.executeSql('SELECT duedate FROM gympackagedue where id IN (SELECT MAX(id) FROM gympackagedue GROUP BY customerid) and isactive = 1 GROUP BY customerid',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueData.push(item);
      }
      this.getTotalDueCountAd();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getTotalDueCountAd() {
    return this.db.storage.executeSql('SELECT duedate FROM adpackagedue where id IN (SELECT MAX(id) FROM adpackagedue GROUP BY customerid) and isactive = 1 GROUP BY customerid',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueData.push(item);
      }
      this.createData();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  calculateGap(date) {
    const oneDay = 1000 * 60 * 60 * 24;
    const EndDate = new Date(date)
    const StartDate = new Date();
    // A day in UTC always lasts 24 hours (unlike in other time formats)
    const start = Date.UTC(EndDate.getFullYear(), EndDate.getMonth(), EndDate.getDate());
    const end = Date.UTC(StartDate.getFullYear(), StartDate.getMonth(), StartDate.getDate());
  
    // so it's safe to divide by 24 hours
    return (start - end) / oneDay;
  }

  createData() {
    this.dueData.forEach((x) => {
      if (this.calculateGap(x.duedate) < 0) {
          this.overdueCount++;
      } else if (this.calculateGap(x.duedate) <= 10 && this.calculateGap(x.duedate) >= 0) {
          this.updueCount++;
      }
    })
  }

}
