import { Produto } from "./Produto.js";
// --- 3. ESPECIALIZAÇÕES ---
// --- Classes Prato, Bebida e Lanche ---
export class Prato extends Produto {
    calcularPrecoFinal() {
        return this.precoBase + 5.00;
    }
}
export class Bebida extends Produto {
    calcularPrecoFinal() {
        return this.precoBase * 1.10;
    }
}
export class Lanche extends Produto {
    calcularPrecoFinal() {
        return this.precoBase + 2.00;
    }
}
