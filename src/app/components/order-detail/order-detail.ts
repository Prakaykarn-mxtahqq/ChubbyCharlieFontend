// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { OrderService, Order } from '../../services/order.service';
//
// @Component({
//   selector: 'app-order-detail',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order-detail.html',
//   styleUrls: ['./order-detail.css']
// })
// export class OrderDetailComponent implements OnInit {
//   order: Order | null = null;
//   loading: boolean = true;
//   orderId: number | null = null;
//
//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private orderService: OrderService
//   ) {}
//
//   ngOnInit(): void {
//     this.orderId = Number(this.route.snapshot.paramMap.get('id'));
//     if (this.orderId) {
//       this.loadOrder();
//     }
//   }
//
//   loadOrder(): void {
//     if (this.orderId) {
//       this.loading = true;
//       this.orderService.getOrderById(this.orderId).subscribe({
//         next: (order) => {
//           this.order = order;
//           this.loading = false;
//         },
//         error: (error) => {
//           console.error('Error loading order:', error);
//           this.loading = false;
//           alert('ไม่พบออเดอร์');
//           this.router.navigate(['/orders']);
//         }
//       });
//     }
//   }
//
//   goBack(): void {
//     this.router.navigate(['/orders']);
//   }
//
//   editOrder(): void {
//     this.router.navigate(['/orders/edit', this.orderId]);
//   }
//
//   deductStock(): void {
//     if (confirm('ต้องการตัด Stock สำหรับออเดอร์นี้?')) {
//       this.orderService.deductStockForOrder(this.orderId!).subscribe({
//         next: (response) => {
//           alert('ตัด Stock สำเร็จ!\n' + response.messages.join('\n'));
//           this.loadOrder();
//         },
//         error: (error) => {
//           console.error('Error deducting stock:', error);
//           alert('เกิดข้อผิดพลาดในการตัด Stock');
//         }
//       });
//     }
//   }
//
//   checkStock(): void {
//     this.orderService.checkStockAvailability(this.orderId!).subscribe({
//       next: (response) => {
//         alert(response.message);
//       },
//       error: (error) => console.error('Error checking stock:', error)
//     });
//   }
//
//   updateStatus(newStatus: string): void {
//     if (confirm(`ต้องการเปลี่ยนสถานะเป็น ${newStatus}?`)) {
//       this.orderService.updateOrderStatus(this.orderId!, newStatus).subscribe({
//         next: () => {
//           alert('เปลี่ยนสถานะสำเร็จ');
//           this.loadOrder();
//         },
//         error: (error) => {
//           console.error('Error updating status:', error);
//           alert('เกิดข้อผิดพลาด');
//         }
//       });
//     }
//   }
//
//   updatePaymentStatus(newStatus: string): void {
//     if (confirm(`ต้องการเปลี่ยนสถานะการชำระเงินเป็น ${newStatus}?`)) {
//       this.orderService.updatePaymentStatus(this.orderId!, newStatus).subscribe({
//         next: () => {
//           alert('เปลี่ยนสถานะการชำระเงินสำเร็จ');
//           this.loadOrder();
//         },
//         error: (error) => {
//           console.error('Error updating payment status:', error);
//           alert('เกิดข้อผิดพลาด');
//         }
//       });
//     }
//   }
//
//   cancelOrder(): void {
//     if (confirm('ต้องการยกเลิกออเดอร์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
//       this.orderService.cancelOrder(this.orderId!).subscribe({
//         next: () => {
//           alert('ยกเลิกออเดอร์สำเร็จ');
//           this.loadOrder();
//         },
//         error: (error) => {
//           console.error('Error cancelling order:', error);
//           alert('เกิดข้อผิดพลาด');
//         }
//       });
//     }
//   }
//
//   getStatusClass(status: string | undefined): string {
//     switch (status) {
//       case 'PENDING': return 'badge badge-warning';
//       case 'CONFIRMED': return 'badge badge-info';
//       case 'PROCESSING': return 'badge badge-primary';
//       case 'PACKED': return 'badge badge-purple';
//       case 'SHIPPED': return 'badge badge-blue';
//       case 'DELIVERED': return 'badge badge-green';
//       case 'CANCELLED': return 'badge badge-red';
//       case 'RETURNED': return 'badge badge-orange';
//       default: return 'badge badge-gray';
//     }
//   }
//
//   getPaymentStatusClass(status: string | undefined): string {
//     switch (status) {
//       case 'PAID': return 'badge badge-green';
//       case 'UNPAID': return 'badge badge-red';
//       case 'REFUNDED': return 'badge badge-orange';
//       default: return 'badge badge-gray';
//     }
//   }
//
//   getStockDeductionClass(status: string | undefined): string {
//     switch (status) {
//       case 'PENDING': return 'badge badge-warning';
//       case 'COMPLETED': return 'badge badge-green';
//       case 'FAILED': return 'badge badge-red';
//       case 'CANCELLED': return 'badge badge-gray';
//       default: return 'badge badge-gray';
//     }
//   }
//
//   // formatCurrency(amount: number | undefined): string {
//   //   if (amount === undefined || amount === null) return '฿0.00';
//   //   return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   // }
//   formatCurrency(amount: number | undefined | null): string {
//     const value = amount ?? 0;
//     return `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   }
//
//   formatDate(date: Date | undefined): string {
//     if (!date) return '-';
//     return new Date(date).toLocaleDateString('th-TH', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  orderId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.orderId) {
      this.loadOrder();
    }
  }

  loadOrder(): void {
    if (this.orderId) {
      this.loading = true;
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading order:', error);
          this.loading = false;
          alert('ไม่พบออเดอร์');
          this.router.navigate(['/orders']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  editOrder(): void {
    this.router.navigate(['/orders/edit', this.orderId]);
  }

  deductStock(): void {
    if (confirm('ต้องการตัด Stock สำหรับออเดอร์นี้?')) {
      this.orderService.deductStockForOrder(this.orderId!).subscribe({
        next: (response) => {
          alert('ตัด Stock สำเร็จ!\n' + response.messages.join('\n'));
          this.loadOrder();
        },
        error: (error) => {
          console.error('Error deducting stock:', error);
          alert('เกิดข้อผิดพลาดในการตัด Stock');
        }
      });
    }
  }

  checkStock(): void {
    this.orderService.checkStockAvailability(this.orderId!).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (error) => console.error('Error checking stock:', error)
    });
  }

  updateStatus(newStatus: string): void {
    if (confirm(`ต้องการเปลี่ยนสถานะเป็น ${newStatus}?`)) {
      this.orderService.updateOrderStatus(this.orderId!, newStatus).subscribe({
        next: (updatedOrder) => {
          alert('เปลี่ยนสถานะสำเร็จ');
          this.order = updatedOrder;
          this.loadOrder();
        },
        error: (error) => {
          console.error('Error updating status:', error);
          const errorMessage = error.error?.message || error.message || 'เกิดข้อผิดพลาด';
          alert('ไม่สามารถเปลี่ยนสถานะได้: ' + errorMessage);
        }
      });
    }
  }

  updatePaymentStatus(newStatus: string): void {
    const previousStatus = this.order?.paymentStatus;

    if (confirm(`ต้องการเปลี่ยนสถานะการชำระเงินเป็น ${newStatus}?`)) {
      this.orderService.updatePaymentStatus(this.orderId!, newStatus).subscribe({
        next: (updatedOrder) => {
          this.order = updatedOrder;
          alert('เปลี่ยนสถานะการชำระเงินสำเร็จ');

          // ✅ สร้าง Transaction อัตโนมัติเมื่อเปลี่ยนเป็น PAID
          if (newStatus === 'PAID' && previousStatus !== 'PAID') {
            this.createAutoTransaction();
          }

          this.loadOrder();
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
          const errorMessage = error.error?.message || error.message || 'เกิดข้อผิดพลาด';
          alert('ไม่สามารถเปลี่ยนสถานะได้: ' + errorMessage);
        }
      });
    }
  }

  // ✅ สร้าง Transaction อัตโนมัติเมื่อชำระเงิน
  private createAutoTransaction(): void {
    if (!this.orderId) return;

    this.transactionService.createAutoTransactionForOrder(this.orderId).subscribe({
      next: (transaction) => {
        console.log('Auto transaction created:', transaction);
        // แสดงข้อความแจ้งเตือนแบบไม่รบกวน (optional)
        setTimeout(() => {
          alert(`สร้าง Transaction รายรับอัตโนมัติสำเร็จ\nจำนวนเงิน: ${this.formatCurrency(transaction.amount)}`);
        }, 500);
      },
      error: (error) => {
        console.error('Error creating auto transaction:', error);
        // ไม่แสดง error ให้ user เพราะไม่ควรขัดขวางการทำงานหลัก
      }
    });
  }

  cancelOrder(): void {
    if (confirm('ต้องการยกเลิกออเดอร์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      this.orderService.cancelOrder(this.orderId!).subscribe({
        next: () => {
          alert('ยกเลิกออเดอร์สำเร็จ');
          this.loadOrder();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('เกิดข้อผิดพลาด');
        }
      });
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING': return 'badge badge-warning';
      case 'CONFIRMED': return 'badge badge-info';
      case 'PROCESSING': return 'badge badge-primary';
      case 'PACKED': return 'badge badge-purple';
      case 'SHIPPED': return 'badge badge-blue';
      case 'DELIVERED': return 'badge badge-green';
      case 'CANCELLED': return 'badge badge-red';
      case 'RETURNED': return 'badge badge-orange';
      default: return 'badge badge-gray';
    }
  }

  getPaymentStatusClass(status: string | undefined): string {
    switch (status) {
      case 'PAID': return 'badge badge-green';
      case 'UNPAID': return 'badge badge-red';
      case 'REFUNDED': return 'badge badge-orange';
      default: return 'badge badge-gray';
    }
  }

  getStockDeductionClass(status: string | undefined): string {
    switch (status) {
      case 'PENDING': return 'badge badge-warning';
      case 'COMPLETED': return 'badge badge-green';
      case 'FAILED': return 'badge badge-red';
      case 'CANCELLED': return 'badge badge-gray';
      default: return 'badge badge-gray';
    }
  }

  formatCurrency(amount: number | undefined | null): string {
    const value = amount ?? 0;
    return `฿${value.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
