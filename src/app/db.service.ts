
import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';

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
  songsList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    public loadingController: LoadingController,
    public file: File
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

  fetchSongs(): Observable<Song[]> {
    return this.songsList.asObservable();
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
  showLoader() {
    this.loadingController.create({
      message: 'Loading...'
    }).then((response) => {
      response.present();
    });
  }

  // Dismiss loader
  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response);
    }).catch((err) => {
      alert(JSON.stringify(err))
    });
  }

  replacedb(data) {
    this.sqlPorter.importSqlToDb(this.storage, data).then((res) => {
      alert(JSON.stringify(res));
    }).catch((err) => {
      alert(JSON.stringify(err))
    })
  }

  export() {
    const uni = new Date().valueOf();
    this.sqlPorter.exportDbToSql(this.storage).then((res) => {
      alert(JSON.stringify(res))
      this.file.writeFile(this.file.externalRootDirectory + 'Download/', uni+'.sql', res).then((res) => {
        alert(JSON.stringify(res))
      }).catch(error => alert(JSON.stringify(error)));
    }).catch(error => alert(JSON.stringify(error)));
  }

}