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
  selector: 'app-add-doc',
  standalone: true,
  imports: [PageLayoutComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './add-doc.component.html',
  styleUrl: './add-doc.component.scss',
})
export class AddDocComponent implements OnInit {
  documentList: any[] = [];
  title = new FormControl<string>('', Validators.required);
  description = new FormControl<string>('');
  doc_type = new FormControl<string>('', Validators.required);
  link = new FormControl<string>('');
  file = new FormControl(null);
  file_name = new FormControl<string>('');

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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file.setValue(file);
      this.file_name.setValue(file.name);
    }
  }

  createUser() {
    if (this.title.invalid) {
      this.toastManager.quickShow('Invalid title', 'warning', true);
      return;
    }
    if (this.doc_type.invalid) {
      this.toastManager.quickShow('Invalid document type', 'warning', true);
      return;
    }

    if (this.link.value && this.file.value) {
      this.toastManager.quickShow(
        'Please provide either a link or a file',
        'warning',
        true
      );
      return;
    }

    if (!this.link.value && !this.file.value) {
      this.toastManager.quickShow(
        'Please provide either a link or a file',
        'warning',
        true
      );
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title.value || '');
    formData.append('description', this.description.value || '');
    formData.append('doc_type', this.doc_type.value || 'other');
    if (this.link.value) {
      formData.append('link', this.link.value);
    } else if (this.file.value) {
      console.log(this.file.value);
      formData.append(
        'file',
        this.file.value,
        this.file_name.value ?? undefined
      );
    }
    this.appService.createDocument(formData).then(
      (response) => {
        this.toastManager.quickShow(
          'Document added successfully',
          'success',
          true
        );
      },
      (error) => {
        this.toastManager.quickShow('Error adding document', 'danger', true);
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
