import { Component, OnDestroy, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { AlertController, IonInfiniteScroll, IonVirtualScroll, ModalController, NavController } from '@ionic/angular';
import { DbService } from '../db.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

@Component({
  selector: 'app-customer-mgmt',
  templateUrl: './customer-mgmt.page.html',
  styleUrls: ['./customer-mgmt.page.scss'],
})
export class CustomerMgmtPage implements OnInit, OnDestroy {
  customerData = [];
  cloneArray = [];
  limit = 10;
  offset = 0;
  totalCustomer = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private nav: NavController, private db: DbService, private alertCtrl: AlertController, private modalController: ModalController, private file: File, private dom: DomSanitizer) { }
  ngOnDestroy(): void {
    this.db.customerCreate.next('')
  }

  ngOnInit() {
    this.getTotalCustomer();
    this.db.fetchCustomAdd().subscribe((res) => {
      if (res === 'created') {
        this.customerData = [];
        this.getTotalCustomer();
      }
    })
  }

  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

  addCustomer() {
    this.nav.navigateForward('/add-customer')
  }

  getTotalCustomer() {
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

  fetchPackage(limit, offset) {
 // this.db.showLoader();
  //  this.customerData = [];
  let data = [limit, offset];
    return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1 ORDER BY name ASC LIMIT ? OFFSET ?',data).then(data => { 
 //  this.db.dismissLoader();
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
        this.customerData.push(item);
      }
      this.cloneArray = this.customerData;
      this.infiniteScroll.complete();
      this.virtualScroll.checkEnd();
   // alert(this.customerData.length)
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
    //  alert(JSON.stringify(err));
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
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentFood.mobile.indexOf(searchTerm) > -1);
      }
    });

    if (!this.customerData.length && searchTerm && searchTerm.length > 4) {
      this.searchinDB(searchTerm);
    }
  }

  searchinDB(string) {
    let a = ['%'+string+'%', '%'+string+'%']
    let b = [];
    return this.db.storage.executeSql('SELECT * FROM customertable where (name LIKE ? or mobile like ?) and isactive = 1 ORDER BY name ASC',a).then(data => { 
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

  navigateEdit(id) {
    const params = { type : 'update', id }
    this.nav.navigateForward('/add-customer', { state: params })
  }

  deleteCustomer(id) {
    return this.db.storage.executeSql(`UPDATE customertable SET isactive = ? WHERE id = ${id}`, [0])
    .then(_ => {
      this.updateGymDue(id);
      this.updateAdDue(id);
      this.customerData = [];
      this.getTotalCustomer();
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  updateGymDue(id) {
    return this.db.storage.executeSql('UPDATE gympackagedue SET isactive = 0 WHERE customerid = ?', [id]).then(res => {
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  updateAdDue(id) {
    return this.db.storage.executeSql('UPDATE adpackagedue SET isactive = 0 WHERE customerid = ?', [id]).then(res => {
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  async presentAlertConfirm(id) {
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
            this.deleteCustomer(id);
          }
        }
      ]
    });

    await alert.present();
  }
  
  navigatePackage(id) {
    this.db.userId = id;
    this.nav.navigateForward('/package-manager');
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

  loadData(event) {
    this.offset = this.offset + 10;
    // Using settimeout to simulate api call 
    setTimeout(() => {

      // load more data
      this.fetchPackage(this.limit, this.offset)

      //Hide Infinite List Loader on Complete

      //Rerender Virtual Scroll List After Adding New Data
    //  this.virtualScroll.checkEnd();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.customerData.length == this.totalCustomer) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }


  itemHeightFn(item, index) {
    return 68;
}

}
