// 1. Modelagem do Produto
class Produto { 
    constructor( 
        public id: number, 
        public nome: string, 
        public descricao: string, 
        public preco: number, 
        public imagem: string 
    ) {} 

    gerarHTML(): string {
        return `
            <div class="card"> 
                <img src="${this.imagem}" alt="${this.nome}" class="card-img"> 
                <div class="card-content"> 
                    <h3 class="card-title">${this.nome}</h3> 
                    <p class="card-description">${this.descricao}</p> 
                    <div class="card-footer"> 
                        <span class="card-price">R$ ${this.preco.toFixed(2)}</span> 
                        <button class="remove-btn" style="width: auto; padding: 8px 12px;">Excluir</button>
                    </div>
                </div>
            </div>
        `; 
    }
}

// 2. Gerenciamento do Cardápio e Persistência
class Cardapio { 
    private produtos: Produto[] = []; 
    private storageKey = "cardapio_produtos"; 

    constructor(private containerId: string) { 
        this.carregarDoStorage(); 
    }

    adicionarProduto(produto: Produto): void { 
        this.produtos.push(produto); 
        this.salvarNoStorage(); 
        this.renderizar(); 
    }

    removerProduto(id: number): void {
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.salvarNoStorage();
        this.renderizar();
    }

    private salvarNoStorage(): void { 
        localStorage.setItem(this.storageKey, JSON.stringify(this.produtos)); 
    }

    private carregarDoStorage(): void { 
        const dadosSalvos = localStorage.getItem(this.storageKey); 
        if (dadosSalvos) { 
            const objetosBrutos = JSON.parse(dadosSalvos); 
            this.produtos = objetosBrutos.map(
                (p: any) => new Produto(p.id, p.nome, p.descricao, p.preco, p.imagem)
            );
        } else { 
            this.produtos.push(new Produto(
                1, "Hambúrguer Artesanal",
                "Pão brioche, carne 180g, queijo cheddar derretido e molho especial.",
                35.90,
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80"
            ));
            this.produtos.push(new Produto(
                2, "Pizza Margherita",
                "Molho de tomate artesanal, muçarela de búfala, manjericão fresco e azeite.",
                48.00,
                "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80"
            ));
            this.produtos.push(new Produto(
                3, "Salada Caesar",
                "Alface-romana, croutons crocantes, queijo parmesão e molho caesar exclusivo.",
                24.50,
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80"
            ));
            this.salvarNoStorage(); 
        }
    }

    renderizar(): void { 
        const container = document.getElementById(this.containerId); 
        if (!container) return; 

        container.innerHTML = ""; 
        this.produtos.forEach(produto => {
            container.innerHTML += produto.gerarHTML();
        });

        // Adiciona eventos de clique aos botões de excluir
        const botoesRemover = container.querySelectorAll<HTMLButtonElement>(".remove-btn");
        botoesRemover.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                this.removerProduto(this.produtos[index].id);
            });
        });
    }
}

// 3. Inicialização e Interação com o Formulário
window.addEventListener("DOMContentLoaded", () => { 
    const meuCardapio = new Cardapio("menu-container"); 
    meuCardapio.renderizar(); 

    const form = document.getElementById("product-form") as HTMLFormElement; 
    
    form.addEventListener("submit", (event) => { 
        event.preventDefault(); 

        const nomeInput = (document.getElementById("nome") as HTMLInputElement).value; 
        const precoInput = parseFloat((document.getElementById("preco") as HTMLInputElement).value); 
        const descInput = (document.getElementById("descricao") as HTMLTextAreaElement).value; 
        const imgInput = (document.getElementById("imagem") as HTMLInputElement).value; 

        const novoId = Date.now(); 
        const novoPrato = new Produto(novoId, nomeInput, descInput, precoInput, imgInput); 

        meuCardapio.adicionarProduto(novoPrato); 
        form.reset(); 
    });
});
