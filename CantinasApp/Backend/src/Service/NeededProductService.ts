import { NeededProduct } from "../Model/NeededProduct";

export class NeededProductService {
    static async create(
        date: Date,
        productId: number,
        mealId: number,
        unit: String,
        quantity: number,
        canteenId: number
    ) {
        return await NeededProduct.create({
            date,
            productId,
            mealId,
            unit,
            quantity,
            canteenId,
            status: "needed"
        });
    }

    static async update(
        id: number,
        data: Partial<{
            date: Date;
            productId: number;
            unit: String;
            quantity: number;
            canteenId: number;
        }>
    ) {
        const neededProduct = await NeededProduct.findByPk(id);
        if (!neededProduct) {
            throw new Error("NeededProduct not found");
        }

        return await neededProduct.update(data);
    }

    static async delete(id: number) {
        const neededProduct = await NeededProduct.findByPk(id);
        if (!neededProduct) {
            throw new Error("NeededProduct not found");
        }

        await neededProduct.destroy();
        return true;
    }
}
