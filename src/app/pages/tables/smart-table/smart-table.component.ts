import { Component } from '@angular/core';
import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {

  data: any[] = [];
  filteredData: any[] = [];
  displayedData: any[] = [];
  editingRow: any = null;
  originalRow: any = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Filter properties
  filters = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    age: ''
  };

  constructor(private service: SmartTableData) {
    this.data = this.service.getData();
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedData = this.filteredData.slice(startIndex, endIndex);
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(item => {
      const matchId = this.filters.id === '' || 
        item.id.toString().toLowerCase().includes(this.filters.id.toLowerCase());
      
      const matchFirstName = this.filters.firstName === '' || 
        item.firstName.toLowerCase().includes(this.filters.firstName.toLowerCase());
      
      const matchLastName = this.filters.lastName === '' || 
        item.lastName.toLowerCase().includes(this.filters.lastName.toLowerCase());
      
      const matchUsername = this.filters.username === '' || 
        item.username.toLowerCase().includes(this.filters.username.toLowerCase());
      
      const matchEmail = this.filters.email === '' || 
        item.email.toLowerCase().includes(this.filters.email.toLowerCase());
      
      const matchAge = this.filters.age === '' || 
        item.age.toString().toLowerCase().includes(this.filters.age.toLowerCase());

      return matchId && matchFirstName && matchLastName && matchUsername && matchEmail && matchAge;
    });

    // Reset to first page after filtering
    this.currentPage = 1;
    this.updatePagination();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
  }

  get totalItems(): number {
    return this.filteredData.length;
  }

  onAddNew(): void {
    this.editingRow = {
      id: 0,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      age: '',
    };
  }

  onSaveNew(): void {
    if (this.editingRow && this.editingRow.id === 0) {
      const newId = Math.max(...this.data.map(item => item.id)) + 1;
      this.editingRow.id = newId;
      this.data.unshift(this.editingRow);
      this.editingRow = null;
      this.currentPage = 1;
      this.applyFilters();
    }
  }

  onEdit(item: any): void {
    this.originalRow = { ...item };
    this.editingRow = item;
  }

  onSaveEdit(): void {
    this.editingRow = null;
    this.originalRow = null;
    this.updatePagination();
  }

  onCancelEdit(): void {
    if (this.originalRow && this.editingRow) {
      Object.assign(this.editingRow, this.originalRow);
    }
    this.editingRow = null;
    this.originalRow = null;
  }

  onDelete(item: any): void {
    if (window.confirm('Are you sure you want to delete?')) {
      const index = this.data.indexOf(item);
      if (index > -1) {
        this.data.splice(index, 1);
        // Adjust current page if needed
        if (this.displayedData.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }
        this.applyFilters();
      }
    }
  }
}
