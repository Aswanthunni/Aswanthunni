import { Component, OnInit, Sanitizer, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { AlertController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-activate-customer',
  templateUrl: './activate-customer.page.html',
  styleUrls: ['./activate-customer.page.scss'],
})
export class ActivateCustomerPage implements OnInit {
  customerData = [];
  cloneArray = [];
  limit = 10;
  offset = 0;
  totalCustomer = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private db: DbService, private alertCtrl: AlertController, private file: File, private dom: DomSanitizer) { }

  ngOnInit() {
    this.getTotalCustomer();
  }

  getTotalCustomer() {
    return this.db.storage.executeSql('SELECT COUNT(id) as count FROM customertable where isactive = 0',[]).then(data => { 
         for (let i = 0; i < data.rows.length; i++) {
           let item = data.rows.item(i);
           this.totalCustomer = item.count;
         }
         this.fetchPackage(10, 0);
       },(err) => {
         alert(JSON.stringify(err));
       });
  }

  fetchPackage(limit, offset) {
      return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 0 LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
     //   this.db.dismissLoader();
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
          this.customerData.push(item);
        }
        this.cloneArray = this.customerData;
        this.infiniteScroll.complete();
        this.virtualScroll.checkEnd();
      },(err) => {
        alert(JSON.stringify(err));
      //  this.db.dismissLoader();
      });
    }

    getSanitizedImage(path, imageName, item){
      this.file.readAsDataURL(path, imageName)
      .then((data)=>{
        item.img = this.dom.sanitize(SecurityContext.RESOURCE_URL, this.dom.bypassSecurityTrustResourceUrl(data));
      })
      .catch((err)=>{
    //    alert(JSON.stringify(err));
      });
  }

    filterList(evt) {
      const searchTerm = evt.srcElement.value;
  
      if (!searchTerm) {
        this.customerData = this.cloneArray;
        return;
      }
    
      this.customerData = this.cloneArray.filter(currentFood => {
        if (currentFood.name && searchTerm) {
          return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }
      });

      if (!this.customerData.length && searchTerm && searchTerm.length > 4) {
        this.searchinDB(searchTerm);
      }
    }

    searchinDB(string) {
      let a = [string+'%']
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where name LIKE ? and isactive = 0',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
             if (b.length) {
              this.customerData = b;
              this.infiniteScroll.complete();
              this.virtualScroll.checkEnd();
             }
           },(err) => {
             alert(JSON.stringify(err));
         //  this.db.dismissLoader();
           });
    }

    activateCustomer(id) {
      return this.db.storage.executeSql('UPDATE customertable set isactive = 1 where id = ?',[id]).then(data => { 
        alert('Customer Activated Successfully');
        this.customerData = [];
        this.fetchPackage(10, 0);
         },(err) => {
           alert(JSON.stringify(err));
         //  this.db.dismissLoader();
         });
    }

    async presentAlertConfirm(id) {
      const alert = await this.alertCtrl.create({
        header: 'Confirm!',
        message: 'Are sure want to Activate ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Okay',
            cssClass: 'danger',
            handler: () => {
              this.activateCustomer(id);
            }
          }
        ]
      });
  
      await alert.present();
    }

    loadData(event) {
      this.offset = this.offset + 10;
      // Using settimeout to simulate api call 
      setTimeout(() => {
  
        // load more data
        this.fetchPackage(this.limit, this.offset)
  
 
       // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.customerData.length == this.totalCustomer) {
          event.target.disabled = true;
        }
      }, 500);
    }

}
