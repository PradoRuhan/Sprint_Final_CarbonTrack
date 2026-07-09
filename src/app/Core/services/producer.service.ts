import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Producer } from '../models/producer.model';

const MOCK_PRODUCERS: Producer[] = [
  {
    id: 'p1',
    name: 'Joana',
    propertyName: 'Fazenda Boa Esperança',
    location: 'Viçosa, MG · Zona da Mata, MG',
    cooperativeName: 'Cooperativa Vale Verde',
    biome: 'Mata Atlântica',
    totalAreaHectares: 142,
    eligibleAreaHectares: 108,
    certificationStage: 'Validação',
    certificationProgressPercent: 62,
    estimatedMonthsToComplete: 4,
    estimatedCarbonPotential: 1240,
    propertyImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    documents: [
      { id: 'd1', name: 'CAR — Cadastro Ambiental Rural', status: 'aprovado' },
      { id: 'd2', name: 'Matrícula da propriedade', status: 'aprovado' },
      { id: 'd3', name: 'Termo de adesão', status: 'aprovado' },
      { id: 'd4', name: 'Laudo técnico', status: 'pendente' },
    ],
    satellite: {
      ndviAverage: 0.82,
      vegetationCoverPercent: 94,
      activeAlerts: 0,
    },
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
];

@Injectable({ providedIn: 'root' })
export class ProducerService {
  private producers$ = new BehaviorSubject<Producer[]>(MOCK_PRODUCERS);
  private searchTerm$ = new BehaviorSubject<string>('');

  getAll(): Observable<Producer[]> {
    return this.producers$.asObservable();
  }

  getById(id: string): Observable<Producer | undefined> {
    return this.producers$.pipe(map((producers) => producers.find((p) => p.id === id)));
  }

  // No mock, o produtor logado é sempre o primeiro registro
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
                p.biome.toLowerCase().includes(term)
            )
      )
    );
  }
}