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
  // tonelada de CO2e por hectare/ano (valor educacional/ilustrativo, não vinculante)
  factorPerHectare: number;
}

interface SimulationResult {
  tco2ePerYear: number;
  estimatedValueBRL: number;
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

  // Fatores educacionais/ilustrativos — não representam dados técnicos reais
  biomeFactors: BiomeFactor[] = [
    { name: 'Amazônia', factorPerHectare: 8.5 },
    { name: 'Cerrado', factorPerHectare: 5.2 },
    { name: 'Mata Atlântica', factorPerHectare: 6.0 },
    { name: 'Caatinga', factorPerHectare: 3.1 },
    { name: 'Pampa', factorPerHectare: 2.4 },
    { name: 'Pantanal', factorPerHectare: 4.0 },
  ];

  private readonly pricePerTonBRL = 45;

  simulatorForm = this.fb.group({
    areaHectares: [50, [Validators.required, Validators.min(1), Validators.max(100000)]],
    biome: ['Amazônia', [Validators.required]],
  });

  simulationResult = signal<SimulationResult | null>(null);

  get areaHectares() {
    return this.simulatorForm.controls.areaHectares;
  }

  ngOnInit(): void {
    this.simulatorForm.valueChanges
      .pipe(
        startWith(this.simulatorForm.getRawValue()),
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        map((value) => this.calculateSimulation(value.areaHectares, value.biome)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => this.simulationResult.set(result));
  }

  private calculateSimulation(area: number | null, biomeName: string | null): SimulationResult | null {
    if (!area || area <= 0 || !biomeName) {
      return null;
    }

    const factor = this.biomeFactors.find((b) => b.name === biomeName)?.factorPerHectare ?? 0;
    const tco2ePerYear = Math.round(area * factor);
    const estimatedValueBRL = tco2ePerYear * this.pricePerTonBRL;

    return { tco2ePerYear, estimatedValueBRL };
  }
}