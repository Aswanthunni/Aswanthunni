import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-admission-trans',
  templateUrl: './admission-trans.page.html',
  styleUrls: ['./admission-trans.page.scss'],
})
export class AdmissionTransPage implements OnInit {
  dueData = [];
  cloneArray = [];
  limit = 10;
  offset = 0;
  totalCustomer = 0;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private db: DbService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getTransCount();
  }

  ionViewWillEnter() { window.dispatchEvent(new Event('resize')); }

  getTransCount() {
    return this.db.storage.executeSql('SELECT COUNT(regfeedue.id) as count FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid where customertable.isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.totalCustomer = item.count;
      }
      this.getTrans(10, 0)
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getTrans(limit, offset) {
    return this.db.storage.executeSql('SELECT regfeedue.id as id, name, mobile, totalpaid, paymentdate, comments FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid where customertable.isactive = 1 LIMIT ? OFFSET ?',[limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.dueData.push(item);
      }
      this.dueData.sort((a, b) => new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime());
      this.cloneArray = JSON.parse(JSON.stringify(this.dueData));
            //Hide Infinite List Loader on Complete
            this.infiniteScroll.complete();

            //Rerender Virtual Scroll List After Adding New Data
            this.virtualScroll.checkEnd();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }


  filterList(evt) {
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      this.dueData = this.cloneArray;
      return;
    }
  
    // this.dueData = this.cloneArray.filter(currentFood => {
    //   if (currentFood.name && searchTerm) {
    //     return (currentFood.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
    //   }
    // });

    if (searchTerm) {
      this.searchinDB(searchTerm);
    }
  }

  searchinDB(string) {
    let a = ['%'+string+'%', '%'+string+'%']
    let b = [];
    return this.db.storage.executeSql('SELECT regfeedue.id as id, name, mobile, totalpaid, paymentdate, comments FROM regfeedue INNER JOIN customertable ON customertable.id = regfeedue.customerid where (name LIKE ? or mobile LIKE ?) and customertable.isactive = 1',a).then(data => { 
      //  this.db.dismissLoader();
           for (let i = 0; i < data.rows.length; i++) {
             let item = data.rows.item(i);
             b.push(item);
           }
            this.dueData = b;
            this.infiniteScroll.complete();
            this.virtualScroll.checkEnd();
         },(err) => {
           alert(JSON.stringify(err));
       //  this.db.dismissLoader();
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
            this.deleteAd(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteAd(id) {
    return this.db.storage.executeSql('DELETE FROM regfeedue WHERE id = ?', [id])
    .then(_ => {
      this.dueData = [];
      this.getTrans(10, 0);
    });
  }

  loadData(event) {
    this.offset = this.offset + 10;
    // Using settimeout to simulate api call 
    setTimeout(() => {

      // load more data
      this.getTrans(this.limit, this.offset)

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.dueData.length == this.totalCustomer) {
        event.target.disabled = true;
      }
    }, 500);
  }

  itemHeightFn(item, index) {
    return 115;
}

}
