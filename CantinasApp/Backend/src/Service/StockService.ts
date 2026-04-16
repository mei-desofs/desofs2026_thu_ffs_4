import {Batch} from "../Model/Batch";
import {Product} from "../Model/Product";
import {Unit} from "../Model/Unit";
import {Stock} from "../Model/Stock";
import {BatchService} from "../Service/BatchService";

const batchService = new BatchService();

export class StockService {
    async createStock(data: {
        updatedDate: Date;
        minimumCapacity: number;
        maximumCapacity: number;
        currentQuantity: number;
        batches: number[];
    }) {
        // validar se a capacidade máxima é maior que a capacidade mínima
        if (data.maximumCapacity <= data.minimumCapacity) throw new Error("MAXIMUM_CAPACITY_MUST_BE_GREATER_THAN_MINIMUM_CAPACITY");

        // validar se a quantidade atual está entre a capacidade mínima e máxima
        if (data.currentQuantity < data.minimumCapacity || data.currentQuantity > data.maximumCapacity) {
            throw new Error("CURRENT_QUANTITY_MUST_BE_BETWEEN_MINIMUM_AND_MAXIMUM_CAPACITY");
        }

        // validar existência de Id's e a quantity dos produtos
        for (const batches of data.batches) {
            const batch = await Batch.findByPk(batches);
            if (!batch) throw new Error("BATCH_NOT_FOUND");
        }

        return await Stock.create(data);
    }

    async listStocks() {
        return await Stock.findAll();
    }

    async getStockById(id: number) {
        const stock = await Stock.findByPk(id);
        if (!stock) throw new Error("STOCK_NOT_FOUND");
        return stock;
    }

    async getStockProducts(stock: Stock) {
        const fullStock = await this.getStockById(stock.id);
        if (!fullStock) throw new Error("STOCK_NOT_FOUND");

        const productMap = new Map<number, { quantity: number; unitId: number }>();

        for (const batchId of fullStock.batches) {
            const batch = await batchService.getBatchById(batchId);
            if (!batch) continue;

            if (productMap.has(batch.productId)) {
                const entry = productMap.get(batch.productId)!;
                entry.quantity += batch.quantity;
            } else {
                productMap.set(batch.productId, {
                    quantity: batch.quantity,
                    unitId: batch.unitId
                });
            }
        }

        return Array.from(productMap.entries()).map(([productId, data]) => ({
            productId,
            quantity: data.quantity,
            unitId: data.unitId,
        }));
    }

}