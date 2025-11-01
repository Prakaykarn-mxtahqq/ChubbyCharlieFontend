// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { TransactionService, Transaction, TransactionSummary } from '../../services/transaction.service';
//
// @Component({
//   selector: 'app-transaction-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './transaction-list.html',
//   styleUrls: ['./transaction-list.css']
// })
// export class TransactionListComponent implements OnInit {
//   transactions: Transaction[] = [];
//   filteredTransactions: Transaction[] = [];
//   paginatedTransactions: Transaction[] = [];
//
//   searchTerm: string = '';
//   selectedType: 'ALL' | 'INCOME' | 'EXPENSE' = 'ALL';
//   selectedCategory: string = 'ALL';
//   startDate: string = '';
//   endDate: string = '';
//
//   currentPage: number = 1;
//   itemsPerPage: number = 10;
//   totalPages: number = 1;
//   loading: boolean = false;
//
//   isDropdownOpen: boolean = false;
//   activeTransaction: Transaction | null = null;
//
//   summary: TransactionSummary = {
//     totalIncome: 0,
//     totalExpense: 0,
//     netAmount: 0,
//     transactionCount: 0
//   };
//
//   constructor(
//     private transactionService: TransactionService,
//     private router: Router
//   ) {}
//
//   ngOnInit(): void {
//     this.initializeDateRange();
//     this.loadTransactions();
//     this.loadSummary();
//   }
//
//   initializeDateRange(): void {
//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
//     const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//
//     this.startDate = this.formatDateForInput(firstDay);
//     this.endDate = this.formatDateForInput(lastDay);
//   }
//
//   formatDateForInput(date: Date): string {
//     return date.toISOString().split('T')[0];
//   }
//
//   get totalTransactions(): number {
//     return this.filteredTransactions.length;
//   }
//
//   get incomeCategories(): string[] {
//     return this.transactionService.getIncomeCategories();
//   }
//
//   get expenseCategories(): string[] {
//     return this.transactionService.getExpenseCategories();
//   }
//
//   get allCategories(): string[] {
//     return [...this.incomeCategories, ...this.expenseCategories];
//   }
//
//   loadTransactions(): void {
//     this.loading = true;
//
//     if (this.startDate && this.endDate) {
//       this.transactionService.getTransactionsByDateRange(this.startDate, this.endDate).subscribe({
//         next: (transactions) => {
//           this.transactions = transactions;
//           this.applyFilters();
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading transactions:', error);
//           this.loading = false;
//         }
//       });
//     } else {
//       this.transactionService.getAllTransactions().subscribe({
//         next: (transactions) => {
//           this.transactions = transactions;
//           this.applyFilters();
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading transactions:', error);
//           this.loading = false;
//         }
//       });
//     }
//   }
//
//   loadSummary(): void {
//     if (this.startDate && this.endDate) {
//       this.transactionService.getTransactionSummary(this.startDate, this.endDate).subscribe({
//         next: (summary) => {
//           this.summary = summary;
//         },
//         error: (error) => console.error('Error loading summary:', error)
//       });
//     } else {
//       this.transactionService.getTransactionSummary().subscribe({
//         next: (summary) => {
//           this.summary = summary;
//         },
//         error: (error) => console.error('Error loading summary:', error)
//       });
//     }
//   }
//
//   onSearch(): void {
//     this.currentPage = 1;
//     if (this.searchTerm.trim()) {
//       this.transactionService.searchTransactions(this.searchTerm).subscribe({
//         next: (transactions) => {
//           this.filteredTransactions = transactions;
//           this.applyFilters();
//         },
//         error: (error) => console.error('Error searching transactions:', error)
//       });
//     } else {
//       this.applyFilters();
//     }
//   }
//
//   onFilterChange(): void {
//     this.currentPage = 1;
//     this.applyFilters();
//     this.loadSummary();
//   }
//
//   onDateRangeChange(): void {
//     this.currentPage = 1;
//     this.loadTransactions();
//     this.loadSummary();
//   }
//
//   applyFilters(): void {
//     let filtered = [...this.transactions];
//
//     if (this.selectedType !== 'ALL') {
//       filtered = filtered.filter(t => t.type === this.selectedType);
//     }
//
//     if (this.selectedCategory !== 'ALL') {
//       filtered = filtered.filter(t => t.category === this.selectedCategory);
//     }
//
//     if (this.searchTerm.trim()) {
//       const term = this.searchTerm.toLowerCase();
//       filtered = filtered.filter(t =>
//         t.description?.toLowerCase().includes(term) ||
//         t.category.toLowerCase().includes(term)
//       );
//     }
//
//     this.filteredTransactions = filtered;
//     this.calculatePagination();
//     this.updatePaginatedData();
//   }
//
//   calculatePagination(): void {
//     this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
//     if (this.currentPage > this.totalPages && this.totalPages > 0) {
//       this.currentPage = this.totalPages;
//     }
//   }
//
//   updatePaginatedData(): void {
//     const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//     const endIndex = startIndex + this.itemsPerPage;
//     this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
//   }
//
//   onItemsPerPageChange(): void {
//     this.currentPage = 1;
//     this.calculatePagination();
//     this.updatePaginatedData();
//   }
//
//   goToPage(page: number): void {
//     if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
//       this.currentPage = page;
//       this.updatePaginatedData();
//     }
//   }
//
//   getRowNumber(index: number): number {
//     return (this.currentPage - 1) * this.itemsPerPage + index + 1;
//   }
//
//   viewTransactionDetails(transaction: Transaction): void {
//     this.router.navigate(['/transactions', transaction.transactionId]);
//   }
//
//   goToAddTransaction(): void {
//     this.router.navigate(['/transactions/add']);
//   }
//
//   editTransaction(transaction: Transaction): void {
//     this.router.navigate(['/transactions/edit', transaction.transactionId]);
//     this.closeDropdown();
//   }
//
//   deleteTransaction(transaction: Transaction): void {
//     if (confirm('ต้องการลบรายการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
//       this.transactionService.deleteTransaction(transaction.transactionId!).subscribe({
//         next: () => {
//           alert('ลบรายการสำเร็จ');
//           this.loadTransactions();
//           this.loadSummary();
//           this.closeDropdown();
//         },
//         error: (error) => {
//           console.error('Error deleting transaction:', error);
//           alert('เกิดข้อผิดพลาดในการลบรายการ');
//         }
//       });
//     }
//   }
//
//   getTypeClass(type: string): string {
//     return type === 'INCOME' ? 'badge badge-green' : 'badge badge-red';
//   }
//
//   getTypeIcon(type: string): string {
//     return type === 'INCOME' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle';
//   }
//
//   getCategoryLabel(category: string): string {
//     return this.transactionService.getCategoryLabel(category);
//   }
//
//   formatCurrency(amount: number | undefined): string {
//     if (!amount) return '฿0.00';
//     return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   }
//
//   formatDate(date: Date | string | undefined): string {
//     if (!date) return '-';
//     return new Date(date).toLocaleDateString('th-TH', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   }
//
//   toggleDropdown(event: Event, transaction: Transaction): void {
//     event.stopPropagation();
//     if (this.activeTransaction === transaction) {
//       this.closeDropdown();
//     } else {
//       this.activeTransaction = transaction;
//       this.isDropdownOpen = true;
//     }
//   }
//
//   closeDropdown(): void {
//     this.isDropdownOpen = false;
//     this.activeTransaction = null;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransactionService, Transaction, TransactionFilter, TransactionSummary, TransactionCategory } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  summary: TransactionSummary | null = null;
  loading: boolean = false;

  // Filter
  filter: TransactionFilter = {};
  searchTerm: string = '';
  selectedType: '' | 'INCOME' | 'EXPENSE' = '';
  selectedCategory: TransactionCategory | '' = '';
  startDate: string = '';
  endDate: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDates();
    this.loadTransactions();
    this.loadSummary();
  }

  initializeDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.startDate = this.formatDateForInput(firstDay);
    this.endDate = this.formatDateForInput(lastDay);
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadTransactions(): void {
    this.loading = true;

    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort((a, b) => {
          const dateA = new Date(a.transactionDate || 0).getTime();
          const dateB = new Date(b.transactionDate || 0).getTime();
          return dateB - dateA;
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลได้');
      }
    });
  }

  loadSummary(): void {
    const params = this.startDate && this.endDate
      ? { startDate: this.startDate, endDate: this.endDate }
      : {};

    this.transactionService.getSummary(params.startDate, params.endDate).subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: (error) => console.error('Error loading summary:', error)
    });
  }

  applyFilters(): void {
    let filtered = [...this.transactions];

    // Filter by type
    if (this.selectedType) {
      filtered = filtered.filter(t => t.type === this.selectedType);
    }

    // Filter by category
    if (this.selectedCategory) {
      filtered = filtered.filter(t => t.category === this.selectedCategory);
    }

    // Filter by date range
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.transactionDate || 0);
        return transactionDate >= start;
      });
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.transactionDate || 0);
        return transactionDate <= end;
      });
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(term) ||
        t.orderNumber?.toLowerCase().includes(term) ||
        t.stockLotName?.toLowerCase().includes(term) ||
        this.formatCurrency(t.amount).includes(term)
      );
    }

    this.filteredTransactions = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransactions.slice(start, end);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.loadSummary();
  }

  clearFilters(): void {
    this.selectedType = '';
    this.selectedCategory = '';
    this.searchTerm = '';
    this.initializeDates();
    this.currentPage = 1;
    this.applyFilters();
    this.loadSummary();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  addTransaction(): void {
    this.router.navigate(['/transactions/add']);
  }

  editTransaction(id: number): void {
    this.router.navigate(['/transactions/edit', id]);
  }

  deleteTransaction(transaction: Transaction): void {
    if (!transaction.transactionId) return;

    const confirmMessage = `ต้องการลบรายการนี้?\n\n` +
      `ประเภท: ${this.getTypeLabel(transaction.type)}\n` +
      `จำนวนเงิน: ${this.formatCurrency(transaction.amount)}\n` +
      `หมวดหมู่: ${this.getCategoryLabel(transaction.category)}`;

    if (confirm(confirmMessage)) {
      this.transactionService.deleteTransaction(transaction.transactionId).subscribe({
        next: () => {
          alert('ลบรายการสำเร็จ');
          this.loadTransactions();
          this.loadSummary();
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
          alert('เกิดข้อผิดพลาดในการลบรายการ');
        }
      });
    }
  }

  viewReference(transaction: Transaction): void {
    if (transaction.referenceType === 'ORDER' && transaction.referenceId) {
      this.router.navigate(['/orders', transaction.referenceId]);
    } else if (transaction.referenceType === 'STOCK_LOT' && transaction.referenceId) {
      this.router.navigate(['/stock-lots', transaction.referenceId]);
    }
  }

  // Utility methods
  getTypeLabel(type: 'INCOME' | 'EXPENSE'): string {
    return this.transactionService.getTypeLabel(type);
  }

  getCategoryLabel(category: TransactionCategory): string {
    return this.transactionService.getCategoryLabel(category);
  }

  getTypeClass(type: 'INCOME' | 'EXPENSE'): string {
    return type === 'INCOME' ? 'badge-success' : 'badge-danger';
  }

  formatCurrency(amount: number | undefined | null): string {
    return this.transactionService.formatCurrency(amount);
  }

  formatDate(date: Date | string | undefined): string {
    return this.transactionService.formatDate(date);
  }

  get incomeCategories(): TransactionCategory[] {
    return this.transactionService.getIncomeCategories();
  }

  get expenseCategories(): TransactionCategory[] {
    return this.transactionService.getExpenseCategories();
  }

  get availableCategories(): TransactionCategory[] {
    if (!this.selectedType) {
      return this.transactionService.getAllCategories();
    }
    return this.selectedType === 'INCOME'
      ? this.incomeCategories
      : this.expenseCategories;
  }
}
