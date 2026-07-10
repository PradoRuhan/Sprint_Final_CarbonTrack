import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Carousel } from '../../shared/components/carousel/carousel';

interface Step {
  order: number;
  title: string;
  description: string;
  icon: string;
}

interface EsgCard {
  letter: string;
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface BiomeFactor {
  name: string;
  factorPerHectare: number; // tCO2e/ha/ano — valor educacional/ilustrativo
}

interface SimulationResult {
  tco2ePerYear: number;
  estimatedValueBRL: number;
}

interface ProjectionPoint {
  year: number;
  value: number;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, Carousel],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  heroImageUrl = 'image/platio_agro_plantas.jpg';

  heroStats = [
    {value: '2.4M', label: 'ha monitorados'},
    {value: '480+', label: 'Cooperativas participantes'},
    {value: '12k', label: 'Produtores rurais engajados'},
  ];

  heroProject = {
    name: 'Cooperativa Vale Verde',
    location: 'Cerrado · MG',
    status: 'Certificado',
    eligibleArea: '18.420 ha',
    estimatedTco2e: '42.180',
    producers: '286',
    currentStage: 'Monitoramento',
    progressPercentage: 72,
  }

  steps: Step[] = [
    { order: 1, title: 'Elegibilidade', description: 'O produtor verifica se sua propriedade é elegível para participar.', icon: '✅' },
    { order: 2, title: 'Cadastro', description: 'Cadastro inicial e vínculo com um projeto coletivo.', icon: '📝' },
    { order: 3, title: 'Projeto Coletivo', description: 'A propriedade é organizada dentro de um projeto de cooperativa ou consultoria.', icon: '🤝' },
    { order: 4, title: 'Validação Técnica', description: 'Consultorias ambientais analisam e validam o projeto.', icon: '🔍' },
    { order: 5, title: 'Monitoramento', description: 'Indicadores ambientais e dados geoespaciais acompanham o progresso.', icon: '🛰️' },
    { order: 6, title: 'Certificação', description: 'O projeto recebe certificação conforme os padrões do mercado.', icon: '📜' },
    { order: 7, title: 'Comercialização', description: 'Os créditos gerados podem ser destinados à comercialização.', icon: '💹' },
  ];

  esgCards: EsgCard[] = [
    { letter: 'E', title: 'Ambiental', description: 'Monitoramento de indicadores ambientais, preservação de biomas e uso responsável da terra.', icon: '🌳' },
    { letter: 'S', title: 'Social', description: 'Inclusão da agricultura familiar e fortalecimento de cooperativas rurais.', icon: '🤲' },
    { letter: 'G', title: 'Governança', description: 'Gestão documental transparente e processos rastreáveis de certificação.', icon: '📊' },
  ];

  testimonials: Testimonial[] = [
    { name: 'Maria Produtora', role: 'Produtora Rural — Cerrado', quote: 'Antes eu nem sabia por onde começar. Com o projeto coletivo, consegui participar do mercado de carbono sem precisar entender toda a burocracia sozinha.' },
    { name: 'Cooperativa Vale Verde', role: 'Cooperativa Agrícola', quote: 'Conseguimos gerenciar centenas de propriedades em um único painel, o que antes era feito manualmente em planilhas separadas.' },
    { name: 'Consultoria Ambiental XYZ', role: 'Consultoria Ambiental', quote: 'A organização documental e o acompanhamento das etapas técnicas tornaram nosso trabalho de validação muito mais eficiente.' },
  ];

  biomeFactors: BiomeFactor[] = [
    { name: 'Amazônia', factorPerHectare: 8.5 },
    { name: 'Cerrado', factorPerHectare: 5.2 },
    { name: 'Mata Atlântica', factorPerHectare: 6.0 },
    { name: 'Caatinga', factorPerHectare: 3.1 },
    { name: 'Pampa', factorPerHectare: 2.4 },
    { name: 'Pantanal', factorPerHectare: 4.0 },
  ];

  private readonly pricePerTonBRL = 45;
  private readonly annualPriceGrowth = 0.04; // 4% a.a. — projeção ilustrativa
  private readonly baseYear = 2026;

  simulatorForm = this.fb.group({
    areaHectares: [500, [Validators.required, Validators.min(1), Validators.max(100000)]],
    biome: ['Cerrado', [Validators.required]],
  });

  hasSimulated = signal(false);
  simulationResult = signal<SimulationResult | null>(null);
  projection = signal<ProjectionPoint[]>([]);

  private currentResult: SimulationResult | null = null;

  get areaHectares() {
    return this.simulatorForm.controls.areaHectares;
  }

  ngOnInit(): void {
    this.simulatorForm.valueChanges
      .pipe(
        startWith(this.simulatorForm.getRawValue()),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        map((value) => this.calculateSimulation(value.areaHectares ?? null, value.biome ?? null)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.currentResult = result;
        // Se já simulou antes, atualiza o resultado em tempo real conforme o usuário ajusta os campos
        if (this.hasSimulated() && result) {
          this.simulationResult.set(result);
          this.projection.set(this.buildProjection(result));
        }
      });
  }

  simulate(): void {
    if (this.simulatorForm.invalid || !this.currentResult) {
      this.simulatorForm.markAllAsTouched();
      return;
    }
    this.hasSimulated.set(true);
    this.simulationResult.set(this.currentResult);
    this.projection.set(this.buildProjection(this.currentResult));
  }

  resetSimulation(): void {
    this.hasSimulated.set(false);
    this.simulationResult.set(null);
    this.projection.set([]);
  }

  private calculateSimulation(area: number | null, biomeName: string | null): SimulationResult | null {
    if (!area || area <= 0 || !biomeName) {
      return null;
    }
    const factor = this.biomeFactors.find((b) => b.name === biomeName)?.factorPerHectare ?? 0;
    const tco2ePerYear = Math.round(area * factor);
    const estimatedValueBRL = Math.round(tco2ePerYear * this.pricePerTonBRL);
    return { tco2ePerYear, estimatedValueBRL };
  }

  private buildProjection(result: SimulationResult): ProjectionPoint[] {
    const points: ProjectionPoint[] = [];
    for (let i = 0; i < 5; i++) {
      const growth = Math.pow(1 + this.annualPriceGrowth, i);
      points.push({ year: this.baseYear + i, value: Math.round(result.estimatedValueBRL * growth) });
    }
    return points;
  }

  getProjectionLinePoints(): string {
    const points = this.projection();
    if (!points.length) return '';
    const values = points.map((p) => p.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const stepX = 100 / (points.length - 1 || 1);

    return points
      .map((p, i) => {
        const x = i * stepX;
        const y = 100 - ((p.value - min) / range) * 85 - 8;
        return `${x},${y}`;
      })
      .join(' ');
  }

  getProjectionAreaPath(): string {
    const line = this.getProjectionLinePoints();
    if (!line) return '';
    return `M0,100 L${line} L100,100 Z`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}