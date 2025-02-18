import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  template: `
    <h2 mat-dialog-title [ngClass]="data?.dialogClass || ''">
      {{ data?.title || 'Default Title' }}
    </h2>

    <mat-dialog-content>
      <p *ngIf="data?.message; else noMessage">{{ data?.message }}</p>
      <ng-template #noMessage><p>No message provided.</p></ng-template>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>

  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; dialogClass: string } | null
  ) {
    console.log('Dialog Data:', this.data);
    console.log('Dialog Title:', this.data?.title);
    console.log('Dialog message:', this.data?.message);
    console.log('Dialog dialogClass:', this.data?.dialogClass);
    console.log('Dialog Ref:', this.dialogRef);
  }

  close() {
    this.dialogRef.close();
  }
}
