# 📄 Product Requirements Document (PRD)
**Projeto:** PRO Elite - 1000 Maratonas até 2030  
**Versão:** 1.0.0 (Release Candidate)  
**Stack Tecnológica:** Astro, Tailwind CSS v4, Vanilla JavaScript  
**Fonte da Verdade de Design:** Figma  

---

## 1. Visão Geral do Produto
O projeto "PRO Elite" é uma landing page de alta performance focada em exibir dados, rankings e estatísticas dos atletas da assessoria esportiva. O grande diferencial do produto é a capacidade de gerar cards personalizados de performance (imagens renderizadas no client-side) para que os atletas possam compartilhar suas conquistas nas redes sociais.

## 2. Arquitetura e Regras Globais
Para manter a consistência extrema em todo o projeto, as seguintes regras arquiteturais devem ser rigorosamente seguidas:

### 2.1. Regra de Ouro do Container (Box Model)
* O layout foi projetado para uma largura de conteúdo de `1216px` com margens de segurança no mobile de `32px` (`px-8`).
* Para evitar que o `box-sizing: border-box` esprema o conteúdo com o uso do Flexbox/Grid, o container principal de **todas as seções** (exceto fundos fluidos) deve usar a classe exata:  
  `<div class="max-w-[1280px] mx-auto px-8 w-full">`

### 2.2. Vertical Rhythm (Espaçamentos)
* **Distância Padrão entre Seções:** `112px` (usando `py-[112px]`).
* **Hero Section (Exceção):** Possui padding mais contido para centralizar o foco inicial: `py-[80px]` (80px no topo e 80px na base).

### 2.3. Design System & Interatividade (UI/UX)
* **Cores Principais:** Amarelo PRO Elite (`#FCBE2B`), Preto (`#010101`), Branco (`#FEFEFE`).
* **Tipografia:** Inter.
* **Hovers:** * Botões de ação principais e paginação: Fundo `#FCBE2B`, texto e borda `#010101`.
  * Elementos selecionados/ativos em filtros: Pílula (background) amarela `#FCBE2B` cobrindo 100% da área, com texto preto.
  * Links simples de texto ("Ver histórico"): `cursor-pointer` e hover com opacidade (ex: `#FCBE2B/50` ou amarelado padrão).
* **Comportamento Accordion:** Em listas ou grids (como o Ranking), a expansão de detalhes de um item ("Ver histórico completo") deve ser **estritamente isolada**. Abertura de um card não deve afetar ou abrir os cards vizinhos.

---

## 3. Estrutura de Componentes

### 3.1. `Layout.astro` (SEO e Base)
* **SEO e Meta Tags:** Título padronizado, Meta Description inserida, e tags Open Graph (OG) configuradas para compartilhamento rico (WhatsApp, LinkedIn, etc.).
* **Favicon:** Configurado para usar a logo oficial da assessoria (`/favicon.svg` ou `/favicon.png`).
* **Acessibilidade (a11y):** O framework base exige `alt` dinâmicos em todas as imagens e `aria-labels` em botões iconográficos.

### 3.2. `Hero.astro`
* Primeira dobra do site. Respeita o padding `py-[80px]`.
* Tipografia responsiva (textos reduzem em telas menores, ex: `text-4xl md:text-6xl`).

### 3.3. `MarqueeBanner.astro`
* Faixa rotativa animada.
* **Conteúdo estrito:** "se não há desafio, não há transformação! ✦" (Renderizado obrigatoriamente em `lowercase` e peso `font-medium`).

### 3.4. `Stats.astro`
* Cards brancos de estatísticas globais da equipe. Extraído fielmente do Figma mantendo larguras, bordas e box-shadows.

### 3.5. `Ranking.astro` (Componente Core)
A interface de dados interativa. Exibe a lista paginada dos atletas.

#### 3.5.1. Regras de Dados (Mock Data)
* O array estático inicial contém 24 atletas para viabilizar testes de paginação.
* **Treinadores Oficiais:** A única lista aceita para o atributo treinador é: **Felipe, Giuliano, Nestor, Gisele, Fábio**. Nomes fora dessa lista são inválidos.
* **Badges Validados:** "Lenda PRO", "Ouro Elite", "Top 3 Geral".

#### 3.5.2. Lógica de Filtros e UI
* **Estado Inicial:** Apenas a aba "Atletas" inicia ativa (amarela). "Treinadores" e "Melhores tempos" iniciam inativas.
* Os filtros de gênero ("Todos", "Masculino", "Feminino") e paginação ("Anterior", "Próxima") possuem cursor pointer e hovers em `#FCBE2B`.
* O botão "Salvar imagem" possui formato e borda visíveis no estado inativo, mudando para fundo amarelo e borda preta no hover.

---

## 4. Engenharia do Gerador de Imagens (Client-Side Canvas)
A funcionalidade mais complexa do sistema: gerar um PNG baixável a partir dos dados do atleta com base em um design Figma independente do layout web.

### 4.1. Arquitetura do Template Oculto (`#export-template`)
* **Posicionamento:** Renderizado no DOM, mas oculto visualmente de forma segura (`fixed top-0 left-[-9999px] z-[-50] overflow-hidden bg-white`). O uso de `display: none` é estritamente proibido, pois quebra a biblioteca de Canvas.
* **CSS Engessado:** O template não é responsivo. Utiliza CSS absoluto e fixo (`w-[1080px] h-[1920px]`, `px-[...]`, `text-[...]`) para garantir que o Canvas (html2canvas/html-to-image) renderize o frame exatamente como no Figma, sem distorcer flexbox ou espremer textos. Variáveis CSS complexas devem ser evitadas em favor de HEX (`#FCBE2B`).

### 4.2. Pipeline de Conversão (Resiliência e CORS)
Para evitar falhas silenciosas ou imagens quebrando por "Tainted Canvas" (CORS Policy), o script segue um fluxo rigoroso:
1. **Try/Catch:** Todo o processo é envelopado com tratamento de erros. Em caso de falha, logs detalhados vão para o console e o usuário recebe um alert amigável. O botão alterna o texto para "Gerando..." e é desabilitado temporariamente.
2. **Conversão Base64 via Proxy:** * A imagem original do atleta (ex: `pravatar.cc`) é interceptada pela função `getBase64Image()`.
   * URLs externas são passadas por um proxy de CORS gratuito (`https://corsproxy.io/?{url}`).
   * O Blob retornado é convertido via `FileReader` para uma string Base64.
   * A string Base64 é injetada diretamente no `src` do template, anulando totalmente problemas de Tainted Canvas na renderização.
3. **Wait for DOM & Fonts:** O script aguarda `document.fonts.ready` e utiliza um pequeno timeout para garantir que a foto injetada no DOM seja desenhada antes do "snapshot".

### 4.3. Distribuição Cross-Platform (Mobile vs Desktop)
* O Canvas gera um `Blob`.
* O script detecta o suporte nativo do dispositivo usando `navigator.canShare`.
* **Mobile (iOS/Android):** Dispara a Web Share API, permitindo que o usuário envie a imagem direto para Instagram, WhatsApp, etc.
* **Desktop:** Fallback clássico; gera uma URL via `URL.createObjectURL()`, forja um clique em uma tag `<a>` com atributo `download`, e faz o cleanup da memória.

---

## 5. Requisitos Não Funcionais (NFRs)
* **Performance:** Imagens abaixo da dobra (Ranking) utilizam `loading="lazy" decoding="async"`.
* **Segurança:** Links externos utilizam obrigatoriamente `target="_blank" rel="noopener noreferrer"`.
* **Responsividade:** Todas as seções estruturais (exceto o template de canvas) devem funcionar desde telas de 320px até resoluções ultrawide usando o Grid/Flexbox do Tailwind.

---
*Documento gerado e validado arquiteturalmente para transição de fase do projeto PRO Elite.*
