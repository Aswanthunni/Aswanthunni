import { Component, OnInit, Sanitizer, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { AlertController, IonInfiniteScroll, IonVirtualScroll, ModalController } from '@ionic/angular';
import { DbService } from '../db.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

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
  constructor(private db: DbService, private alertCtrl: AlertController, private file: File, private dom: DomSanitizer, private modalController: ModalController) { }

  ngOnInit() {
    this.getTotalCustomer();
  }

  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

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
      return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 0 ORDER BY name COLLATE NOCASE ASC LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
     //   this.db.dismissLoader();
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
          this.customerData.push(item);
        }
        this.cloneArray = JSON.parse(JSON.stringify(this.customerData));
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
    
      // this.customerData = this.cloneArray.filter(currentFood => {
      //   if (currentFood.name && searchTerm) {
      //     return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentFood.mobile.indexOf(searchTerm) > -1);
      //   }
      // });

      if (searchTerm) {
        this.searchinDB(searchTerm);
      }
    }

    searchinDB(string) {
      let a = ['%'+string+'%', '%'+string+'%']
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where (name LIKE ? or mobile LIKE ?) and isactive = 0 ORDER BY name COLLATE NOCASE ASC',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
              this.customerData = b;
              this.infiniteScroll.complete();
              this.virtualScroll.checkEnd();
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

    async imagePreview(data) {
      const modal = await this.modalController.create({
        component: ImagePreviewPage,
        componentProps : {params : data},
        swipeToClose: true,
        presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
      });
  
      modal.onDidDismiss().then((data) => {
        
      })
  
      return await modal.present()
    }

    itemHeightFn(item, index) {
      return 68;
  }

  deletePermanent(id) {
    return this.db.storage.executeSql('DELETE FROM regfeedue WHERE customerid = ?', [id])
    .then(_ => {
      return this.db.storage.executeSql('DELETE FROM adpackagedue WHERE customerid = ?', [id])
      .then(_ => {
        return this.db.storage.executeSql('DELETE FROM gympackagedue WHERE customerid = ?', [id])
        .then(_ => {
          return this.db.storage.executeSql('DELETE FROM customertable WHERE id = ?', [id])
          .then(_ => {
           alert('Deleted Permenantly')
    this.customerData = [];
    this.fetchPackage(10, 0);
          });
        });
      });
    });
  }

  async delete(id) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are sure want to delete ?',
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
            this.deletePermanent(id);
          }
        }
      ]
    });

    await alert.present();
  }

}
