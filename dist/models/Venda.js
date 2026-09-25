// --- 4. CLASSE VENDA (COM REMOÇÃO DE ITEM DA COMANDA) ---
export class Venda {
    constructor() {
        this.produtos = [];
        this.fechada = false;
    }
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
Venda.faturamentoTotal = 0;
