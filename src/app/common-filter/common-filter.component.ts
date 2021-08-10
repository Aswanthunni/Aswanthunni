import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss'],
})
export class CommonFilterComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter();
  constructor(private fb: FormBuilder) { }
  packageForm: FormGroup;
  ngOnInit() {
    this.buildForm();
  }

  packageChange() {
    this.newItemEvent.emit(this.packageForm.controls.gympackage.value);
  }

  buildForm() {
    this.packageForm = this.fb.group({
      gympackage: 'gym',
    });
  }

}
