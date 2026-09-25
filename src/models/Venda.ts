import { Produto } from "./Produto.js";

// --- 4. CLASSE VENDA (COM REMOÇÃO DE ITEM DA COMANDA) ---

export class Venda {
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
