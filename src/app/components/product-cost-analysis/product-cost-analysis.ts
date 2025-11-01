import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductCostAnalysis, IngredientCostBreakdown } from '../../services/product.service';

@Component({
  selector: 'app-product-cost-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cost-analysis.html',
  styleUrls: ['./product-cost-analysis.css']
})
export class ProductCostAnalysisComponent implements OnInit {
  productId: number | null = null;
  product: Product | null = null;
  costAnalysis: ProductCostAnalysis | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;

    if (this.productId) {
      this.loadProductData();
      this.loadCostAnalysis();
    }
  }

  loadProductData(): void {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => console.error('Error loading product:', error)
      });
    }
  }

  loadCostAnalysis(): void {
    if (this.productId) {
      this.loading = true;
      this.productService.getProductCostAnalysis(this.productId).subscribe({
        next: (analysis) => {
          this.costAnalysis = analysis;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading cost analysis:', error);
          this.loading = false;
        }
      });
    }
  }

  recalculateCost(): void {
    if (this.productId) {
      this.loading = true;
      this.productService.recalculateProductCost(this.productId).subscribe({
        next: () => {
          this.loadProductData();
          this.loadCostAnalysis();
        },
        error: (error) => {
          console.error('Error recalculating cost:', error);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  editProduct(): void {
    this.router.navigate(['/products/edit', this.productId]);
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '฿0.00';
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatPercentage(percentage: number | undefined): string {
    if (percentage === undefined || percentage === null) return '0%';
    return `${percentage.toFixed(1)}%`;
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'ACTIVE': return 'badge badge-green';
      case 'INACTIVE': return 'badge badge-red';
      case 'DISCONTINUED': return 'badge badge-orange';
      default: return 'badge badge-gray';
    }
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'ACTIVE': return 'ใช้งาน';
      case 'INACTIVE': return 'ไม่ใช้งาน';
      case 'DISCONTINUED': return 'หยุดผลิต';
      default: return 'ไม่ระบุ';
    }
  }

  getProfitClass(profit: number | undefined): string {
    if (!profit || profit === 0) return '';
    return profit > 0 ? 'text-success' : 'text-danger';
  }

  getMarginClass(margin: number | undefined): string {
    if (!margin || margin === 0) return '';
    return margin > 0 ? 'text-success' : 'text-danger';
  }

  getMaxCostPercentage(): number {
    if (!this.costAnalysis?.ingredientBreakdown) return 0;
    return Math.max(...this.costAnalysis.ingredientBreakdown.map(item => item.costPercentage || 0));
  }
}
