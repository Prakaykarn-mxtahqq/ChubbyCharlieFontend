import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionService, Transaction, TransactionCategory } from '../../services/transaction.service';
import { OrderService, Order } from '../../services/order.service';
import { StockLotService, StockLot } from '../../services/stock-lot.service';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-add.html',
  styleUrls: ['./transaction-add.css']
})
export class TransactionAddComponent implements OnInit {
  isEditMode: boolean = false;
  transactionId: number | null = null;
  loading: boolean = false;
  submitting: boolean = false;

  // Form data
  type: 'INCOME' | 'EXPENSE' = 'INCOME';
  category: TransactionCategory = 'ORDER_PAYMENT';
  amount: number = 0;
  transactionDate: string = '';
  description: string = '';
  referenceType: '' | 'ORDER' | 'STOCK_LOT' = '';
  referenceId: number | null = null;

  // Reference data
  orders: Order[] = [];
  stockLots: StockLot[] = [];
  filteredOrders: Order[] = [];
  filteredStockLots: StockLot[] = [];

  constructor(
    private transactionService: TransactionService,
    private orderService: OrderService,
    private stockLotService: StockLotService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeTransactionDate();
    this.loadReferenceData();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.transactionId = Number(id);
      this.loadTransaction();
    }
  }

  initializeTransactionDate(): void {
    const now = new Date();
    this.transactionDate = this.formatDateForInput(now);
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  loadReferenceData(): void {
    // Load orders
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = orders;
      },
      error: (error) => console.error('Error loading orders:', error)
    });

    // Load stock lots
    this.stockLotService.getAllStockLots().subscribe({
      next: (stockLots) => {
        this.stockLots = stockLots;
        this.filteredStockLots = stockLots;
      },
      error: (error) => console.error('Error loading stock lots:', error)
    });
  }

  loadTransaction(): void {
    if (this.transactionId) {
      this.loading = true;
      this.transactionService.getTransactionById(this.transactionId).subscribe({
        next: (transaction) => {
          this.populateFormWithTransaction(transaction);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading transaction:', error);
          alert('ไม่สามารถโหลดข้อมูลได้');
          this.router.navigate(['/transactions']);
        }
      });
    }
  }

  populateFormWithTransaction(transaction: Transaction): void {
    this.type = transaction.type;
    this.category = transaction.category;
    this.amount = transaction.amount;
    this.transactionDate = transaction.transactionDate
      ? this.formatDateForInput(new Date(transaction.transactionDate))
      : '';
    this.description = transaction.description || '';
    this.referenceType = transaction.referenceType || '';
    this.referenceId = transaction.referenceId || null;
  }

  onTypeChange(): void {
    // เปลี่ยน category ตาม type
    if (this.type === 'INCOME') {
      this.category = 'ORDER_PAYMENT';
    } else {
      this.category = 'STOCK_PURCHASE';
    }
  }

  onReferenceTypeChange(): void {
    this.referenceId = null;
  }

  get availableCategories(): TransactionCategory[] {
    return this.type === 'INCOME'
      ? this.transactionService.getIncomeCategories()
      : this.transactionService.getExpenseCategories();
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;

    const transactionData: Transaction = {
      type: this.type,
      category: this.category,
      amount: this.amount,
      transactionDate: this.transactionDate ? new Date(this.transactionDate).toISOString() : undefined,
      description: this.description.trim() || undefined,
      referenceType: this.referenceType || undefined,
      referenceId: this.referenceId || undefined
    };

    const operation = this.isEditMode
      ? this.transactionService.updateTransaction(this.transactionId!, transactionData)
      : this.transactionService.createTransaction(transactionData);

    operation.subscribe({
      next: (response) => {
        const message = this.isEditMode ? 'แก้ไขรายการสำเร็จ' : 'เพิ่มรายการสำเร็จ';
        alert(message);
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        console.error('Error saving transaction:', error);
        alert('เกิดข้อผิดพลาด: ' + (error.error?.message || error.message));
        this.submitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.type) {
      alert('กรุณาเลือกประเภท');
      return false;
    }

    if (!this.category) {
      alert('กรุณาเลือกหมวดหมู่');
      return false;
    }

    if (!this.amount || this.amount <= 0) {
      alert('กรุณากรอกจำนวนเงินที่มากกว่า 0');
      return false;
    }

    if (!this.transactionDate) {
      alert('กรุณาเลือกวันที่');
      return false;
    }

    return true;
  }

  goBack(): void {
    if (confirm('ต้องการยกเลิกและกลับหรือไม่? ข้อมูลที่กรอกจะหายไป')) {
      this.router.navigate(['/transactions']);
    }
  }

  getCategoryLabel(category: TransactionCategory): string {
    return this.transactionService.getCategoryLabel(category);
  }

  formatCurrency(amount: number | null | undefined): string {
    return this.transactionService.formatCurrency(amount);
  }

  // Quick amount buttons
  addQuickAmount(value: number): void {
    this.amount = (this.amount || 0) + value;
  }

  setQuickAmount(value: number): void {
    this.amount = value;
  }
}
