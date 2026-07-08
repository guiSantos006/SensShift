# SensShift

Conversor de sensibilidade de mira para jogos de FPS. Converta sensibilidade e DPI entre CS2, Valorant, Apex Legends, Overwatch 2, Call of Duty e Rainbow Six Siege mantendo a mesma distância física de giro (cm/360°).

## Pré-requisitos

- Node.js 18+

## Executar localmente

```bash
npm install
npm run dev
```

O app estará disponível em `http://localhost:3000`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Verificação TypeScript |

## Deploy

O SensShift é uma SPA estática. Faça o deploy da pasta `dist/` em Vercel, Netlify, GitHub Pages ou qualquer host de arquivos estáticos.
