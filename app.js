"use strict";
// --- 2. CLASSE ABSTRATA BASE ---
class Produto {
    id;
    nome;
    precoBase;
    descricao;
    imagem;
    constructor(id, nome, precoBase, descricao, imagem) {
        this.id = id;
        this.nome = nome;
        this.precoBase = precoBase;
        this.descricao = descricao;
        this.imagem = imagem;
    }
    // O Card agora traz tanto a ação de Adicionar à Venda quanto a de Excluir do Cardápio (Dono)
    gerarHTML() {
        const precoFinal = this.calcularPrecoFinal();
        return `
            <div class="card"> 
                <img src="${this.imagem}" alt="${this.nome}" class="card-img"> 
                <div class="card-content"> 
                    <h3 class="card-title">${this.nome}</h3> 
                    <p class="card-description">${this.descricao}</p> 
                    <div class="card-footer"> 
                        <span class="card-price">R$ ${precoFinal.toFixed(2)}</span> 
                        <div class="card-actions">
                            <button class="add-venda-btn" data-id="${this.id}">+ Adicionar</button>
                            <button class="delete-cardapio-btn" data-id="${this.id}">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
// --- 3. ESPECIALIZAÇÕES ---
class Prato extends Produto {
    calcularPrecoFinal() {
        return this.precoBase + 5.00;
    }
}
class Bebida extends Produto {
    calcularPrecoFinal() {
        return this.precoBase * 1.10;
    }
}
class Lanche extends Produto {
    calcularPrecoFinal() {
        return this.precoBase + 2.00;
    }
}
// --- 4. CLASSE VENDA (COM REMOÇÃO DE ITEM DA COMANDA) ---
class Venda {
    produtos = [];
    fechada = false;
    static faturamentoTotal = 0;
    adicionar(produto) {
        if (!this.fechada) {
            this.produtos.push(produto);
        }
    }
    // Permite remover um item da comanda caso o cliente mude de ideia
    removerItem(index) {
        if (!this.fechada && index >= 0 && index < this.produtos.length) {
            this.produtos.splice(index, 1);
        }
    }
    get total() {
        return this.produtos.reduce((soma, prod) => soma + prod.calcularPrecoFinal(), 0);
    }
    get listaProdutos() {
        return this.produtos;
    }
    finalizar() {
        if (!this.fechada && this.produtos.length > 0) {
            Venda.faturamentoTotal += this.total;
            this.fechada = true;
        }
    }
}
// --- 5. GERENCIAMENTO DO CARDÁPIO ---
class Cardapio {
    produtos = [];
    constructor() {
        this.carregarIniciais();
    }
    carregarIniciais() {
        this.produtos = [
            new Lanche(1, "Hambúrguer Artesanal", 33.90, "Pão brioche, carne 180g e cheddar.", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"),
            new Lanche(2, "Pizza Margherita", 46.00, "Molho de tomate artesanal e muçarela.", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"),
            new Bebida(3, "Suco Natural", 10.00, "Suco de laranja natural 500ml.", "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80")
        ];
    }
    getLista() {
        return this.produtos;
    }
    adicionarProduto(produto) {
        this.produtos.push(produto);
        this.renderizar();
    }
    // Método para o dono excluir o produto do menu
    removerProduto(id) {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.renderizar();
    }
    renderizar() {
        const container = document.getElementById("menu-container");
        if (!container)
            return;
        container.innerHTML = "";
        this.produtos.forEach(p => container.innerHTML += p.gerarHTML());
    }
}
// --- 6. INTEGRAÇÃO E EVENTOS DA TELA ---
window.addEventListener("DOMContentLoaded", () => {
    const cardapio = new Cardapio();
    cardapio.renderizar();
    let vendaAtual = new Venda();
    const atualizarTelaVendas = () => {
        const totalVendaEl = document.getElementById("total-venda");
        const faturamentoEl = document.getElementById("faturamento-total");
        const itensVendaEl = document.getElementById("itens-venda");
        if (totalVendaEl)
            totalVendaEl.innerText = vendaAtual.total.toFixed(2);
        if (faturamentoEl)
            faturamentoEl.innerText = Venda.faturamentoTotal.toFixed(2);
        // Renderiza itens da comanda com botão para cancelar o item
        if (itensVendaEl) {
            itensVendaEl.innerHTML = vendaAtual.listaProdutos
                .map((p, index) => `
                    <li style="margin-bottom: 5px;">
                        ${p.nome} - R$ ${p.calcularPrecoFinal().toFixed(2)} 
                        <button class="remove-item-comanda-btn" data-index="${index}" style="margin-left: 10px; color: red; cursor: pointer;">[Remover]</button>
                    </li>
                `)
                .join("");
        }
    };
    // DELEGAÇÃO DE EVENTOS NO CARDÁPIO (Ações dos Cards)
    document.getElementById("menu-container")?.addEventListener("click", (e) => {
        const target = e.target;
        // Ação 1: Adicionar à Venda/Comanda
        if (target.classList.contains("add-venda-btn")) {
            const id = Number(target.getAttribute("data-id"));
            const produtoEncontrado = cardapio.getLista().find(p => p.id === id);
            if (produtoEncontrado) {
                vendaAtual.adicionar(produtoEncontrado);
                atualizarTelaVendas();
            }
        }
        // Ação 2: Excluir do Cardápio (Visão do Dono)
        if (target.classList.contains("delete-cardapio-btn")) {
            const id = Number(target.getAttribute("data-id"));
            cardapio.removerProduto(id);
        }
    });
    // Remover item individual da Comanda Atual
    document.getElementById("itens-venda")?.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("remove-item-comanda-btn")) {
            const index = Number(target.getAttribute("data-index"));
            vendaAtual.removerItem(index);
            atualizarTelaVendas();
        }
    });
    // Finalizar Venda
    document.getElementById("btn-finalizar-venda")?.addEventListener("click", () => {
        vendaAtual.finalizar();
        vendaAtual = new Venda();
        atualizarTelaVendas();
    });
    // Form de Cadastro pelo Dono
    const form = document.getElementById("product-form");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const preco = parseFloat(document.getElementById("preco").value);
        const desc = document.getElementById("descricao").value;
        const img = document.getElementById("imagem").value;
        const tipo = document.getElementById("tipo-produto").value;
        const novoId = Date.now();
        let novoProduto;
        if (tipo === "prato") {
            novoProduto = new Prato(novoId, nome, preco, desc, img);
        }
        else if (tipo === "bebida") {
            novoProduto = new Bebida(novoId, nome, preco, desc, img);
        }
        else {
            novoProduto = new Lanche(novoId, nome, preco, desc, img);
        }
        cardapio.adicionarProduto(novoProduto);
        form.reset();
    });
});
