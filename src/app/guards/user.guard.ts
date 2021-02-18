import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,  CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if (!user) {
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
