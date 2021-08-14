import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';

@Component({
  selector: 'app-over-due',
  templateUrl: './over-due.page.html',
  styleUrls: ['./over-due.page.scss'],
})
export class OverDuePage implements OnInit {

  dueDataclone = [];
  dueData = [];
  cloneArray = [];
  constructor(private db: DbService) { }

  ngOnInit() {
    this.getGymData();
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
    this.dueData = [];
    this.dueDataclone.forEach((x) => {
      let dueDay = this.calculateGap(x.duedate);
      if (dueDay < 0) {
        x.daysCount = dueDay;
        this.dueData.push(x);
      }
    })
    this.dueData.sort((a, b) => new Date(b.duedate).getTime() - new Date(a.duedate).getTime());
    this.cloneArray = this.dueData;
  }

  getGymData() {
    this.dueDataclone = [];
    return this.db.storage.executeSql('SELECT name, duedate, img, mobile FROM gympackagedue INNER JOIN customertable ON customertable.id = gympackagedue.customerid and gympackagedue.id = (SELECT MAX(id) FROM gympackagedue where gympackagedue.customerid = customertable.id) and customertable.isactive = 1 and gympackagedue.isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueDataclone.push(item);
      }
      this.createData();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getAddData() {
    this.dueDataclone = [];
    return this.db.storage.executeSql('SELECT name, duedate, img, mobile FROM adpackagedue INNER JOIN customertable ON customertable.id = adpackagedue.customerid and adpackagedue.id IN (SELECT MAX(id) FROM adpackagedue where adpackagedue.customerid = customertable.id GROUP BY packageid) and customertable.isactive = 1 and adpackagedue.isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueDataclone.push(item);
      }
      this.createData();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getEvent(event) {
    if (event === 'gym') {
      this.getGymData();
    } else if (event === 'add') {
      this.getAddData();
    }
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
}
