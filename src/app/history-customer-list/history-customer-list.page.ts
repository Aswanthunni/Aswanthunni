import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { IonInfiniteScroll, IonVirtualScroll, ModalController, NavController } from '@ionic/angular';
import { DbService } from '../db.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

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
  constructor(private db: DbService, private nav: NavController, private activatedRoute: ActivatedRoute, private file: File, private dom: DomSanitizer, private modalController: ModalController) { }

  ngOnInit() {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.getTotalCustomerDue();
  }

  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

    fetchPackagedue(limit, offset) {
      //  this.db.showLoader();
        let data = [limit, offset];
        return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1 ORDER BY name COLLATE NOCASE ASC LIMIT ? OFFSET ?', data).then(data => { 
       //   this.db.dismissLoader();
          for (let i = 0; i < data.rows.length; i++) {
            let item = data.rows.item(i);
            this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
            this.custData.push(item);
          }
          this.cloneArray = JSON.parse(JSON.stringify(this.custData));
                          //Hide Infinite List Loader on Complete
                          this.infiniteScroll.complete();
  
                          //Rerender Virtual Scroll List After Adding New Data
                          this.virtualScroll.checkEnd();
        },(err) => {
          alert(JSON.stringify(err));
        //  this.db.dismissLoader();
        });
      }

      getTotalCustomerDue() {
        return this.db.storage.executeSql('SELECT COUNT(id) as count FROM customertable where isactive = 1',[]).then(data => { 
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.totalCustomer = item.count;
             }
             this.fetchPackagedue(10, 0);
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
    
      // this.custData = this.cloneArray.filter(currentFood => {
      //   if (currentFood.name && searchTerm) {
      //     return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentFood.mobile.indexOf(searchTerm) > -1);
      //   }
      // });

      if (this.path === 'due' && searchTerm) {
        this.searchinDBDue(searchTerm);
      } else if (searchTerm) {
        this.searchinDB(searchTerm);
      }
    }
    searchinDB(string) {
      let a = ['%'+string+'%', '%'+string+'%']
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where (name LIKE ? or mobile LIKE ?) and isactive = 1 ORDER BY name COLLATE NOCASE ASC',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
              this.custData = b;
                               //Hide Infinite List Loader on Complete
                               this.infiniteScroll.complete();
  
                               //Rerender Virtual Scroll List After Adding New Data
                               this.virtualScroll.checkEnd();
           },(err) => {
             alert(JSON.stringify(err));
         //  this.db.dismissLoader();
           });
    }

    searchinDBDue(string) {
      let a = ['%'+string+'%', '%'+string+'%']
      let b = [];
      return this.db.storage.executeSql('SELECT * FROM customertable where (name LIKE ? or mobile LIKE ?) and isactive = 1 ORDER BY name COLLATE NOCASE ASC',a).then(data => { 
        //  this.db.dismissLoader();
             for (let i = 0; i < data.rows.length; i++) {
               let item = data.rows.item(i);
               this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
               b.push(item);
             }
              this.custData = b;
                               //Hide Infinite List Loader on Complete
                               this.infiniteScroll.complete();
  
                               //Rerender Virtual Scroll List After Adding New Data
                               this.virtualScroll.checkEnd();
  
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
  

          this.fetchPackagedue(this.limit, this.offset)
  

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
  

}
