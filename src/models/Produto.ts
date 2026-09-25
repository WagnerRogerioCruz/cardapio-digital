// --- Interface ProdutoRenderizavel e Classe Abstrata Produto ---
// --- 1. INTERFACE ---

export interface ProdutoRenderizavel {
    readonly id: number;
    nome: string;
    calcularPrecoFinal(): number;
    gerarHTML(): string;
}

// --- 2. CLASSE ABSTRATA BASE ---

export abstract class Produto implements ProdutoRenderizavel {
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