import { Order, OrderStatus } from "../Model/Order";
import { Product } from "../Model/Product";
import { User } from "../Model/User";
import { Notification } from "../Model/Notification";

export class OrderService {
    static async create(
        userId: number,
        neededProductId: number,
        productId: number,
        unit: String,
        quantity: number,
        date: Date,
        canteenId: number
    ) {
        return await Order.create({
            userId,
            neededProductId,
            productId,
            unit,
            quantity,
            status: "pending",
            date,
            canteenId
        });
    }

    static async update(
        id: number,
        data: Partial<{
            neededProductId: number;
            productId: number;
            unit: String;
            quantity: number;
        }>
    ) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }

        return await order.update(data);
    }

    static async updateStatus(id: number, status: OrderStatus) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }

        order.status = status;
        await order.save();

        if (status === "rejected") {
        const product = await Product.findByPk(order.productId);
        const user = await User.findByPk(order.userId);
        Notification.create({
            userId: order.userId,
            title: "Encomenda Recusada",
            body: `A encomenda de produto ${product?.name} para dia ${order.date} do produtor ${user?.name} foi recusada.`,
        });
    }
        return order;
    }

    static async delete(id: number) {
        const order = await Order.findByPk(id);
        if (!order) {
            throw new Error("Order not found");
        }

        await order.destroy();
        return true;
    }

    static async getByUserId(userId: number) {
        return await Order.findAll({
            where: { userId }
        });
    }

    static async getAll() {
        return await Order.findAll();
    }
}
