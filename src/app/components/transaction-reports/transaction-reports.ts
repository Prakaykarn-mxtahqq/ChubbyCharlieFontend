import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, MonthlyReport, CategoryBreakdown } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-reports.html',
  styleUrls: ['./transaction-reports.css']
})
export class TransactionReportsComponent implements OnInit {
  loading: boolean = false;
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;

  monthlyReport: MonthlyReport | null = null;
  yearlyReports: MonthlyReport[] = [];

  // ⭐ Error handling
  errorMessage: string = '';
  hasError: boolean = false;
  useMockData: boolean = false;

  availableYears: number[] = [];
  months = [
    { value: 1, label: 'มกราคม' },
    { value: 2, label: 'กุมภาพันธ์' },
    { value: 3, label: 'มีนาคม' },
    { value: 4, label: 'เมษายน' },
    { value: 5, label: 'พฤษภาคม' },
    { value: 6, label: 'มิถุนายน' },
    { value: 7, label: 'กรกฎาคม' },
    { value: 8, label: 'สิงหาคม' },
    { value: 9, label: 'กันยายน' },
    { value: 10, label: 'ตุลาคม' },
    { value: 11, label: 'พฤศจิกายน' },
    { value: 12, label: 'ธันวาคม' }
  ];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.initializeYears();
    this.loadMonthlyReport();
    this.loadYearlyReport();
  }

  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.availableYears.push(year);
    }
  }

  loadMonthlyReport(): void {
    this.loading = true;
    this.hasError = false;
    this.errorMessage = '';

    this.transactionService.getMonthlyReport(this.selectedYear, this.selectedMonth).subscribe({
      next: (report) => {
        this.monthlyReport = report;
        this.loading = false;
        this.useMockData = false;

        // ⭐ ถ้าไม่มีข้อมูล แต่ response สำเร็จ
        if (!report || report.transactionCount === 0) {
          this.hasError = true;
          this.errorMessage = 'ไม่มีข้อมูลรายการในเดือนนี้';
        }
      },
      error: (error) => {
        console.error('Error loading monthly report:', error);
        this.loading = false;
        this.hasError = true;

        // ⭐ จัดการ Error ต่างๆ
        if (error.status === 500) {
          this.errorMessage = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กรุณาตรวจสอบว่า Backend API ทำงานอยู่หรือไม่';
        } else if (error.status === 404) {
          this.errorMessage = 'ไม่พบ API Endpoint สำหรับดึงรายงาน กรุณาตรวจสอบ Backend';
        } else if (error.status === 0) {
          this.errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend กำลังทำงานที่ http://localhost:8080';
        } else {
          this.errorMessage = `เกิดข้อผิดพลาด: ${error.message || 'ไม่สามารถโหลดข้อมูลได้'}`;
        }

        // ⭐ แสดง Solution
        console.log('💡 แนะนำการแก้ไข:');
        console.log('1. ตรวจสอบว่า Backend API ทำงานอยู่ที่ http://localhost:8080');
        console.log('2. ตรวจสอบว่ามี endpoint: GET /api/transactions/reports/monthly');
        console.log('3. ตรวจสอบว่ามีข้อมูล Transaction ในฐานข้อมูล');
        console.log('4. หรือคลิกปุ่ม "ใช้ข้อมูลตัวอย่าง" เพื่อทดสอบ UI');
      }
    });
  }

  loadYearlyReport(): void {
    this.transactionService.getYearlyReport(this.selectedYear).subscribe({
      next: (reports) => {
        this.yearlyReports = reports;
        this.useMockData = false;
      },
      error: (error) => {
        console.error('Error loading yearly report:', error);
        this.yearlyReports = [];
      }
    });
  }

  // ⭐ ฟังก์ชันสร้าง Mock Data สำหรับทดสอบ
  loadMockData(): void {
    this.useMockData = true;
    this.hasError = false;
    this.errorMessage = '';
    this.loading = false;

    // Mock Monthly Report
    this.monthlyReport = {
      month: this.getMonthName(this.selectedMonth),
      year: this.selectedYear,
      totalIncome: 450000,
      totalExpense: 320000,
      netAmount: 130000,
      transactionCount: 45,
      categoryBreakdown: [
        {
          category: 'ORDER_PAYMENT',
          amount: 350000,
          count: 25,
          percentage: 77.8
        },
        {
          category: 'SERVICE_INCOME',
          amount: 80000,
          count: 8,
          percentage: 17.8
        },
        {
          category: 'OTHER_INCOME',
          amount: 20000,
          count: 3,
          percentage: 4.4
        },
        {
          category: 'STOCK_PURCHASE',
          amount: 150000,
          count: 5,
          percentage: 46.9
        },
        {
          category: 'SALARY_MONTHLY',
          amount: 80000,
          count: 4,
          percentage: 25.0
        },
        {
          category: 'SHIPPING_COST',
          amount: 45000,
          count: 20,
          percentage: 14.1
        },
        {
          category: 'MARKETING',
          amount: 25000,
          count: 3,
          percentage: 7.8
        },
        {
          category: 'OTHER_EXPENSE',
          amount: 20000,
          count: 5,
          percentage: 6.2
        }
      ]
    };

    // Mock Yearly Reports
    this.yearlyReports = this.months.map((month, index) => ({
      month: month.label,
      year: this.selectedYear,
      totalIncome: 300000 + Math.random() * 200000,
      totalExpense: 200000 + Math.random() * 150000,
      netAmount: 50000 + Math.random() * 100000,
      transactionCount: 30 + Math.floor(Math.random() * 30),
      categoryBreakdown: []
    }));

    // คำนวณ netAmount ให้ถูกต้อง
    this.yearlyReports.forEach(report => {
      report.netAmount = report.totalIncome - report.totalExpense;
    });

    console.log('✅ ใช้ข้อมูลตัวอย่างสำหรับทดสอบ UI');
  }

  // ⭐ Retry function
  retryLoad(): void {
    this.loadMonthlyReport();
    this.loadYearlyReport();
  }

  onYearChange(): void {
    if (!this.useMockData) {
      this.loadMonthlyReport();
      this.loadYearlyReport();
    }
  }

  onMonthChange(): void {
    if (!this.useMockData) {
      this.loadMonthlyReport();
    }
  }

  getMonthName(month: number): string {
    const monthData = this.months.find(m => m.value === month);
    return monthData ? monthData.label : '';
  }

  formatCurrency(amount: number | undefined): string {
    return this.transactionService.formatCurrency(amount);
  }

  getCategoryLabel(category: string): string {
    return this.transactionService.getCategoryLabel(category as any);
  }

  get incomeCategories(): CategoryBreakdown[] {
    if (!this.monthlyReport) return [];
    return this.monthlyReport.categoryBreakdown.filter(c =>
      this.transactionService.getIncomeCategories().includes(c.category as any)
    );
  }

  get expenseCategories(): CategoryBreakdown[] {
    if (!this.monthlyReport) return [];
    return this.monthlyReport.categoryBreakdown.filter(c =>
      this.transactionService.getExpenseCategories().includes(c.category as any)
    );
  }

  get totalIncomeFromBreakdown(): number {
    return this.incomeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  }

  get totalExpenseFromBreakdown(): number {
    return this.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  }

  get yearlyTotalIncome(): number {
    return this.yearlyReports.reduce((sum, report) => sum + report.totalIncome, 0);
  }

  get yearlyTotalExpense(): number {
    return this.yearlyReports.reduce((sum, report) => sum + report.totalExpense, 0);
  }

  get yearlyNetAmount(): number {
    return this.yearlyTotalIncome - this.yearlyTotalExpense;
  }

  getTotalTransactionCount(): number {
    return this.yearlyReports.reduce((sum, report) => sum + report.transactionCount, 0);
  }

  exportToCSV(): void {
    if (!this.monthlyReport) return;

    let csv = 'Transaction Report\n';
    csv += `Period: ${this.getMonthName(this.selectedMonth)} ${this.selectedYear}\n\n`;

    csv += 'Summary\n';
    csv += 'Type,Amount\n';
    csv += `Total Income,${this.monthlyReport.totalIncome}\n`;
    csv += `Total Expense,${this.monthlyReport.totalExpense}\n`;
    csv += `Net Amount,${this.monthlyReport.netAmount}\n\n`;

    csv += 'Category Breakdown\n';
    csv += 'Category,Amount,Count,Percentage\n';
    this.monthlyReport.categoryBreakdown.forEach(cat => {
      csv += `${this.getCategoryLabel(cat.category)},${cat.amount},${cat.count},${cat.percentage}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction-report-${this.selectedYear}-${this.selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
  }
}
