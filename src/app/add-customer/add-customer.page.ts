import { Component, OnInit, SecurityContext } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import * as uuid from 'uuid';
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
})
export class AddCustomerPage implements OnInit {

  croppedImagepath = "assets/user.jpg";
  imagePath = '';
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
  gymPackMonth = 0;
  adPackMonth = 0;
  type:string;
  userId: any;
  gymTempData: any;
  btntext = '';
  title = '';
  imageData = '';
  gymmanArray = ['gympaydate','gymduedate', 'gympackage', 'gymFees', 'gymtotalpaid', 'gymbalance'];
  admanArray = ['adpaydate','adduedate', 'adpackage', 'adFees', 'adtotalpaid', 'adbalance'];

  constructor(
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private datePicker: DatePicker,
    private fb: FormBuilder,
    private db: DbService,
    public router: Router,
    private nav: NavController,
    private file: File,
    private dom: DomSanitizer
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
    this.getLatestAdFees();
    this.checkDirExist();
  }

  checkDirExist() {
    this.file.checkDir(this.file.externalRootDirectory + 'Pictures/', 'Gym Album').then(response => {
		//	alert(JSON.stringify(response));
		}).catch(err => {
			this.file.createDir(this.file.externalRootDirectory + 'Pictures/', 'Gym Album', false).then(response => {
		//		alert(JSON.stringify(response));
			}).catch(err => {
				alert(JSON.stringify(err));
			}); 
		});
  }

  buildForm() {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['',  Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      dob: [''],
      age: [''],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      gender: ['', Validators.required],
      address1: ['', Validators.required],
      address2: '',
      adpaydate: '',
      adduedate: '',
      adpackage: '',
      adFees: '',
      adtotalpaid: ['', Validators.min(0)],
      adbalance: ['', Validators.min(0)],
      gympaydate: '',
      gymduedate: '',
      gympackage: '',
      gymFees: '',
      gymtotalpaid: ['', Validators.min(0)],
      gymbalance: ['', Validators.min(0)],
      regfees: ['', [Validators.required, Validators.min(0)]],
      regfeesPaid : ['', [Validators.required, Validators.min(0)]],
      height: [''],
      weight: ['']
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

  getLatestAdFees() {
    return this.db.storage.executeSql('SELECT fees FROM admission WHERE id IN (SELECT MAX(id) FROM admission)',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.customerForm.get('regfees').setValue(+item.fees);
      }
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
    this.customerForm.controls.regfeesPaid.setValue(0);
    // this.customerForm.controls.gympackage.setValue(res.name);
    // this.customerForm.controls.adpackage.setValue(res.name);
    this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', res.img);
  //  this.croppedImagepath = res.img;
  }

  pickImage(sourceType, type= 'cam') {
    const options: CameraOptions = {
      quality: 20,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum : false
    }
    this.camera.getPicture(options).then(async (imageData) => {
      const base64Response = await fetch(`data:image/jpeg;base64,${imageData}`);
      const blob = await base64Response.blob();
      this.file.writeFile(this.file.externalRootDirectory + 'Pictures/Gym Album/', uuid.v4()+'.jpeg' ,blob)
      .then((res) => {
         this.imagePath = res.name;
         this.getSanitizedImage(this.file.externalRootDirectory + 'Pictures/Gym Album/', res.name);
      }, (err) => {
        alert(JSON.stringify(err));
      })
    }, (err) => {
      // Handle error
    });
  }

  getSanitizedImage(path, imageName){
    this.file.readAsDataURL(path, imageName)
    .then((data)=>{
      this.croppedImagepath = this.dom.sanitize(SecurityContext.RESOURCE_URL, this.dom.bypassSecurityTrustResourceUrl(data));
    })
    .catch((err)=>{
  //    alert(JSON.stringify(err));
    });
}

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY, 'lib');
        }
      },
      ]
    });
    await actionSheet.present();
  }

  showCalender(controls) {
    let date = new Date()
    if (this.customerForm.get(controls).value) {
      date = new Date(this.customerForm.get(controls).value);
    }
    this.datePicker.show({
      date: date,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      (dateTime) => {
        const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
        this.customerForm.get(controls).setValue(dFormat);
        if (controls === 'dob') {
        this.calculateAge(dFormat);
        }
        if (controls === 'gympaydate') {
          var d = new Date(dFormat);
          d.setMonth(d.getMonth() + +this.gymPackMonth);
          const fl = d.getDate()+" "+d.toLocaleString('default', { month: 'short' })+" "+d.getFullYear();
          this.customerForm.get('gymduedate').setValue(fl);
        } else if (controls === 'adpaydate') {
          var d = new Date(dFormat);
          d.setMonth(d.getMonth() + +this.adPackMonth);
          const fl = d.getDate()+" "+d.toLocaleString('default', { month: 'short' })+" "+d.getFullYear();
          this.customerForm.get('adduedate').setValue(fl);
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
        this.gymPackMonth = this.gymPackage[index].month;
      }
    }
  }

  adPackageChange() {
    const id = this.customerForm.get('adpackage').value;
    if (id) {
      const index = this.adPackage.findIndex( i => i.id == id);
      if (index > -1) {
        this.customerForm.get('adFees').setValue(this.adPackage[index].fees);
        this.adPackMonth = this.adPackage[index].month;
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


      if (this.customerForm.controls.gymduedate.value && this.customerForm.controls.gympaydate.value && new Date(this.customerForm.controls.gymduedate.value) < new Date(this.customerForm.controls.gympaydate.value)) {
        alert('Due Date should be greater than Pay Date');
        return false;
      }

      if (this.customerForm.controls.adduedate.value && this.customerForm.controls.adpaydate.value && new Date(this.customerForm.controls.adduedate.value) < new Date(this.customerForm.controls.adpaydate.value)) {
        alert('Due Date should be greater than Pay Date');
        return false;
      }

      if (this.customerForm.controls.regfees.value && this.customerForm.controls.regfeesPaid.value && +this.customerForm.controls.regfeesPaid.value > +this.customerForm.controls.regfees.value ) {
        alert('Admission Fees is less than Paid Fee');
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
        this.imagePath, 1];
      this.db.showLoader();
      return this.db.storage.executeSql('INSERT INTO customertable (name, email, dob, age, mobile, gender, address1, address2, height, weight, regfees, gympackid, addpackid, createdate, img, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        this.updateRegDue(res.insertId);

        if (this.addRequired) {
          this.updateAddDue(res.insertId)
        }

        if (this.gymRequired) {
          this.updateGymDue(res.insertId)
        }
        this.emiEvent();
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }

    updateGymDue(id) {
      let data = [id, this.customerForm.controls.gympackage.value, this.customerForm.controls.gymtotalpaid.value,
        this.customerForm.controls.gymbalance.value, this.customerForm.controls.gympaydate.value,
        this.customerForm.controls.gymduedate.value, this.customerForm.controls.gympaydate.value, 'Initial Payment' ,1]
      return this.db.storage.executeSql('INSERT INTO gympackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
      },(err) => {
        alert(JSON.stringify(err));
      });
    }

    updateAddDue(id) {
      let data = [id, this.customerForm.controls.adpackage.value, this.customerForm.controls.adtotalpaid.value,
        this.customerForm.controls.adbalance.value, this.customerForm.controls.adpaydate.value,
        this.customerForm.controls.adduedate.value, this.customerForm.controls.adpaydate.value, 'Initial Payment', 1]
      return this.db.storage.executeSql('INSERT INTO adpackagedue (customerid, packageid, totalpaid, balance, paymentdate, duedate, createdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }

    updateRegDue(id) {
      let joinDate = '';
      const balance = +this.customerForm.controls.regfees.value - +this.customerForm.controls.regfeesPaid.value;
      if (this.customerForm.controls.gympaydate.value) {
        joinDate = this.customerForm.controls.gympaydate.value
      } else if (this.customerForm.controls.adpaydate.value) {
        joinDate = this.customerForm.controls.adpaydate.value
      } 
      let data = [id, this.customerForm.controls.regfees.value, this.customerForm.controls.regfeesPaid.value,
        balance, joinDate, 'Initial Payment', 1]
      return this.db.storage.executeSql('INSERT INTO regfeedue (customerid, fees, totalpaid, balance, paymentdate, comments, isactive) VALUES (?, ?, ?, ?, ?, ?, ?)', data)
      .then(res => {
      },(err) => {
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
        this.customerForm.controls.regfees.value, this.imagePath];
      return this.db.storage.executeSql(`UPDATE customertable set name = ?, email = ?, dob = ?, age = ?, mobile = ?, gender = ?, address1 = ?, address2 = ?, height = ?, weight = ?, regfees = ?, img = ? WHERE id = ${this.userId}` , data)
      .then(res => {
        this.emiUpdateEvent();
      }, (err) => {
        alert(JSON.stringify(err));
      });
    }

    emiEvent() {
      setTimeout(() => {
        this.db.dismissLoader();
        alert('Customer Created Successfully');
        this.db.customerCreate.next('created');
        this.nav.pop();
      }, 1000);
    }

    emiUpdateEvent() {
        alert('Customer Updated Successfully');
        this.db.customerCreate.next('created');
        this.nav.pop();
    }

  }
