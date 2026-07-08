import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Producer } from '../models/producer.model';

const MOCK_PRODUCERS: Producer[] = [
  {
    id: 'p1',
    name: 'Maria Produtora',
    propertyName: 'Sítio Boa Esperança',
    biome: 'Cerrado',
    eligibleAreaHectares: 42,
    certificationStage: 'Monitoramento',
    estimatedCarbonPotential: 320,
    propertyImageUrl: 'assets/images/property-1.jpg',
    documents: [
      { id: 'd1', name: 'CAR - Cadastro Ambiental Rural', status: 'aprovado' },
      { id: 'd2', name: 'Comprovante de Propriedade', status: 'enviado' },
      { id: 'd3', name: 'Laudo Técnico', status: 'pendente' },
    ],
  },
  {
    id: 'p2',
    name: 'João da Silva',
    propertyName: 'Fazenda Vale Verde',
    biome: 'Amazônia',
    eligibleAreaHectares: 78,
    certificationStage: 'Validação Técnica',
    estimatedCarbonPotential: 610,
    propertyImageUrl: 'assets/images/property-2.jpg',
    documents: [
      { id: 'd4', name: 'CAR - Cadastro Ambiental Rural', status: 'aprovado' },
      { id: 'd5', name: 'Comprovante de Propriedade', status: 'aprovado' },
    ],
  },
  {
    id: 'p3',
    name: 'Ana Cooperativada',
    propertyName: 'Chácara Nova Aurora',
    biome: 'Mata Atlântica',
    eligibleAreaHectares: 15,
    certificationStage: 'Certificado',
    estimatedCarbonPotential: 145,
    propertyImageUrl: 'assets/images/property-3.jpg',
    documents: [
      { id: 'd6', name: 'CAR - Cadastro Ambiental Rural', status: 'aprovado' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ProducerService {
  private producers$ = new BehaviorSubject<Producer[]>(MOCK_PRODUCERS);

  // termo de busca digitado pelo admin na tabela
  private searchTerm$ = new BehaviorSubject<string>('');

  getAll(): Observable<Producer[]> {
    return this.producers$.asObservable();
  }

  getById(id: string): Observable<Producer | undefined> {
    return this.producers$.pipe(
      map((producers) => producers.find((p) => p.id === id))
    );
  }

  setSearchTerm(term: string): void {
    this.searchTerm$.next(term);
  }

  // Observable já filtrado — é isso que o componente da tabela do admin vai consumir
  getFilteredProducers(): Observable<Producer[]> {
    return this.searchTerm$.pipe(
      debounceTime(300),        // espera 300ms depois que o usuário para de digitar
      distinctUntilChanged(),   // ignora se o termo não mudou
      map((term) => term.trim().toLowerCase()),
      filter(() => true),      // (mantido para ilustrar o operador filter no pipeline)
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

  getCertificationStages(): Observable<string[]> {
    return this.producers$.pipe(
      map((producers) => producers.map((p) => p.certificationStage))
    );
  }
}