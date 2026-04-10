# 💰 FinanceApp — Frontend

![Angular](https://img.shields.io/badge/Angular-19.2-dd0031?style=flat&logo=angular&logoColor=dd0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19.1-17202C?style=flat&logo=primefaces&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat&logo=reactivex&logoColor=B7178C)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Karma](https://img.shields.io/badge/Karma-6.4-3DDC84?style=flat&logo=jasmine&logoColor=47D687)

## 🎯 Teste Integrado — Módulo Frontend

**Objetivo Central**: Construir o frontend de um sistema de gestão de benefícios financeiros, integrado a uma API REST Spring Boot, com foco em usabilidade, validações e consistência visual.

🔍 **Competências Avaliadas**:

1. Reatividade e Validações (Reactive Forms + PrimeNG)
2. Integração com API REST (HttpClient + Interceptors)
3. Componentização e Reuso
4. Gerenciamento de Estado com RxJS (BehaviorSubject)
5. Observabilidade e Feedbacks ao Usuário
6. Testes Automatizados (Jasmine/Karma)
7. Design System com Dark Mode

🧠 **Resolução**: <p>Sistema de gestão de benefícios financeiros desenvolvido com Angular 19 e PrimeNG 19, consumindo uma API REST Spring Boot. O projeto aplica boas práticas de arquitetura modular, Clean Code e princípios SOLID. Inclui autenticação simulada com JWT, controle de estado reativo via RxJS, persistência de histórico em localStorage e 69 testes unitários cobrindo serviços, guards, pipes e componentes.</p>

## 📋 Pré-requisitos

* Node.js 18+
* npm

  ```sh
  npm install npm@latest -g
  ```

* Backend rodando em `http://localhost:8080` (ver `../backend-module`)

## 📦 Instalação

1. Clone o repositório

   ```sh
   git clone https://github.com/emanuelluiss/bip-teste-integrado
   ```

2. Acesse a pasta do frontend e instale os pacotes NPM

   ```sh
   cd frontend
   npm install
   ```

## ▶️ Rode o projeto

* Comando Angular para rodar o projeto:

  ```sh
  ng serve
  ```

* Comando NPM para rodar o projeto definido no `package.json`:

  ```sh
  npm run start
  ```

A aplicação estará disponível em 👉 **http://localhost:4200** 👈

**Credenciais de acesso:**

| Campo | Valor |
|---|---|
| Usuário | `admin` |
| Senha | `admin123` |

## 🧪 Testes

* Rodar todos os testes unitários:

  ```sh
  npm test
  ```

* Rodar em modo headless (CI):

  ```sh
  ng test --watch=false --browsers=ChromeHeadless
  ```

**Cobertura atual: 69 testes — 0 falhas**

| Suite | Testes |
|---|---|
| `BeneficioService` | 6 |
| `HistoricoService` | 7 |
| `AuthService` | 3 |
| `AuthGuard` | 3 |
| `BrlCurrencyPipe` | 8 |
| `TransferenciaComponent` | 6 |
| `BeneficiosComponent` | 13 |
| `HistoricoComponent` | 13 |
| `DashboardComponent` | 7 |
| `AppComponent` | 1 |

## 🚀 Funcionalidades

- **Dashboard:** Visão geral com métricas (total de benefícios, valor total, ativos/inativos), listagem resumida e ações rápidas.
- **Gestão de Benefícios:** Listagem em tabela com filtro global, criação, edição e exclusão com confirmação via dialog.
- **Transferência em Stepper:** Fluxo em 3 etapas (origem → valor → confirmação) com atalhos de percentual (25/50/75/Max) e validação de saldo em tempo real.
- **Detalhe do Benefício:** Abas com dados cadastrais, histórico de movimentações e gráfico de distribuição com Chart.js.
- **Histórico de Transferências:** Filtros por status e busca por nome, cards de métricas, painel de timeline deslizante e exportação CSV.
- **Autenticação:** Login com validação de formulário reativo, simulação de JWT em localStorage e guard de rota.
- **Design System Dark:** Tema escuro consistente com variáveis CSS, paleta definida e override do tema Aura do PrimeNG.

## 🛠️ Tech Stack

* **Framework:** Angular 19 (NgModules, Lazy Loading, Reactive Forms)
* **UI Library:** PrimeNG 19.1 + PrimeIcons + PrimeFlex
* **Gráficos:** Chart.js 4
* **Testes Unitários:** Jasmine + Karma
* **Estilo:** SCSS com design system próprio (dark mode)
* **Arquitetura:** Modular por Feature com camada Shared e Core isolada

## 📂 Arquitetura do Projeto

O projeto segue uma estrutura modular focada em escalabilidade e separação de responsabilidades:

```text
src/app
├── core/                    # Singletons e configurações globais
│   ├── guards/              # AuthGuard — protege rotas privadas
│   ├── interceptors/        # AuthInterceptor — injeta Bearer token
│   └── services/            # AuthService — login/logout/estado
├── layout/                  # Shell da aplicação autenticada
│   ├── layout.component     # Sidebar + topbar + router-outlet
│   └── layout.module        # Roteamento filho com lazy loading
├── pages/                   # Telas da aplicação
│   ├── login/               # Tela de autenticação
│   ├── dashboard/           # Visão geral e métricas
│   ├── beneficios/          # CRUD de benefícios
│   ├── beneficio-detalhe/   # Detalhe + gráfico + tabs
│   ├── transferencia/       # Stepper de transferência
│   └── historico/           # Histórico com filtros e CSV
└── shared/                  # Reutilizáveis entre features
    ├── components/          # StatusBadge, MoneyDisplay
    ├── models/              # Interfaces TypeScript (Beneficio, Transferencia...)
    ├── pipes/               # BrlCurrencyPipe
    ├── services/            # BeneficioService, HistoricoService
    └── shared.module        # Barrel de exportações compartilhadas
```

## 📌 Decisões Técnicas

* **NgModules com Lazy Loading:** <br>Optei pelo modelo tradicional de NgModules em vez de Standalone Components para manter compatibilidade com o ecossistema PrimeNG 19 e garantir carregamento sob demanda de cada feature. O Angular carrega cada módulo (`DashboardModule`, `BeneficiosModule`, etc.) somente quando a rota é acessada, reduzindo o bundle inicial.

* **Gerenciamento de Estado com BehaviorSubject:** <br>O `HistoricoService` usa `BehaviorSubject<TransferenciaHistorico[]>` como fonte única de verdade do histórico de transferências. Qualquer componente que precisar do estado atual recebe um `Observable` via `historico$`, sem acoplamento direto entre componentes.

* **Persistência sem Backend:** <br>O backend não expõe endpoint de histórico. A solução foi um `HistoricoService` que persiste as transferências no `localStorage` sob a chave `finance_historico`. Isso permite que o histórico sobreviva a recarregamentos de página sem nenhuma dependência de servidor.

* **AuthInterceptor e Token Simulado:** <br>O `AuthInterceptor` injeta automaticamente o header `Authorization: Bearer <token>` em todas as requisições. O token é gerado via `btoa()` simulando um JWT, armazenado em localStorage. Essa arquitetura permite substituir a autenticação simulada por um servidor OAuth real sem alterar nenhum componente.

* **Tratamento Centralizado de Erros HTTP:** <br>O `BeneficioService` encapsula um `handleError` privado que converte os status HTTP (0, 404, 422, 5xx) em mensagens amigáveis em português antes de propagar o erro. Os componentes recebem apenas uma `Error` com `.message` legível, sem precisar conhecer a estrutura da resposta HTTP.

* **Stepper de Transferência com Validação de Saldo em Tempo Real:** <br>O `TransferenciaComponent` calcula o `valorError` e as funções `canGoStep2()` / `canGoStep3()` de forma síncrona com base no estado local, sem requisições adicionais ao backend. O saldo disponível é derivado da lista já carregada de benefícios, proporcionando feedback imediato ao usuário.

* **Componentes PrimeNG Atualizados:** <br>`p-calendar → p-datepicker`, `p-dropdown → p-select` — as mudanças refletem a evolução da biblioteca e maior aderência ao HTML semântico. O tema Aura é configurado via `providePrimeNG` com `darkModeSelector: '.app-dark'`, centralizado no `AppModule`.

* **BrlCurrencyPipe com `Math.abs`:** <br>O pipe formata valores monetários sempre como positivos por padrão, usando `Intl.NumberFormat` com locale `pt-BR`. O parâmetro `showSign` permite exibir `+` ou `-` explicitamente apenas quando necessário (ex: movimentações no detalhe do benefício).

* **`standalone: false` nos Componentes:** <br>O Angular 19 cria componentes standalone por padrão via CLI. Como o projeto usa NgModules, todos os componentes criados manualmente exigem `standalone: false` explícito no decorator `@Component`. Sem isso, o compilador não os reconhece como declarações de módulo e gera erros em tempo de build.

* **Testes com `NoopAnimationsModule`:** <br>Componentes que usam `p-stepper` ou outros elementos PrimeNG animados requerem `NoopAnimationsModule` nos testes. Sem ele, o Angular lança `NG05105: Unexpected synthetic property @content found`. A inclusão do módulo desabilita as animações sem afetar a lógica testada.
