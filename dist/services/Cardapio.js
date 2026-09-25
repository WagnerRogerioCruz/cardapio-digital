import { Lanche, Bebida } from "../models/Especializacoes.js";
// --- 5. GERENCIAMENTO DO CARDÁPIO ---
export class Cardapio {
    constructor() {
        this.produtos = [];
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
