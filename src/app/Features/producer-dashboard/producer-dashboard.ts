import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProducerService } from '../../core/services/producer.service';
import { Producer } from '../../core/models/producer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-producer-dashboard',
  imports: [CommonModule],
  templateUrl: './producer-dashboard.html',
  styleUrl: './producer-dashboard.css',
})
export class ProducerDashboard {
  private authService = inject(AuthService);
  private producerService = inject(ProducerService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  producer$: Observable<Producer> = this.producerService.getCurrentProducer();

  activeMenu = 'overview';

  setMenu(menu: string): void {
    this.activeMenu = menu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'aprovado': return 'badge-success';
      case 'pendente': return 'badge-warning';
      case 'enviado': return 'badge-info';
      default: return 'badge-danger';
    }
  }
}