import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DbService } from '../db.service';
import { HistoryPaymentListPage } from '../history-payment-list/history-payment-list.page';

@Component({
  selector: 'app-history-package-list',
  templateUrl: './history-package-list.page.html',
  styleUrls: ['./history-package-list.page.scss'],
})
export class HistoryPackageListPage implements OnInit {
  userId = '';
  fetchAllPackage = [];
  packageId = [];
  balanceArray = [];
  AllPackage = [];
  type = 'gym';
  constructor(private router: Router, private db: DbService, private modalController: ModalController) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const pageName = this.router.getCurrentNavigation().extras.state;
      this.userId = pageName.id;
      this.getLatestAddata(this.userId);
    }
  }

  getLatestGymdata(id) {
    this.fetchAllPackage = [];
    this.packageId = [];
    this.balanceArray = [];
    this.AllPackage = [];
    return this.db.storage.executeSql('SELECT * FROM adpackagedue WHERE id IN (SELECT MAX(id) FROM adpackagedue where customerid = ? GROUP BY packageid)',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.packageId.push(item.packageid)
        this.fetchAllPackage.push(item);
      }
      this.sumtotalbal(id);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbal(id) {
    return this.db.storage.executeSql('SELECT packageid, SUM(totalpaid) as total, SUM(balance) as bal FROM adpackagedue where customerid = ? GROUP BY packageid',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray.push(item);
      }
      this.fetchPackageDetails();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  fetchPackageDetails() {
    return this.db.storage.executeSql('SELECT * FROM adpackagetable WHERE id IN (' + this.packageId.toString() + ')',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.AllPackage.push(item);
      }
      this.buildPackage();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  buildPackage() {
    this.fetchAllPackage.forEach((data) => {
      const index = this.AllPackage.findIndex( x => data.packageid == x.id);
      const index2 = this.balanceArray.findIndex( x => data.packageid == x.packageid);
      if (index > -1) {
        data.packageName = this.AllPackage[index].name;
        data.packageDetails = this.AllPackage[index].details;
        data.packageFees = this.AllPackage[index].fees;
      }

      if (index2 > -1) {
        data.paid = this.balanceArray[index2].total;
        data.balance = this.balanceArray[index2].bal;
      }
    })
  }


  getLatestAddata(id) {
    this.fetchAllPackage = [];
    this.packageId = [];
    this.balanceArray = [];
    this.AllPackage = [];
    return this.db.storage.executeSql('SELECT * FROM gympackagedue WHERE id IN (SELECT MAX(id) FROM gympackagedue where customerid = ? GROUP BY packageid)',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.packageId.push(item.packageid)
        this.fetchAllPackage.push(item);
      }
      this.sumtotalbalAd(id);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sumtotalbalAd(id) {
    return this.db.storage.executeSql('SELECT packageid, SUM(totalpaid) as total, SUM(balance) as bal FROM gympackagedue where customerid = ? GROUP BY packageid',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.balanceArray.push(item);
      }
      this.fetchPackageDetailsAd();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  fetchPackageDetailsAd() {
    return this.db.storage.executeSql('SELECT * FROM packagetable WHERE id IN (' + this.packageId.toString() + ')',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.AllPackage.push(item);
      }
      this.buildPackageAd();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  buildPackageAd() {
    this.fetchAllPackage.forEach((data) => {
      const index = this.AllPackage.findIndex( x => data.packageid == x.id);
      const index2 = this.balanceArray.findIndex( x => data.packageid == x.packageid);
      if (index > -1) {
        data.packageName = this.AllPackage[index].name;
        data.packageDetails = this.AllPackage[index].details;
        data.packageFees = this.AllPackage[index].fees;
      }

      if (index2 > -1) {
        data.paid = this.balanceArray[index2].total;
        data.balance = this.balanceArray[index2].bal;
      }
    })
  }

  async viewhistory(id) {
    const modal = await this.modalController.create({
      component: HistoryPaymentListPage,
      swipeToClose: true,
      componentProps : {params : { userId : this.userId, pkgId : id , type: this.type}},
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    // modal.onDidDismiss().then((data) => {
    //   if (data.data === 'add') {
    //     this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
    //   }
    // })

    return await modal.present()
  }

  getEvent(event) {
    this.type = event;
    if (event === 'gym') {
      this.getLatestAddata(this.userId);
    } else if (event === 'add') {
      this.getLatestGymdata(this.userId);
    }
  }

}
