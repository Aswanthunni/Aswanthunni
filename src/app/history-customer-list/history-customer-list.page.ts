import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-history-customer-list',
  templateUrl: './history-customer-list.page.html',
  styleUrls: ['./history-customer-list.page.scss'],
})
export class HistoryCustomerListPage implements OnInit {
  custData = [];
  cloneArray = [];
  constructor(private db: DbService, private nav: NavController) { }

  ngOnInit() {
    this.fetchPackage()
  }

  fetchPackage() {
    //  this.db.showLoader();
      this.custData = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1',[]).then(data => { 
     //   this.db.dismissLoader();
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          this.custData.push(item);
        }
        this.cloneArray = this.custData;
      },(err) => {
        alert(JSON.stringify(err));
      //  this.db.dismissLoader();
      });
    }

    filterList(evt) {
      const searchTerm = evt.srcElement.value;
  
      if (!searchTerm) {
        this.custData = this.cloneArray;
        return;
      }
    
      this.custData = this.cloneArray.filter(currentFood => {
        if (currentFood.name && searchTerm) {
          return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });
    }

    navigate(id) {
      const params = { id }
      this.nav.navigateForward('/history-package-list', { state: params });
    }

}
