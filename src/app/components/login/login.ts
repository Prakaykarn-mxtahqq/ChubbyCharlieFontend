import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // ถ้า login แล้วให้ redirect ไปหน้าหลัก
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    // Validation
    if (!this.username.trim()) {
      this.errorMessage = 'กรุณากรอกชื่อผู้ใช้';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'กรุณากรอกรหัสผ่าน';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      username: this.username.trim(),
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        if (response.success) {
          // Login สำเร็จ
          console.log('Login successful:', response);

          // แสดงข้อความสำเร็จ
          alert(`ยินดีต้อนรับ ${response.employee.empName}`);

          // Redirect ไปหน้าหลัก
          this.router.navigate(['/dashboard']);
        } else {
          // Login ไม่สำเร็จ
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Login error:', error);

        if (error.status === 401) {
          this.errorMessage = error.error?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        } else {
          this.errorMessage = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง';
        }

        this.loading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
