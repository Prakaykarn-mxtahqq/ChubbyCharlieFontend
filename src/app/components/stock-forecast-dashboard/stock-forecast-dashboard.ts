import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  StockForecastService,
  StockForecastSummaryDTO,
  StockForecastDTO
} from '../../services/stock-forecast.service';

@Component({
  selector: 'app-stock-forecast-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './stock-forecast-dashboard.html',
  styleUrls: ['./stock-forecast-dashboard.css']
})
export class StockForecastDashboardComponent implements OnInit {
  summary: StockForecastSummaryDTO | null = null;
  urgentItems: StockForecastDTO[] = [];
  soonestToRunOut: StockForecastDTO[] = [];
  chinaStockCount: number = 0;
  thaiStockCount: number = 0;
  urgentOrderCost: number = 0;
  loading: boolean = false;
  calculating: boolean = false;

  constructor(
    private stockForecastService: StockForecastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.stockForecastService.getDashboard().subscribe({
      next: (data) => {
        this.summary = data.summary;
        this.urgentItems = data.urgentItems || [];
        this.soonestToRunOut = data.soonestToRunOut || [];
        this.chinaStockCount = data.chinaStockCount || 0;
        this.thaiStockCount = data.thaiStockCount || 0;
        this.urgentOrderCost = data.urgentOrderCost || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading = false;
      }
    });
  }

  calculateForecasts(): void {
    if (confirm('This will recalculate all stock forecasts. Continue?')) {
      this.calculating = true;
      this.stockForecastService.calculateAllForecasts().subscribe({
        next: () => {
          alert('Stock forecasts calculated successfully!');
          this.calculating = false;
          this.loadDashboard();
        },
        error: (error) => {
          console.error('Error calculating forecasts:', error);
          alert('Error calculating forecasts. Please try again.');
          this.calculating = false;
        }
      });
    }
  }

  navigateToUrgentItems(): void {
    this.router.navigate(['/stock-forecast/urgent']);
  }

  navigateToRecommendations(): void {
    this.router.navigate(['/stock-forecast/recommendations']);
  }

  navigateToAnalysis(): void {
    this.router.navigate(['/stock-forecast/analysis']);
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

  getProgressPercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }
}
