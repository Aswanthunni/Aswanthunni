import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { DbService } from '../db.service';


@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  lastLog = [];
  constructor(private file: File, public platform: Platform, private sqliteDbCopy: SqliteDbCopy, private androidPermissions: AndroidPermissions, private dbS: DbService) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.getPermission();
      }
    });

    this.dbS.returnbackup().subscribe((res) => {
        this.getbackupdate();
    })
  }

  getPermission() {
    this.showFile();
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.GET_ACCOUNTS,
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]
    );
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          //    this.checkFile();
        }
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then(status => {
              if (status.hasPermission) {
                //      this.checkFile();
              }
            });
        }
      });
  }

  checkFile() {
    this.file.checkFile(this.file.applicationDirectory + "www/assets/", 'package.sql').then((res) => {
      alert(JSON.stringify(res));
    }).catch((err) => {
      alert(JSON.stringify(err));
    })
  }

  showFile() {
    let self = this;
    document.getElementById('input-file')
      .addEventListener('change', getFile)

    function getFile(event) {
      const input = event.target
      if ('files' in input && input.files.length > 0) {
        var sFileName = input.value;
        var sCurExtension = 'sql'
        if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
          placeFileContent(input.files[0])
        } else {
          alert('False')
        }
      }
    }

    function placeFileContent(file) {
      readFileContent(file).then(content => {
        self.dbS.replacedb(content);
      }).catch(error => console.log(error))
    }

    function readFileContent(file) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
      })
    }

  }

  export() {
   this.dbS.export();
  }

  getbackupdate() {
    return this.dbS.storage.executeSql('SELECT * FROM backup WHERE id IN (SELECT MAX(id) FROM backup)',[]).then(data => { 
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        this.lastLog.push(item);
      }
    },(err) => {
      alert(JSON.stringify(err));
    });
  }

}
