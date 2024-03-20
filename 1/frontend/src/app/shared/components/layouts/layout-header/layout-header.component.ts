// Angular modules
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

// External modules
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

// Services
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';

// Internal modules
import { environment } from '@env/environment';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgbCollapse,
    RouterLinkActive,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    TranslateModule,
  ],
})
export class LayoutHeaderComponent implements OnInit {
  public appName: string = environment.appName;
  public isMenuCollapsed: boolean = true;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private appService: AppService
  ) {}

  public ngOnInit(): void {}

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickLogout(): Promise<void> {
    this.storeService.isLoading.set(true);

    const success = await this.appService.logout();

    this.storeService.isLoading.set(false);

    if (!success) return;

    // NOTE Redirect to home
    this.router.navigate(['/auth/login']);
  }

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------
}
