// --- 1. INTERFACE ---
interface ProdutoRenderizavel {
    readonly id: number;
    nome: string;
    calcularPrecoFinal(): number;
    gerarHTML(): string;
}

// --- 2. CLASSE ABSTRATA BASE ---
abstract class Produto implements ProdutoRenderizavel {
    readonly id: number;
    nome: string;
    precoBase: number;
    descricao: string;
    imagem: string;

    constructor(id: number, nome: string, precoBase: number, descricao: string, imagem: string) {
        this.id = id;
        this.nome = nome;
        this.precoBase = precoBase;
        this.descricao = descricao;
        this.imagem = imagem;
    }

    abstract calcularPrecoFinal(): number;

    // O Card agora traz tanto a ação de Adicionar à Venda quanto a de Excluir do Cardápio (Dono)
    gerarHTML(): string {
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
    override calcularPrecoFinal(): number {
        return this.precoBase + 5.00;
    }
}

class Bebida extends Produto {
    override calcularPrecoFinal(): number {
        return this.precoBase * 1.10;
    }
}

class Lanche extends Produto {
    override calcularPrecoFinal(): number {
        return this.precoBase + 2.00;
    }
}

// --- 4. CLASSE VENDA (COM REMOÇÃO DE ITEM DA COMANDA) ---
class Venda {
    private readonly produtos: Produto[] = [];
    private fechada: boolean = false;
    static faturamentoTotal: number = 0;

    adicionar(produto: Produto): void {
        if (!this.fechada) {
            this.produtos.push(produto);
        }
    }

    // Permite remover um item da comanda caso o cliente mude de ideia
    removerItem(index: number): void {
        if (!this.fechada && index >= 0 && index < this.produtos.length) {
            this.produtos.splice(index, 1);
        }
    }

    get total(): number {
        return this.produtos.reduce((soma, prod) => soma + prod.calcularPrecoFinal(), 0);
    }

    get listaProdutos(): readonly Produto[] {
        return this.produtos;
    }

    finalizar(): void {
        if (!this.fechada && this.produtos.length > 0) {
            Venda.faturamentoTotal += this.total;
            this.fechada = true;
        }
    }
}

// --- 5. GERENCIAMENTO DO CARDÁPIO ---
class Cardapio {
    private produtos: Produto[] = [];

    constructor() {
        this.carregarIniciais();
    }

    private carregarIniciais(): void {
        this.produtos = [
            new Lanche(1, "Hambúrguer Artesanal", 33.90, "Pão brioche, carne 180g e cheddar.", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"),
            new Lanche(2, "Pizza Margherita", 46.00, "Molho de tomate artesanal e muçarela.", "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"),
            new Bebida(3, "Suco Natural", 10.00, "Suco de laranja natural 500ml.", "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80")
        ];
    }

    getLista(): Produto[] {
        return this.produtos;
    }

    adicionarProduto(produto: Produto): void {
        this.produtos.push(produto);
        this.renderizar();
    }

    // Método para o dono excluir o produto do menu
    removerProduto(id: number): void {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.renderizar();
    }

    renderizar(): void {
        const container = document.getElementById("menu-container");
        if (!container) return;
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

        if (totalVendaEl) totalVendaEl.innerText = vendaAtual.total.toFixed(2);
        if (faturamentoEl) faturamentoEl.innerText = Venda.faturamentoTotal.toFixed(2);
        
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
        const target = e.target as HTMLElement;

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
        const target = e.target as HTMLElement;
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
    const form = document.getElementById("product-form") as HTMLFormElement;
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = (document.getElementById("nome") as HTMLInputElement).value;
        const preco = parseFloat((document.getElementById("preco") as HTMLInputElement).value);
        const desc = (document.getElementById("descricao") as HTMLTextAreaElement).value;
        const img = (document.getElementById("imagem") as HTMLInputElement).value;
        const tipo = (document.getElementById("tipo-produto") as HTMLSelectElement).value;

        const novoId = Date.now();
        let novoProduto: Produto;

        if (tipo === "prato") {
            novoProduto = new Prato(novoId, nome, preco, desc, img);
        } else if (tipo === "bebida") {
            novoProduto = new Bebida(novoId, nome, preco, desc, img);
        } else {
            novoProduto = new Lanche(novoId, nome, preco, desc, img);
        }

        cardapio.adicionarProduto(novoProduto);
        form.reset();
    });
});