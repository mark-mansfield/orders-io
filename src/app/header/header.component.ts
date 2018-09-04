import { Component, OnInit,  OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from '../../../node_modules/rxjs';

// import { SidenavService } from '../side-nav/sidenav-service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private authStatusSubs: Subscription;
  userIsAuthenticated = false;
  currentUrl: string;

  constructor(private router: Router, private authService: AuthService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url);
  }

  ngOnInit () {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}

