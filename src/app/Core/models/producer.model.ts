export interface Producer {
  id: string;
  name: string;
  propertyName: string;
  biome: 'Amazônia' | 'Cerrado' | 'Mata Atlântica' | 'Caatinga' | 'Pampa' | 'Pantanal';
  eligibleAreaHectares: number;
  certificationStage: CertificationStage;
  estimatedCarbonPotential: number; // toneladas CO2 (educativo, não vinculante)
  propertyImageUrl: string;
  documents: ProducerDocument[];
}

export type CertificationStage =
  | 'Elegibilidade'
  | 'Cadastro'
  | 'Projeto Coletivo'
  | 'Validação Técnica'
  | 'Monitoramento'
  | 'Certificado';

export interface ProducerDocument {
  id: string;
  name: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
  uploadedAt?: string;
}