import { Component, OnDestroy, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonVirtualScroll, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { BalanceDuePopupPage } from '../balance-due-popup/balance-due-popup.page';
import { DbService } from '../db.service';
import { takeUntil } from 'rxjs/operators';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagePreviewPage } from '../image-preview/image-preview.page';

@Component({
  selector: 'app-balance-due',
  templateUrl: './balance-due.page.html',
  styleUrls: ['./balance-due.page.scss'],
})
export class BalanceDuePage implements OnInit, OnDestroy {
  balanceArrayBackup = [];
  balanceArray = [];
  balanceArray2 = [];
  cloneArray = [];
  gymLimit = 0;
  adLimit = 0;
  limit = 10;
  offset = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  private ngUnsubscribe = new Subject();
  constructor(public db: DbService, public modalController: ModalController, private file: File, private dom: DomSanitizer) { }
  ngOnDestroy(): void {
    this.db.balSettle.next('');
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.sumtotalbalAdCount();
    this.db.returnbalSettle()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((res) => {
      if (res === 'updated') {
        this.sumtotalbalAdCount();
      }
    });
  }
  
  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

  sumtotalbalAdCount() {
    return this.db.storage.executeSql('SELECT COUNT(DISTINCT adpackagedue.customerid) as count FROM adpackagedue INNER JOIN customertable on customertable.id = adpackagedue.customerid where customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.adLimit += +item.count;
      }
      this.sumtotalbalGymCount();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalGymCount() {
    return this.db.storage.executeSql('SELECT COUNT(DISTINCT gympackagedue.customerid) as count FROM gympackagedue INNER JOIN customertable on customertable.id = gympackagedue.customerid where customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.gymLimit += +item.count;
      }
      this.sumtotalbalAd(10, 0);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }


  sumtotalbalAd(limit, offset) {
    this.balanceArrayBackup = [];
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , mobile, customertable.id as id, img, customertable.isactive as active FROM adpackagedue INNER JOIN customertable on customertable.id = adpackagedue.customerid where customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0 ORDER BY name COLLATE NOCASE ASC LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArrayBackup.push(item);
      }
      this.sumtotalbalGym(limit, offset);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalGym(limit, offset) {
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , mobile, customertable.id as id, img, customertable.isactive as active FROM gympackagedue INNER JOIN customertable on customertable.id = gympackagedue.customerid where customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0 ORDER BY name COLLATE NOCASE ASC LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArrayBackup.push(item);
      }
      this.reduceArray();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  reduceArray() {
    const mutate = this.balanceArrayBackup.reduce((obj, item) => {
      obj[item.id] ? obj[item.id].bal = +obj[item.id].bal + +item.bal : (obj[item.id] = { ...item });
      return obj;
    }, {});

    this.splitArray(mutate);
  }

  splitArray(mutate) {
  let copyArray = [];
  for (let key in mutate) {
    copyArray.push(mutate[key])
  }
  copyArray.forEach((item) => {
    this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
  })
  copyArray.sort((a, b) => a.name.localeCompare(b.name));
  copyArray.forEach((x) => {
    this.balanceArray.push(x);
  })

  this.cloneArray = JSON.parse(JSON.stringify(this.balanceArray));
        //Hide Infinite List Loader on Complete
        this.infiniteScroll.complete();

        //Rerender Virtual Scroll List After Adding New Data
        this.virtualScroll.checkEnd();
  }

  filterList(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.balanceArray = this.cloneArray;
      return;
    }
  
    // this.balanceArray = this.cloneArray.filter(currentFood => {
    //   if (currentFood.name && searchTerm) {
    //     return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentFood.mobile.indexOf(searchTerm) > -1);
    //   }
    // });
    
    if (searchTerm) {
      this.searchinDB(searchTerm);
    }
  }

  searchinDB(string) {
    this.sumtotalbalAdSearch(string+'%');
    
  }

  sumtotalbalAdSearch(string) {
    this.balanceArray2 = [];
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , mobile, customertable.id as id, img, customertable.isactive as active FROM adpackagedue INNER JOIN customertable on customertable.id = adpackagedue.customerid where (name LIKE ? or mobile LIKE ?) and customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0 ORDER BY name COLLATE NOCASE ASC',[string, string]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray2.push(item);
      }
      this.sumtotalbalGymSearch(string);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalGymSearch(string) {
    return this.db.storage.executeSql('SELECT SUM(balance) as bal, name , mobile, customertable.id as id, img, customertable.isactive as active FROM gympackagedue INNER JOIN customertable on customertable.id = gympackagedue.customerid where (name LIKE ? or mobile LIKE ?) and customertable.isactive = 1 GROUP BY customerid HAVING SUM(balance) > 0 ORDER BY name COLLATE NOCASE ASC',[string, string]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray2.push(item);
      }
      this.reduceArray2();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  reduceArray2() {
    const mutate = this.balanceArray2.reduce((obj, item) => {
      obj[item.id] ? obj[item.id].bal = +obj[item.id].bal + +item.bal : (obj[item.id] = { ...item });
      return obj;
    }, {});

    this.splitArray2(mutate);
  }

  splitArray2(mutate) {
    this.balanceArray2 = [];
  for (let key in mutate) {
    this.balanceArray2.push(mutate[key])
  }
  this.balanceArray2.sort((a, b) => b.active - a.active || a.name.localeCompare(b.name));
  this.balanceArray.forEach((item) => {
    this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', item.img, item);
  })
  this.balanceArray = this.balanceArray2;
  this.infiniteScroll.complete();

  //Rerender Virtual Scroll List After Adding New Data
  this.virtualScroll.checkEnd();
  }


  async openpopoup(id) {
    const modal = await this.modalController.create({
      component: BalanceDuePopupPage,
      componentProps : {params : { userId : id}},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        this.sumtotalbalAd(10, 0);
      }
    })

    return await modal.present()
  }

  loadData(event) {
    this.offset = this.offset + 10;
    // Using settimeout to simulate api call 
    setTimeout(() => {

      // load more data
      this.sumtotalbalAd(this.limit, this.offset)
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.balanceArray.length == (this.adLimit + this.gymLimit)) {
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
  //    alert(JSON.stringify(err));
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
