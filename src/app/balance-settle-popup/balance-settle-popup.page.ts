import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { NavParams } from '@ionic/angular';
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
    private fb: FormBuilder, private db: DbService) { }

  ngOnInit() {
    this.params = this.navParams.get('params').data;
    this.buildForm();
    alert(JSON.stringify(this.params));
  }

  buildForm() {
    this.customerForm = this.fb.group({
      balance: [this.params.bal, Validators.required],
      amount: ['', Validators.required],
      paydate: ['', Validators.required],
      balamount: ['', Validators.required]
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
      this.params.duedate, this.params.createdate, 1]
    return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      alert(JSON.stringify(res));
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  // updateAddDue() {
  //   let data = [id, this.customerForm.controls.adpackage.value, this.customerForm.controls.adtotalpaid.value,
  //     this.customerForm.controls.adbalance.value, this.customerForm.controls.adpaydate.value,
  //     this.customerForm.controls.adduedate.value, this.customerForm.controls.adpaydate.value, 1]
  //   return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
  //   .then(res => {
  //     alert(res);
  //   }, (err) => {
  //     alert(JSON.stringify(err));
  //   });
  // }

  showCalender() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      (dateTime) => {
        const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
        alert(JSON.stringify(dFormat))
        this.customerForm.controls.paydate.setValue(dFormat);
      },
      err => JSON.stringify(err)
    );
  }

  decideSave() {
    if (this.params.type === 'gym') {
        this.updateGymDue();
    } else if (this.params.type === 'ad') {
      //  this.updateAddDue();
    }
  }

}
