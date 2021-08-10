import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../db.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {

  croppedImagepath = "assets/user.jpg";
  isLoading = false;
  addRequired = false;
  gymRequired = false;
  customerForm: FormGroup;
  adPackage = [];
  gymPackage = [];
  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  type:string;
  userId: any;
  gymTempData: any;
  btntext = '';
  title = '';
  gymmanArray = ['gympaydate','gymduedate', 'gympackage', 'gymFees', 'gymtotalpaid', 'gymbalance'];
  admanArray = ['adpaydate','adduedate', 'adpackage', 'adFees', 'adtotalpaid', 'adbalance'];

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private base64ToGallery: Base64ToGallery,
    private datePicker: DatePicker,
    private fb: FormBuilder,
    private db: DbService,
    public router: Router
  ) { }

  ngOnInit() {
    this.btntext = 'save';
    this.title = 'Add Customer'
    if (this.router.getCurrentNavigation().extras.state) {
      const pageName = this.router.getCurrentNavigation().extras.state;
      this.type = pageName.type; 
      this.userId = pageName.id;
      this.btntext = 'update';
      this.title = 'Update Customer';
    }
    this.buildForm();
  }

  buildForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['',  Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      adpaydate: '',
      adduedate: '',
      adpackage: '',
      adFees: '',
      adtotalpaid: '',
      adbalance: '',
      gympaydate: '',
      gymduedate: '',
      gympackage: '',
      gymFees: '',
      gymtotalpaid: '',
      gymbalance: '',
      regfees: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required]
    });

    this.customerForm.controls.gymtotalpaid.valueChanges.subscribe((value) => {
      if (this.customerForm.controls.gymFees.value) {
      const bal = +this.customerForm.controls.gymFees.value - +value
      this.customerForm.controls.gymbalance.setValue(bal);
    }
    })

    this.customerForm.controls.adtotalpaid.valueChanges.subscribe((value) => {
      if (this.customerForm.controls.adFees.value) {
      const bal = +this.customerForm.controls.adFees.value - +value
      this.customerForm.controls.adbalance.setValue(bal);
    }
    })

    if (this.type === 'update') {
      this.setSavedValues();
    }
  }

  setSavedValues() {
    return this.db.storage.executeSql('SELECT * FROM customertable where isactive = 1 and id = ?',[this.userId]).then(data => { 
      let res =  data.rows.item(0);
      this.preDefineValues(res);
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  preDefineValues(res) {
    this.customerForm.controls.name.setValue(res.name);
    this.customerForm.controls.email.setValue(res.email);
    this.customerForm.controls.dob.setValue(res.dob);
    this.customerForm.controls.age.setValue(res.age);
    this.customerForm.controls.mobile.setValue(res.mobile);
    this.customerForm.controls.gender.setValue(res.gender);
    this.customerForm.controls.address1.setValue(res.address1);
    this.customerForm.controls.address2.setValue(res.address2);
    this.customerForm.controls.height.setValue(res.height);
    this.customerForm.controls.weight.setValue(res.weight);
    this.customerForm.controls.regfees.setValue(res.regfees);
    // this.customerForm.controls.gympackage.setValue(res.name);
    // this.customerForm.controls.adpackage.setValue(res.name);
    this.croppedImagepath = res.img;
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.croppedImagepath = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
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
        if (controls === 'dob') {
        this.calculateAge(dFormat);
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  calculateAge(birth) {
    let birthday = new Date(birth);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    this.customerForm.controls.age.setValue((Math.abs(ageDate.getUTCFullYear() - 1970)));
}

  getAddPackage() {
    return this.db.storage.executeSql('SELECT * FROM adpackagetable where isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.adPackage.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  getGymPackage() {
    return this.db.storage.executeSql('SELECT * FROM packagetable where isactive = 1',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.gymPackage.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

  toggle(event) {
    if (this.addRequired && !this.adPackage.length) {
      this.getAddPackage();
    }

    if (this.gymRequired && !this.gymPackage.length) {
      this.getGymPackage();
    }

    this.gymRequired ? this.setgymMandate() : this.unsetgymMandate();

    this.addRequired ? this.setadMandate() : this.unsetadMandate();
  }

  gymPackageChange() {
    const id = this.customerForm.get('gympackage').value;
    if (id) {
      const index = this.gymPackage.findIndex( i => i.id == id);
      if (index > -1) {
        this.customerForm.get('gymFees').setValue(this.gymPackage[index].fees);
      }
    }
  }

  adPackageChange() {
    const id = this.customerForm.get('adpackage').value;
    if (id) {
      const index = this.adPackage.findIndex( i => i.id == id);
      if (index > -1) {
        this.customerForm.get('adFees').setValue(this.adPackage[index].fees);
      }
    }
  }

  setgymMandate() {
    this.gymmanArray.forEach((val) => {
      this.customerForm.controls[val].setValidators(Validators.required);
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: true, emitEvent : false});
    })
  }

  unsetgymMandate() {
    this.gymmanArray.forEach((val) => {
      this.customerForm.controls[val].clearValidators();
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: false, emitEvent : false});
    })
  }

  setadMandate() {
    this.admanArray.forEach((val) => {
      this.customerForm.controls[val].setValidators(Validators.required);
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: true, emitEvent : false});
    })
  }

  unsetadMandate() {
    this.admanArray.forEach((val) => {
      this.customerForm.controls[val].clearValidators();
      this.customerForm.controls[val].updateValueAndValidity({onlySelf: false, emitEvent : false});
    })
  }

  decideSave() {
    this.btntext === 'save' ? this.saveCustomer() : this.updateCustomer();
  }

  saveCustomer() {

      if (this.customerForm.controls.gymbalance.value && +this.customerForm.controls.gymbalance.value < 0 ) {
        alert('No negative value for Gym balance');
        return false;
      }

      if (this.customerForm.controls.adbalance.value && +this.customerForm.controls.adbalance.value < 0 ) {
        alert('No negative value for Ad balance');
        return false;
      }
      let joinDate = '';
      if (this.customerForm.controls.gympaydate.value) {
        joinDate = this.customerForm.controls.gympaydate.value
      } else if (this.customerForm.controls.adpaydate.value) {
        joinDate = this.customerForm.controls.adpaydate.value
      }

      let data = [this.customerForm.controls.name.value, this.customerForm.controls.email.value, 
        this.customerForm.controls.dob.value, this.customerForm.controls.age.value,
        this.customerForm.controls.mobile.value, this.customerForm.controls.gender.value,
        this.customerForm.controls.address1.value, this.customerForm.controls.address2.value,
        this.customerForm.controls.height.value, this.customerForm.controls.weight.value,
        this.customerForm.controls.regfees.value, this.customerForm.controls.gympackage.value,
        this.customerForm.controls.adpackage.value, joinDate,
        this.croppedImagepath, 1];
      return this.db.storage.executeSql('INSERT INTO customertable (name, email, dob, age, mobile, gender, address1, address2, height, weight, regfees, gympackid, addpackid, createdate, img, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        if (this.addRequired) {
          this.updateAddDue(res.insertId)
        }

        if (this.gymRequired) {
          this.updateGymDue(res.insertId)
        }
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }

    updateGymDue(id) {
      let data = [id, this.customerForm.controls.gympackage.value, this.customerForm.controls.gymtotalpaid.value,
        this.customerForm.controls.gymbalance.value, this.customerForm.controls.gympaydate.value,
        this.customerForm.controls.gymduedate.value, this.customerForm.controls.gympaydate.value, 1]
      return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        alert(res);
      },(err) => {
        alert(JSON.stringify(err));
      });
    }

    updateAddDue(id) {
      let data = [id, this.customerForm.controls.adpackage.value, this.customerForm.controls.adtotalpaid.value,
        this.customerForm.controls.adbalance.value, this.customerForm.controls.adpaydate.value,
        this.customerForm.controls.adduedate.value, this.customerForm.controls.adpaydate.value, 1]
      return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        alert(res);
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }

    updateCustomer() {
      if (this.customerForm.controls.gymbalance.value && +this.customerForm.controls.gymbalance.value < 0 ) {
        alert('No negative value for Gym balance');
        return false;
      }

      if (this.customerForm.controls.adbalance.value && +this.customerForm.controls.adbalance.value < 0 ) {
        alert('No negative value for Ad balance');
        return false;
      }

      let data = [this.customerForm.controls.name.value, this.customerForm.controls.email.value, 
        this.customerForm.controls.dob.value, this.customerForm.controls.age.value,
        this.customerForm.controls.mobile.value, this.customerForm.controls.gender.value,
        this.customerForm.controls.address1.value, this.customerForm.controls.address2.value,
        this.customerForm.controls.height.value, this.customerForm.controls.weight.value,
        this.customerForm.controls.regfees.value, this.croppedImagepath];
      return this.db.storage.executeSql(`UPDATE customertable set name = ?, email = ?, dob = ?, age = ?, mobile = ?, gender = ?, address1 = ?, address2 = ?, height = ?, weight = ?, regfees = ?, img = ? WHERE id = ${this.userId}` , data)
      .then(res => {
        alert(JSON.stringify(res));
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }


  }