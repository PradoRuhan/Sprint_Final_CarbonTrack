import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Producer } from '../models/producer.model';

const MOCK_PRODUCERS: Producer[] = [
  {
    id: 'p1',
    name: 'Ruhan Prado',
    propertyName: 'Fazenda Boa Esperança',
    location: 'Muritiba, Ba · Recôncavo Baiano, BA',
    cooperativeName: 'Cooperativa Vale Verde',
    biome: 'Mata Atlântica',
    totalAreaHectares: 142,
    eligibleAreaHectares: 108,
    certificationStage: 'Validação',
    certificationProgressPercent: 62,
    estimatedMonthsToComplete: 4,
    estimatedCarbonPotential: 1240,
    propertyImageUrl: 'image/Casa_fazenda.jpg',
    documents: [
      { id: 'd1', name: 'CAR — Cadastro Ambiental Rural', status: 'aprovado' },
      { id: 'd2', name: 'Matrícula da propriedade', status: 'aprovado' },
      { id: 'd3', name: 'Termo de adesão', status: 'aprovado' },
      { id: 'd4', name: 'Laudo técnico', status: 'pendente' },
    ],
    satellite: { ndviAverage: 0.82, vegetationCoverPercent: 94, activeAlerts: 0 },
    timeline: [
      { order: 1, title: 'Elegibilidade', date: '12 mar 2026', status: 'completed' },
      { order: 2, title: 'Cadastro', date: '28 mar 2026', status: 'completed' },
      { order: 3, title: 'Projeto Coletivo', date: '10 abr 2026', status: 'completed' },
      { order: 4, title: 'Validação Técnica', status: 'current' },
      { order: 5, title: 'Monitoramento Satelital', status: 'pending' },
      { order: 6, title: 'Certificação', status: 'pending' },
      { order: 7, title: 'Comercialização', status: 'pending' },
    ],
    activities: [
      { id: 'a1', title: 'Novo alerta satelital recebido', description: 'Cobertura vegetal estável em 94%.', timeAgo: 'há 2h' },
      { id: 'a2', title: 'Documento aprovado', description: 'Seu Termo de Adesão foi validado pela consultoria.', timeAgo: 'há 1d' },
      { id: 'a3', title: 'Reunião agendada', description: 'Visita técnica marcada para 18 nov.', timeAgo: 'há 2d' },
      { id: 'a4', title: 'Estimativa atualizada', description: 'Potencial de crédito revisado para 1.240 tCO₂e.', timeAgo: 'há 3d' },
    ],
  },
  {
    id: 'p2',
    name: 'João Almeida',
    propertyName: 'Fazenda Vale do Rio Doce',
    location: 'Governador Valadares, MG',
    cooperativeName: 'Coop Rio Doce',
    biome: 'Cerrado',
    totalAreaHectares: 210,
    eligibleAreaHectares: 175,
    certificationStage: 'Monitoramento',
    certificationProgressPercent: 78,
    estimatedMonthsToComplete: 2,
    estimatedCarbonPotential: 2100,
    propertyImageUrl: 'image/paisagem_fazenda_agro.jpg',
    documents: [],
    satellite: { ndviAverage: 0.75, vegetationCoverPercent: 88, activeAlerts: 1 },
    timeline: [],
    activities: [],
  },
  {
    id: 'p3',
    name: 'Ana Cooperativada',
    propertyName: 'Chácara Nova Aurora',
    location: 'Petrópolis, RJ',
    cooperativeName: 'Coop Terra Boa',
    biome: 'Mata Atlântica',
    totalAreaHectares: 34,
    eligibleAreaHectares: 15,
    certificationStage: 'Certificado',
    certificationProgressPercent: 100,
    estimatedMonthsToComplete: 0,
    estimatedCarbonPotential: 145,
    propertyImageUrl: 'image/imagem_vale_natureza.jpg',
    documents: [],
    satellite: { ndviAverage: 0.9, vegetationCoverPercent: 97, activeAlerts: 0 },
    timeline: [],
    activities: [],
  },
  {
    id: 'p4',
    name: 'Carlos Mendes',
    propertyName: 'Sítio Cerrado Sustentável',
    location: 'Barreiras, BA',
    cooperativeName: 'AgroCerrado',
    biome: 'Cerrado',
    totalAreaHectares: 320,
    eligibleAreaHectares: 240,
    certificationStage: 'Cadastro',
    certificationProgressPercent: 28,
    estimatedMonthsToComplete: 9,
    estimatedCarbonPotential: 3400,
    propertyImageUrl: 'image/platacao_agro.jpg',
    documents: [],
    satellite: { ndviAverage: 0.68, vegetationCoverPercent: 80, activeAlerts: 2 },
    timeline: [],
    activities: [],
  },
  {
    id: 'p5',
    name: 'Fernanda Souza',
    propertyName: 'Fazenda Mata Viva',
    location: 'Ilhéus, BA',
    cooperativeName: 'Coop Vale Verde',
    biome: 'Mata Atlântica',
    totalAreaHectares: 88,
    eligibleAreaHectares: 60,
    certificationStage: 'Projeto Coletivo',
    certificationProgressPercent: 45,
    estimatedMonthsToComplete: 6,
    estimatedCarbonPotential: 610,
    propertyImageUrl: 'image/agricultor_lavoura_agro.jpg',
    documents: [],
    satellite: { ndviAverage: 0.79, vegetationCoverPercent: 91, activeAlerts: 0 },
    timeline: [],
    activities: [],
  },
];

@Injectable({ providedIn: 'root' })
export class ProducerService {
  private producers$ = new BehaviorSubject<Producer[]>(MOCK_PRODUCERS);
  private searchTerm$ = new BehaviorSubject<string>('');

  getAll(): Observable<Producer[]> {
    return this.producers$.asObservable();
  }

  getById(id: string): Observable<Producer | undefined> {
    // Nota: usamos map() para extrair uma propriedade específica, que é o substituto
    // moderno do operador `pluck` (removido a partir do RxJS 7 / Angular recente).
    return this.producers$.pipe(map((producers) => producers.find((p) => p.id === id)));
  }

  // No mock, o produtor logado (dashboard do produtor) é sempre o primeiro registro
  getCurrentProducer(): Observable<Producer> {
    return this.producers$.pipe(map((producers) => producers[0]));
  }

  setSearchTerm(term: string): void {
    this.searchTerm$.next(term);
  }

  getFilteredProducers(): Observable<Producer[]> {
    return this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term) => term.trim().toLowerCase()),
      filter(() => true),
      map((term) =>
        term.length === 0
          ? MOCK_PRODUCERS
          : MOCK_PRODUCERS.filter(
              (p) =>
                p.name.toLowerCase().includes(term) ||
                p.propertyName.toLowerCase().includes(term) ||
                p.biome.toLowerCase().includes(term) ||
                p.cooperativeName.toLowerCase().includes(term)
            )
      )
    );
  }
}