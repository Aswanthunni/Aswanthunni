import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-manager',
  templateUrl: './package-manager.page.html',
  styleUrls: ['./package-manager.page.scss'],
})
export class PackageManagerPage implements OnInit {
  userId = '';
  constructor(public router: Router) { }

  ngOnInit() {  
    if (this.router.getCurrentNavigation().extras.state) {
      const pageName = this.router.getCurrentNavigation().extras.state;
      this.userId = pageName.id;
    }
  }

}
