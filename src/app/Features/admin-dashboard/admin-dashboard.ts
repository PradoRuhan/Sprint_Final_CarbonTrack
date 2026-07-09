import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import {
  BiomeDistribution,
  CarbonVolumePoint,
  EsgIndicator,
  ExecutiveStats,
  ValidationQueueItem,
  ValidationStatus,
} from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  activeMenu = 'executive';

  stats = signal<ExecutiveStats | null>(null);
  volumePoints = signal<CarbonVolumePoint[]>([]);
  biomes = signal<BiomeDistribution[]>([]);
  validationQueue = signal<ValidationQueueItem[]>([]);
  esgIndicators = signal<EsgIndicator[]>([]);
  consolidatedScore = 0;

  selectedPeriod: '12m' | '6m' | '3m' = '12m';

  ngOnInit(): void {
    this.adminService.getExecutiveStats().subscribe((s) => this.stats.set(s));
    this.adminService.getBiomeDistribution().subscribe((b) => this.biomes.set(b));
    this.adminService.getValidationQueue().subscribe((q) => this.validationQueue.set(q));
    this.adminService.getEsgIndicators().subscribe((e) => this.esgIndicators.set(e));
    this.consolidatedScore = this.adminService.getConsolidatedScore();
    this.loadVolume('12m');
  }

  loadVolume(period: '12m' | '6m' | '3m'): void {
    this.selectedPeriod = period;
    this.adminService.getCarbonVolume(period).subscribe((points) => this.volumePoints.set(points));
  }

  setMenu(menu: string): void {
    this.activeMenu = menu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Gera os pontos do SVG a partir dos valores (normalizado numa viewBox 0-100 x 0-100)
  getChartPoints(): string {
    const points = this.volumePoints();
    if (!points.length) return '';

    const max = Math.max(...points.map((p) => p.value));
    const min = Math.min(...points.map((p) => p.value));
    const range = max - min || 1;
    const stepX = 100 / (points.length - 1 || 1);

    return points
      .map((p, i) => {
        const x = i * stepX;
        const y = 100 - ((p.value - min) / range) * 90 - 5; // 5-95% de margem vertical
        return `${x},${y}`;
      })
      .join(' ');
  }

  getChartAreaPath(): string {
    const line = this.getChartPoints();
    if (!line) return '';
    return `M0,100 L${line} L100,100 Z`;
  }

  statusLabel(status: ValidationStatus): string {
    const map: Record<ValidationStatus, string> = {
      'em-analise': 'Em análise',
      'monitoramento': 'Monitoramento',
      'pendente-docs': 'Pendente docs',
      'certificado': 'Certificado',
    };
    return map[status];
  }

  statusClass(status: ValidationStatus): string {
    const map: Record<ValidationStatus, string> = {
      'em-analise': 'badge-warning',
      'monitoramento': 'badge-success',
      'pendente-docs': 'badge-danger',
      'certificado': 'badge-success',
    };
    return map[status];
  }
}