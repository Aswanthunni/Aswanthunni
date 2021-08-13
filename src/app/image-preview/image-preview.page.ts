import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.page.html',
  styleUrls: ['./image-preview.page.scss'],
})
export class ImagePreviewPage implements OnInit {
  data = '';
  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.data = this.navParams.get('params');
  }

}
