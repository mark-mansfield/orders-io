import { Component, OnInit } from '@angular/core';
import { ImportService } from '../import.service';
import { Subscription } from 'rxjs';
import { mimeType } from './mime-type.validator';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-import-order',
  templateUrl: './import-order.component.html',
  styleUrls: ['./import-order.component.css']
})
export class ImportOrderComponent implements OnInit {
  filePicked: any;
  file: any;
  fileData: any;
  message = '';
  disabledUpload = true;
  form: FormGroup;
  orderSub: Subscription;
  isLoading = false;

  constructor(public importService: ImportService) {}

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      submit: new FormControl(null)
    });

    this.orderSub = this.importService.getOrderImportListener().subscribe(jsonArray => {
      this.isLoading = false;
    });
  }
  // get the file and validate it
  onFilePicked(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ file: this.file });
    const extension = this.file.name.split('.')[1];

    // check file extension here and show an error.
    // we do a deeper validation in the mimetype middlewear 'validators: [Validators.required],'
    if (extension !== 'csv') {
      this.message = `Invalid file type: \r\n ${this.file.name}  selected`;
    } else {
      this.message = this.file.name;
      this.disabledUpload = false;
    }

    // inform angular that we have updated the file form control value
    this.form.get('file').updateValueAndValidity();
  }

  extractFileName(str) {
    let fileString = str.split('.')[0];
    let arr = fileString.split('-');
    arr.pop();
    return arr.join('-');
  }
  // upload selected file if form is valid
  onSubmit() {
    this.isLoading = true;
    setTimeout(() => {
      if (this.form.invalid) {
        this.message = 'invalid file selected';
      } else {
        this.fileData = this.form.value.file;
        const fileName = this.extractFileName(this.form.value.file.name);
        this.importService.uploadFile(this.fileData, fileName);
        this.form.reset();
        this.fileData = null;
        this.file = null;
        this.disabledUpload = true;
        this.message = '';
      }
    }, 5000);
  }
}
