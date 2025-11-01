// /*import { Component, OnInit, HostListener } from '@angular/core';
// import { Router } from '@angular/router';
// import {Sidebar} from './components/sidebar/sidebar';
// import {Header} from './components/header/header';
// import {Footer} from './components/footer/footer';
// import {RouterOutlet} from '@angular/router';
// import {CommonModule} from '@angular/common';
//
// @Component({
//   selector: 'app-root',
//   imports: [CommonModule, RouterOutlet, Sidebar, Header, Footer],
//   templateUrl: './app.html',
//   styleUrls: ['./app.css']
// })
// export class App implements OnInit {
//   title = 'staff-management-system';
//   sidebarCollapsed = false;
//
//   constructor(private router: Router) {}
//
//   ngOnInit(): void {
//     // Check initial screen size
//     this.checkScreenSize();
//   }
//
//   @HostListener('window:resize', ['$event'])
//   onResize(event: any): void {
//     this.checkScreenSize();
//   }
//
//   private checkScreenSize(): void {
//     // Auto-collapse sidebar on mobile
//     if (window.innerWidth <= 768) {
//       this.sidebarCollapsed = true;
//     }
//   }
//
//   toggleSidebar(): void {
//     this.sidebarCollapsed = !this.sidebarCollapsed;
//   }
//
//   closeSidebar(): void {
//     if (window.innerWidth <= 768) {
//       this.sidebarCollapsed = true;
//     }
//   }
// }*/
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
// import {Sidebar} from './components/sidebar/sidebar';
// import {Header} from './components/header/header';
//
//
// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, Sidebar, Header],
//   templateUrl: './app.html',
//   styleUrls: ['./app.css']
// })
// export class App {
//   isSidebarCollapsed: boolean = false;
//
//   constructor() {
//     window.addEventListener('sidebarToggle', (event: any) => {
//       this.isSidebarCollapsed = event.detail.collapsed;
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
// import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  template: `
    <div class="app-container"
         [class.sidebar-collapsed]="isSidebarCollapsed"
         [class.full-screen]="!showLayout">

      <!-- ⭐ แสดง Sidebar และ Header เฉพาะเมื่อ login แล้ว -->
      <ng-container *ngIf="showLayout">
        <!-- Sidebar -->
        <app-sidebar class="sidebar"></app-sidebar>

        <!-- Main Content -->
        <div class="main-content">
          <!-- Content Area -->
          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </div>
      </ng-container>

      <!-- ⭐ แสดง Content เต็มหน้าจอเมื่อไม่ได้ login -->
      <ng-container *ngIf="!showLayout">
        <router-outlet></router-outlet>
      </ng-container>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'Stock Management System';
  isSidebarCollapsed = false;
  showLayout = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ⭐ ตรวจสอบสถานะ login
    this.checkLoginStatus();

    // ⭐ ฟังการเปลี่ยน route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });

    // ⭐ ฟัง event จาก sidebar
    window.addEventListener('sidebarToggle', (event: any) => {
      this.isSidebarCollapsed = event.detail.collapsed;
    });

    // ⭐ ฟัง login status จาก AuthService
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.showLayout = isLoggedIn && !this.isPublicRoute();
    });
  }

  /**
   * ⭐ ตรวจสอบว่าต้องแสดง Layout (Sidebar + Header) หรือไม่
   */
  private checkLoginStatus(): void {
    const isLoggedIn = this.authService.isLoggedIn();
    const currentRoute = this.router.url;

    // ไม่แสดง layout สำหรับ public routes
    this.showLayout = isLoggedIn && !this.isPublicRoute();
  }

  /**
   * ⭐ ตรวจสอบว่าเป็น Public Route หรือไม่
   */
  private isPublicRoute(): boolean {
    const currentRoute = this.router.url;
    const publicRoutes = ['/login', '/unauthorized'];

    return publicRoutes.some(route => currentRoute.startsWith(route));
  }
}
