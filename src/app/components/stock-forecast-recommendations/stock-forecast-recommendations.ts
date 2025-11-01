import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  StockForecastService,
  StockOrderRecommendationDTO,
  OrderGroupDTO,
  StockForecastDTO
} from '../../services/stock-forecast.service';

@Component({
  selector: 'app-stock-forecast-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-forecast-recommendations.html',
  styleUrls: ['./stock-forecast-recommendations.css']
})
export class StockForecastRecommendationsComponent implements OnInit {
  recommendations: StockOrderRecommendationDTO | null = null;
  loading: boolean = false;
  urgentDays: number = 14;
  soonDays: number = 30;
  selectedTab: 'urgent' | 'soon' | 'china' | 'thai' = 'urgent';
  expandedItems: Set<number> = new Set();

  constructor(
    private stockForecastService: StockForecastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.loading = true;
    this.stockForecastService.getOrderRecommendations(this.urgentDays, this.soonDays).subscribe({
      next: (data) => {
        this.recommendations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
        this.loading = false;
      }
    });
  }

  refreshRecommendations(): void {
    this.loadRecommendations();
  }

  toggleItemExpansion(forecastId: number): void {
    if (this.expandedItems.has(forecastId)) {
      this.expandedItems.delete(forecastId);
    } else {
      this.expandedItems.add(forecastId);
    }
  }

  isItemExpanded(forecastId: number): boolean {
    return this.expandedItems.has(forecastId);
  }

  getPriorityClass(level: string): string {
    switch (level) {
      case 'CRITICAL':
        return 'priority-critical';
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
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

  exportRecommendations(): void {
    // Convert recommendations to JSON and download
    const dataStr = JSON.stringify(this.recommendations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `stock-recommendations-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  printRecommendations(): void {
    window.print();
  }
}
