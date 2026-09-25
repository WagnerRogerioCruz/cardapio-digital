import { Produto } from "./Produto.js";

// --- 3. ESPECIALIZAÇÕES ---
// --- Classes Prato, Bebida e Lanche ---

export class Prato extends Produto {
    override calcularPrecoFinal(): number {
        return this.precoBase + 5.00;
    }
}

export class Bebida extends Produto {
    override calcularPrecoFinal(): number {
        return this.precoBase * 1.10;
    }
}

export class Lanche extends Produto {
    override calcularPrecoFinal(): number {
        return this.precoBase + 2.00;
    }
}