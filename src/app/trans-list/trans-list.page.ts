import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, IonVirtualScroll, ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';
import { TransNewPage } from '../trans-new/trans-new.page';

@Component({
  selector: 'app-trans-list',
  templateUrl: './trans-list.page.html',
  styleUrls: ['./trans-list.page.scss'],
})
export class TransListPage implements OnInit {
  history = [];
  params: any;
  userId: any;
  defaultType = 'gym';
  limit = 10;
  offset = 0;
  totalGym = 0;
  totalAd = 0;
  registerHistory = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  constructor(private db: DbService, public router: Router, public modalController: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    if (state) {
        this.userId = state.id;
        this.getLatestGymdataCount();
    }
  }

  getLatestAddata(limit, offset) {
    return this.db.storage.executeSql('SELECT adpackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details, fees, comments FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE customerid = ? LIMIT ? OFFSET ?',[this.userId, limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestGymdata(limit, offset) {
    return this.db.storage.executeSql('SELECT gympackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details, fees, comments FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE customerid = ? LIMIT ? OFFSET ?',[this.userId, limit, offset]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestAddataCount() {
    this.history = [];
    return this.db.storage.executeSql('SELECT COUNT(packageid) as count FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.totalAd = item.count;
      }
      this.getLatestAddata(10, 0);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestGymdataCount() {
    this.history = [];
    return this.db.storage.executeSql('SELECT COUNT(packageid) as count FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.totalGym = item.count;
      }
      this.getLatestGymdata(10, 0);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sortBydate() {
          //Hide Infinite List Loader on Complete
          this.infiniteScroll.complete();

          //Rerender Virtual Scroll List After Adding New Data
          this.virtualScroll.checkEnd();
    this.history.sort((a, b) => new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime());
  }

  getEvent(event) {
    this.limit = 10;
    this.offset = 0;
    this.defaultType = event;
    if (event === 'gym') {
      this.getLatestGymdataCount()
    } else if (event === 'add') {
      this.getLatestAddataCount();
    }
  }

  async newPackage() {
    const data = {id : this.userId, type: this.defaultType};
    const modal = await this.modalController.create({
      component: TransNewPage,
      componentProps : {params : data},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      if (data.data === 'update') {
        if (this.defaultType === 'gym') {
          this.getLatestGymdataCount();
        } else {
          this.getLatestAddataCount();
        }

      }
    })

    return await modal.present()
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
            this.deleteTrans(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteTrans(id) {
    if (this.defaultType === 'gym') {
        this.deleteGym(id)
    } else if (this.defaultType === 'add') {
        this.deleteAd(id)
    }
  }

  deleteAd(id) {
    return this.db.storage.executeSql('DELETE FROM adpackagedue WHERE id = ?', [id])
    .then(_ => {
      this.getLatestAddataCount()
    });
  }

  deleteGym(id) {
    return this.db.storage.executeSql('DELETE FROM gympackagedue WHERE id = ?', [id])
    .then(_ => {
      this.getLatestGymdataCount()
    });
  }

  loadData(event) {
    this.offset = this.offset + 10;
    // Using settimeout to simulate api call 
    setTimeout(() => {

      if (this.defaultType === 'gym') {
        this.getLatestGymdata(this.limit,this.offset);
      } else if (this.defaultType === 'add') {
        this.getLatestAddata(10, 0);
      }
      // load more data




      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.defaultType === 'gym' && this.history.length == this.totalGym) {
        event.target.disabled = true;
      } else if (this.defaultType === 'add' && this.history.length == this.totalAd) {
        event.target.disabled = true;
      }
    }, 500);
  }


}
