# Frontend — FinanceApp

Interface Angular 19 + PrimeNG 19 para gestão de benefícios e transferências.

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 18+           |
| npm        | 9+            |
| Angular CLI| 19+           |

## Como rodar

### 1. Backend (Spring Boot)

```bash
cd backend-module
mvn spring-boot:run
```

O backend sobe em **http://localhost:8080**. H2 Console em `/h2-console`.

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

Acesse **http://localhost:4200**

### Login padrão

| Campo   | Valor      |
|---------|------------|
| Usuário | `admin`    |
| Senha   | `admin123` |

## Rotas disponíveis

| Rota               | Descrição                               |
|--------------------|-----------------------------------------|
| `/login`           | Tela de autenticação                    |
| `/beneficios`      | CRUD completo de benefícios             |
| `/beneficios/:id`  | Detalhe + transferências do benefício   |
| `/transferencia`   | Transferência em 3 etapas (stepper)     |
| `/historico`       | Histórico de transferências da sessão   |

## Estrutura de pastas

```
src/app/
├── core/
│   ├── guards/        auth.guard.ts
│   ├── interceptors/  auth.interceptor.ts
│   └── services/      auth.service.ts
├── shared/
│   ├── models/        beneficio.model.ts
│   ├── services/      beneficio.service.ts, historico.service.ts
│   ├── components/    money-display/, status-badge/
│   └── pipes/         brl-currency.pipe.ts
├── layout/            Sidebar 240px + Topbar 56px
└── pages/
    ├── login/
    ├── beneficios/
    ├── transferencia/
    ├── beneficio-detalhe/
    └── historico/
```

## Tecnologias

- **Angular 19** — NgModules + lazy loading em todas as rotas de página
- **PrimeNG 19** — Select, Stepper, Tabs, Table, Dialog, Chart, Timeline…
- **PrimeFlex 4** — utilitários CSS
- **Design System dark** — bg `#0A0E1A`, accent `#00D4FF`
- **DM Sans** (corpo) + **DM Mono** (valores monetários via Google Fonts)

## Executar testes

```bash
ng test
```

Cobertos: `AuthService` (login/logout), `AuthGuard` (redirect), `BeneficioService` (sucesso/404/500/422/transferir) e `TransferenciaComponent` (validação de saldo insuficiente, atalhos de %).

## Decisões de arquitetura

| Decisão | Justificativa |
|---------|---------------|
| AuthService com localStorage | Estruturado para plugar JWT real sem alterar chamadas existentes |
| HistoricoService com localStorage | Backend não possui endpoint de histórico; persiste por sessão |
| Anti-deadlock no Service Angular | Validação de saldo no frontend antes de enviar — evita roundtrip desnecessário; backend também valida |
| Zero `any` | Todos os modelos tipados via interfaces em `beneficio.model.ts` |
| Lazy loading | Cada página em módulo separado — bundle inicial mínimo |
