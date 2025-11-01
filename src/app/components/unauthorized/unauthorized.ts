import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon">
          <i class="bi-shield-lock"></i>
        </div>
        <h1>ไม่มีสิทธิ์เข้าถึง</h1>
        <p class="message">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้<br>
          กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
        </p>
        <div class="actions">
          <button class="btn-primary" (click)="goBack()">
            <i class="bi-arrow-left"></i>
            กลับหน้าที่แล้ว
          </button>
          <button class="btn-secondary" (click)="goToDashboard()">
            <i class="bi-house"></i>
            ไปหน้าหลัก
          </button>
          <button class="btn-logout" (click)="logout()">
            <i class="bi-box-arrow-right"></i>
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .unauthorized-content {
      background: white;
      border-radius: 24px;
      padding: 4rem 3rem;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #fecaca 0%, #fee2e2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      color: #dc2626;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
    }

    .message {
      font-size: 1.125rem;
      color: #6b7280;
      margin: 0 0 2.5rem 0;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    button {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-logout {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-logout:hover {
      background: #fecaca;
    }

    @media (max-width: 640px) {
      .unauthorized-content {
        padding: 3rem 2rem;
      }

      h1 {
        font-size: 2rem;
      }

      .message {
        font-size: 1rem;
      }

      .icon {
        width: 100px;
        height: 100px;
        font-size: 3rem;
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  goBack(): void {
    window.history.back();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}
