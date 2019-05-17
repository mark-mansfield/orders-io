import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../services/menu.service';
import { Menu } from '../../models/menu.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from '../../../../node_modules/rxjs';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css']
})
export class MenuCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredDescription = '';
  form: FormGroup;
  menu: Menu;
  menuItems: 'need to set this up';
  isLoading = false;
  imagePreview: ArrayBuffer;
  private mode = 'create';
  private menuId: string;
  private authStatusSub: Subscription;

  constructor(public dataService: DataService, public route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      desc: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    // built in observable no need to unsub.
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.menuId = paramMap.get('id');
        // show spinner
        this.isLoading = true;
        this.dataService.getMenu(this.menuId).subscribe(menuData => {
          // hide spinner.menu
          this.isLoading = false;
          this.menu = {
            id: menuData._id,
            title: menuData.title,
            description: menuData.description,
            items: [],
            imagePath: menuData.imagePath,
            creator: menuData.creator
          };
          this.form.setValue({
            title: this.menu.title,
            desc: this.menu.description,
            image: this.menu.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.menuId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveMenu() {
    if (this.form.invalid) {
      return;
    }
    // start spinner
    this.isLoading = true;
    if (this.mode === 'create') {
      this.dataService.addMenu(this.form.value.title, this.menuItems, this.form.value.desc, this.form.value.image);
    } else {
      this.dataService.updateMenu(
        this.menuId,
        this.form.value.title,
        this.menuItems,
        this.form.value.desc,
        this.form.value.image,
        this.menu.creator
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
