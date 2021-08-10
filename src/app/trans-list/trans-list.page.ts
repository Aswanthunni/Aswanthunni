import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';
import { TransUpdatePage } from '../trans-update/trans-update.page';

@Component({
  selector: 'app-trans-list',
  templateUrl: './trans-list.page.html',
  styleUrls: ['./trans-list.page.scss'],
})
export class TransListPage implements OnInit {
  history = [];
  params: any;
  userId: any;
  constructor(private db: DbService, public router: Router, public modalController: ModalController) { }

  ngOnInit() {
    const state = this.router.getCurrentNavigation().extras.state
    if (state) {
        this.userId = state.id;
        this.getLatestGymdata();
    }
  }

  getLatestAddata() {
    this.history = [];
    return this.db.storage.executeSql('SELECT adpackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestGymdata() {
    this.history = [];
    return this.db.storage.executeSql('SELECT gympackagedue.id, customerid, packageid , totalpaid , balance , paymentdate , duedate , createdate, name, details FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE customerid = ? ',[this.userId]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.history.push(item);
      }
      this.sortBydate();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  sortBydate() {
    this.history.sort((a, b) => new Date(b.paymentdate).getTime() - new Date(a.paymentdate).getTime());
  }

  getEvent(event) {
    if (event === 'gym') {
      this.getLatestGymdata();
    } else if (event === 'add') {
      this.getLatestAddata();
    }
  }

  async updatePackage(data) {
    const modal = await this.modalController.create({
      component: TransUpdatePage,
      componentProps : {params : data},
      swipeToClose: true,
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    modal.onDidDismiss().then((data) => {
      // if (data.data === 'update') {
      //   this.getLatestGymdata(this.activatedRoute.snapshot.paramMap.get('id'));
      // }
    })

    return await modal.present()
  }

}
