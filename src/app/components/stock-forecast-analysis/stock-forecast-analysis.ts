import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StockForecastService, StockForecastDTO } from '../../services/stock-forecast.service';

interface UsageAnalysisData {
  topUsageItems: StockForecastDTO[];
  totalDailyUsage: number;
  totalMonthlyUsage: number;
  analyzedItems: number;
}

@Component({
  selector: 'app-stock-forecast-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-forecast-analysis.html',
  styleUrls: ['./stock-forecast-analysis.css']
})
export class StockForecastAnalysisComponent implements OnInit {
  analysisData: UsageAnalysisData | null = null;
  chinaStockItems: StockForecastDTO[] = [];
  thaiStockItems: StockForecastDTO[] = [];
  loading: boolean = false;
  selectedView: 'usage' | 'china' | 'thai' = 'usage';
  topItemsCount: number = 30;
  sortBy: string = 'averageMonthlyUsage';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private stockForecastService: StockForecastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnalysis();
  }

  loadAnalysis(): void {
    this.loading = true;

    // Load usage analysis
    this.stockForecastService.getUsageAnalysis(this.topItemsCount).subscribe({
      next: (data) => {
        this.analysisData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analysis:', error);
        this.loading = false;
      }
    });

    // Load China stock forecasts
    this.stockForecastService.getForecastsByStockType('CHINA').subscribe({
      next: (items) => {
        this.chinaStockItems = items;
      },
      error: (error) => console.error('Error loading China stocks:', error)
    });

    // Load Thai stock forecasts
    this.stockForecastService.getForecastsByStockType('THAI').subscribe({
      next: (items) => {
        this.thaiStockItems = items;
      },
      error: (error) => console.error('Error loading Thai stocks:', error)
    });
  }

  refreshAnalysis(): void {
    this.loadAnalysis();
  }

  changeTopItems(): void {
    this.loadAnalysis();
  }

  sortItems(items: StockForecastDTO[]): StockForecastDTO[] {
    return [...items].sort((a, b) => {
      let compareValue = 0;
      switch (this.sortBy) {
        case 'averageMonthlyUsage':
          compareValue = a.averageMonthlyUsage - b.averageMonthlyUsage;
          break;
        case 'averageDailyUsage':
          compareValue = a.averageDailyUsage - b.averageDailyUsage;
          break;
        case 'currentStock':
          compareValue = a.currentStock - b.currentStock;
          break;
        case 'daysUntilStockOut':
          compareValue = a.daysUntilStockOut - b.daysUntilStockOut;
          break;
        case 'stockItemName':
          compareValue = a.stockItemName.localeCompare(b.stockItemName);
          break;
      }
      return this.sortOrder === 'asc' ? compareValue : -compareValue;
    });
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  get sortedTopUsageItems(): StockForecastDTO[] {
    return this.analysisData ? this.sortItems(this.analysisData.topUsageItems) : [];
  }

  get sortedChinaItems(): StockForecastDTO[] {
    return this.sortItems(this.chinaStockItems);
  }

  get sortedThaiItems(): StockForecastDTO[] {
    return this.sortItems(this.thaiStockItems);
  }

  getChinaTotalUsage(): number {
    return this.chinaStockItems.reduce((sum, item) => sum + item.averageMonthlyUsage, 0);
  }

  getThaiTotalUsage(): number {
    return this.thaiStockItems.reduce((sum, item) => sum + item.averageMonthlyUsage, 0);
  }

  getChinaTotalValue(): number {
    return this.chinaStockItems.reduce((sum, item) => sum + item.currentStockValue, 0);
  }

  getThaiTotalValue(): number {
    return this.thaiStockItems.reduce((sum, item) => sum + item.currentStockValue, 0);
  }

  getUsagePercentage(itemUsage: number, totalUsage: number): number {
    if (totalUsage === 0) return 0;
    return Math.round((itemUsage / totalUsage) * 100);
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

  formatNumber(num: number | undefined): string {
    if (!num) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  }

  goBack(): void {
    this.router.navigate(['/stock-forecast']);
  }

  exportAnalysis(): void {
    const exportData = {
      analysisData: this.analysisData,
      chinaStockAnalysis: {
        items: this.chinaStockItems.length,
        totalMonthlyUsage: this.getChinaTotalUsage(),
        totalValue: this.getChinaTotalValue(),
        details: this.chinaStockItems
      },
      thaiStockAnalysis: {
        items: this.thaiStockItems.length,
        totalMonthlyUsage: this.getThaiTotalUsage(),
        totalValue: this.getThaiTotalValue(),
        details: this.thaiStockItems
      },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `stock-usage-analysis-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}
