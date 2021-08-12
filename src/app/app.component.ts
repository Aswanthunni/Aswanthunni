import { AfterViewInit, Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { DbService } from './db.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home/home', icon: 'home' },
    { title: 'Customer', url: '/add-customer', icon: 'paper-plane' },
    { title: 'Backup', url: '/backup', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(public db: DbService, private androidPermissions: AndroidPermissions, private platform: Platform) {
  }
  ngOnInit(): void {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.getPermission();
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
}
