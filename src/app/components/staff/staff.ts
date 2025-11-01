import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
  styleUrls: ['./staff.css']
})
export class Staff implements OnInit {
  filteredStaff: Employee[] = [];
  paginatedStaff: Employee[] = [];
  searchTerm: string = '';
  selectedFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  selectedStatus: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';
  isDropdownOpen: boolean = false; // ตัวแปรสำหรับควบคุมการแสดง dropdown
  activeStaff: Employee | null = null; // เก็บ staff ที่ถูกเลือก

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  get totalStaff(): number {
    return this.filteredStaff.length;
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        console.log('Loaded employees:', employees); // Debug
        this.filteredStaff = employees.map(emp => ({
          ...emp,
          status: emp.status || 'N/A' // ใช้ 'N/A' เป็นค่าเริ่มต้น
        }));
        this.calculatePagination();
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    if (this.searchTerm.trim()) {
      this.employeeService.searchEmployeesByName(this.searchTerm).subscribe({
        next: (employees) => {
          console.log('Search results:', employees); // Debug
          this.filteredStaff = employees.map(emp => ({
            ...emp,
            status: emp.status || 'N/A'
          }));
          this.calculatePagination();
          this.updatePaginatedData();
        },
        error: (error) => console.error('Error searching employees:', error)
      });
    } else {
      this.loadEmployees();
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.filteredStaff];

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(staff =>
        staff.empName.toLowerCase().includes(searchLower) ||
        staff.empPhone.includes(searchLower) ||
        staff.role.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedFilter) {
      filtered = filtered.filter(staff =>
        staff.role.toLowerCase().includes(this.selectedFilter.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(staff => staff.status === this.selectedStatus);
    }

    this.filteredStaff = filtered;
    this.calculatePagination();
    this.updatePaginatedData();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStaff.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStaff = this.filteredStaff.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.calculatePagination();
    this.updatePaginatedData();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  getRowNumber(index: number): number {
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  viewStaffDetails(staff: Employee): void {
    this.router.navigate(['/staff', staff.empId]);
  }

  openAddStaffModal(): void {
    this.router.navigate(['/staff/add']);
  }

  editStaff(staff: Employee): void {
    this.router.navigate(['/staff/edit', staff.empId]);
    this.closeDropdown(); // ปิด dropdown หลังจากคลิก
  }

  deleteStaff(staff: Employee): void {
    if (confirm(`Are you sure you want to delete ${staff.empName}?`)) {
      this.employeeService.deleteEmployee(staff.empId).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeDropdown(); // ปิด dropdown หลังจากลบ
        },
        error: (error) => console.error('Error deleting employee:', error)
      });
    }
  }

  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-green';
      case 'INACTIVE':
        return 'badge badge-red';
      case 'N/A':
      case null:
      case undefined:
        return 'badge badge-gray';
      default:
        return 'badge badge-gray';
    }
  }

  toggleDropdown(event: Event, staff: Employee): void {
    event.stopPropagation(); // ป้องกัน event กระจายไปยัง element อื่น
    if (this.activeStaff === staff) {
      this.closeDropdown(); // ถ้าเปิดอยู่แล้ว ให้ปิด
    } else {
      this.activeStaff = staff;
      this.isDropdownOpen = true;
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.activeStaff = null;
  }
}
