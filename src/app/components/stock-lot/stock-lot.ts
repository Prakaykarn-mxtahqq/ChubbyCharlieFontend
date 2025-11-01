import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StockLotService, StockLot } from '../../services/stock-lot.service';

@Component({
  selector: 'app-stock-lot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-lot.html',
  styleUrls: ['./stock-lot.css']
})
export class StockLotComponent implements OnInit {
  filteredStockLots: StockLot[] = [];
  paginatedStockLots: StockLot[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  loading: boolean = false;
  selectedStatus: 'ALL' | 'PENDING' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED' = 'ALL';
  isDropdownOpen: boolean = false;
  activeStockLot: StockLot | null = null;

  constructor(
    private stockLotService: StockLotService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStockLots();
  }

  get totalStockLots(): number {
    return this.filteredStockLots.length;
  }

  loadStockLots(): void {
    this.loading = true;
    this.stockLotService.getAllStockLots().subscribe({
      next: (stockLots) => {
        this.filteredStockLots = stockLots;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stock lots:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.filteredStockLots];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(lot =>
        lot.lotName.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(lot => lot.status === this.selectedStatus);
    }

    this.filteredStockLots = filtered;
    this.calculatePagination();
    this.updatePaginatedData();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredStockLots.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStockLots = this.filteredStockLots.slice(startIndex, endIndex);
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

  viewStockLotDetails(stockLot: StockLot): void {
    this.router.navigate(['/stock-lots', stockLot.stockLotId]);
  }

  openAddStockLotModal(): void {
    this.router.navigate(['/stock-lots/add']);
  }

  editStockLot(stockLot: StockLot): void {
    this.router.navigate(['/stock-lots/edit', stockLot.stockLotId]);
    this.closeDropdown();
  }

  updateStockLotStatus(stockLot: StockLot, newStatus: string): void {
    if (stockLot.stockLotId) {
      this.stockLotService.updateStockLotStatus(stockLot.stockLotId, newStatus).subscribe({
        next: () => {
          this.loadStockLots();
          this.closeDropdown();
        },
        error: (error) => console.error('Error updating stock lot status:', error)
      });
    }
  }

  deleteStockLot(stockLot: StockLot): void {
    if (confirm(`Are you sure you want to delete ${stockLot.lotName}?`)) {
      if (stockLot.stockLotId) {
        this.stockLotService.deleteStockLot(stockLot.stockLotId).subscribe({
          next: () => {
            this.loadStockLots();
            this.closeDropdown();
          },
          error: (error) => console.error('Error deleting stock lot:', error)
        });
      }
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING':
        return 'badge badge-yellow';
      case 'IN_TRANSIT':
        return 'badge badge-blue';
      case 'ARRIVED':
        return 'badge badge-green';
      case 'COMPLETED':
        return 'badge badge-green';
      case 'CANCELLED':
        return 'badge badge-red';
      default:
        return 'badge badge-gray';
    }
  }

  toggleDropdown(event: Event, stockLot: StockLot): void {
    event.stopPropagation();
    if (this.activeStockLot === stockLot) {
      this.closeDropdown();
    } else {
      this.activeStockLot = stockLot;
      this.isDropdownOpen = true;
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.activeStockLot = null;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '฿0.00';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  }
}
