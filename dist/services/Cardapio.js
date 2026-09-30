import { Prato, Lanche, Bebida } from "../models/Especializacoes.js";
export class Cardapio {
    constructor() {
        this.produtos = [];
        this.carregarProdutos(); // Modificado para carregar do localStorage ou iniciar com padrões
    }
    carregarProdutos() {
        const dadosSalvos = localStorage.getItem("cardapio_produtos");
        if (dadosSalvos) {
            // Se houver dados salvos, convertemos de JSON para objetos normais
            const listaBruta = JSON.parse(dadosSalvos);
            // [IMPORTANTE]: Como o JSON perde os métodos das classes, precisamos instanciar 
            // os objetos reais novamente com base no tipo para recuperar o polimorfismo!
            this.produtos = listaBruta.map((p) => {
                if (p.tipo === "prato") {
                    return new Prato(p.id, p.nome, p.precoBase, p.descricao, p.imagem);
                }
                else if (p.tipo === "bebida") {
                    return new Bebida(p.id, p.nome, p.precoBase, p.descricao, p.imagem);
                }
                else {
                    return new Lanche(p.id, p.nome, p.precoBase, p.descricao, p.imagem);
                }
            });
        }
        else {
            // Se não houver nada salvo, carrega os padrões e já salva no localStorage
            this.produtos = [
                new Lanche(1, "Hambúrguer Artesanal", 33.90, "Pão brioche, carne 180g e cheddar.", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"),
                new Lanche(2, "Pizza Margherita", 46.00, "Molho de tomate artesanal e muçarela.", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"),
                new Bebida(3, "Suco Natural", 10.00, "Suco de laranja natural 500ml.", "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80")
            ];
            this.salvarNoStorage();
        }
    }
    // Método privado auxiliar para salvar o estado atual no localStorage
    salvarNoStorage() {
        // Mapeamos para adicionar uma propriedade "tipo" visível, facilitando na hora de reconstruir os objetos
        const dadosParaSalvar = this.produtos.map(p => {
            let tipo = "lanche";
            if (p instanceof Prato)
                tipo = "prato";
            if (p instanceof Bebida)
                tipo = "bebida";
            return {
                id: p.id,
                nome: p.nome,
                precoBase: p.precoBase,
                descricao: p.descricao,
                imagem: p.imagem,
                tipo: tipo
            };
        });
        localStorage.setItem("cardapio_produtos", JSON.stringify(dadosParaSalvar));
    }
    getLista() {
        return this.produtos;
    }
    adicionarProduto(produto) {
        this.produtos.push(produto);
        this.salvarNoStorage(); // Salva sempre que adicionar
        this.renderizar();
    }
    removerProduto(id) {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.salvarNoStorage(); // Salva sempre que remover
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
