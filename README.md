# SensShift

SensShift é uma aplicação web para converter sensibilidade de mira e DPI entre jogos de FPS, mantendo a mesma sensação física de movimento e consistência em qualquer título.

## Preview

[Preview do SensShift](https://seu-link-da-imagem-aqui)

## Funcionalidades

- Conversão de sensibilidade entre jogos populares
- Suporte a DPI de origem e destino
- Cálculo de distância física de giro (cm/360°)
- Salvamento local de perfis favoritos
- Interface moderna e responsiva

## Pré-requisitos

- Node.js 18+

## Executar localmente

```bash
npm install
npm run dev
```

O aplicativo ficará disponível em `http://localhost:3000`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verificação TypeScript |

## Deploy

O SensShift é uma SPA estática. Faça o deploy da pasta `dist/` em Vercel, Netlify, GitHub Pages ou qualquer host de arquivos estáticos.
