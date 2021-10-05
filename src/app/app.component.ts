import { AfterViewInit, Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController, Platform } from '@ionic/angular';
import { DbService } from './db.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home/home', icon: 'home' },
    { title: 'Customer', url: '/customer-mgmt', icon: 'person' },
    { title: 'Dashboard', url: '/dashboard', icon: 'bar-chart' },
    { title: 'Backup', url: '/backup', icon: 'cloud-upload' },
    { title: 'Settings', url: '/settings', icon: 'cog' },
    // { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(public db: DbService, private androidPermissions: AndroidPermissions, private platform: Platform, private nav: NavController, private device: Device) {
  }
  ngOnInit(): void {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.getPermission();
      //  this.checkDate();
        this.checkUid();
      }
  });
  }

  getPermission() {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
        } 
        else {
          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE])
            .then(status => {
              if(status.hasPermission) {
              }
            });
        }
      }).catch((er) => {
        alert(JSON.stringify(er))
      });
    }

    checkDate() {
      if (new Date() > new Date('08 Oct 2021')) {
        alert('Your app access is expired');
        navigator['app'].exitApp();
      }
    }

    checkUid() {
      if (this.device.uuid !== '0d4b660d79b27abd') {
        alert('You are not authorized to use');
        navigator['app'].exitApp();
      }
    }
}
