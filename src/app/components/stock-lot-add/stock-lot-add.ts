// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { StockLotService, StockLot } from '../../services/stock-lot.service';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { CommonModule } from '@angular/common';
// //
// // @Component({
// //   selector: 'app-stock-lot-add',
// //   standalone: true,
// //   imports: [ReactiveFormsModule, CommonModule],
// //   templateUrl: './stock-lot-add.html',
// //   styleUrls: ['./stock-lot-add.css']
// // })
// // export class StockLotAddComponent implements OnInit {
// //   stockLotForm: FormGroup;
// //   isEditMode: boolean = false;
// //   stockLotId: number | null = null;
// //
// //   constructor(
// //     private fb: FormBuilder,
// //     private stockLotService: StockLotService,
// //     private router: Router,
// //     private route: ActivatedRoute
// //   ) {
// //     this.stockLotForm = this.fb.group({
// //       lotName: ['', [Validators.required, Validators.minLength(2)]],
// //       importDate: [''],
// //       arrivalDate: [''],
// //       // ลบ totalShippingBath ออกแล้ว
// //       status: ['PENDING', Validators.required]
// //     });
// //   }
// //
// //   ngOnInit(): void {
// //     this.stockLotId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
// //     this.isEditMode = !!this.stockLotId;
// //
// //     if (this.isEditMode) {
// //       this.loadStockLot();
// //     }
// //   }
// //
// //   loadStockLot(): void {
// //     if (this.stockLotId) {
// //       this.stockLotService.getStockLotById(this.stockLotId).subscribe({
// //         next: (stockLot) => {
// //           this.stockLotForm.patchValue({
// //             lotName: stockLot.lotName,
// //             importDate: stockLot.importDate ? this.formatDateForInput(stockLot.importDate) : '',
// //             arrivalDate: stockLot.arrivalDate ? this.formatDateForInput(stockLot.arrivalDate) : '',
// //             // ลบ totalShippingBath mapping ออกแล้ว
// //             status: stockLot.status || 'PENDING'
// //           });
// //         },
// //         error: (error) => console.error('Error loading stock lot:', error)
// //       });
// //     }
// //   }
// //
// //   onSubmit(): void {
// //     if (this.stockLotForm.valid) {
// //       const stockLot: StockLot = {
// //         ...this.stockLotForm.value,
// //         importDate: this.stockLotForm.value.importDate || undefined,
// //         arrivalDate: this.stockLotForm.value.arrivalDate || undefined
// //       };
// //
// //       if (this.isEditMode && this.stockLotId) {
// //         this.stockLotService.updateStockLot(this.stockLotId, stockLot).subscribe({
// //           next: () => {
// //             alert('Stock lot updated successfully!');
// //             this.router.navigate(['/stock-lots']);
// //           },
// //           error: (error) => {
// //             console.error('Error updating stock lot:', error);
// //             alert('Error updating stock lot. Please try again.');
// //           }
// //         });
// //       } else {
// //         this.stockLotService.createStockLot(stockLot).subscribe({
// //           next: () => {
// //             alert('Stock lot added successfully!');
// //             this.resetForm();
// //             this.router.navigate(['/stock-lots']);
// //           },
// //           error: (error) => {
// //             console.error('Error adding stock lot:', error);
// //             alert('Error adding stock lot. Please try again.');
// //           }
// //         });
// //       }
// //     } else {
// //       this.markFormGroupTouched();
// //     }
// //   }
// //
// //   private markFormGroupTouched(): void {
// //     Object.keys(this.stockLotForm.controls).forEach(key => {
// //       const control = this.stockLotForm.get(key);
// //       control?.markAsTouched();
// //     });
// //   }
// //
// //   private resetForm(): void {
// //     this.stockLotForm.reset();
// //     this.stockLotForm.patchValue({ status: 'PENDING' });
// //   }
// //
// //   private formatDateForInput(dateString: string): string {
// //     const date = new Date(dateString);
// //     return date.toISOString().slice(0, 16);
// //   }
// //
// //   goBack(): void {
// //     this.router.navigate(['/stock-lots']);
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { StockLotService, StockLot } from '../../services/stock-lot.service';
// import { TransactionService } from '../../services/transaction.service'; // ⭐ เพิ่ม import
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
//
// @Component({
//   selector: 'app-stock-lot-add',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './stock-lot-add.html',
//   styleUrls: ['./stock-lot-add.css']
// })
// export class StockLotAddComponent implements OnInit {
//   stockLotForm: FormGroup;
//   isEditMode: boolean = false;
//   stockLotId: number | null = null;
//
//   constructor(
//     private fb: FormBuilder,
//     private stockLotService: StockLotService,
//     private transactionService: TransactionService, // ⭐ เพิ่ม TransactionService
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.stockLotForm = this.fb.group({
//       lotName: ['', [Validators.required, Validators.minLength(2)]],
//       importDate: [''],
//       arrivalDate: [''],
//       status: ['PENDING', Validators.required]
//     });
//   }
//
//   ngOnInit(): void {
//     this.stockLotId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
//     this.isEditMode = !!this.stockLotId;
//
//     if (this.isEditMode) {
//       this.loadStockLot();
//     }
//   }
//
//   loadStockLot(): void {
//     if (this.stockLotId) {
//       this.stockLotService.getStockLotById(this.stockLotId).subscribe({
//         next: (stockLot) => {
//           this.stockLotForm.patchValue({
//             lotName: stockLot.lotName,
//             importDate: stockLot.importDate ? this.formatDateForInput(stockLot.importDate) : '',
//             arrivalDate: stockLot.arrivalDate ? this.formatDateForInput(stockLot.arrivalDate) : '',
//             status: stockLot.status || 'PENDING'
//           });
//         },
//         error: (error) => console.error('Error loading stock lot:', error)
//       });
//     }
//   }
//
//   onSubmit(): void {
//     if (this.stockLotForm.valid) {
//       const stockLot: StockLot = {
//         ...this.stockLotForm.value,
//         importDate: this.stockLotForm.value.importDate || undefined,
//         arrivalDate: this.stockLotForm.value.arrivalDate || undefined
//       };
//
//       if (this.isEditMode && this.stockLotId) {
//         // ⭐ กรณีแก้ไข - ไม่สร้าง Transaction ใหม่
//         this.stockLotService.updateStockLot(this.stockLotId, stockLot).subscribe({
//           next: () => {
//             alert('Stock lot updated successfully!');
//             this.router.navigate(['/stock-lots']);
//           },
//           error: (error) => {
//             console.error('Error updating stock lot:', error);
//             alert('Error updating stock lot. Please try again.');
//           }
//         });
//       } else {
//         // ⭐ กรณีสร้างใหม่ - สร้าง Transaction อัตโนมัติ
//         this.stockLotService.createStockLot(stockLot).subscribe({
//           next: (createdStockLot) => {
//             const successMessage = 'Stock lot added successfully!';
//
//             // สร้าง Auto Transaction
//             if (createdStockLot.stockLotId) {
//               this.createAutoTransaction(createdStockLot.stockLotId, successMessage);
//             } else {
//               alert(successMessage);
//               this.resetForm();
//               this.router.navigate(['/stock-lots']);
//             }
//           },
//           error: (error) => {
//             console.error('Error adding stock lot:', error);
//             alert('Error adding stock lot. Please try again.');
//           }
//         });
//       }
//     } else {
//       this.markFormGroupTouched();
//     }
//   }
//
//   // ⭐ เพิ่ม method สำหรับสร้าง Auto Transaction
//   private createAutoTransaction(stockLotId: number, stockLotMessage: string): void {
//     console.log('Creating auto transaction for stock lot:', stockLotId);
//
//     this.transactionService.createAutoTransactionForStockLot(stockLotId).subscribe({
//       next: (transaction) => {
//         console.log('✅ Auto transaction created:', transaction);
//         alert(
//           `${stockLotMessage}\n\n` +
//           `📊 สร้าง Transaction อัตโนมัติ:\n` +
//           `- ประเภท: ${transaction.type === 'INCOME' ? 'รายรับ' : 'รายจ่าย'}\n` +
//           `- จำนวนเงิน: ${this.formatCurrency(transaction.amount)}\n` +
//           `- หมวดหมู่: ${this.transactionService.getCategoryLabel(transaction.category)}\n` +
//           `- รายละเอียด: ${transaction.description || 'N/A'}`
//         );
//         this.resetForm();
//         this.router.navigate(['/stock-lots']);
//       },
//       error: (error) => {
//         console.error('❌ Error creating auto transaction:', error);
//         // ไม่ให้ error ขัดขวางการทำงาน - แจ้งเตือนเท่านั้น
//         alert(
//           `${stockLotMessage}\n\n` +
//           `⚠️ สร้าง Stock Lot สำเร็จแต่ไม่สามารถสร้าง Transaction อัตโนมัติได้\n` +
//           `คุณสามารถเพิ่ม Transaction ด้วยตนเองภายหลังได้`
//         );
//         this.resetForm();
//         this.router.navigate(['/stock-lots']);
//       }
//     });
//   }
//
//   private markFormGroupTouched(): void {
//     Object.keys(this.stockLotForm.controls).forEach(key => {
//       const control = this.stockLotForm.get(key);
//       control?.markAsTouched();
//     });
//   }
//
//   private resetForm(): void {
//     this.stockLotForm.reset();
//     this.stockLotForm.patchValue({ status: 'PENDING' });
//   }
//
//   private formatDateForInput(dateString: string): string {
//     const date = new Date(dateString);
//     return date.toISOString().slice(0, 16);
//   }
//
//   private formatCurrency(amount: number | undefined): string {
//     if (!amount) return '฿0.00';
//     return `฿${amount.toLocaleString('th-TH', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     })}`;
//   }
//
//   goBack(): void {
//     this.router.navigate(['/stock-lots']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockLotService, StockLot } from '../../services/stock-lot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-lot-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './stock-lot-add.html',
  styleUrls: ['./stock-lot-add.css']
})
export class StockLotAddComponent implements OnInit {
  stockLotForm: FormGroup;
  isEditMode: boolean = false;
  stockLotId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private stockLotService: StockLotService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.stockLotForm = this.fb.group({
      lotName: ['', [Validators.required, Validators.minLength(2)]],
      importDate: [''],
      arrivalDate: [''],
      status: ['PENDING', Validators.required]
    });
  }

  ngOnInit(): void {
    this.stockLotId = this.route.snapshot.paramMap.get('id') ? Number(this.route.snapshot.paramMap.get('id')) : null;
    this.isEditMode = !!this.stockLotId;

    if (this.isEditMode) {
      this.loadStockLot();
    }
  }

  loadStockLot(): void {
    if (this.stockLotId) {
      this.stockLotService.getStockLotById(this.stockLotId).subscribe({
        next: (stockLot) => {
          this.stockLotForm.patchValue({
            lotName: stockLot.lotName,
            importDate: stockLot.importDate ? this.formatDateForInput(stockLot.importDate) : '',
            arrivalDate: stockLot.arrivalDate ? this.formatDateForInput(stockLot.arrivalDate) : '',
            status: stockLot.status || 'PENDING'
          });
        },
        error: (error) => console.error('Error loading stock lot:', error)
      });
    }
  }

  onSubmit(): void {
    if (this.stockLotForm.valid) {
      const stockLot: StockLot = {
        ...this.stockLotForm.value,
        importDate: this.stockLotForm.value.importDate || undefined,
        arrivalDate: this.stockLotForm.value.arrivalDate || undefined
      };

      if (this.isEditMode && this.stockLotId) {
        // ✅ กรณีแก้ไข
        this.stockLotService.updateStockLot(this.stockLotId, stockLot).subscribe({
          next: () => {
            alert('✅ Stock lot updated successfully!');
            this.router.navigate(['/stock-lots']);
          },
          error: (error) => {
            console.error('Error updating stock lot:', error);
            const errorMessage = error.error?.message || 'เกิดข้อผิดพลาด';
            alert('❌ Error: ' + errorMessage);
          }
        });
      } else {
        // ✅ กรณีสร้างใหม่ - แค่สร้าง Stock Lot ไม่สร้าง Transaction
        this.stockLotService.createStockLot(stockLot).subscribe({
          next: (createdStockLot) => {
            alert(
              '✅ Stock Lot สร้างสำเร็จ!\n\n' +
              'คุณสามารถเพิ่มสินค้าเข้า Stock Lot ได้แล้ว\n' +
              'เมื่อเพิ่มสินค้าเสร็จ ให้คลิก "Complete & Create Transaction"'
            );
            this.resetForm();

            // ไปที่หน้า detail เพื่อเพิ่มสินค้า
            this.router.navigate(['/stock-lots', createdStockLot.stockLotId]);
          },
          error: (error) => {
            console.error('Error adding stock lot:', error);
            const errorMessage = error.error?.message || 'เกิดข้อผิดพลาด';
            alert('❌ Error: ' + errorMessage);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.stockLotForm.controls).forEach(key => {
      const control = this.stockLotForm.get(key);
      control?.markAsTouched();
    });
  }

  private resetForm(): void {
    this.stockLotForm.reset();
    this.stockLotForm.patchValue({ status: 'PENDING' });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  goBack(): void {
    this.router.navigate(['/stock-lots']);
  }
}
