import {Product} from "../Model/Product";
import {Unit} from "../Model/Unit";
import {Batch} from "../Model/Batch";

export class BatchService {

    async createBatch(data: {
        expirationDate: Date;
        productId: number;
        quantity: number;
        unitId: number;
        bio: boolean;
    }) {
        // validar existência de Id's
        const product = await Product.findByPk(data.productId);
        if (!product) throw new Error("PRODUCT_NOT_FOUND");

        const unit = await Unit.findByPk(data.unitId);
        if (!unit) throw new Error("UNIT_NOT_FOUND");

        return await Batch.create(data)
    }

    async listBatches() {
        return await Batch.findAll();
    }

    async getBatchById(id: number) {
        const batch = await Batch.findByPk(id);
        if (!batch) throw new Error("BATCH_NOT_FOUND");
        return batch;
    }
}