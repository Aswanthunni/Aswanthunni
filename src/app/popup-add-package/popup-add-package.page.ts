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
  regReq = false;
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
      totalpaid: ['', [Validators.required, Validators.min(0)]],
      balance: ['', [Validators.required, Validators.min(0)]],
      regfees: '',
      regfeesPaid :''
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
      this.customerForm.controls.duedate.value, this.customerForm.controls.paydate.value, 'Initial Payment', 1]
    return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      alert('Package Added Successfully')
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
      alert('Package Updated Successfully');
      this.viewCtrl.dismiss('update');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  gymPackageInsert() {
    let data = [this.params.userId, this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value, this.customerForm.controls.paydate.value, 'Initial Payment', 1]
    return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      if (this.regReq) {
        this.updateRegDue(this.params.userId);
      }
      this.checkPackageExist();
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  checkPackageExist() {
    if (this.params.packageId && this.params.packageId.length) {
      const index = this.params.packageId.indexOf(this.customerForm.controls.package.value);
      if (index > -1) {
        this.params.packageId.splice(index, 1);
        this.makePreviousInactiveGym(this.params.packageId);
      } else {
        this.makePreviousInactiveGym(this.params.packageId);
      }
    }
  }

  makePreviousInactiveGym(pack) {
    return this.db.storage.executeSql('UPDATE gympackagedue SET isactive = 0 WHERE customerid = ? and packageid IN (' + pack.toString() + ')', [this.params.userId]).then(res => {
      alert('Package Added Successfully')
      this.viewCtrl.dismiss('add');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  updateRegDue(id) {
    const balance = +this.customerForm.controls.regfees.value - +this.customerForm.controls.regfeesPaid.value;
    let data = [id, this.customerForm.controls.regfees.value, this.customerForm.controls.regfeesPaid.value,
      balance, this.customerForm.controls.paydate.value, 'Initial Payment', 1]
    return this.db.storage.executeSql('INSERT INTO regfeedue (customerid, fees, totalpaid, balance, paymentdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  gymPackageUpdate() {
    let data = [this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value]
    return this.db.storage.executeSql(`UPDATE gympackagedue SET packageid = ?, totalpaid = ?, balance = ?, paymentdate = ?, duedate = ? WHERE id = ${this.updateData.id}`, data)
    .then(res => {
      alert('Package Updated Successfully');
      this.viewCtrl.dismiss('update');
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  decideSave() {
    if (this.customerForm.controls.balance.value && +this.customerForm.controls.balance.value < 0 ) {
      alert('No negative value for Balance');
      return false;
    }

    if (this.customerForm.controls.duedate.value && this.customerForm.controls.paydate.value && new Date(this.customerForm.controls.duedate.value) < new Date(this.customerForm.controls.paydate.value)) {
      alert('Due Date should be greater than Pay Date');
      return false;
    }

    if (this.regReq && this.customerForm.controls.regfees.value && this.customerForm.controls.regfeesPaid.value && +this.customerForm.controls.regfeesPaid.value > +this.customerForm.controls.regfees.value ) {
      alert('Admission Fees is less than Paid Fee');
      return false;
    }

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

  toggle() {
    this.regReq ? this.setgymMandate() : this.unsetgymMandate();
  }

  setgymMandate() {
    const array = ['regfees','regfeesPaid'];
    array.forEach((val) => {
      this.customerForm.controls[val].setValidators([Validators.required, Validators.min(0)]);
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: true, emitEvent : false});
    })
  }

  unsetgymMandate() {
    const array = ['regfees','regfeesPaid'];
    array.forEach((val) => {
      this.customerForm.controls[val].clearValidators();
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: false, emitEvent : false});
    })
  }


}
