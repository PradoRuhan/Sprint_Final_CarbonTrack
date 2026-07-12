# 🌱 CarbonTrack

**Plataforma de Inteligência Climática** que conecta pequenos produtores rurais, cooperativas agrícolas, consultorias ambientais e empresas ao mercado de carbono por meio de projetos coletivos, gestão ESG e monitoramento ambiental.

Projeto final desenvolvido para o programa **Ford Enter** — Trilha de Front-End.

🔗 **[Acesse o projeto no ar](https://sprint-final-carbon-track-543crct1d-ruhanprado-2677s-projects.vercel.app/)**

---

## 📋 Sobre o projeto

O CarbonTrack simplifica uma jornada normalmente burocrática — o acesso ao mercado de carbono — utilizando tecnologia para organizar produtores em projetos coletivos, acompanhar processos de certificação, monitorar indicadores ambientais e aproximar projetos sustentáveis de oportunidades de comercialização.

### Principais funcionalidades

- **Landing page institucional** com carrossel automático, simulador de potencial de carbono e seções educativas (ESG, Mercado de Carbono, Cooperativas).
- **Autenticação simulada** (login/cadastro) com aceite obrigatório dos Termos de Uso e LGPD no cadastro.
- **Onboarding guiado** em 3 etapas após o cadastro (dados do produtor, propriedade e documentação).
- **Dashboard do Produtor**: acompanhamento de certificação, linha do tempo, monitoramento satelital (mock) e documentos.
- **Dashboard Administrativo (Executive)**: KPIs consolidados, gráfico de volume de carbono, distribuição por bioma, fila de validação e busca de produtores em tempo real.
- **Rotas protegidas** por autenticação e por papel de usuário (produtor/admin).
- **Design responsivo**, com sidebar retrátil nos dashboards e menu mobile na navegação pública.

---

## 🛠️ Tecnologias utilizadas

- **Angular 22** (standalone components)
- **TypeScript**
- **RxJS** (`map`, `debounceTime`, `distinctUntilChanged`, `filter`)
- **Bootstrap 5** + **Bootstrap Icons**
- **Reactive Forms** e `ngModel`
- **SCSS/CSS** com variáveis customizadas para identidade visual

> Este é um projeto **front-end** — não há backend real. Todos os dados (usuários, produtores, indicadores) são simulados via serviços Angular com `Observable`/`BehaviorSubject`, sem persistência real.

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/PradoRuhan/Sprint_Final_CarbonTrack.git

# Acesse a pasta
cd Sprint_Final_CarbonTrack

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
ng serve
```

Acesse `http://localhost:4200` no navegador.

---

## 👤 Contas de demonstração

Como não há backend real, use estas credenciais para testar os dois perfis de acesso:

| Perfil | E-mail | Senha |
|---|---|---|
| Produtor Rural | `produtor@carbontrack.com` | `123456` |
| Administrador | `admin@carbontrack.com` | `123456` |

*(Na tela de login, também é possível preencher automaticamente essas credenciais pelos botões de demonstração.)*

---

## 📁 Estrutura do projeto

src/app/
├── core/                  # Guards, models e services (regras de negócio)
│   ├── guards/
│   ├── models/
│   └── services/
├── shared/                # Componentes reutilizáveis
│   └── components/
│       ├── navbar/
│       ├── footer/
│       └── carousel/
└── features/              # Telas da aplicação
├── landing/
├── auth/
│   ├── login/
│   └── register/
├── onboarding/
├── producer-dashboard/
└── admin-dashboard/

---

## ⚖️ LGPD

Este é um projeto **acadêmico**, sem fins comerciais. Nenhum dado inserido é processado, armazenado em servidores externos ou compartilhado com terceiros. O cadastro exige aceite explícito dos Termos de Uso e da Política de Privacidade (LGPD), conforme a Lei nº 13.709/2018, mesmo sendo uma simulação.

---

## 🌐 Deploy

Aplicação hospedada na **Vercel**, com deploy automático a cada push na branch `main`.

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais no âmbito do programa Ford Enter.