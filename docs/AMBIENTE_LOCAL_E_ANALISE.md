# Ambiente Local e Análise — Repasse Rápido (Mobile)

> Documento gerado em 21/09/2026. Análise baseada no clone local em `/Users/karinavlima/repasse_rapido_app`, branch `main`.

---

## 1. Visão geral do aplicativo

**Repasse Rápido** é um marketplace mobile de veículos (com foco em repasses) publicado na Apple App Store. O app permite:

- Navegar e buscar anúncios de veículos (público, sem login)
- Autenticar-se (login, cadastro, recuperação de senha)
- Publicar anúncios em fluxo multi-step (6 etapas)
- Gerenciar anúncios próprios
- Editar perfil (Pessoa Física, Pessoa Jurídica ou Autônomo)
- Visualizar e vincular anúncios de PF (perfil PJ)
- Contato via WhatsApp com anunciantes

O app opera em **managed workflow Expo** (sem diretórios `ios/` e `android/` versionados) e utiliza **EAS Build** para geração de builds Android. A API backend é consumida via Axios com autenticação Bearer token.

---

## 2. Tecnologias e versões encontradas

| Componente | Versão |
|---|---|
| **Node.js** (`.nvmrc`) | `20.11.0` |
| **npm** (lockfile) | `10.2.4` (bundled com Node 20.11.0) |
| **Gerenciador de pacotes** | npm (`package-lock.json` presente) |
| **Expo SDK** | `~52.0.47` |
| **React** | `18.3.1` |
| **React Native** | `0.76.9` |
| **TypeScript** | `^5.1.3` (strict mode) |
| **Expo CLI** (via npx) | `0.22.26` |
| **App version** (`package.json`) | `2.3.0` |
| **App version** (`app.config.js`) | `1.0.0` ⚠️ inconsistência |
| **React Navigation** | v6 (native-stack + bottom-tabs) |
| **TanStack React Query** | v5 |
| **Axios** | v1.6.2 |
| **styled-components** | v6.1.1 |
| **react-hook-form + yup** | Formulários e validação |

### Configurações de instalação

- `.npmrc`: `legacy-peer-deps=true` (aplicado automaticamente pelo npm)
- `.nvmrc`: `20.11.0`

### Ambiente de execução (macOS)

| Ferramenta | Status |
|---|---|
| macOS | 26.6.2 (Apple Silicon arm64) |
| Git | 2.50.1 ✅ |
| NVM | v0.40.1 ✅ (instalado nesta sessão) |
| Node.js | 20.11.0 ✅ |
| npm | 10.2.4 ✅ |
| Xcode completo | ❌ Ausente (apenas Command Line Tools) |
| Watchman | ❌ Ausente (opcional) |

---

## 3. Estrutura de pastas

```
repasse_rapido_app/
├── index.js                    # Entry point → registerRootComponent(App)
├── app.config.js               # Configuração Expo (nome, plugins, bundle ID, extra)
├── eas.json                    # Perfis EAS Build (development, preview, production)
├── babel.config.js             # babel-preset-expo + module-resolver aliases
├── metro.config.js             # Config padrão Expo + extensões de fonte
├── tsconfig.json               # TypeScript strict + path aliases
├── react-native.config.js      # Linking de assets de fonte
├── package.json                # Dependências e scripts
├── package-lock.json           # Lockfile npm
├── .nvmrc                      # Node 20.11.0
├── .npmrc                      # legacy-peer-deps=true
├── .gitignore                  # node_modules, .env, ios/, android/, .expo/
├── assets/                     # Ícones, splash, favicon (raiz)
├── docs/
│   ├── build.txt               # Notas mínimas de build Android
│   └── AMBIENTE_LOCAL_E_ANALISE.md  # Este documento
└── src/
    ├── App.tsx                 # Providers + NavigationContainer externo
    ├── @types/                 # Declarações TypeScript (svg, png, styled-components)
    ├── assets/
    │   ├── fonts/              # Cabin, Montserrat, Ionicons, MaterialIcons
    │   ├── icons/              # ~100 ícones SVG/PNG/TSX
    │   └── images/             # Logos, cards de serviço, imagens UI
    ├── components/             # 25+ componentes reutilizáveis
    ├── context/
    │   ├── AuthContext.tsx     # Autenticação, token, signIn/signOut
    │   ├── HomeContext.tsx     # Dados da home
    │   ├── FiltersContext.tsx  # Filtros e busca (React Query)
    │   └── AdvertiseContext.tsx # Estado do fluxo de anúncio
    ├── hooks/                  # useAuth, useHome, useFilters, useBanners
    ├── lib/
    │   ├── api.ts              # Instância Axios (baseURL, timeout)
    │   ├── api-interceptors.ts # Refresh token automático
    │   └── storage/            # AsyncStorage helpers (token, user)
    ├── routes/
    │   ├── index.tsx           # Gate de loading + linking + NavigationContainer interno
    │   ├── app.routes.tsx      # Stack raiz + bottom tabs
    │   └── auth.routes.tsx     # Stack de autenticação
    ├── screens/                # Telas por feature (Auth, Home, Details, Advertise, etc.)
    ├── services/               # Módulos de API por domínio
    ├── theme/GlobalStyles.ts   # Estilos globais
    └── utils/                  # Máscaras, tipos, helpers
```

**Nota:** Diretórios `ios/` e `android/` estão no `.gitignore` — managed Expo workflow.

---

## 4. Arquitetura atual

### Camadas

```
┌─────────────────────────────────────────┐
│  App.tsx (Providers)                    │
│  QueryClient, AuthContext, HomeContext, │
│  FiltersContext, ToastProvider, Fonts   │
├─────────────────────────────────────────┤
│  NavigationContainer (externo)          │
├─────────────────────────────────────────┤
│  Routes/index.tsx                       │
│  Loading gate + Linking + NavContainer    │
│  (interno, independent=true)            │
├─────────────────────────────────────────┤
│  AppRoutes (Native Stack)               │
│  ├── AppTabs (Bottom Tabs)              │
│  │   ├── Home                           │
│  │   ├── Search (Stack: Results/Filter) │
│  │   ├── Sell (Stack: Advertise 6 steps)│
│  │   ├── Contact (WhatsApp redirect)    │
│  │   └── Menu                           │
│  ├── adDetails (modal)                  │
│  ├── moreInfo (modal)                   │
│  ├── myAccount, manageAds, viewPFAds    │
│  └── auth (Auth Stack)                  │
├─────────────────────────────────────────┤
│  Services (Axios) → API Backend         │
│  Context (estado local)                 │
│  React Query (cache servidor)           │
│  AsyncStorage (persistência auth)       │
└─────────────────────────────────────────┘
```

### Padrões identificados

- **Navegação:** React Navigation v6 com stack + tabs aninhados
- **Estado servidor:** TanStack React Query v5 (filtros, detalhes, listagens)
- **Estado local:** React Context (auth, home, filtros, anúncio)
- **Formulários:** react-hook-form + yup
- **Estilização:** styled-components v6
- **HTTP:** Axios com interceptors para refresh token
- **Persistência:** AsyncStorage (somente token e user)

### Observações arquiteturais

1. **Dois NavigationContainers** aninhados (`App.tsx` externo + `routes/index.tsx` interno com `independent={true}`)
2. **Auth não é gate de rota global** — usuários não autenticados podem navegar Home, Search e detalhes
3. **Guards em 3 camadas:** ProtectedRoute, tab listeners, useEffect inline
4. **Telas órfãs:** `Services`, `Transfers`, `Search` (standalone) existem mas não estão conectadas à navegação

---

## 5. Mapa de telas e navegação

### Fluxo de autenticação (Auth Stack)

```
login → register → registerSuccess
login → forgotPassword → forgotPasswordSuccess
createNewPassword (param: token)
```

| Tela | Arquivo | Descrição |
|---|---|---|
| Login | `screens/Auth/Login` | Email + senha → POST /login |
| Register | `screens/Auth/Register` | Cadastro PF/PJ/A (multipart) |
| RegisterSuccess | `screens/Auth/RegisterSuccess` | Confirmação de cadastro |
| ForgotPassword | `screens/Auth/ForgotPassword` | POST /recuperar_senha |
| ForgotPasswordSuccess | `screens/Auth/ForgotPasswordSuccess` | Confirmação envio |
| CreateNewPassword | `screens/Auth/CreateNewPassword` | POST /cadastrar_nova_senha |

### Bottom Tabs (acesso público parcial)

| Tab | Tela | Auth | Descrição |
|---|---|---|---|
| home | Home | Não | Listagem de anúncios + banners |
| search | SearchResults → Filter → Specifications | Não | Busca com filtros avançados |
| sell | Advertise Step1–6 → Success | **Sim** (oculto para tipo A) | Fluxo de publicação |
| contact | WhatsApp redirect | Não | Abre WhatsApp externo |
| menu | Menu | **Sim** | Menu do usuário logado |

### Stack raiz (modais e protegidas)

| Tela | Auth | Apresentação |
|---|---|---|
| adDetails (Details) | Parcial | Modal — detalhes do anúncio |
| moreInfo (MoreInfo) | Não | Modal — informações adicionais |
| myAccount (MyAccount) | **Sim** | Edição de perfil por tipo |
| manageAds (ManageAds) | **Sim** | Gerenciar anúncios próprios |
| viewPFAds (ViewPFAds) | **Sim** (PJ) | Vincular anúncios PF |
| auth (AuthRoutes) | Não | Stack de autenticação |

### Fluxo de anúncio (Advertise Stack — 6 steps)

```
advertiseHome → Step1 (dados veículo) → Step2 (detalhes) → Step3 (opcionais)
→ Step4 (fotos) → Step5 (contato/preço) → Step6 (revisão/publicar) → advertiseSuccess
+ selectOptions (modal)
```

### Deep Links configurados

**Prefixo:** `com.repasserapido.client:`

| Path | Destino |
|---|---|
| `home`, `search`, `sell`, `contact`, `menu` | Tabs |
| `anuncio/:code` | adDetails |
| `auth` | Auth stack |
| `myAccount`, `manageAds`, `viewPFAds` | Stack raiz |

**Não linkado:** `createNewPassword` (reset de senha)

### Telas órfãs (não conectadas)

- `screens/Search/index.tsx` — busca standalone
- `screens/Services/index.tsx` — serviços
- `screens/Transfers/index.tsx` — repasses (restrito a PJ)
- `components/DebugScreen/index.tsx` — debug

---

## 6. Principais funcionalidades

### Por perfil de usuário

| Funcionalidade | PF | PJ | A (Autônomo) |
|---|---|---|---|
| Navegar/buscar anúncios | ✅ | ✅ | ✅ |
| Ver detalhes + contato | ✅* | ✅* | ✅* |
| Publicar anúncio (tab sell) | ✅ | ✅ | ❌ (tab oculta) |
| Gerenciar anúncios | ✅ | ✅ | ❌ |
| Vincular anúncios PF | ❌ | ✅ | ❌ |
| Editar perfil | ✅ | ✅ | ✅ |
| Seleção de plano na publicação | ❌ | ✅ | ✅ |

*Contato (ligar/WhatsApp) requer autenticação inline.

### Funcionalidades confirmadas no código

1. **Home** — carrega anúncios via `GET /cliente/home` + banners rotativos
2. **Busca avançada** — filtros por marca, modelo, cor, estado, cidade, câmbio, combustível, opcionais
3. **Detalhes do anúncio** — fotos, specs, comentários/avaliações, contato
4. **Cadastro multi-tipo** — PF (individual), PJ (repassador), A (autônomo) com upload de documentos
5. **Publicação de anúncio** — 6 steps com upload de fotos (base64 → multipart)
6. **Gerenciamento** — listar, marcar como vendido
7. **Minha conta** — edição de dados por tipo com CEP lookup (ViaCEP)
8. **Token refresh** — automático via interceptor quando expirado
9. **WhatsApp** — contato direto com número fixo + fallback wa.me

---

## 7. APIs e integrações

### API Backend (Axios)

**Base URL:** resolvida em cascata:
1. `process.env.API_URL_PROD`
2. `Constants.expoConfig.extra.apiUrl`
3. Fallback hardcoded: `https://api-repasses.arietedigital.com.br/api`

**Timeout:** 10s (60s para salvar anúncio)

### Endpoints consumidos

| Método | Endpoint | Contexto |
|---|---|---|
| POST | `/login` | Autenticação |
| POST | `/refresh` | Refresh token |
| POST | `/cadastrar` | Registro (multipart) |
| POST | `/recuperar_senha` | Esqueci senha |
| POST | `/cadastrar_nova_senha` | Nova senha |
| GET | `/cliente/home` | Home |
| GET | `/cliente/banners_by_type` | Banners |
| GET | `/cliente/anuncios/detalhe` | Detalhes |
| GET | `/cliente/anuncios/obter_dados_anunciante` | Dados anunciante |
| POST | `/cliente/anuncios/filtrar` | Busca/filtros |
| POST | `/cliente/anuncios/salvar_avaliacao` | Comentários |
| GET | `/cliente/anuncios/lista_anuncios_vincular` | Anúncios PF (PJ) |
| POST | `/cliente/anuncios/publicar_anuncio` | Publicar |
| GET | `/cliente/listagem/*` | Marcas, modelos, cores, estados, cidades, câmbio, combustível, opcionais |
| GET | `/cliente/minha_conta/obter` | Perfil |
| POST | `/cliente/minha_conta/salvar` | Salvar perfil |
| GET | `/cliente/meus_anuncios` | Meus anúncios |
| POST | `/cliente/meus_anuncios/marcar_vendido` | Marcar vendido |
| GET | `/cliente/meus_anuncios/obter_info_parametros` | Parâmetros anúncio |
| GET | `/cliente/meus_anuncios/detalhes` | Detalhes para edição |
| POST | `/cliente/meus_anuncios/obter_info_veiculo` | Info veículo (placa) |
| POST | `/cliente/meus_anuncios/salvar` | Salvar anúncio |

### Integrações externas

| Serviço | URL | Uso |
|---|---|---|
| ViaCEP | `https://viacep.com.br/ws/{cep}/json/` | Auto-preenchimento de endereço |
| WhatsApp | `whatsapp://send?phone=5517982109999` | Contato (com fallback wa.me) |

---

## 8. Variáveis de ambiente necessárias

| Variável | Onde definida | Onde usada | Impacto se ausente |
|---|---|---|---|
| `API_URL_PROD` | `app.config.js`, `eas.json` | `app.config.js` → `extra.apiUrl`; `src/lib/api.ts` → `baseURL` | Usa fallback hardcoded em `app.config.js` |
| `NODE_ENV` | `eas.json` (build) | Apenas EAS build | Sem impacto local |
| `EXPO_NO_DEV` | `eas.json` preview | Apenas EAS build | Sem impacto local |
| `EXPO_OFFLINE` | `eas.json` preview | Apenas EAS build | Sem impacto local |

### Observações

- `dotenv` está nas dependências mas **nunca é importado** no código
- `.env` e `.env*.local` estão no `.gitignore`
- Não existe `.env.example` no repositório
- Para desenvolvimento local, a API funciona com o fallback hardcoded — **não é necessário criar `.env`**

---

## 9. Como instalar o projeto do zero

### Pré-requisitos

1. **macOS** (Apple Silicon ou Intel)
2. **Git** — `git --version`
3. **NVM** — instalar pelo procedimento oficial:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

4. Recarregar o shell:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

### Instalação

```bash
# 1. Clonar
git clone https://github.com/ariete-digital/repasse_rapido_app.git
cd repasse_rapido_app

# 2. Ativar Node correto
nvm install 20.11.0
nvm use 20.11.0
node --version   # v20.11.0
npm --version    # 10.2.4

# 3. Instalar dependências (respeita lockfile + .npmrc)
npm ci
```

**Nota:** Se o NVM falhar ao carregar dentro de um diretório com `.nvmrc` (antes de instalar a versão), execute os comandos `nvm install` a partir de `/tmp` ou outro diretório sem `.nvmrc`.

---

## 10. Como executar localmente

```bash
cd repasse_rapido_app
nvm use 20.11.0
npm start -- --clear
```

O Metro Bundler inicia em **http://localhost:8081**.

### Opções de execução

| Método | Requisito | Comando |
|---|---|---|
| Expo Go (iPhone físico) | Expo Go compatível com SDK 52 | Escanear QR Code no terminal |
| Simulador iOS | Xcode completo instalado | Pressionar `i` no terminal Expo |
| Emulador Android | Android Studio | Pressionar `a` no terminal Expo |
| Web | Navegador | Pressionar `w` no terminal Expo |

### Status atual (21/09/2026)

- ✅ Metro Bundler rodando em `http://localhost:8081`
- ❌ Simulador iOS indisponível (Xcode completo não instalado)
- ⏳ Teste via Expo Go no iPhone físico é a opção recomendada

---

## 11. Como testar no iPhone

### Opção 1: Expo Go (recomendada para SDK 52)

1. Instalar **Expo Go** na App Store (versão compatível com SDK 52)
2. Garantir que iPhone e Mac estão na **mesma rede Wi-Fi**
3. Executar `npm start -- --clear`
4. Escanear o QR Code exibido no terminal com a câmera do iPhone
5. O app abrirá no Expo Go

**Limitação:** Se o app usar módulos nativos não suportados pelo Expo Go, será necessário um development build (`eas build --profile development`).

### Opção 2: Simulador iOS (requer Xcode)

1. Instalar Xcode completo via App Store
2. Aceitar licença: `sudo xcodebuild -license accept`
3. Verificar: `xcode-select -p` deve apontar para `/Applications/Xcode.app/...`
4. Executar `npm start -- --clear` e pressionar `i`

### Opção 3: Development Build

Se Expo Go não suportar algum módulo nativo:

```bash
npx eas build --profile development --platform ios
```

**⚠️ Requer autorização** — gera diretórios nativos e altera configurações estruturais.

---

## 12. Scripts disponíveis

| Script | Comando | Descrição | Seguro para dev? |
|---|---|---|---|
| `start` | `expo start` | Inicia Metro Bundler | ✅ |
| `android` | `expo run:android` | Build + run Android nativo | ⚠️ Requer Android Studio |
| `ios` | `expo run:ios` | Build + run iOS nativo | ⚠️ Requer Xcode |
| `web` | `expo start --web` | Inicia versão web | ✅ |
| `build:android:apk` | `eas build -p android --profile preview` | Build APK via EAS | ❌ Build remoto |
| `build:android:aab` | `eas build -p android --profile production` | Build AAB via EAS | ❌ Build remoto |
| `build:android:apk:local` | `eas build ... --local` | Build APK local | ❌ Build local |
| `build:android:aab:local` | `eas build ... --local` | Build AAB local | ❌ Build local |
| `bump:app:version` | `eas build:version:set` | Altera versão remota | ❌ Altera EAS |

**Scripts seguros para validação local:** apenas `start` e `web`.

---

## 13. Problemas encontrados

### Bloqueios (impedem funcionalidade)

| # | Problema | Impacto | Correção sugerida |
|---|---|---|---|
| — | Nenhum bloqueio de execução | — | — |

### Alertas (não impedem execução)

| # | Problema | Severidade | Ação |
|---|---|---|---|
| 1 | **TypeScript errors** em `CarouselBanners/index.tsx` (linhas 115, 142) | Média | Erros de sintaxe TS — não impedem Metro Bundler |
| 2 | **Peer dependency ausente:** `react-dom` (requerido por styled-components) | Baixa | Instalar com `npx expo install react-dom` se necessário |
| 3 | **expo@52.0.47** — versão esperada `~52.0.49` | Baixa | Atualização futura, não crítica |
| 4 | **Inconsistência de versão:** package.json `2.3.0` vs app.config.js `1.0.0` | Info | Documentar, não corrigir agora |
| 5 | **43 vulnerabilidades npm** (1 low, 18 moderate, 21 high, 3 critical) | Info | Não executar `npm audit fix` sem autorização |
| 6 | **Auth route name mismatch:** `initialRouteName="Login"` vs screen `"login"` | Baixa | Pode causar tela inicial incorreta no auth stack |
| 7 | **Dois NavigationContainers** aninhados | Info | Padrão existente, monitorar comportamento |
| 8 | **Telas órfãs** (Services, Transfers, Search standalone) | Info | Código morto, não afeta funcionalidade |
| 9 | **expo-doctor** requer Node >=20.19.4 (projeto usa 20.11.0) | Info | Versão fixada pelo `.nvmrc` — respeitar |
| 10 | **401 handler** stubbed (bloco vazio) em api.ts e interceptors | Info | Sessão expirada não redireciona automaticamente |

### Legado / design decisions

- `NSAllowsArbitraryLoads: true` — permite HTTP não seguro no iOS
- Tokens armazenados em AsyncStorage (não criptografado)
- Password reset URL usa scheme Expo (`exp://`) em vez de universal link
- Campo `role` em UserDTO definido mas nunca usado — `tipo` governa tudo
- `dotenv` nas dependências mas nunca importado

---

## 14. Limitações do ambiente

| Limitação | Status | Workaround |
|---|---|---|
| **Xcode completo ausente** | ❌ | Instalar manualmente via App Store |
| **Simulador iOS indisponível** | ❌ | Usar Expo Go no iPhone físico |
| **Watchman ausente** | ⚠️ Opcional | Instalar se Metro Bundler ficar lento: `brew install watchman` |
| **Sem perfil iOS no eas.json** | Info | Builds iOS não configurados no EAS (apenas Android APK) |
| **Sem .env.example** | Info | Fallback hardcoded funciona para dev |
| **Node 20.11.0 vs expo-doctor >=20.19.4** | Info | Respeitar `.nvmrc` do projeto |

---

## 15. Dependências críticas

### Runtime (app não funciona sem)

| Pacote | Versão | Função |
|---|---|---|
| `expo` | ~52.0.47 | Framework |
| `react` / `react-native` | 18.3.1 / 0.76.9 | UI |
| `@react-navigation/native` + stacks/tabs | ^6.x | Navegação |
| `axios` | ^1.6.2 | HTTP client |
| `@tanstack/react-query` | ^5.14.1 | Cache servidor |
| `@react-native-async-storage/async-storage` | 1.23.1 | Persistência auth |
| `react-hook-form` + `yup` | ^7.x / ^1.x | Formulários |
| `styled-components` | ^6.1.1 | Estilização |
| `expo-image-picker` | ~16.0.6 | Upload de fotos |
| `expo-document-picker` | ~13.0.3 | Upload de documentos |
| `expo-font` | ~13.0.4 | Fontes customizadas |
| `react-native-gesture-handler` | ~2.20.2 | Gestos (obrigatório RN) |
| `react-native-screens` | ~4.4.0 | Telas nativas |
| `react-native-safe-area-context` | 4.12.0 | Safe area |

### Build (EAS)

| Pacote/Config | Função |
|---|---|
| `eas.json` profiles | Build Android APK |
| `app.config.js` → `extra.eas.projectId` | Identificação EAS |
| `app.config.js` → `owner: "repasse-rapido"` | Conta Expo |

---

## 16. Cuidados relacionados ao Expo/EAS

### NÃO fazer nesta fase

- ❌ Atualizar Expo SDK, React Native ou dependências
- ❌ Executar `eas build`, `eas submit` ou `eas update`
- ❌ Alterar `projectId`, `owner`, `bundleIdentifier` ou `package`
- ❌ Modificar perfis de build no `eas.json`
- ❌ Gerar diretórios `ios/` ou `android/` (development build)
- ❌ Alterar certificados ou perfis de provisionamento
- ❌ Fazer commit, push ou publicar qualquer versão
- ❌ Executar `npm audit fix` ou `npm update`
- ❌ Remover ou alterar o `package-lock.json`

### Configurações EAS preservadas

| Config | Valor |
|---|---|
| Owner | `repasse-rapido` |
| Project ID | `2b0cf35b-cdb7-43fa-8bf1-bd294cb41b9a` |
| Bundle ID (iOS) | `com.repasserapido.client` |
| Package (Android) | `com.repasserapido.client` |
| App Version Source | `remote` |
| Build profiles | development, preview, production (Android APK) |

### Compatibilidade Expo Go

- **SDK 52** é suportado pelo Expo Go atual
- Módulos nativos usados (image-picker, document-picker, font) são compatíveis
- Se algum módulo falhar no Expo Go, considerar development build (com autorização)

---

## 17. Próximos passos recomendados

### Imediato (para testar no iPhone)

1. **Instalar Xcode completo** via App Store (para simulador iOS)
2. **Testar via Expo Go** no iPhone físico (QR Code do Metro Bundler)
3. **Solicitar credenciais** se necessário testar fluxos autenticados em staging

### Curto prazo (com autorização)

4. Corrigir erros TypeScript em `CarouselBanners/index.tsx`
5. Instalar peer dependency `react-dom` se styled-components causar crash
6. Avaliar inconsistência de versão (package.json vs app.config.js)
7. Conectar telas órfãs (Services, Transfers) ou removê-las
8. Corrigir `initialRouteName` mismatch no auth stack

### Médio prazo (planejamento)

9. Configurar perfil iOS no `eas.json` se builds iOS forem necessários
10. Criar `.env.example` documentando variáveis
11. Avaliar vulnerabilidades npm (sem auto-fix)
12. Considerar criptografia de tokens no AsyncStorage
13. Implementar handler 401 (redirect para login)
14. Adicionar deep link para `createNewPassword`

---

## Entrega final

### Status do clone

| Item | Valor |
|---|---|
| Diretório | `/Users/karinavlima/repasse_rapido_app` |
| Remote | `https://github.com/ariete-digital/repasse_rapido_app.git` |
| Branch | `main` (up to date with origin/main) |
| Último commit | `c48d323` — fix: change require register fields |
| Branches remotas | `main`, `expo-link-andrehf8` |
| Working tree | clean |

### Versões detectadas

| Ferramenta | Versão |
|---|---|
| Node.js | v20.11.0 |
| npm | 10.2.4 |
| NVM | v0.40.1 |
| Expo CLI | 0.22.26 |
| Expo SDK | ~52.0.47 |

### Status da instalação

✅ `npm ci` concluído com sucesso — 1061 pacotes instalados

### Status da execução local

✅ Metro Bundler rodando em **http://localhost:8081**

### Forma recomendada de testar

1. **Expo Go no iPhone físico** — escanear QR Code (mesma rede Wi-Fi)
2. Após instalar Xcode — simulador iOS via tecla `i`

### Variáveis pendentes

Nenhuma variável obrigatória para desenvolvimento local. A API usa fallback hardcoded.

### Arquivos criados ou modificados

| Arquivo | Ação |
|---|---|
| `docs/AMBIENTE_LOCAL_E_ANALISE.md` | **Criado** (este documento) |

Nenhum outro arquivo do projeto foi modificado.

### Resumo funcional

O **Repasse Rápido** é um marketplace mobile de veículos com 3 perfis de usuário (PF, PJ, Autônomo), navegação por tabs + stacks, autenticação JWT com refresh automático, busca avançada com filtros, publicação de anúncios em 6 etapas com upload de fotos, e integração com WhatsApp para contato. Opera em managed Expo workflow com builds Android via EAS.

### Comando para reiniciar o projeto

```bash
cd /Users/karinavlima/repasse_rapido_app
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm use 20.11.0
npm start -- --clear
```
