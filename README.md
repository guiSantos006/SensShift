# SensShift

SensShift é uma aplicação web para converter sensibilidade de mira e DPI entre jogos de FPS, mantendo a mesma sensação física de movimento e consistência em qualquer título.

## Preview

<p align="center">
  <a href="https://github.com/user-attachments/assets/6b9784f0-8039-4078-8453-eb430395dee7">
    <img src="https://github.com/user-attachments/assets/6b9784f0-8039-4078-8453-eb430395dee7" width="700" alt="Preview do projeto">
  </a>
</p>

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

