import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { NavParams, ModalController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-admission-settle',
  templateUrl: './admission-settle.page.html',
  styleUrls: ['./admission-settle.page.scss'],
})
export class AdmissionSettlePage implements OnInit {

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
      balance: [this.params.due, Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      paydate: ['', Validators.required],
      balamount: ['', [Validators.required, Validators.min(0)]],
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
    let data = [this.params.userId, this.params.fees, this.customerForm.controls.amount.value,
      bal, this.customerForm.controls.paydate.value,this.customerForm.controls.comments.value,1]
    return this.db.storage.executeSql('INSERT INTO regfeedue (customerid, fees, totalpaid, balance, paymentdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?)', data)
    .then(res => {
      this.success();
    },(err) => {
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

  closePop() {
    this.viewCtrl.dismiss('dismissed')
  }

  success() {
    alert('Balance updated successfully');
    this.viewCtrl.dismiss('updated');
  }


}
