import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-balance-settle-popup',
  templateUrl: './balance-settle-popup.page.html',
  styleUrls: ['./balance-settle-popup.page.scss'],
})
export class BalanceSettlePopupPage implements OnInit {
  params: any;
  customerForm: FormGroup;
  constructor(private navParams: NavParams, private datePicker: DatePicker,
    private fb: FormBuilder, private db: DbService, private viewCtrl: ModalController) { }

  ngOnInit() {
    this.params = this.navParams.get('params').data;
    this.buildForm();
  }

  buildForm() {
    this.customerForm = this.fb.group({
      balance: [this.params.bal, Validators.required],
      amount: ['', Validators.required],
      paydate: ['', Validators.required],
      balamount: ['', Validators.required],
      comments : ''
    });

    this.customerForm.controls.amount.valueChanges.subscribe((value) => {
      if (this.customerForm.controls.balance.value) {
      const bal = +this.customerForm.controls.balance.value - +value
      this.customerForm.controls.balamount.setValue(bal);
      }
    });
  }

  updateGymDue() {
    const bal =  0 - +this.customerForm.controls.amount.value;
    let data = [this.params.userId, this.params.packageid, this.customerForm.controls.amount.value,
      bal, this.customerForm.controls.paydate.value,
      this.params.duedate, this.params.createdate, this.customerForm.controls.comments.value,1]
    return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.success();
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  updateAddDue() {
    const bal =  0 - +this.customerForm.controls.amount.value;
    let data = [this.params.userId, this.params.packageid, this.customerForm.controls.amount.value,
      bal, this.customerForm.controls.paydate.value,
      this.params.duedate, this.params.createdate, this.customerForm.controls.comments.value, 1]
    return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.success();
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  showCalender() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then(
      (dateTime) => {
        const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
        this.customerForm.controls.paydate.setValue(dFormat);
      },
      err => JSON.stringify(err)
    );
  }

  decideSave() {
    if (this.customerForm.controls.balamount.value && +this.customerForm.controls.balamount.value < 0 ) {
      alert('No negative value for Balance');
      return false;
    }
    if (this.params.type === 'gym') {
        this.updateGymDue();
    } else if (this.params.type === 'ad') {
        this.updateAddDue();
    }
  }

  closePop() {
    this.viewCtrl.dismiss('dismissed')
  }

  success() {
    alert('Balance updated successfully');
    if (this.params.type === 'balancelist') {
    this.db.balSettle.next('updated');
    }
    this.viewCtrl.dismiss('update');
  }

}
