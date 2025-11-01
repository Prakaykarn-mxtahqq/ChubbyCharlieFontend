import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // ตรวจสอบว่า login แล้วหรือยัง
    if (this.authService.isLoggedIn()) {

      // ตรวจสอบ role ถ้ามีกำหนดไว้ใน route
      const requiredRoles = route.data['roles'] as string[];

      if (requiredRoles && requiredRoles.length > 0) {
        const currentUser = this.authService.getCurrentUser();
        const userRole = currentUser?.role?.toUpperCase();

        if (userRole && requiredRoles.includes(userRole)) {
          return true;
        } else {
          // ไม่มีสิทธิ์เข้าถึง
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }

      // ไม่มีข้อกำหนด role - อนุญาตเข้าได้
      return true;
    }

    // ยังไม่ได้ login - redirect ไป login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
