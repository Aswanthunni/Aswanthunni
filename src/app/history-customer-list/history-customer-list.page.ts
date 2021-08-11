import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  path = '';
  constructor(private db: DbService, private nav: NavController, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path === 'due') {
      this.fetchPackagedue();
    } else {
      this.fetchPackage()
    }
  }

  fetchPackage() {
    //  this.db.showLoader();
      this.custData = [];
      return this.db.storage.executeSql('SELECT * FROM customertable',[]).then(data => { 
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

    fetchPackagedue() {
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
      if (this.path === 'report') {
      this.nav.navigateForward('/history-package-list', { state: params });
      } else if (this.path === 'trans') {
        this.nav.navigateForward('/trans-list', { state: params });
      } else if (this.path === 'due') {
        this.nav.navigateForward('/due-extend', { state: params });
      }
    }

}
