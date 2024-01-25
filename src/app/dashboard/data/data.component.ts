import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { StoreService } from 'src/app/shared/store.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit, AfterViewInit {

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;

  displayedColumns: string[] = ['name', 'kindergarden', 'address', 'alter', 'geburtsdatum', 'cancelRegistration'];
  dataSource: MatTableDataSource<ChildResponse>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public itemsPerPage: number = CHILDREN_PER_PAGE;
  isLoading: boolean = true;

  constructor(
    public storeService: StoreService,
    private backendService: BackendService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.backendService.getChildren(2)
    this.dataSource = new MatTableDataSource(storeService.children())
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.kindergarden.name.toLowerCase().includes(filter);
      };

      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
      age--;
    }
    return age;
  }

  selectPage(e: PageEvent) {
    let currentPage = e.pageIndex + 1;
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage);
  }

  public returnAllPages() {
    let res = [];
    const pageCount = Math.ceil(this.storeService.childrenTotalCount() / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // User clicked "Yes" in the confirmation dialog
        this.performCancelRegistration(childId);
      }
    });
  }

  private performCancelRegistration(childId: string) {
    this.isLoading = true;
    this.backendService.deleteChildData(childId, this.currentPage);
    this.snackBar.open('Registration canceled', 'Ok');
    this.isLoading = false;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const lowerCase = filterValue.toLowerCase();

    this.dataSource.filter = lowerCase.trim();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sortState: Sort) {
    const data = this.storeService.children().slice();

    if (!sortState.active || sortState.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sortState.direction === 'asc';
      switch (sortState.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'kindergarden':
          return this.compare(a.kindergarden.name, b.kindergarden.name, isAsc);
        case 'geburtsdatum':
          return this.compare(new Date(a.birthDate), new Date(b.birthDate), isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}


