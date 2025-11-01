import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})
export class CustomerComponent implements OnInit {
  customers: Customer[] = [];  // ✅ เพิ่มตัวแปรนี้
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  loading: boolean = false;
  isDropdownOpen: boolean = false;
  activeCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  get totalCustomers(): number {
    return this.filteredCustomers.length;
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;  // ✅ เก็บข้อมูลทั้งหมด
        this.filteredCustomers = customers;
        this.calculatePagination();
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลลูกค้า');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    if (this.searchTerm.trim()) {
      this.customerService.searchCustomersByNameOrPhone(this.searchTerm).subscribe({
        next: (customers) => {
          this.filteredCustomers = customers;
          this.calculatePagination();
          this.updatePaginatedData();
        },
        error: (error) => {
          console.error('Error searching customers:', error);
          // ถ้า API ล้มเหลว ใช้ filter ใน frontend แทน
          this.filteredCustomers = this.customers.filter(c =>
            c.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            (c.customerPhone && c.customerPhone.includes(this.searchTerm))
          );
          this.calculatePagination();
          this.updatePaginatedData();
        }
      });
    } else {
      this.filteredCustomers = this.customers;
      this.calculatePagination();
      this.updatePaginatedData();
    }
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.totalPages === 0) {
      this.currentPage = 1;
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
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

  openAddCustomerModal(): void {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers/edit', customer.customerId]);
    this.closeDropdown();
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${customer.customerName}?`)) {
      this.customerService.deleteCustomer(customer.customerId).subscribe({
        next: () => {
          alert('ลบลูกค้าสำเร็จ');
          this.loadCustomers();
          this.closeDropdown();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('เกิดข้อผิดพลาดในการลบลูกค้า');
        }
      });
    }
  }

  toggleDropdown(event: Event, customer: Customer): void {
    event.stopPropagation();
    if (this.activeCustomer === customer) {
      this.closeDropdown();
    } else {
      this.activeCustomer = customer;
      this.isDropdownOpen = true;
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.activeCustomer = null;
  }

  // ✅ เพิ่ม method สำหรับปิด dropdown เมื่อคลิกที่อื่น
  onDocumentClick(): void {
    if (this.isDropdownOpen) {
      this.closeDropdown();
    }
  }
}
