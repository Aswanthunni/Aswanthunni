import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { IonInfiniteScroll, IonVirtualScroll, ModalController } from '@ionic/angular';
import { AdmissionSettlePage } from '../admission-settle/admission-settle.page';
import { DbService } from '../db.service';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

@Component({
  selector: 'app-admission-due',
  templateUrl: './admission-due.page.html',
  styleUrls: ['./admission-due.page.scss'],
})
export class AdmissionDuePage implements OnInit {
  dueData = [];
  cloneArray = [];
  limit = 10;
  offset = 0;
  totalCustomer = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private db: DbService, private modalController: ModalController, private file: File, private dom: DomSanitizer) { }

  ngOnInit() {
    this.getGymDataCount();
  }

  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

  getGymDataCount() {
    return this.db.storage.executeSql('SELECT COUNT(regfeedue.customerid) as count FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid GROUP BY regfeedue.customerid HAVING SUM(balance) > 0 ',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.totalCustomer += +item.count;
      }
      this.getGymData(10, 0)
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getGymData(limit, offset) {
    return this.db.storage.executeSql('SELECT SUM(balance) as due, name, img, fees, mobile, customertable.id as userId FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid GROUP BY regfeedue.customerid HAVING SUM(balance) > 0 ORDER BY name ASC LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
        this.dueData.push(item);
      }
      this.cloneArray = this.dueData;
      this.infiniteScroll.complete();
      this.virtualScroll.checkEnd();
    },(err) => {
      alert(JSON.stringify(err));
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
      this.dueData = this.cloneArray;
      return;
    }
  
    this.dueData = this.cloneArray.filter(currentFood => {
      if (currentFood.name && searchTerm) {
        return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });

    if (!this.dueData.length && searchTerm && searchTerm.length > 4) {
      this.searchinDB(searchTerm);
    }
  }

  searchinDB(string) {
    let a = [string+'%']
    let b = [];
    return this.db.storage.executeSql('SELECT SUM(balance) as due, name, img, fees, mobile, customertable.id as userId FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid where name LIKE ? GROUP BY regfeedue.customerid HAVING SUM(balance) > 0 ORDER BY name ASC',a).then(data => { 
      //  this.db.dismissLoader();
           for (let i = 0; i < data.rows.length; i++) {
             let item = data.rows.item(i);
             this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
             b.push(item);
           }
           if (b.length) {
            this.dueData = b;
            this.infiniteScroll.complete();
            this.virtualScroll.checkEnd();
           }
         },(err) => {
           alert(JSON.stringify(err));
       //  this.db.dismissLoader();
         });
  }


  loadData(event) {
    this.offset = this.offset + 10;
    // Using settimeout to simulate api call 
    setTimeout(() => {

      // load more data
      this.getGymData(this.limit, this.offset)
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.dueData.length == this.totalCustomer) {
        event.target.disabled = true;
      }
    }, 500);
  }

  async settle(data) {
    const modal = await this.modalController.create({
      component: AdmissionSettlePage,
      componentProps : {params : { data }},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'updated') {
        this.dueData = [];
        this.getGymData(10, 0);
      }
    })

    return await modal.present();
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
