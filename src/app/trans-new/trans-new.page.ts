import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-trans-new',
  templateUrl: './trans-new.page.html',
  styleUrls: ['./trans-new.page.scss'],
})
export class TransNewPage implements OnInit {
  package = [];
  createDate = '';
  params: any;
  customerForm: FormGroup;
  constructor(private db: DbService, public navParams: NavParams, private fb: FormBuilder, private datePicker: DatePicker, private viewCntrl: ModalController) { }

  ngOnInit() {
    this.params = this.navParams.get('params');
    this.buildForm();
    if (this.params.type === 'gym') {
      this.getLatestGymdata(this.params.id);
    } else  if (this.params.type === 'add') {
      this.getLatestAdata(this.params.id);
    }
  }

  buildForm() {
    this.customerForm = this.fb.group({
      paydate: ['', Validators.required],
      duedate: ['', Validators.required],
      package: ['', Validators.required],
      Fees: ['', Validators.required],
      totalpaid: ['', Validators.required],
      balance: ['', Validators.required],
      comments: ''
    });

    this.customerForm.controls.totalpaid.valueChanges.subscribe((value) => {
      if (this.customerForm.controls.Fees.value) {
      const bal = +this.customerForm.controls.Fees.value - +value
      this.customerForm.controls.balance.setValue(bal);
    }
    })
  }

  getLatestGymdata(id) {
    this.package = [];
    return this.db.storage.executeSql('SELECT packageid, name, fees, details, createdate FROM gympackagedue INNER JOIN packagetable on packagetable.id = gympackagedue.packageid WHERE gympackagedue.id IN (SELECT MAX(id) FROM gympackagedue where customerid = ? GROUP BY packageid) and gympackagedue.isactive = 1',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.package.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getLatestAdata(id) {
    this.package = [];
    return this.db.storage.executeSql('SELECT packageid, name, fees, details, createdate FROM adpackagedue INNER JOIN adpackagetable on adpackagetable.id = adpackagedue.packageid WHERE adpackagedue.id IN (SELECT MAX(id) FROM adpackagedue where customerid = ? GROUP BY packageid) and adpackagedue.isactive = 1',[id]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.package.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  packageChange() {
    const id = this.customerForm.get('package').value;
    if (id) {
      const index = this.package.findIndex( i => i.packageid == id);
      if (index > -1) {
        this.customerForm.get('Fees').setValue(this.package[index].fees);
        this.createDate = this.package[index].createdate;
      }
    }
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

  updateGymDue() {
    let data = [this.params.id, this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value, this.createDate , this.customerForm.controls.comments.value, 1]
    return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.saveSuccess();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  updateAdDue() {
    let data = [this.params.id, this.customerForm.controls.package.value, this.customerForm.controls.totalpaid.value,
      this.customerForm.controls.balance.value, this.customerForm.controls.paydate.value,
      this.customerForm.controls.duedate.value, this.createDate , this.customerForm.controls.comments.value, 1]
    return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.saveSuccess();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  decideSave() {
    if (this.customerForm.controls.duedate.value && this.customerForm.controls.paydate.value && new Date(this.customerForm.controls.duedate.value) < new Date(this.customerForm.controls.paydate.value)) {
      alert('Due Date should be greater than Pay Date');
      return false;
    }
    if (this.customerForm.controls.balance.value && +this.customerForm.controls.balance.value < 0 ) {
      alert('No negative value for Balance');
      return false;
    }
    if (this.params.type === 'gym') {
      this.updateGymDue();
    } else if (this.params.type === 'add') {
      this.updateAdDue();
    }
  }

  closePop() {
    this.viewCntrl.dismiss();
  }

  saveSuccess() {
    alert('Transaction added successfully')
    this.viewCntrl.dismiss('update');
  }

}
