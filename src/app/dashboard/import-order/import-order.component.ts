import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { FormBuilder, FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
@Component({
  selector: 'app-import-order',
  templateUrl: './import-order.component.html',
  styleUrls: ['./import-order.component.css']
})
export class ImportOrderComponent implements OnInit {
  filePicked = '';
  disabledUpload = true;
  constructor() {}

  ngOnInit() {}

  onFilePicked(event) {
    this.filePicked = `File Chosen: ${event.target.files[0].name}`;
    this.disabledUpload = false;
  }
}
