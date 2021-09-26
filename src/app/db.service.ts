
import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';
import { Device } from '@ionic-native/device/ngx';

export interface Song {
  id: number;
  artist_name: string;
  song_name: string;
}


@Injectable({
  providedIn: 'root'
})
export class DbService {
  public storage: SQLiteObject;
  customerCreate = new BehaviorSubject('');
  balSettle = new BehaviorSubject('');
  backup = new BehaviorSubject('');
  userId = '';
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    public loadingController: LoadingController,
    public file: File,
    private device: Device
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'gym.db',
        location: 'default',

      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.createPackageTable();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchCustomAdd() {
    return this.customerCreate.asObservable();
  }

  returnbalSettle() {
    return this.balSettle.asObservable();
  }

  returnbackup() {
    return this.backup.asObservable();
  }


  // Render fake data
  createPackageTable() {
    this.httpClient.get(
      'assets/package.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          // this.getSongs();
          //  this.isDbReady.next(true);
          this.insertUid();
        })
        .catch(error => alert(JSON.stringify(error)));
    });
  }

  // Get list
  getSongs() {
    return this.storage.executeSql('SELECT * FROM packagetable', []).then(res => {
      alert(JSON.stringify(res));
    });
  }

  // Add
  addSong(artist_name, song_name) {
    let data = [artist_name, song_name];
    return this.storage.executeSql('INSERT INTO songtable (artist_name, song_name) VALUES (?, ?)', data)
      .then(res => {
        this.getSongs();
      });
  }

  insertUid() {
    let data = [this.device.uuid];
    return this.storage.executeSql('INSERT INTO uniqueid (uid) VALUES (?)', data)
    .then(res => {
    });
  }

  // Get single object
  getSong(id): Promise<Song> {
    return this.storage.executeSql('SELECT * FROM songtable WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        artist_name: res.rows.item(0).artist_name,
        song_name: res.rows.item(0).song_name
      }
    });
  }

  // Update
  updateSong(id, song: Song) {
    let data = [song.artist_name, song.song_name];
    return this.storage.executeSql(`UPDATE songtable SET artist_name = ?, song_name = ? WHERE id = ${id}`, data)
      .then(data => {
        this.getSongs();
      })
  }

  // Delete
  deleteSong(id) {
    return this.storage.executeSql('DELETE FROM songtable WHERE id = ?', [id])
      .then(_ => {
        this.getSongs();
      });
  }

  // Simple loader
  async showLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait...',
    });
    loading.present();
  }

  // Dismiss loader
  dismissLoader() {
    setTimeout(() => {
      this.loadingController.dismiss().then((response) => {
        console.log('Loader closed!', response);
      }).catch((err) => {
        alert(JSON.stringify(err))
      });
    }, 100)
  }

  replacedb(data) {
    this.showLoader();
    this.sqlPorter.importSqlToDb(this.storage, data).then((res) => {
      this.logRestore();
    }).catch((err) => {
      this.dismissLoader();
      alert(JSON.stringify(err))
    })
  }

  export() {
    this.showLoader();
    const uni = new Date().valueOf();
    try {
    this.sqlPorter.exportDbToSql(this.storage).then((res) => {
      try {
      this.file.writeFile(this.file.externalRootDirectory + 'Download/', uni+'.sql', res).then((res) => {
        this.logbackup();
      }).catch(error => alert(JSON.stringify(error)));
    } catch(er) {
      alert(JSON.stringify(er));
    }
    }).catch(error => alert(JSON.stringify(error)));
  } catch(er) {
    alert(JSON.stringify(er));
  }
  }

  logbackup() {
    const dateTime = new Date();
    const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
    return this.storage.executeSql('INSERT INTO backup (lastdate) VALUES (?)', [dFormat])
      .then(res => {
        this.dismissLoader();
        alert('Database backup is successfull');
        this.backup.next('');
      });
  }

  logRestore() {
    const dateTime = new Date();
    const dFormat = dateTime.getDate()+" "+dateTime.toLocaleString('default', { month: 'short' })+" "+dateTime.getFullYear();
    return this.storage.executeSql('INSERT INTO restore (lastdate) VALUES (?)', [dFormat])
      .then(res => {
        this.dismissLoader();
        alert('Data Restored Successfully');
        this.backup.next('');
      });
  }

}