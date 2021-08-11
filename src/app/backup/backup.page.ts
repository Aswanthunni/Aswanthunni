import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {

  constructor(private file: File, public  platform: Platform, private sqliteDbCopy: SqliteDbCopy, private androidPermissions: AndroidPermissions) { }

  ngOnInit() {
    this.platform.ready().then(() =>{
      if(this.platform.is('android')) {
        this.getPermission();
}
  });
}

  getPermission() {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.copyDB();
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {
                this.copyDB();
              }
            });
        }
      });
    }

    createDir() {
      alert(this.file.externalRootDirectory);
      this.file.checkDir(this.file.externalRootDirectory, 'Download').then(response => {
        this.sqliteDbCopy.copyDbToStorage('gym.db', 0, this.file.externalRootDirectory + "Download/",true).then((res) => {
          alert(JSON.stringify(res));
        }).catch((err) => {
          alert(JSON.stringify(err))
        })
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }

    copyDB() {
      alert(this.file.externalRootDirectory);
      this.file.checkDir(this.file.externalRootDirectory, 'Download').then(response => {
        alert(JSON.stringify(response))
        this.sqliteDbCopy.copyDbFromStorage('gym.db', 0, this.file.externalRootDirectory + "Download/gym.db",true).then((res) => {
          alert(JSON.stringify(res));
        }).catch((err) => {
          alert(JSON.stringify(err))
        })
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    }

    checkFile() {
      this.file.checkFile(this.file.externalRootDirectory + "Download/", 'gym.db').then((res) => {
        alert(JSON.stringify(res));
      }).catch((err) => {
        alert(JSON.stringify(err));
      })
    }
  

}
