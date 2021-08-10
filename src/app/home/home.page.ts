import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, public nav: NavController) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.activatedRoute.snapshot.paramMap.get('id'))
    // this.db.dbState().subscribe((res) => {
    //   if(res){
    //     this.db.fetchSongs().subscribe(item => {
    //       alert(item);
    //     })
    //   }
    // });
  }

  navigate(route: string) {
    this.nav.navigateForward(route);
  }

}
