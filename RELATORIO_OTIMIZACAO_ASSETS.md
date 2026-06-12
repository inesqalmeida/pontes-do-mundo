# Relatório de Optimização de Assets

Base: `pontes_do_mundo_v13_fase_visual_1_39`.

## Estratégia aplicada

- Mantive nomes e caminhos dos ficheiros.
- Não alterei HTML, CSS ou JavaScript nesta fase.
- Não alterei lógica, saves, colisões, progressão ou mecânicas.
- Reduzi assets pequenos/de gameplay exportados com resolução excessiva.
- Recomprimi PNGs com compressão sem perdas quando aplicável.
- Removi canal alpha apenas quando o PNG era totalmente opaco.
- Não redimensionei mapas principais, fundos principais, pergaminhos ou avatares.

## Resultado

- Peso original da pasta `assets`: **183.60 MB**.
- Peso optimizado da pasta `assets`: **82.00 MB**.
- Redução: **101.61 MB**.
- Ficheiros alterados: **61**.

## Principais ficheiros optimizados

| Ficheiro | Antes | Depois | Resolução antes | Resolução depois |
|---|---:|---:|---:|---:|
| `mecanismo-magico.png` | 2.88 MB | 0.20 MB | 1536×1024 | 512×341 |
| `cimento.png` | 2.83 MB | 0.15 MB | 1536×1024 | 512×341 |
| `vaso-flor.png` | 2.75 MB | 0.14 MB | 1536×1024 | 512×341 |
| `secao_ponte.png` | 2.75 MB | 0.16 MB | 1536×1024 | 512×341 |
| `flores.png` | 2.72 MB | 0.14 MB | 1536×1024 | 512×341 |
| `cristal-central.png` | 2.64 MB | 0.12 MB | 1536×1024 | 512×341 |
| `vigas.png` | 2.63 MB | 0.13 MB | 1536×1024 | 512×341 |
| `bota.png` | 2.58 MB | 0.10 MB | 1536×1024 | 512×341 |
| `caixa-ferramentas.png` | 2.59 MB | 0.13 MB | 1536×1024 | 512×341 |
| `lanterna-ativa.png` | 2.56 MB | 0.12 MB | 1536×1024 | 512×341 |
| `bolo.png` | 2.58 MB | 0.14 MB | 1536×1024 | 512×341 |
| `frigideira.png` | 2.51 MB | 0.10 MB | 1536×1024 | 512×341 |
| `lanterna-inativa.png` | 2.50 MB | 0.09 MB | 1536×1024 | 512×341 |
| `troncos.png` | 2.46 MB | 0.08 MB | 1536×1024 | 512×341 |
| `correntes.png` | 2.46 MB | 0.11 MB | 1536×1024 | 512×341 |
| `chapeu.png` | 2.43 MB | 0.09 MB | 1536×1024 | 512×341 |
| `efeito-sucesso.png` | 2.43 MB | 0.12 MB | 1536×1024 | 512×341 |
| `peixe.png` | 2.39 MB | 0.08 MB | 1536×1024 | 512×341 |
| `bola.png` | 2.39 MB | 0.11 MB | 1536×1024 | 512×341 |
| `corda.png` | 2.35 MB | 0.08 MB | 1536×1024 | 512×341 |
| `caixa-aberta.png` | 2.39 MB | 0.13 MB | 1536×1024 | 512×341 |
| `parafusos.png` | 2.33 MB | 0.07 MB | 1536×1024 | 512×341 |
| `almofada.png` | 2.35 MB | 0.10 MB | 1536×1024 | 512×341 |
| `caixa-fechada.png` | 2.33 MB | 0.09 MB | 1536×1024 | 512×341 |
| `alicate.png` | 2.30 MB | 0.08 MB | 1536×1024 | 512×341 |
| `martelo.png` | 2.28 MB | 0.06 MB | 1536×1024 | 512×341 |
| `barco.png` | 2.29 MB | 0.08 MB | 1536×1024 | 512×341 |
| `cristal-pequeno.png` | 2.26 MB | 0.07 MB | 1536×1024 | 512×341 |
| `pena.png` | 2.24 MB | 0.05 MB | 1536×1024 | 512×341 |
| `maca.png` | 2.24 MB | 0.07 MB | 1536×1024 | 512×341 |
| `energia-falha.png` | 2.24 MB | 0.07 MB | 1536×1024 | 512×341 |
| `efeito-ativacao.png` | 2.23 MB | 0.07 MB | 1536×1024 | 512×341 |
| `pregos.png` | 2.21 MB | 0.05 MB | 1536×1024 | 512×341 |
| `guarda_chuva.png` | 2.21 MB | 0.06 MB | 1536×1024 | 512×341 |
| `energia-fluxo.png` | 2.13 MB | 0.05 MB | 1536×1024 | 512×341 |
| `candeeiro.png` | 1.91 MB | 0.03 MB | 1536×1024 | 512×341 |
| `suporte_pesado.png` | 2.05 MB | 0.29 MB | 1024×1024 | 512×512 |
| `energia-espiral.png` | 2.11 MB | 0.36 MB | 1024×1024 | 512×512 |
| `nucleo_magico.png` | 1.90 MB | 0.25 MB | 1024×1024 | 512×512 |
| `vagoneta.png` | 1.75 MB | 0.16 MB | 1536×1024 | 512×341 |
| `runa-magica.png` | 1.85 MB | 0.27 MB | 1024×1024 | 512×512 |
| `energia-fragmentos.png` | 1.74 MB | 0.23 MB | 1024×1024 | 512×512 |
| `estrutura_reforcada.png` | 1.62 MB | 0.17 MB | 1024×1024 | 512×512 |
| `energia_ativa.png` | 1.46 MB | 0.10 MB | 1024×1024 | 512×512 |
| `fundo-oficina3.png` | 3.51 MB | 2.32 MB | 1672×941 | 1672×941 |
| `madeira.png` | 1.30 MB | 0.13 MB | 1252×864 | 512×353 |
| `carril.png` | 1.21 MB | 0.10 MB | 1536×1024 | 512×341 |
| `plataforma.png` | 0.84 MB | 0.09 MB | 1536×1024 | 512×341 |
| `cabo-supenso.png` | 0.34 MB | 0.03 MB | 1536×1024 | 512×341 |
| `mapa-base.png` | 4.85 MB | 4.68 MB | 6405×4263 | 6405×4263 |
| `fundo-inicial.png` | 2.75 MB | 2.62 MB | 1675×1154 | 1675×1154 |
| `avatares.png` | 2.53 MB | 2.41 MB | 1536×1024 | 1536×1024 |
| `fundo-perfil.png` | 2.46 MB | 2.38 MB | 1536×1024 | 1536×1024 |
| `fundo-ponte1.png` | 1.78 MB | 1.74 MB | 1510×724 | 1510×724 |
| `fundo-rio.png` | 2.61 MB | 2.58 MB | 1537×1023 | 1537×1023 |
| `avatar-engracado-2.png` | 0.21 MB | 0.20 MB | 341×397 | 341×397 |
| `avatar-menina-nepalesa-bengali.png` | 0.17 MB | 0.17 MB | 231×397 | 231×397 |
| `avatar-menino-nepales-bengali.png` | 0.19 MB | 0.18 MB | 231×397 | 231×397 |
| `avatar-engracado-1.png` | 0.19 MB | 0.18 MB | 341×397 | 341×397 |
| `avatar-menino-europeu.png` | 0.18 MB | 0.17 MB | 231×397 | 231×397 |
| `avatar-menina-europeia.png` | 0.20 MB | 0.19 MB | 231×397 | 231×397 |

## Mantidos sem redimensionamento nesta fase

- `mapa-*`
- `original*`
- `fundo-*`
- `ponte*`
- `oficina03*`
- `pergaminho*`
- `avatar*`
- `avatares.png`

Estes ficheiros continuam pesados e devem ser tratados numa segunda fase, com validação visual específica, porque são fundos/mapas/UI crítica.
