import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-popup-add-package',
  templateUrl: './popup-add-package.page.html',
  styleUrls: ['./popup-add-package.page.scss'],
})
export class PopupAddPackagePage implements OnInit {
  customerForm: FormGroup;
  package = [];
  params: any;
  updateData: any;
  btntxt = '';
  constructor(public viewCtrl: ModalController,
    private datePicker: DatePicker,
    private fb: FormBuilder,
    private db: DbService,public navParams: NavParams) { }

  ngOnInit() {
    this.params = this.navParams.get('params');
    this.buildForm();
  }

  buildForm() {
    this.customerForm = this.fb.group({
      paydate: ['', Validators.required],
      duedate: ['', Validators.required],
      package: ['', Validators.required],
      Fees: ['', Validators.required],
      totalpaid: ['', Validators.required],
      balance: ['', Validators.required],
    });

    this.customerForm.controls.totalpaid.valueChanges.subscribe((value) => {
      if (this.customerForm.controls.Fees.value) {
      const bal = +this.customerForm.controls.Fees.value - +value
      this.customerForm.controls.balance.setValue(bal);
      }
    });
    this.btntxt = 'add';
    if (this.params.type === 'add') {
      this.getAddPackage();
    }

    if (this.params.type === 'gym') {
      this.getGymPackage();
    }

    if (this.params.type === 'add' && this.params.action === 'update') {
      this.btntxt = 'update';
      this.updateData = this.params.updateData;
    }

    if (this.params.type === 'gym' && this.params.action === 'update') {
      this.btntxt = 'update';
      this.updateData = this.params.updateData;
    }
  }

  presetData() {
    let res = this.updateData;
    this.customerForm.controls.package.setValue(res.packageid);
    this.customerForm.controls.paydate.setValue(res.paymentdate);
    this.customerForm.controls.duedate.setValue(res.duedate);
    this.customerForm.controls.totalpaid.setValue(res.paid);
    this.customerForm.controls.balance.setValue(res.balance);
    this.customerForm.controls.Fees.setValue(res.packageFees);
  }

  closePop() {
    this.viewCtrl.dismiss('dismissed')
  }

  showCalender(controls) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      (dateTime) => {
        const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
        this.customerForm.get(controls).setValue(dFormat);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  packageChange() {
    const id = this.customerForm.get('package').value;
    if (id) {
      const index = this.package.findIndex( i => i.id == id);
      if (index > -1) {
        this.customerForm.get('Fees').setValue(this.package[index].fees);
      }
    }
  }

  addPackage() {

  }

  additionalPackageInsert() {
    let data = [this.params.userId, this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value, this.customerForm.controls.paydate.value, 1]
    return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      alert(res);
      this.viewCtrl.dismiss('add');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  additionalPackageUpdate() {
    let data = [this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value]
    return this.db.storage.executeSql(`UPDATE adpackagedue SET packageid = ?, totalpaid = ?, balance = ?, paymentdate = ?, duedate = ? WHERE id = ${this.updateData.id}`, data)
    .then(res => {
      alert(res);
      this.viewCtrl.dismiss('update');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  gymPackageInsert() {
    let data = [this.params.userId, this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value, this.customerForm.controls.paydate.value, 1]
    return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      if (this.params.packageId.length) {
        this.makePreviousInactiveGym(this.params.packageId);
      }
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  makePreviousInactiveGym(pack) {
    return this.db.storage.executeSql('UPDATE gympackagedue SET isactive = 0 WHERE packageid IN (' + pack.toString() + ')', []).then(res => {
      this.viewCtrl.dismiss('add');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  gymPackageUpdate() {
    let data = [this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value]
    return this.db.storage.executeSql(`UPDATE gympackagedue SET packageid = ?, totalpaid = ?, balance = ?, paymentdate = ?, duedate = ? WHERE id = ${this.updateData.id}`, data)
    .then(res => {
      alert(res);
      this.viewCtrl.dismiss('update');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  decideSave() {
    if (this.params.type === 'add' && this.btntxt === 'add') {
      this.additionalPackageInsert();
    } else if (this.params.type === 'add' && this.btntxt === 'update') {
      this.additionalPackageUpdate();
    }  else if (this.params.type === 'gym' && this.btntxt === 'add') {
      this.gymPackageInsert();
    } else if (this.params.type === 'gym' && this.btntxt === 'update') {
      this.gymPackageUpdate();
    }
  }

  getAddPackage() {
    this.package = [];
    return this.db.storage.executeSql('SELECT * FROM adpackagetable where isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.package.push(item);
      }
      this.presetData();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getGymPackage() {
    this.package = [];
    return this.db.storage.executeSql('SELECT * FROM packagetable where isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.package.push(item);
      }
      this.presetData();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

}
