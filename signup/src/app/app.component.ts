import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="authenticated; else loginButton">
      <button (click)="logout()">Logout</button>
      <p>User is logged in</p>
    </div>
    <ng-template #loginButton>
      <button (click)="login()">Login</button>
      <p>User is not logged in</p>
    </ng-template>
  `,
})
export class AppComponent {
  authenticated: boolean;

  constructor(private authService: MsalService) {
    this.authenticated = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    this.authService.loginPopup().subscribe(() => {
      this.authenticated = true;
    });
  }

  logout() {
    this.authService.logout();
    this.authenticated = false;
  }
}
