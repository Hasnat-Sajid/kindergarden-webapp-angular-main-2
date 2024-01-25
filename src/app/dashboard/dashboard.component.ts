import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDataComponent } from './add-data/add-data.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public currentPage: number = 1;

  constructor(private dialog: MatDialog) { }

  receiveMessage(newPageCount: number) {
    this.currentPage = newPageCount;
  }

  openPopupClicked(showAddData: boolean) {
    const dialogRef = this.dialog.open(AddDataComponent, {
      width: '600px',
      height: '350px', // Adjust the width as needed
      data: { currentPage: this.currentPage }
    });
  }
}
