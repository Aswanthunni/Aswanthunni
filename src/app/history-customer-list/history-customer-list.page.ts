import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { IonInfiniteScroll, IonVirtualScroll, NavController } from '@ionic/angular';
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
  limit = 10;
  offset = 0;
  totalCustomer = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private db: DbService, private nav: NavController, private activatedRoute: ActivatedRoute, private file: File, private dom: DomSanitizer) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path === 'due') {
      this.getTotalCustomerDue();
    } else {
      this.getTotalCustomer()
    }
  }

  fetchPackage(limit, offset) {
    //  this.db.showLoader();
      let data = [limit, offset];
      return this.db.storage.executeSql('SELECT * FROM customertable LIMIT ? OFFSET ?',data).then(data => { 
     //   this.db.dismissLoader();
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
          this.custData.push(item);
        }
        this.custData.sort((a, b) => b.isactive - a.isactive || a.name.localeCompare(b.name));
        this.cloneArray = this.custData;
                //Hide Infinite List Loader on Complete
                this.infiniteScroll.complete();
  
                //Rerender Virtual Scroll List After Adding New Data
                this.virtualScroll.checkEnd();
          
      },(err) => {
        alert(JSON.stringify(err));
      //  this.db.dismissLoader();
      });
    }

    fetchPackagedue(limit, offset) {
      //  this.db.showLoader();
        let data = [limit, offset];
        return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1 LIMIT ? OFFSET ?', data).then(data => { 
       //   this.db.dismissLoader();
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i);
            this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
            this.custData.push(item);
          }
          this.cloneArray = this.custData;
                          //Hide Infinite List Loader on Complete
                          this.infiniteScroll.complete();
  
                          //Rerender Virtual Scroll List After Adding New Data
                          this.virtualScroll.checkEnd();
        },(err) => {
          alert(JSON.stringify(err));
        //  this.db.dismissLoader();
        });
      }

      getTotalCustomer() {
        return this.db.storage.executeSql('SELECT COUNT(id) as count FROM customertable',[]).then(data => { 
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.totalCustomer = item.count;
             }
             this.fetchPackage(10, 0);
           },(err) => {
             alert(JSON.stringify(err));
           });
      }

      getTotalCustomerDue() {
        return this.db.storage.executeSql('SELECT COUNT(id) as count FROM customertable where isactive = 1',[]).then(data => { 
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.totalCustomer = item.count;
             }
             this.fetchPackage(10, 0);
           },(err) => {
             alert(JSON.stringify(err));
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

      if (!this.custData.length && this.path === 'due' && searchTerm && searchTerm.length > 4) {
        this.searchinDBDue(searchTerm);
      } else if (!this.custData.length && searchTerm && searchTerm.length > 4) {
        this.searchinDB(searchTerm);
      }
    }
    searchinDB(string) {
      let a = [string+'%']
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where name LIKE ? and isactive = 1',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
             if (b.length) {
              this.custData = b;
                               //Hide Infinite List Loader on Complete
                               this.infiniteScroll.complete();
  
                               //Rerender Virtual Scroll List After Adding New Data
                               this.virtualScroll.checkEnd();
             }
           },(err) => {
             alert(JSON.stringify(err));
         //  this.db.dismissLoader();
           });
    }

    searchinDBDue(string) {
      let a = ['%'+string]
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where name LIKE ?',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
             if (b.length) {
              this.custData = b;
                               //Hide Infinite List Loader on Complete
                               this.infiniteScroll.complete();
  
                               //Rerender Virtual Scroll List After Adding New Data
                               this.virtualScroll.checkEnd();
  
             }
           },(err) => {
             alert(JSON.stringify(err));
         //  this.db.dismissLoader();
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

    loadData(event) {
      this.offset = this.offset + 10;
      // Using settimeout to simulate api call 
      setTimeout(() => {
  
        // load more data
        this.fetchPackage(this.limit, this.offset)
  

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.custData.length == this.totalCustomer) {
          event.target.disabled = true;
        }
      }, 500);
    }

    getSanitizedImage(path, imageName, item){
      this.file.readAsDataURL(path, imageName)
      .then((data)=>{
        item.img = this.dom.sanitize(SecurityContext.RESOURCE_URL, this.dom.bypassSecurityTrustResourceUrl(data));
      })
      .catch((err)=>{
      //  alert(JSON.stringify(err));
      });
  }
  

}
