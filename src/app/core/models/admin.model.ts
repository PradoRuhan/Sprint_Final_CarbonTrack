export interface ExecutiveStats {
  totalProducers: number;
  producersGrowthPercent: number;
  totalCooperatives: number;
  cooperativesGrowthPercent: number;
  activeProjects: number;
  activeProjectsGrowth: number;
  estimatedCarbonVolume: string;
  carbonVolumeGrowthPercent: number;
}

export interface CarbonVolumePoint {
  month: string;
  value: number;
}

export interface BiomeDistribution {
  name: string;
  percent: number;
  colorClass: string;
}

export type ValidationStatus = 'em-analise' | 'monitoramento' | 'pendente-docs' | 'certificado';

export interface ValidationQueueItem {
  id: string;
  projectName: string;
  cooperativeName: string;
  areaHectares: number;
  status: ValidationStatus;
}

export interface EsgIndicator {
  label: 'Environmental' | 'Social' | 'Governance';
  score: number;
  colorClass: string;
}