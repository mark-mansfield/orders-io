import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.css']
})
export class DeleteItemComponent implements OnInit {
  input: String = '';
  form: FormGroup;
  sumbitDisabled: Boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DeleteItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      inputText: ['', [Validators.pattern('[A-Z]*')]]
    });
  }

  onUpdateInput(value) {
    console.log(value);
    this.input = value;
    if (this.input === 'DELETE') {
      this.sumbitDisabled = false;
    }
  }

  deleteClicked() {
    console.log(this.input);
    this.dialogRef.close(this.input);
  }
}
