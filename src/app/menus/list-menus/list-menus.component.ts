import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {  DataService } from '../menu.service';
import { Subscription } from 'rxjs';
import { Menu } from '../menu.model';
import { AuthService } from '../../auth/auth.service';



@Component({
  selector: 'app-list-menus',
  templateUrl: './list-menus.component.html',
  styleUrls: ['./list-menus.component.css']
})
export class ListMenusComponent implements OnInit , OnDestroy {

  menus: Menu[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  private menusSub: Subscription;
  private authStatusSub: Subscription;

  constructor(private data: DataService , private authService: AuthService,  public route: ActivatedRoute) { }



  ngOnInit() {
    this.data.getMenus();
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.menusSub = this.data.getMenuUpdateListener().subscribe(( menus: Menu[] ) => {
        this.isLoading = false;
        this.menus = menus;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.authService.getUserId();
    });
  }
  // onEditMenu(id: string) {
  //   this.data.getMenu(id);
  // }
  onDelete(id: String) {
    this.data.deleteMenu(id);
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }

}
