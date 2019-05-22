import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogConfig,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private sanitizer: DomSanitizer) {}

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  extraClasses = ['dark-snackbar'];

  openSnackBar(message) {
    const config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3000;
    config.panelClass = this.extraClasses;
    this.snackBar.open(message, '', config);
  }
}
