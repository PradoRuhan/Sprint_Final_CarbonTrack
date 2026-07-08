import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  anchor: string;
}

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel {
  slides: CarouselSlide[] = [
    {
      id: 0,
      title: 'Mercado de Carbono',
      description: 'Entenda como funcionam os créditos de carbono e como pequenos produtores podem participar.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
      anchor: '#mercado-carbono',
    },
    {
      id: 1,
      title: 'ESG',
      description: 'Sustentabilidade na prática: ambiental, social e governança em projetos reais.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
      anchor: '#esg',
    },
    {
      id: 2,
      title: 'ODS',
      description: 'Conheça os Objetivos de Desenvolvimento Sustentável da ONU e o alinhamento com o CarbonTrack.',
      imageUrl: 'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=1200&q=80',
      anchor: '#ods',
    },
    {
      id: 3,
      title: 'Agricultura Familiar',
      description: 'Inclusão social e viabilidade econômica para pequenos produtores rurais.',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80',
      anchor: '#agricultura-familiar',
    },
    {
      id: 4,
      title: 'Cooperativas',
      description: 'Como cooperativas organizam projetos coletivos de carbono de forma eficiente.',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
      anchor: '#cooperativas',
    },
    {
      id: 5,
      title: 'Tecnologia',
      description: 'Monitoramento por satélite, inteligência artificial e análise geoespacial.',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
      anchor: '#tecnologia',
    },
  ];
}