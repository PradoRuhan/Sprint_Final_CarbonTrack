import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  BiomeDistribution,
  CarbonVolumePoint,
  EsgIndicator,
  ExecutiveStats,
  ValidationQueueItem,
} from '../models/admin.model';

const MOCK_STATS: ExecutiveStats = {
  totalProducers: 12487,
  producersGrowthPercent: 8.2,
  totalCooperatives: 482,
  cooperativesGrowthPercent: 3.1,
  activeProjects: 128,
  activeProjectsGrowth: 12,
  estimatedCarbonVolume: '2.4M',
  carbonVolumeGrowthPercent: -1.4,
};

const MOCK_VOLUME_12M: CarbonVolumePoint[] = [
  { month: 'Ago', value: 40 },
  { month: 'Set', value: 55 },
  { month: 'Out', value: 48 },
  { month: 'Nov', value: 62 },
  { month: 'Dez', value: 58 },
  { month: 'Jan', value: 68 },
  { month: 'Fev', value: 72 },
  { month: 'Mar', value: 70 },
  { month: 'Abr', value: 78 },
  { month: 'Mai', value: 85 },
  { month: 'Jun', value: 90 },
  { month: 'Jul', value: 100 },
];

const MOCK_BIOMES: BiomeDistribution[] = [
  { name: 'Amazônia', percent: 42, colorClass: 'bar-green' },
  { name: 'Cerrado', percent: 28, colorClass: 'bar-orange' },
  { name: 'Mata Atlântica', percent: 18, colorClass: 'bar-teal' },
  { name: 'Caatinga', percent: 8, colorClass: 'bar-orange' },
  { name: 'Pampa', percent: 3, colorClass: 'bar-blue' },
  { name: 'Pantanal', percent: 1, colorClass: 'bar-green' },
];

const MOCK_QUEUE: ValidationQueueItem[] = [
  { id: 'v1', projectName: 'Vale Verde · Etapa 4', cooperativeName: 'Coop Vale Verde', areaHectares: 18420, status: 'em-analise' },
  { id: 'v2', projectName: 'Rio Doce · Etapa 5', cooperativeName: 'Coop Rio Doce', areaHectares: 9860, status: 'monitoramento' },
  { id: 'v3', projectName: 'Cerrado Sustentável', cooperativeName: 'AgroCerrado', areaHectares: 24100, status: 'pendente-docs' },
  { id: 'v4', projectName: 'Mata Viva', cooperativeName: 'Coop Terra Boa', areaHectares: 6240, status: 'certificado' },
];

const MOCK_ESG: EsgIndicator[] = [
  { label: 'Environmental', score: 87, colorClass: 'bar-green' },
  { label: 'Social', score: 74, colorClass: 'bar-orange' },
  { label: 'Governance', score: 92, colorClass: 'bar-blue' },
];

@Injectable({ providedIn: 'root' })
export class AdminService {
  getExecutiveStats(): Observable<ExecutiveStats> {
    return of(MOCK_STATS).pipe(delay(300));
  }

  getCarbonVolume(period: '12m' | '6m' | '3m'): Observable<CarbonVolumePoint[]> {
    const sliceMap = { '12m': 12, '6m': 6, '3m': 3 };
    return of(MOCK_VOLUME_12M.slice(-sliceMap[period])).pipe(delay(200));
  }

  getBiomeDistribution(): Observable<BiomeDistribution[]> {
    return of(MOCK_BIOMES).pipe(delay(200));
  }

  getValidationQueue(): Observable<ValidationQueueItem[]> {
    return of(MOCK_QUEUE).pipe(delay(200));
  }

  getEsgIndicators(): Observable<EsgIndicator[]> {
    return of(MOCK_ESG).pipe(delay(200));
  }

  getConsolidatedScore(): number {
    return 84;
  }
}