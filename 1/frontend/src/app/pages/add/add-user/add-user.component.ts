// Angular modules
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

//Internal modules
import { ToastManager } from '@blocks/toast/toast.manager';

// Services
import { StoreService } from '@services/store.service';
import { AppService } from '@services/app.service';

// Components
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [PageLayoutComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  documentList: any[] = [];
  email = new FormControl('', Validators.email);

  constructor(
    public storeService: StoreService,
    public appService: AppService,
    public toastManager: ToastManager
  ) {}

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit(): void {}

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  createUser() {
    if (!this.email?.value || !this.email.valid) {
      this.toastManager.quickShow('Invalid email', 'warning', true);
      return;
    }

    this.appService.createUser(this.email?.value).then(
      (response) => {
        this.toastManager.quickShow(
          'User created successfully',
          'success',
          true
        );
      },
      (error) => {
        this.toastManager.quickShow('Error creating user', 'danger', true);
        console.error(error);
      }
    );
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
