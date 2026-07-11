import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import { ProducerService } from '../../core/services/producer.service';
import { Producer } from '../../core/models/producer.model';
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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private producerService = inject(ProducerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  currentUser = this.authService.currentUser;
  activeMenu = 'executive';
  sidebarOpen = signal(false);

  stats = signal<ExecutiveStats | null>(null);
  volumePoints = signal<CarbonVolumePoint[]>([]);
  biomes = signal<BiomeDistribution[]>([]);
  validationQueue = signal<ValidationQueueItem[]>([]);
  esgIndicators = signal<EsgIndicator[]>([]);
  consolidatedScore = 0;

  selectedPeriod: '12m' | '6m' | '3m' = '12m';

  // --- Tela de Produtores ---
  searchTerm = ''; // usado com [(ngModel)] no input de busca
  producersLoading = signal(true);
  filteredProducers = signal<Producer[]>([]);

  ngOnInit(): void {
    this.adminService.getExecutiveStats().subscribe((s) => this.stats.set(s));
    this.adminService.getBiomeDistribution().subscribe((b) => this.biomes.set(b));
    this.adminService.getValidationQueue().subscribe((q) => this.validationQueue.set(q));
    this.adminService.getEsgIndicators().subscribe((e) => this.esgIndicators.set(e));
    this.consolidatedScore = this.adminService.getConsolidatedScore();
    this.loadVolume('12m');

    this.producerService
      .getFilteredProducers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((producers) => {
        this.filteredProducers.set(producers);
        this.producersLoading.set(false);
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  onSearchChange(term: string): void {
    this.producerService.setSearchTerm(term);
  }

  loadVolume(period: '12m' | '6m' | '3m'): void {
    this.selectedPeriod = period;
    this.adminService.getCarbonVolume(period).subscribe((points) => this.volumePoints.set(points));
  }

  setMenu(menu: string): void {
    this.activeMenu = menu;
    this.sidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

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
        const y = 100 - ((p.value - min) / range) * 90 - 5;
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
      monitoramento: 'Monitoramento',
      'pendente-docs': 'Pendente docs',
      certificado: 'Certificado',
    };
    return map[status];
  }

  statusClass(status: ValidationStatus): string {
    const map: Record<ValidationStatus, string> = {
      'em-analise': 'badge-warning',
      monitoramento: 'badge-success',
      'pendente-docs': 'badge-danger',
      certificado: 'badge-success',
    };
    return map[status];
  }

  certificationBadgeClass(stage: string): string {
    if (stage === 'Certificado') return 'badge-success';
    if (stage === 'Cadastro' || stage === 'Elegibilidade') return 'badge-warning';
    return 'badge-info';
  }
}