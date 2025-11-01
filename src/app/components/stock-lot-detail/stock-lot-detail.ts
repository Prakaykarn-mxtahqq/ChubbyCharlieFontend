import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StockLotService, StockLot } from '../../services/stock-lot.service';

@Component({
  selector: 'app-stock-lot-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-lot-detail.html',
  styleUrls: ['./stock-lot-detail.css']
})
export class StockLotDetailComponent implements OnInit {
  stockLot: StockLot | null = null;
  stockLotId: number | null = null;
  loading: boolean = true;
  totalCost: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stockLotService: StockLotService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.stockLotId = Number(id);
      this.loadStockLot();
    }
  }

  loadStockLot(): void {
    if (!this.stockLotId) return;

    this.loading = true;
    this.stockLotService.getStockLotById(this.stockLotId).subscribe({
      next: (data) => {
        console.log('📦 Stock Lot Data:', data);
        this.stockLot = data;
        this.calculateTotalCost();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stock lot:', error);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูล Stock Lot ได้');
      }
    });
  }

  calculateTotalCost(): void {
    console.log('🧮 Calculating total cost...');

    if (!this.stockLot?.items || this.stockLot.items.length === 0) {
      console.log('❌ No items found');
      this.totalCost = 0;
      return;
    }

    console.log('📋 Items:', this.stockLot.items);

    // คำนวณยอดรวมจาก items
    this.totalCost = this.stockLot.items.reduce((sum, item, index) => {
      console.log(`Item ${index + 1}:`, item);

      // ⭐ กรณีที่ 1: มี totalValue (ใช้อันนี้ก่อน - เป็นยอดรวมสุดท้าย)
      if (item.totalValue !== undefined && item.totalValue !== null) {
        console.log(`  ✅ totalValue: ${item.totalValue}`);
        return sum + Number(item.totalValue);
      }

      // กรณีที่ 2: ChinaStock มี totalBath
      if (item.totalBath !== undefined && item.totalBath !== null) {
        console.log(`  ✅ totalBath: ${item.totalBath}`);
        return sum + Number(item.totalBath);
      }

      // กรณีที่ 3: ThaiStock มี priceTotal
      if (item.priceTotal !== undefined && item.priceTotal !== null) {
        console.log(`  ✅ priceTotal: ${item.priceTotal}`);
        return sum + Number(item.priceTotal);
      }

      // กรณีที่ 4: คำนวณจาก quantity * finalPrice
      if (item.quantity && item.finalPrice) {
        const cost = item.quantity * item.finalPrice;
        console.log(`  ✅ quantity × finalPrice: ${item.quantity} × ${item.finalPrice} = ${cost}`);
        return sum + cost;
      }

      // กรณีที่ 5: คำนวณจาก quantity * costPerUnit
      if (item.quantity && item.costPerUnit) {
        const cost = item.quantity * item.costPerUnit;
        console.log(`  ✅ quantity × costPerUnit: ${item.quantity} × ${item.costPerUnit} = ${cost}`);
        return sum + cost;
      }

      // กรณีที่ 6: คำนวณจาก quantity * pricePerUnit
      if (item.quantity && item.pricePerUnit) {
        const cost = item.quantity * item.pricePerUnit;
        console.log(`  ✅ quantity × pricePerUnit: ${item.quantity} × ${item.pricePerUnit} = ${cost}`);
        return sum + cost;
      }

      // กรณีที่ 7: คำนวณจาก quantity * finalPricePerPair
      if (item.quantity && item.finalPricePerPair) {
        const cost = item.quantity * item.finalPricePerPair;
        console.log(`  ✅ quantity × finalPricePerPair: ${item.quantity} × ${item.finalPricePerPair} = ${cost}`);
        return sum + cost;
      }

      // กรณีที่ 8: คำนวณจาก quantity * pricePerUnitWithShipping
      if (item.quantity && item.pricePerUnitWithShipping) {
        const cost = item.quantity * item.pricePerUnitWithShipping;
        console.log(`  ✅ quantity × pricePerUnitWithShipping: ${item.quantity} × ${item.pricePerUnitWithShipping} = ${cost}`);
        return sum + cost;
      }

      console.log(`  ⚠️ Cannot calculate cost for this item`);
      return sum;
    }, 0);

    console.log('💰 Total Cost:', this.totalCost);
  }

  /**
   * ⭐ Complete Stock Lot และสร้าง Transaction
   */
  completeStockLot(): void {
    if (!this.stockLotId || !this.stockLot) return;

    // ตรวจสอบว่ามีสินค้าหรือไม่
    if (!this.stockLot.items || this.stockLot.items.length === 0) {
      alert('❌ ไม่สามารถ Complete ได้\n\nกรุณาเพิ่มสินค้าเข้า Stock Lot ก่อน');
      return;
    }

    // ตรวจสอบสถานะ
    if (this.stockLot.status === 'COMPLETED') {
      alert('❌ Stock Lot นี้ถูก Complete ไปแล้ว');
      return;
    }

    // ⭐ ตรวจสอบยอดรวม
    if (this.totalCost <= 0) {
      alert(
        '❌ ไม่สามารถ Complete ได้\n\n' +
        'ยอดรวมเป็น 0 หรือไม่ถูกต้อง\n' +
        'กรุณาตรวจสอบข้อมูลสินค้าให้มีราคาครบถ้วน'
      );
      return;
    }

    // ยืนยันการทำงาน
    const confirmed = confirm(
      `🎯 Complete Stock Lot?\n\n` +
      `Lot: ${this.stockLot.lotName}\n` +
      `จำนวนสินค้า: ${this.stockLot.items.length} รายการ\n` +
      `ยอดรวม: ${this.formatCurrency(this.totalCost)}\n\n` +
      `✅ ระบบจะ:\n` +
      `- เปลี่ยนสถานะเป็น COMPLETED\n` +
      `- สร้าง Transaction รายจ่ายอัตโนมัติ\n\n` +
      `ต้องการดำเนินการต่อหรือไม่?`
    );

    if (!confirmed) return;

    // เรียก API
    this.stockLotService.completeStockLot(this.stockLotId).subscribe({
      next: (response) => {
        console.log('✅ Complete response:', response);

        alert(
          `✅ Complete Stock Lot สำเร็จ!\n\n` +
          `📊 สร้าง Transaction อัตโนมัติ:\n` +
          `- ประเภท: รายจ่าย\n` +
          `- หมวดหมู่: ซื้อสต็อก\n` +
          `- จำนวนเงิน: ${this.formatCurrency(response.totalCost)}\n` +
          `- จำนวนสินค้า: ${response.itemsCount} รายการ\n\n` +
          `สถานะ: COMPLETED ✅`
        );

        // Reload ข้อมูล
        this.loadStockLot();
      },
      error: (error) => {
        console.error('❌ Error completing stock lot:', error);
        const errorMessage = error.error?.message || 'เกิดข้อผิดพลาดในการ Complete Stock Lot';
        alert(`❌ ไม่สามารถ Complete ได้\n\n${errorMessage}`);
      }
    });
  }

  editStockLot(): void {
    if (this.stockLot?.status === 'COMPLETED') {
      alert('❌ ไม่สามารถแก้ไข Stock Lot ที่ Complete แล้ว');
      return;
    }
    this.router.navigate(['/stock-lots/edit', this.stockLotId]);
  }

  /**
   * ⭐ เพิ่มสินค้าจากจีน
   */
  addChinaStock(): void {
    if (this.stockLot?.status === 'COMPLETED') {
      alert('❌ ไม่สามารถเพิ่มสินค้าใน Stock Lot ที่ Complete แล้ว');
      return;
    }
    this.router.navigate(['/china-stocks/add'], {
      queryParams: { stockLotId: this.stockLotId }
    });
  }

  /**
   * ⭐ เพิ่มสินค้าจากไทย
   */
  addThaiStock(): void {
    if (this.stockLot?.status === 'COMPLETED') {
      alert('❌ ไม่สามารถเพิ่มสินค้าใน Stock Lot ที่ Complete แล้ว');
      return;
    }
    this.router.navigate(['/thai-stocks/add'], {
      queryParams: { stockLotId: this.stockLotId }
    });
  }

  updateStatus(status: string): void {
    if (!this.stockLotId) return;

    if (this.stockLot?.status === 'COMPLETED') {
      alert('❌ ไม่สามารถเปลี่ยนสถานะของ Stock Lot ที่ Complete แล้ว');
      return;
    }

    this.stockLotService.updateStockLotStatus(this.stockLotId, status).subscribe({
      next: () => {
        alert(`✅ เปลี่ยนสถานะเป็น ${status} สำเร็จ`);
        this.loadStockLot();
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('❌ ไม่สามารถเปลี่ยนสถานะได้');
      }
    });
  }

  deleteStockLot(): void {
    if (!this.stockLotId || !this.stockLot) return;

    if (this.stockLot.status === 'COMPLETED') {
      alert('❌ ไม่สามารถลบ Stock Lot ที่ Complete แล้ว');
      return;
    }

    const confirmed = confirm(
      `⚠️ ยืนยันการลบ Stock Lot?\n\n` +
      `Lot: ${this.stockLot.lotName}\n` +
      `สถานะ: ${this.stockLot.status}\n\n` +
      `การกระทำนี้ไม่สามารถย้อนกลับได้`
    );

    if (!confirmed) return;

    this.stockLotService.deleteStockLot(this.stockLotId).subscribe({
      next: () => {
        alert('✅ ลบ Stock Lot สำเร็จ');
        this.router.navigate(['/stock-lots']);
      },
      error: (error) => {
        console.error('Error deleting stock lot:', error);
        const errorMessage = error.error?.message || 'เกิดข้อผิดพลาด';
        alert(`❌ ไม่สามารถลบได้\n\n${errorMessage}`);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/stock-lots']);
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '฿0.00';
    return `฿${amount.toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'ไม่ระบุ';
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(): string {
    switch (this.stockLot?.status) {
      case 'PENDING': return 'badge-warning';
      case 'ARRIVED': return 'badge-info';
      case 'COMPLETED': return 'badge-success';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusLabel(): string {
    switch (this.stockLot?.status) {
      case 'PENDING': return 'รอดำเนินการ';
      case 'ARRIVED': return 'สินค้าถึงแล้ว';
      case 'COMPLETED': return 'เสร็จสมบูรณ์';
      case 'CANCELLED': return 'ยกเลิก';
      default: return 'ไม่ทราบสถานะ';
    }
  }

  /**
   * ⭐ คำนวณยอดรวมของแต่ละ item
   */
  getItemTotalCost(item: any): number {
    // ลำดับความสำคัญในการหายอดรวม
    if (item.totalValue !== undefined && item.totalValue !== null) {
      return Number(item.totalValue);
    }
    if (item.totalBath !== undefined && item.totalBath !== null) {
      return Number(item.totalBath);
    }
    if (item.priceTotal !== undefined && item.priceTotal !== null) {
      return Number(item.priceTotal);
    }
    if (item.quantity && item.finalPrice) {
      return item.quantity * item.finalPrice;
    }
    if (item.quantity && item.costPerUnit) {
      return item.quantity * item.costPerUnit;
    }
    if (item.quantity && item.pricePerUnit) {
      return item.quantity * item.pricePerUnit;
    }
    if (item.quantity && item.finalPricePerPair) {
      return item.quantity * item.finalPricePerPair;
    }
    if (item.quantity && item.pricePerUnitWithShipping) {
      return item.quantity * item.pricePerUnitWithShipping;
    }
    return 0;
  }

  /**
   * ⭐ หาราคาต่อหน่วยของแต่ละ item
   */
  getItemUnitPrice(item: any): number {
    if (item.finalPrice !== undefined && item.finalPrice !== null) {
      return Number(item.finalPrice);
    }
    if (item.costPerUnit !== undefined && item.costPerUnit !== null) {
      return Number(item.costPerUnit);
    }
    if (item.pricePerUnit !== undefined && item.pricePerUnit !== null) {
      return Number(item.pricePerUnit);
    }
    if (item.finalPricePerPair !== undefined && item.finalPricePerPair !== null) {
      return Number(item.finalPricePerPair);
    }
    if (item.pricePerUnitWithShipping !== undefined && item.pricePerUnitWithShipping !== null) {
      return Number(item.pricePerUnitWithShipping);
    }
    return 0;
  }
}
