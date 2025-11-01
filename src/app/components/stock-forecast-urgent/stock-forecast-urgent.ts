import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StockForecastService, StockForecastDTO } from '../../services/stock-forecast.service';

@Component({
  selector: 'app-stock-forecast-urgent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-forecast-urgent.html',
  styleUrls: ['./stock-forecast-urgent.css']
})
export class StockForecastUrgentComponent implements OnInit {
  urgentItems: StockForecastDTO[] = [];
  filteredItems: StockForecastDTO[] = [];
  paginatedItems: StockForecastDTO[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  selectedUrgency: string = 'ALL';
  selectedStockType: string = 'ALL';
  sortBy: string = 'daysUntilStockOut';
  sortOrder: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private stockForecastService: StockForecastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUrgentItems();
  }

  loadUrgentItems(): void {
    this.loading = true;
    this.stockForecastService.getUrgentStockItems().subscribe({
      next: (items) => {
        this.urgentItems = items;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading urgent items:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.urgentItems];

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.stockItemName.toLowerCase().includes(searchLower) ||
        item.stockType.toLowerCase().includes(searchLower)
      );
    }

    // Urgency filter
    if (this.selectedUrgency !== 'ALL') {
      filtered = filtered.filter(item => item.urgencyLevel === this.selectedUrgency);
    }

    // Stock type filter
    if (this.selectedStockType !== 'ALL') {
      filtered = filtered.filter(item => item.stockType === this.selectedStockType);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      switch (this.sortBy) {
        case 'daysUntilStockOut':
          compareValue = a.daysUntilStockOut - b.daysUntilStockOut;
          break;
        case 'currentStock':
          compareValue = a.currentStock - b.currentStock;
          break;
        case 'estimatedOrderCost':
          compareValue = a.estimatedOrderCost - b.estimatedOrderCost;
          break;
        case 'stockItemName':
          compareValue = a.stockItemName.localeCompare(b.stockItemName);
          break;
      }
      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    this.filteredItems = filtered;
    this.calculatePagination();
    this.updatePaginatedData();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
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

  getUrgencyClass(urgencyLevel: string): string {
    switch (urgencyLevel) {
      case 'CRITICAL':
        return 'urgency-critical';
      case 'HIGH':
        return 'urgency-high';
      case 'MEDIUM':
        return 'urgency-medium';
      case 'LOW':
        return 'urgency-low';
      default:
        return 'urgency-unknown';
    }
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '฿0.00';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('th-TH');
  }

  goBack(): void {
    this.router.navigate(['/stock-forecast']);
  }

  getTotalEstimatedCost(): number {
    return this.filteredItems.reduce((sum, item) => sum + item.estimatedOrderCost, 0);
  }

  protected readonly Math = Math;
}
