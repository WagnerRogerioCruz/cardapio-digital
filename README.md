# 🍽️ Sistema de Cardápio Digital & Gestão de Vendas

> Projeto acadêmico focado no desenvolvimento de uma aplicação web para gerenciamento de cardápios e vendas de restaurante, utilizando **TypeScript moderno** e os pilares de **Programação Orientada a Objetos (POO)**.

---

## 👥 Desenvolvedores & Autores
* **Wagner Rogerio Cruz**
* **Harley Hatgers**
* **Kazuriho**

---

## 🚀 Sobre o Projeto

O projeto foi desenvolvido em duas etapas (**Sprints**), evoluindo de uma interface dinâmica de cardápio para um sistema administrativo completo de caixa e comanda. A aplicação elimina a necessidade de alteração de código HTML estático para novos produtos, gerando toda a interface e regras de negócio via código limpo e modularizado.

---

## 📑 Escopo das Sprints

### 🔹 Sprint 1 — Cardápio Digital Dinâmico
* **Geração Dinâmica do DOM:** Remoção de marcação HTML manual dos cards. O próprio modelo em TypeScript gera a estrutura da interface.
* **Gerenciador de Cardápio:** Estrutura dedicada para armazenar, gerenciar e renderizar produtos.
* **Persistência de Dados:** Armazenamento do cardápio e das alterações via `localStorage` do navegador.

### 🔹 Sprint 2 — Sistema de Gestão de Vendas (POO Avançado)
* **Encapsulamento e Modificadores de Acesso:** Proteção da lista interna de vendas com `private` e atribuição de identificadores `readonly`.
* **Herança e Abstração:** Classe base abstrata `Produto` e modelo de interface `ProdutoRenderizavel`.
* **Polimorfismo:** Especializações (`Prato`, `Bebida` e `Lanche`) sobrescrevendo métodos para cálculo dinâmico de taxas/preços finais (`calcularPrecoFinal`).
* **Membros Estáticos:** Atributo `static` na classe `Venda` para controle centralizado de faturamento total.
* **Módulos ES6:** Separação do projeto em arquivos com responsabilidades únicas (SRP/SOLID).

---

## 📁 Estrutura do Projeto

```text
projeto-final/
│
├── src/
│   ├── models/
│   │   ├── Produto.ts          # Interface ProdutoRenderizavel e Classe Abstrata Produto
│   │   ├── Especializacoes.ts    # Classes filhas: Prato, Bebida e Lanche
│   │   └── Venda.ts            # Classe Venda (controle de itens e faturamento)
│   │
│   ├── services/
│   │   └── Cardapio.ts         # Gerenciamento do catálogo de produtos
│   │
│   └── app.ts                  # Manipulação do DOM e delegação de eventos
│
├── dist/                       # Saída compilada em JavaScript (gerada pelo tsc)
├── index.html                  # Interface do usuário e painel administrativo
├── style.css                   # Estilização responsiva do sistema
├── tsconfig.json               # Configurações do compilador TypeScript
└── README.md                   # Documentação do projeto
```

## 🛠️ Tecnologias Utilizadas
* **HTML5 & CSS3** (Layout responsivo com Grid e Flexbox)
* **TypeScript** (Tipagem estática, Módulos ES6, POO)
* **JavaScript ES6+** (Código final executado no navegador)

## ⚙️ Como Executar o Projeto Localmente
* **Pré-requisitos**
Certifique-se de ter o Node.js e o compilador do TypeScript instalados globalmente em sua máquina.

* **Passos**
**Clone o repositório:**
`git clone [https://github.com/WagnerRogerioCruz/cardapio-digital](https://github.com/WagnerRogerioCruz/cardapio-digital)`

**Acesse o diretório**
`cd cardapio-digital`

**Compile os arquivos TypeScript:**
Para compilar uma única vez e gerar a pasta `dist/`:
`tsc`

**Ou rode o modo de escuta automática durante o desenvolvimento:**
`tsc --watch`

**Execute a aplicação:**
Abra o arquivo `index.html` diretamente em seu navegador ou utilize a extensão `Live Server` do VS Code.