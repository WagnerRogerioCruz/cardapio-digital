"use strict";
// 1. Modelagem do Produto
class Produto {
    id;
    nome;
    descricao;
    preco;
    imagem;
    constructor(id, nome, descricao, preco, imagem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.imagem = imagem;
    }
    gerarHTML() {
        return `
            <div class="card">
                <img src="${this.imagem}" alt="${this.nome}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${this.nome}</h3>
                    <p class="card-description">${this.descricao}</p>
                    <div class="card-footer">
                        <span class="card-price">R$ ${this.preco.toFixed(2)}</span>
                        <button class="card-btn" style="width: auto; padding: 8px 12px;">Pedir</button>
                    </div>
                </div>
            </div>
        `;
    }
}
// 2. Gerenciamento do Cardápio e Persistência
class Cardapio {
    containerId;
    produtos = [];
    storageKey = "cardapio_produtos";
    constructor(containerId) {
        this.containerId = containerId;
        this.carregarDoStorage();
    }
    adicionarProduto(produto) {
        this.produtos.push(produto);
        this.salvarNoStorage();
        this.renderizar();
    }
    salvarNoStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.produtos));
    }
    carregarDoStorage() {
        const dadosSalvos = localStorage.getItem(this.storageKey);
        if (dadosSalvos) {
            const objetosBrutos = JSON.parse(dadosSalvos);
            this.produtos = objetosBrutos.map((p) => new Produto(p.id, p.nome, p.descricao, p.preco, p.imagem));
        }
        else {
            // Produtos iniciais padrão
            this.produtos.push(new Produto(1, "Hambúrguer Artesanal", "Pão brioche, carne 180g, queijo cheddar derretido e molho especial.", 35.90, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"));
            this.produtos.push(new Produto(2, "Pizza Margherita", "Molho de tomate artesanal, muçarela de búfala, manjericão fresco e azeite.", 48.00, "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"));
            this.salvarNoStorage();
        }
    }
    renderizar() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        container.innerHTML = "";
        this.produtos.forEach(produto => {
            container.innerHTML += produto.gerarHTML();
        });
    }
}
// 3. Inicialização e Interação com o Formulário
window.addEventListener("DOMContentLoaded", () => {
    const meuCardapio = new Cardapio("menu-container");
    meuCardapio.renderizar();
    // Capturando o envio do formulário
    const form = document.getElementById("product-form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Obtendo valores dos inputs
        const nomeInput = document.getElementById("nome").value;
        const precoInput = parseFloat(document.getElementById("preco").value);
        const descInput = document.getElementById("descricao").value;
        const imgInput = document.getElementById("imagem").value;
        // Gerando um ID único baseado no tempo atual
        const novoId = Date.now();
        // Criando a nova instância da classe Produto
        const novoPrato = new Produto(novoId, nomeInput, descInput, precoInput, imgInput);
        // Adicionando ao cardápio (que já salva e renderiza automaticamente)
        meuCardapio.adicionarProduto(novoPrato);
        // Limpando o formulário após o cadastro
        form.reset();
    });
});
