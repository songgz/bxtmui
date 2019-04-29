import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatCardModule,
  MatSelectModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatGridListModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorIntl

} from '@angular/material';
import {MatPaginatorIntlChinese} from './MatPaginatorIntlChinese';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    MatButtonModule,
    MatTooltipModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlChinese }
  ]
})
export class MaterialModule {}

