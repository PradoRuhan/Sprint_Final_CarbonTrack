export interface Producer {
  id: string;
  name: string;
  propertyName: string;
  location: string;
  cooperativeName: string;
  biome: 'Amazônia' | 'Cerrado' | 'Mata Atlântica' | 'Caatinga' | 'Pampa' | 'Pantanal';
  totalAreaHectares: number;
  eligibleAreaHectares: number;
  certificationStage: CertificationStage;
  certificationProgressPercent: number;
  estimatedMonthsToComplete: number;
  estimatedCarbonPotential: number; // toneladas CO2e (educativo, não vinculante)
  propertyImageUrl: string;
  documents: ProducerDocument[];
  satellite: SatelliteData;
  timeline: TimelineStep[];
  activities: ActivityItem[];
}

export type CertificationStage =
  | 'Elegibilidade'
  | 'Cadastro'
  | 'Projeto Coletivo'
  | 'Validação'
  | 'Monitoramento'
  | 'Certificado';

export interface ProducerDocument {
  id: string;
  name: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
  uploadedAt?: string;
}

export interface SatelliteData {
  ndviAverage: number;
  vegetationCoverPercent: number;
  activeAlerts: number;
}

export interface TimelineStep {
  order: number;
  title: string;
  date?: string;
  status: 'completed' | 'current' | 'pending';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
}