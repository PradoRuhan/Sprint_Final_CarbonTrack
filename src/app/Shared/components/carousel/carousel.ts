import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel as BootstrapCarousel } from 'bootstrap';

interface InfoCard {
  icon: string;
  title: string;
  description: string;
}

interface InfoSlide {
  id: number;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  contentType: 'cards' | 'checklist';
  cards?: InfoCard[];
  checklist?: string[];
  liveBadge?: string;
}

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})

export class Carousel implements AfterViewInit, OnDestroy {
  private carouselInstance?: BootstrapCarousel;
  private carouselEl?: Element | null;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.carouselEl = this.elementRef.nativeElement.querySelector('#heroCarousel');
    if (this.carouselEl) {
      this.carouselInstance = new BootstrapCarousel(this.carouselEl, {
        interval: 7000,
        ride: 'carousel',
        pause: false, // controlamos o pause manualmente via mouseenter/mouseleave
        wrap: true,
      });
    }
  }

  onMouseEnter(): void {
    this.carouselInstance?.pause();
  }

  onMouseLeave(): void {
    this.carouselInstance?.cycle();
  }
  ngOnDestroy(): void {
    this.carouselInstance?.dispose();
  }

  slides: InfoSlide[] = [
    {
      id: 0,
      badge: 'Mercado de Carbono',
      title: 'O que são créditos de carbono?',
      description: 'Cada crédito representa uma tonelada de CO₂ evitada, reduzida ou removida da atmosfera — um ativo financeiro real com impacto ambiental verificado.',
      imageUrl: 'image/imagem_vale_natureza.jpg',
      imagePosition: 'left',
      contentType: 'cards',
      cards: [
        { icon: 'bi-globe2', title: 'Mercado Voluntário', description: 'Empresas compensam emissões por compromissos ESG.' },
        { icon: 'bi-shield-check', title: 'Mercado Regulado', description: 'Créditos negociados sob regulamentação nacional e internacional.' },
        { icon: 'bi-people-fill', title: 'Compradores', description: 'Indústrias, bancos e empresas globais buscando neutralidade.' },
        { icon: 'bi-tree-fill', title: 'Vendedores', description: 'Produtores e cooperativas com projetos ambientais certificados.' },
      ],
    },
    {
      id: 1,
      badge: 'Tecnologia',
      title: 'Inteligência ambiental de ponta a ponta',
      description: 'Satélites, IA e dados geoespaciais para trazer transparência ao mercado de carbono.',
      imageUrl: 'image/photo_forest.avif',
      imagePosition: 'right',
      contentType: 'cards',
      liveBadge: 'Cobertura vegetal detectada · NDVI 0.84',
      cards: [
        { icon: 'bi-broadcast', title: 'Monitoramento Satelital', description: 'Sentinel-2, Landsat e Planet Labs.' },
        { icon: 'bi-cpu-fill', title: 'Inteligência Artificial', description: 'Modelos de detecção de mudança e biomassa.' },
        { icon: 'bi-geo-alt-fill', title: 'GIS & Mapas Interativos', description: 'Análise geoespacial em tempo real.' },
        { icon: 'bi-cloud-fill', title: 'Cloud Infrastructure', description: 'Escalável, segura e auditável.' },
        { icon: 'bi-graph-up-arrow', title: 'Inteligência Ambiental', description: 'Dashboards climáticos preditivos.' },
        { icon: 'bi-clipboard-check-fill', title: 'Automação de Auditoria', description: 'Rastreabilidade e conformidade.' },
      ],
    },
{
      id: 2,
      badge: 'Cooperativas',
      title: 'Projetos coletivos, impacto multiplicado',
      description: 'Pequenos produtores unidos por cooperativas alcançam escala e viabilizam a certificação.',
      imageUrl: 'image/uniao_maos_conservacao.jpg',
      imagePosition: 'left',
      contentType: 'cards',
      cards: [
        { icon: 'bi-percent', title: 'Custos Reduzidos', description: 'Redução de custos de certificação em até 78%.' },
        { icon: 'bi-diagram-3-fill', title: 'Agrupamento Inteligente', description: 'Organização por biomas e regiões próximas.' },
        { icon: 'bi-cash-coin', title: 'Renda Transparente', description: 'Distribuição clara da renda gerada pelo projeto.' },
        { icon: 'bi-headset', title: 'Assistência Técnica', description: 'Suporte contínuo incluído para os produtores.' },
      ],
    },
  ];
}
