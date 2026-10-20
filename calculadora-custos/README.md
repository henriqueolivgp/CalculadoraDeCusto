# CalculaPreço 🧮

Web app em Astro (HTML, CSS e JS puro) para calcular o custo dos teus produtos e descobrir por quanto os deves vender.

## Como usar

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a pasta dist/
npm run preview  # pré-visualiza o build
```

## Funcionalidades

- Materiais com nome, preço do pacote, quantidade no pacote e quantidade usada (adiciona quantos precisares)
- Tempo de trabalho em minutos ou horas, com valor por hora
- Margem de lucro (%) sobre o custo
- Resultado em tempo real: custo de materiais, mão de obra, custo total, lucro e preço de venda
- Guardar produtos, consultá-los, pesquisar, editar, duplicar e eliminar

## Fórmulas

- Custo do material = (preço do pacote ÷ quantidade no pacote) × quantidade usada
- Custo de mão de obra = horas trabalhadas × valor por hora
- Preço de venda = custo total × (1 + margem ÷ 100)

## Dados

Os produtos ficam guardados no `localStorage` do navegador (neste dispositivo). Se limpares os dados do navegador, a lista é apagada.

## Estrutura

```
src/
  layouts/Layout.astro     cabeçalho, navegação, fundo animado
  pages/index.astro        calculadora
  pages/produtos.astro     lista de produtos guardados
  scripts/lib.js           cálculos, formatação, armazenamento, toast
  styles/global.css        estilos pastel e animações
```
