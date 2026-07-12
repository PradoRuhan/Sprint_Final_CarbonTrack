import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private router = inject(Router);
  currentYear = new Date().getFullYear();

  goHome(event: Event): void {
    event.preventDefault();
    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }
}