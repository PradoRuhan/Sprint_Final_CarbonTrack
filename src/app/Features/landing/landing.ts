import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, Carousel],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
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
    {
      letter: 'E',
      title: 'Ambiental',
      description: 'Monitoramento de indicadores ambientais, preservação de biomas e uso responsável da terra.',
      icon: '🌳',
    },
    {
      letter: 'S',
      title: 'Social',
      description: 'Inclusão da agricultura familiar e fortalecimento de cooperativas rurais.',
      icon: '🤲',
    },
    {
      letter: 'G',
      title: 'Governança',
      description: 'Gestão documental transparente e processos rastreáveis de certificação.',
      icon: '📊',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Maria Produtora',
      role: 'Produtora Rural — Cerrado',
      quote: 'Antes eu nem sabia por onde começar. Com o projeto coletivo, consegui participar do mercado de carbono sem precisar entender toda a burocracia sozinha.',
    },
    {
      name: 'Cooperativa Vale Verde',
      role: 'Cooperativa Agrícola',
      quote: 'Conseguimos gerenciar centenas de propriedades em um único painel, o que antes era feito manualmente em planilhas separadas.',
    },
    {
      name: 'Consultoria Ambiental XYZ',
      role: 'Consultoria Ambiental',
      quote: 'A organização documental e o acompanhamento das etapas técnicas tornaram nosso trabalho de validação muito mais eficiente.',
    },
  ];
}