import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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

interface EsgStat {
  value: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatarInitial: string;
  avatarImageUrl?: string;
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
  private sanitizer = inject(DomSanitizer);

  private svgIcons: string[] = [
    // 1 - Diagnóstico (mapa/pin)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="#14532d" stroke-width="1.7"/><circle cx="12" cy="9" r="2.3" stroke="#14532d" stroke-width="1.7"/></svg>`,
    // 2 - Agrupamento (pessoas)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="8" r="3" stroke="#14532d" stroke-width="1.7"/><circle cx="17" cy="9" r="2.4" stroke="#14532d" stroke-width="1.7"/><path d="M2.5 20c.6-3.6 3-5.5 5.5-5.5s4.9 1.9 5.5 5.5" stroke="#14532d" stroke-width="1.7" stroke-linecap="round"/><path d="M14.5 20c.4-2.6 1.8-4.2 3.7-4.2s3.3 1.6 3.7 4.2" stroke="#14532d" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    // 3 - Validação (check)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h13l3 3v13H4V4z" stroke="#14532d" stroke-width="1.7" stroke-linejoin="round"/><path d="M8 12l2.5 2.5L16 9" stroke="#14532d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    // 4 - Monitoramento (pulso)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12h4l2-7 4 14 3-9 2 2h5" stroke="#14532d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    // 5 - Certificação (escudo)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 3.5v5.5c0 5-3.4 8.6-8 9.7-4.6-1.1-8-4.7-8-9.7V6.5L12 3z" stroke="#14532d" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 12l2 2 4-4.5" stroke="#14532d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    // 6 - Comercialização (raio)
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h6l-1 8 10-14h-6l0-6z" stroke="#14532d" stroke-width="1.5" stroke-linejoin="round" fill="#14532d" fill-opacity="0.08"/></svg>`,
  ];

  stepIcons: SafeHtml[] = this.svgIcons.map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg));
  heroImageUrl = 'image/imagem_vale_natureza.jpg';
  ctaImageUrl = 'image/floresta_visao.jpg';

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
    { order: 1, title: 'Elegibilidade & Cadastro inicial', description: 'O produtor verifica se sua propriedade é elegível para participar e faz o cadastro inicial.', icon: '✅' },
    { order: 2, title: 'Projeto Coletivo', description: 'A propriedade é organizada dentro de um projeto de cooperativa ou consultoria.', icon: '🤝' },
    { order: 3, title: 'Validação Técnica', description: 'Consultorias ambientais analisam e validam o projeto.', icon: '🔍' },
    { order: 4, title: 'Monitoramento', description: 'Indicadores ambientais e dados geoespaciais acompanham o progresso.', icon: '🛰️' },
    { order: 5, title: 'Certificação', description: 'O projeto recebe certificação conforme os padrões do mercado.', icon: '📜' },
    { order: 6, title: 'Comercialização', description: 'Os créditos gerados podem ser destinados à comercialização.', icon: '💹' },
  ];

esgCards: EsgCard[] = [
    {
      letter: 'E',
      title: 'Ambiental',
      description: 'Cada projeto é acompanhado por monitoramento contínuo de indicadores ambientais e imagens de satélite, garantindo que a preservação de biomas e o uso responsável da terra sejam verificáveis — não apenas prometidos.',
      icon: '🌱',
    },
    {
      letter: 'S',
      title: 'Social',
      description: 'O modelo de projetos coletivos foi desenhado para incluir a agricultura familiar no mercado de carbono, fortalecendo cooperativas rurais e distribuindo a renda gerada de forma justa entre os produtores.',
      icon: '🤝',
    },
    {
      letter: 'G',
      title: 'Governança',
      description: 'Toda a jornada de certificação é documentada em um único ambiente digital, com processos rastreáveis do cadastro à comercialização — trazendo transparência para produtores, cooperativas e compradores.',
      icon: '🔐',
    },
  ];

  esgImageUrl = 'image/agricultor_lavoura_agro.jpg';

  esgStats: EsgStat[] = [
    { value: '94%', label: 'Cobertura vegetal preservada nas áreas monitoradas' },
    { value: '78%', label: 'Redução no custo de certificação por produtor' },
    { value: '100%', label: 'Documentos rastreáveis em tempo real' },
  ];
  testimonials: Testimonial[] = [
    {
      name: 'Joana Ribeiro',
      role: 'Produtora · Zona da Mata, MG',
      quote: 'Consegui certificar minha propriedade sem burocracia. A cooperativa cuidou de tudo e hoje minha família tem uma nova fonte de renda.',
      avatarInitial: 'J',
      avatarImageUrl: 'image/agricultor_lavoura_agro.jpg',
    },
    {
      name: 'Carlos Mendes',
      role: 'Diretor · Cooperativa Vale Verde',
      quote: 'O CarbonTrack transformou como coordenamos nossos projetos coletivos. Monitoramento e certificação em uma única plataforma.',
      avatarInitial: 'C',
    },
    {
      name: 'Marina Costa',
      role: 'ESG Manager · GreenCorp',
      quote: 'Rastreabilidade completa dos créditos que compramos. Nunca vimos esse nível de transparência no mercado voluntário.',
      avatarInitial: 'M',
    },
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