import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);
  isHomeActive = signal(true);

  private router = inject(Router);

  constructor(
    public authService: AuthService,
    private elementRef: ElementRef<HTMLElement>
  ) {
    this.isHomeActive.set(this.router.url === '/');
    this.router.events.subscribe(() => {
      this.isHomeActive.set(this.router.url === '/');
    });
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.userMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen.update((v) => !v);
  }

  goHome(event: Event): void {
    event.preventDefault();
    this.closeMobileMenu();
    if (this.router.url === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
}