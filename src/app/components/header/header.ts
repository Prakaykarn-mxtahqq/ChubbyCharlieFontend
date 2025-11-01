import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, EmployeeDTO } from '../../services/auth.service';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // ⭐ User Data จาก AuthService
  currentUser: EmployeeDTO | null = null;

  // Date and Time
  currentDate: string = '';

  // Sidebar state
  sidebarCollapsed: boolean = false;

  // Dropdown states
  showProfileMenu: boolean = false;
  showNotifications: boolean = false;

  // Notifications (ตัวอย่าง - จริงๆ ควรดึงจาก API)
  notifications: Notification[] = [
    {
      id: '1',
      type: 'info',
      title: 'New Staff Member',
      message: 'John Doe has been added to the staff directory',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Stock Alert',
      message: 'Some products are running low on inventory',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Order Complete',
      message: 'Order #ORD-2025-001 has been completed',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateCurrentDate();
    this.setupDateUpdater();
    this.listenToSidebarEvents();
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ⭐ โหลดข้อมูลผู้ใช้จาก AuthService
   */
  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  /**
   * อัพเดทวันที่ปัจจุบัน
   */
  private updateCurrentDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate = now.toLocaleDateString('en-US', options);
  }

  /**
   * ตั้งค่าการอัพเดทวันที่อัตโนมัติ
   */
  private setupDateUpdater(): void {
    setInterval(() => {
      this.updateCurrentDate();
    }, 60000);
  }

  /**
   * ฟังเหตุการณ์จาก sidebar
   */
  private listenToSidebarEvents(): void {
    window.addEventListener('sidebarToggle', (event: any) => {
      this.sidebarCollapsed = event.detail.collapsed;
    });
  }

  // ====================== DROPDOWN METHODS ======================

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    if (this.showProfileMenu) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showProfileMenu = false;
    }
  }

  closeAllDropdowns(): void {
    this.showProfileMenu = false;
    this.showNotifications = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const isDropdownClick = target.closest('.profile-wrapper') ||
      target.closest('.notification-wrapper');

    if (!isDropdownClick) {
      this.closeAllDropdowns();
    }
  }

  // ====================== NOTIFICATION METHODS ======================

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }

  get notificationCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAllAsRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }

  viewAllNotifications(): void {
    this.closeAllDropdowns();
    this.router.navigate(['/notifications']);
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'info': 'bi-info-circle',
      'warning': 'bi-exclamation-triangle',
      'success': 'bi-check-circle',
      'error': 'bi-x-circle'
    };
    return icons[type] || 'bi-bell';
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  // ====================== NAVIGATION METHODS ======================

  navigateToProfile(): void {
    this.closeAllDropdowns();
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    this.closeAllDropdowns();
    this.router.navigate(['/settings']);
  }

  navigateToHelp(): void {
    this.closeAllDropdowns();
    this.router.navigate(['/help']);
  }

  /**
   * ⭐ Logout ผ่าน AuthService
   */
  logout(): void {
    this.closeAllDropdowns();

    if (confirm('คุณแน่ใจว่าต้องการออกจากระบบ?')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('Logged out successfully');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          // ถ้า error ก็ให้ไป login อยู่ดี
          this.router.navigate(['/login']);
        }
      });
    }
  }

  // ====================== UTILITY METHODS ======================

  refreshNotifications(): void {
    console.log('Refreshing notifications...');
    // TODO: โหลด notifications จาก API
  }

  addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date()
    };

    this.notifications.unshift(newNotification);

    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  markNotificationAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'info': '#3b82f6',
      'warning': '#f59e0b',
      'success': '#10b981',
      'error': '#ef4444'
    };
    return colors[type] || '#6b7280';
  }

  // ====================== DEVICE DETECTION ======================

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  get isTablet(): boolean {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  get isDesktop(): boolean {
    return window.innerWidth > 1024;
  }

  // ====================== KEYBOARD SHORTCUTS ======================

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
    }

    if (event.altKey && event.key === 'n') {
      event.preventDefault();
      this.toggleNotifications();
    }

    if (event.altKey && event.key === 'p') {
      event.preventDefault();
      this.toggleProfileMenu();
    }
  }

  // ====================== HELPER GETTERS ======================

  get userName(): string {
    return this.currentUser?.empName || 'User';
  }

  get userRole(): string {
    return this.currentUser?.role || 'Employee';
  }

  get userEmail(): string {
    return this.currentUser?.email || '';
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }
}
