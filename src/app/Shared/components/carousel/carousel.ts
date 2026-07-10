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
      imageUrl: 'image/floresta_visao.jpg',
      anchor: '#mercado-carbono',
    },
    {
      id: 1,
      title: 'ESG',
      description: 'Sustentabilidade na prática: ambiental, social e governança em projetos reais.',
      imageUrl: 'image/maos_na_terra.jpg',
      anchor: '#esg',
    },
    {
      id: 2,
      title: 'ODS',
      description: 'Conheça os Objetivos de Desenvolvimento Sustentável da ONU e o alinhamento com o CarbonTrack.',
      imageUrl: 'image/imagem_vale_natureza.jpg',
      anchor: '#ods',
    },
    {
      id: 3,
      title: 'Agricultura Familiar',
      description: 'Inclusão social e viabilidade econômica para pequenos produtores rurais.',
      imageUrl: 'image/plantacao_terra_agro.jpg',
      anchor: '#agricultura-familiar',
    },
    {
      id: 4,
      title: 'Cooperativas',
      description: 'Como cooperativas organizam projetos coletivos de carbono de forma eficiente.',
      imageUrl: 'image/uniao_maos_conservacao.jpg',
      anchor: '#cooperativas',
    },
    {
      id: 5,
      title: 'Tecnologia',
      description: 'Monitoramento por satélite, inteligência artificial e análise geoespacial.',
      imageUrl: 'image/photo_forest.avif',
      anchor: '#tecnologia',
    },
  ];
}