# 💰 FinanceApp

![Angular](https://img.shields.io/badge/Angular-19.2-dd0031?style=flat&logo=angular&logoColor=dd0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)
![PrimeNG](https://img.shields.io/badge/PrimeNG-19.1-17202C?style=flat&logo=primefaces&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat&logo=reactivex&logoColor=B7178C)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Karma](https://img.shields.io/badge/Karma-6.4-3DDC84?style=flat&logo=jasmine&logoColor=47D687)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat&logo=springboot&logoColor=white)
![JUnit](https://img.shields.io/badge/JUnit-5-25A162?style=flat&logo=junit5&logoColor=white)

## 🎯 Teste Integrado — Sistema de Gestão de Benefícios

**Objetivo Central**: Construir um sistema fullstack de gestão de benefícios financeiros, composto por uma API REST Spring Boot e um frontend Angular 19 com PrimeNG.

🔍 **Competências Avaliadas**:

1. Reatividade e Validações (Reactive Forms + PrimeNG)
2. Integração com API REST (HttpClient + Interceptors)
3. Componentização e Reuso
4. Gerenciamento de Estado com RxJS (BehaviorSubject)
5. Observabilidade e Feedbacks ao Usuário
6. Testes Automatizados (Jasmine/Karma + JUnit/Mockito)
7. Design System com Dark Mode

🧠 **Resolução**: <p>Sistema fullstack de gestão de benefícios financeiros. O backend foi desenvolvido com Spring Boot 3, Spring Data JPA e H2, implementando locking pessimista e versionamento otimista para transferências seguras e livres de deadlock. O frontend foi desenvolvido com Angular 19 e PrimeNG 19, aplicando arquitetura modular, controle de estado reativo via RxJS e persistência de histórico em localStorage. O projeto inclui 111 testes automatizados (42 no backend + 69 no frontend).</p>

---

# 📦 Backend

## 🛠️ Tecnologias

- Java 17
- Spring Boot 3.2.5
- Spring Data JPA + Hibernate
- H2 Database (em memória)
- Bean Validation (jakarta.validation)
- SpringDoc OpenAPI 2.3 (Swagger UI)
- JUnit 5 + Mockito + MockMvc

## 📁 Estrutura do Projeto

```text
backend-module/src/main/java/com/example/backend/
├── controller/       # Endpoints REST
├── dto/              # BeneficioRequest, BeneficioResponse, TransferenciaRequest
├── entity/           # Beneficio com @Version (optimistic locking)
├── exception/        # BeneficioNotFoundException, SaldoInsuficienteException, GlobalExceptionHandler
├── repository/       # BeneficioRepository com @Lock(PESSIMISTIC_WRITE)
├── service/          # Regras de negócio e anti-deadlock
└── config/           # CorsConfig (CorsFilter bean)
```

## ▶️ Como rodar o Backend

### Pré-requisitos

- Java 17 ou superior
- Maven instalado
- IntelliJ IDEA (recomendado)

### Opção 1 — Pelo IntelliJ IDEA (recomendado)

1. Abra o IntelliJ → **File > Open**
2. Selecione o arquivo `pom.xml` dentro de `backend-module/`
3. Clique em **Open as Project**
4. Aguarde o Maven baixar as dependências
5. Vá em **File > Settings > Build, Execution, Deployment > Build Tools > Maven > Runner**
6. Marque ✅ **Delegate IDE build/run actions to Maven** → **Apply > OK**
7. Abra `BackendApplication.java` e clique em ▶️

> ✅ O projeto está rodando quando aparecer no console:
> ```
> Started BackendApplication in X seconds
> ```

### Opção 2 — Pelo terminal

```bash
cd backend-module
mvn spring-boot:run
```

## 🌐 Endpoints disponíveis

Base URL: `http://localhost:8080/api/v1/beneficios`

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/v1/beneficios` | Lista todos os benefícios |
| GET | `/api/v1/beneficios/{id}` | Busca por ID |
| POST | `/api/v1/beneficios` | Cria novo benefício |
| PUT | `/api/v1/beneficios/{id}` | Atualiza um benefício |
| DELETE | `/api/v1/beneficios/{id}` | Remove um benefício |
| POST | `/api/v1/beneficios/transferencia` | Transfere valor entre benefícios |

## 🗄️ Console do banco H2

```
http://localhost:8080/h2-console
```

| Campo | Valor |
|-------|-------|
| JDBC URL | `jdbc:h2:mem:beneficiodb` |
| Username | `sa` |
| Password | *(deixar em branco)* |

## 🧪 Rodando os testes do Backend

```bash
cd backend-module
mvn test
```

**Cobertura atual: 42 testes — 0 falhas**

| Suite | Testes |
|---|---|
| `BeneficioServiceTest` — unitários com Mockito | 15 |
| `BeneficioControllerTest` — MockMvc standalone | 16 |
| `BeneficioRepositoryTest` — integração com H2 | 11 |

## 🔁 Exemplos de requisições

### Criar benefício
```bash
curl -X POST http://localhost:8080/api/v1/beneficios \
  -H "Content-Type: application/json" \
  -d '{"nome":"Benefício Teste","descricao":"Desc","valor":500.00,"ativo":true}'
```

### Transferir valor
```bash
curl -X POST http://localhost:8080/api/v1/beneficios/transferencia \
  -H "Content-Type: application/json" \
  -d '{"fromId":1,"toId":2,"valor":100.00}'
```

## 🚨 Solução de problemas comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Port 8080 was already in use` | Porta ocupada | Adicione `server.port=8081` no `application.properties` |
| `Table not found` | `schema.sql` não executado | Verifique `spring.sql.init.mode=always` no `application.properties` |
| `Output directory is not specified` | IntelliJ compilando sem Maven | Marque **Delegate IDE build/run actions to Maven** nas configurações |
| SDK não definido | Java não configurado no IntelliJ | **File > Project Structure > SDK > Download JDK 17** |

---

# 🖥️ Frontend

## 🛠️ Tecnologias

* **Framework:** Angular 19 (Standalone Components, Lazy Loading, Reactive Forms)
* **UI Library:** PrimeNG 19.1 + PrimeIcons + PrimeFlex
* **Gráficos:** Chart.js 4
* **Testes Unitários:** Jasmine + Karma
* **Estilo:** SCSS com design system próprio — tema **Cyberpunk** (dark mode)
* **Arquitetura:** Standalone por Feature com camada Shared e Core isolada

## 📋 Pré-requisitos

* Node.js 18+
* npm

  ```sh
  npm install npm@latest -g
  ```

* Angular CLI 19

  ```sh
  npm install -g @angular/cli@19
  ```

* Backend rodando em `http://localhost:8080` (ver seção Backend acima)

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

## ▶️ Rode o Frontend

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

## 🧪 Rodando os testes do Frontend

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

## 📂 Arquitetura do Projeto

```text
src/app
├── core/                    # Singletons e configurações globais
│   ├── guards/              # AuthGuard — protege rotas privadas
│   ├── interceptors/        # AuthInterceptor — injeta Bearer token
│   └── services/            # AuthService — login/logout/estado
├── layout/                  # Shell da aplicação autenticada
│   └── layout.component     # Sidebar + topbar + router-outlet (standalone)
├── pages/                   # Telas da aplicação (todas standalone)
│   ├── login/               # Tela de autenticação
│   ├── dashboard/           # Visão geral e métricas
│   ├── beneficios/          # CRUD de benefícios
│   ├── beneficio-detalhe/   # Detalhe + gráfico + tabs
│   ├── transferencia/       # Stepper de transferência
│   └── historico/           # Histórico com filtros e CSV
└── shared/                  # Reutilizáveis entre features (todos standalone)
    ├── components/          # StatusBadge, MoneyDisplay
    ├── models/              # Interfaces TypeScript (Beneficio, Transferencia...)
    ├── pipes/               # BrlCurrencyPipe
    └── services/            # BeneficioService, HistoricoService
```

## 📌 Decisões Técnicas

* **Standalone Components com Lazy Loading:** <br>O projeto segue o padrão padrão do Angular 19 com Standalone Components. Não há `NgModule` na aplicação — cada componente, pipe e diretiva declara seus próprios `imports`. O bootstrap é feito via `bootstrapApplication` com `provideRouter(routes)`, e cada rota usa `loadComponent` para carregamento sob demanda, reduzindo o bundle inicial.

* **Gerenciamento de Estado com BehaviorSubject:** <br>O `HistoricoService` usa `BehaviorSubject<TransferenciaHistorico[]>` como fonte única de verdade do histórico de transferências. Qualquer componente que precisar do estado atual recebe um `Observable` via `historico$`, sem acoplamento direto entre componentes.

* **Persistência sem Backend:** <br>O backend não expõe endpoint de histórico. A solução foi um `HistoricoService` que persiste as transferências no `localStorage` sob a chave `finance_historico`. Isso permite que o histórico sobreviva a recarregamentos de página sem nenhuma dependência de servidor.

* **AuthInterceptor e Token Simulado:** <br>O `AuthInterceptor` injeta automaticamente o header `Authorization: Bearer <token>` em todas as requisições. O token é gerado via `btoa()` simulando um JWT, armazenado em localStorage. Essa arquitetura permite substituir a autenticação simulada por um servidor OAuth real sem alterar nenhum componente.

* **Tratamento Centralizado de Erros HTTP:** <br>O `BeneficioService` encapsula um `handleError` privado que converte os status HTTP (0, 404, 422, 5xx) em mensagens amigáveis em português antes de propagar o erro. Os componentes recebem apenas uma `Error` com `.message` legível, sem precisar conhecer a estrutura da resposta HTTP.

* **Stepper de Transferência com Validação de Saldo em Tempo Real:** <br>O `TransferenciaComponent` calcula o `valorError` e as funções `canGoStep2()` / `canGoStep3()` de forma síncrona com base no estado local, sem requisições adicionais ao backend. O saldo disponível é derivado da lista já carregada de benefícios, proporcionando feedback imediato ao usuário.

* **Componentes PrimeNG Atualizados:** <br>`p-calendar → p-datepicker`, `p-dropdown → p-select` — as mudanças refletem a evolução da biblioteca e maior aderência ao HTML semântico. O tema Aura é configurado via `providePrimeNG` com `darkModeSelector: '.app-dark'`, centralizado no `bootstrapApplication` em `main.ts`.

* **BrlCurrencyPipe com `Math.abs`:** <br>O pipe formata valores monetários sempre como positivos por padrão, usando `Intl.NumberFormat` com locale `pt-BR`. O parâmetro `showSign` permite exibir `+` ou `-` explicitamente apenas quando necessário (ex: movimentações no detalhe do benefício).

* **Guard e Interceptor Funcionais:** <br>O `AuthGuard` é implementado como `CanActivateFn` e o `AuthInterceptor` como `HttpInterceptorFn` — o padrão funcional do Angular 19, sem classes e sem `@Injectable`. O interceptor é registrado via `provideHttpClient(withInterceptors([authInterceptor]))` no bootstrap, eliminando o token legado `HTTP_INTERCEPTORS`.

* **Testes com `NoopAnimationsModule`:** <br>Componentes que usam `p-stepper` ou outros elementos PrimeNG animados requerem `NoopAnimationsModule` nos testes. Sem ele, o Angular lança `NG05105: Unexpected synthetic property @content found`. A inclusão do módulo desabilita as animações sem afetar a lógica testada.

* **Design System Cyberpunk:** <br>O frontend adota um visual **cyberpunk** com paleta escura (fundo `#030c18`), detalhes em ciano (`#00e5ff`) e magenta (`#d946ef`), tipografia técnica via fonte `Rajdhani`, bordas com glow neon e elementos decorativos como barcodes e sparklines SVG inline. O tema é aplicado globalmente via variáveis CSS no `styles.scss` e sobrescreve o tema Aura do PrimeNG, mantendo coerência visual em todos os componentes.
