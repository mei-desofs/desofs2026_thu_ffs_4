import { User } from "../Model/User";
import { Application } from "../Model/Application";
import { FarmerProduct } from "../Model/FarmerProducts";
import { Product } from "../Model/Product";
import { Order } from "../Model/Order";
import { Canteen } from "../Model/Canteen";

export interface ProducerStatistics {
    totalProducers: number;
    totalApplications: number;
    approvalRate: number;
    producersByStatus: {
        approved: number;
        submitted: number;
        under_review: number;
        rejected: number;
        cancelled: number;
    };
    topProducers: Array<{
        userId: number;
        userName: string;
        email: string;
        totalQuantity: number;
        productCount: number;
        applicationStatus: string;
    }>;
    topProducts: Array<{
        productId: number;
        productName: string;
        totalQuantity: number;
        unit: string;
        producerCount: number;
    }>;
    ordersByCanteen: Array<{
        canteenId: number;
        canteenName: string;
        totalOrders: number;
        ordersByStatus: {
            pending: number;
            sent: number;
            confirmed: number;
            rejected: number;
            cancelled: number;
            delivered: number;
        };
        quantitiesByUnit: Array<{
            unit: string;
            totalQuantity: number;
        }>;
        lastDeliveryDate: string | null;
        lastOrderDate: string | null;
        lastPendingDate: string | null;
        products: Array<{
            productId: number;
            productName: string;
            quantity: number;
            unit: string;
            status: string;
        }>;
    }>;
    totalOrders: number;
    deliveredProducts: Array<{
        productId: number;
        productName: string;
        totalQuantity: number;
        unit: string;
        orderCount: number;
    }>;
    deliveryStats: {
        deliveryRate: number;
        averageQuantityByUnit: Array<{
            unit: string;
            averageQuantity: number;
        }>;
        uniqueProductsDelivered: number;
    };
}

export class ProducerStatisticsService {
    async getProducerStatistics(filters?: { producerId?: number }): Promise<ProducerStatistics> {
        // 1. Total de produtores
        const totalProducers = await User.count({
            where: { role: "Supplier" }
        });

        // 2. Total de candidaturas
        const applicationsQuery: any = {};
        if (filters?.producerId) {
            applicationsQuery.userId = filters.producerId;
        }

        const applications = await Application.findAll({
            where: applicationsQuery
        });

        const totalApplications = applications.length;

        // 3. Distribuição por status
        const producersByStatus = {
            approved: 0,
            submitted: 0,
            under_review: 0,
            rejected: 0,
            cancelled: 0
        };

        applications.forEach(app => {
            if (app.status in producersByStatus) {
                producersByStatus[app.status as keyof typeof producersByStatus]++;
            }
        });

        // 4. Taxa de aprovação
        const approvedCount = producersByStatus.approved;
        const approvalRate = totalApplications > 0 
            ? (approvedCount / totalApplications) * 100 
            : 0;

        // 5. Top produtores por quantidade oferecida
        const farmerProductsQuery: any = {};
        if (filters?.producerId) {
            farmerProductsQuery.userId = filters.producerId;
        }

        const farmerProducts = await FarmerProduct.findAll({
            where: farmerProductsQuery,
            include: [
                { model: User, as: "user", attributes: ["id", "name", "email"] },
                { model: Product, as: "product", attributes: ["id", "name"] }
            ]
        });

        // Agrupar por produtor
        const producerMap = new Map<number, {
            name: string;
            email: string;
            totalQuantity: number;
            productIds: Set<number>;
            applicationStatus: string;
        }>();

        farmerProducts.forEach(fp => {
            const userId = fp.userId;
            const fpData = fp as any;
            const userName = fpData.user?.name || `Produtor ${userId}`;
            const userEmail = fpData.user?.email || "";
            const application = applications.find(app => app.userId === userId);
            const status = application?.status || "no_application";

            if (!producerMap.has(userId)) {
                producerMap.set(userId, {
                    name: userName,
                    email: userEmail,
                    totalQuantity: 0,
                    productIds: new Set(),
                    applicationStatus: status
                });
            }

            const producerData = producerMap.get(userId)!;
            producerData.totalQuantity += fp.quantity;
            producerData.productIds.add(fp.productId);
        });

        const topProducers = Array.from(producerMap.entries())
            .map(([userId, data]) => ({
                userId,
                userName: data.name,
                email: data.email,
                totalQuantity: data.totalQuantity,
                productCount: data.productIds.size,
                applicationStatus: data.applicationStatus
            }))
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 5); // Top 5

        // 6. Top produtos mais oferecidos
        const productMap = new Map<number, {
            name: string;
            totalQuantity: number;
            unit: string;
            producerIds: Set<number>;
        }>();
        
        farmerProducts.forEach(fp => {
            const productId = fp.productId;
            const fpData = fp as any;
            const productName = fpData.product?.name || `Produto ${productId}`;
            const unit = fp.unit;
            const userId = fp.userId;

            if (!productMap.has(productId)) {
                productMap.set(productId, {
                    name: productName,
                    totalQuantity: 0,
                    unit: unit,
                    producerIds: new Set()
                });
            }

            const productData = productMap.get(productId)!;
            productData.totalQuantity += fp.quantity;
            productData.producerIds.add(userId);
        });

        const topProducts = Array.from(productMap.entries())
            .map(([productId, data]) => ({
                productId,
                productName: data.name,
                totalQuantity: data.totalQuantity,
                unit: data.unit,
                producerCount: data.producerIds.size
            }))
            .sort((a, b) => b.totalQuantity - a.totalQuantity)
            .slice(0, 10); // Top 10

        // 7. Estatísticas de Orders por Cantina
        const allOrders = await Order.findAll({
            include: [
                { model: Canteen, as: "canteen", attributes: ["id", "name"] },
                { model: Product, as: "product", attributes: ["id", "name"] }
            ]
        });

        const totalOrders = allOrders.length;

        const canteenMap = new Map<number, {
            canteenName: string;
            orders: Order[];
        }>();

        allOrders.forEach(order => {
            const canteenId = order.canteenId;
            const orderData = order as any;
            const canteenName = orderData.canteen?.name || `Cantina ${canteenId}`;

            if (!canteenMap.has(canteenId)) {
                canteenMap.set(canteenId, {
                    canteenName,
                    orders: []
                });
            }

            canteenMap.get(canteenId)!.orders.push(order);
        });

        const ordersByCanteen = Array.from(canteenMap.entries())
            .map(([canteenId, data]) => {
                const orders = data.orders;
                const ordersByStatus = {
                    pending: 0,
                    sent: 0,
                    confirmed: 0,
                    rejected: 0,
                    cancelled: 0,
                    delivered: 0
                };

                // Agrupar quantidades por unidade e produtos
                const quantitiesByUnitMap = new Map<string, number>();
                const productsList: Array<{
                    productId: number;
                    productName: string;
                    quantity: number;
                    unit: string;
                    status: string;
                }> = [];
                let lastDeliveryDate: string | null = null;
                let lastOrderDate: string | null = null;
                let lastPendingDate: string | null = null;

                orders.forEach(order => {
                    if (order.status in ordersByStatus) {
                        ordersByStatus[order.status as keyof typeof ordersByStatus]++;
                    }
                    
                    // Converter data da order
                    let orderDate: string;
                    const dateValue = order.date as any;
                    if (dateValue instanceof Date) {
                        orderDate = dateValue.toISOString().split('T')[0];
                    } else if (typeof dateValue === 'string') {
                        orderDate = dateValue.split('T')[0];
                    } else {
                        orderDate = String(dateValue).split('T')[0];
                    }
                    
                    // Guardar a data mais recente de qualquer order (para ordenação)
                    if (!lastOrderDate || orderDate > lastOrderDate) {
                        lastOrderDate = orderDate;
                    }
                    
                    // Se a order foi entregue, guardar a data mais recente de entrega
                    if (order.status === "delivered") {
                        if (!lastDeliveryDate || orderDate > lastDeliveryDate) {
                            lastDeliveryDate = orderDate;
                        }
                    }
                    
                    // Se a order está pendente, guardar a data mais recente de pending
                    if (order.status === "pending") {
                        if (!lastPendingDate || orderDate > lastPendingDate) {
                            lastPendingDate = orderDate;
                        }
                    }
                    
                    // Adicionar produto à lista
                    const orderData = order as any;
                    const productName = orderData.product?.name || `Produto ${order.productId}`;
                    productsList.push({
                        productId: order.productId,
                        productName,
                        quantity: order.quantity,
                        unit: order.unit.toString(),
                        status: order.status
                    });
                    
                    const unit = order.unit.toString();
                    if (!quantitiesByUnitMap.has(unit)) {
                        quantitiesByUnitMap.set(unit, 0);
                    }
                    quantitiesByUnitMap.set(unit, quantitiesByUnitMap.get(unit)! + order.quantity);
                });

                const quantitiesByUnit = Array.from(quantitiesByUnitMap.entries())
                    .map(([unit, totalQuantity]) => ({
                        unit,
                        totalQuantity
                    }))
                    .sort((a, b) => b.totalQuantity - a.totalQuantity);

                return {
                    canteenId,
                    canteenName: data.canteenName,
                    totalOrders: orders.length,
                    ordersByStatus,
                    quantitiesByUnit,
                    lastDeliveryDate,
                    lastOrderDate,
                    lastPendingDate,
                    products: productsList
                };
            })
            .sort((a, b) => {
                // Ordenar por data mais recente primeiro (mais recente no topo)
                const dateA = a.lastOrderDate ? String(a.lastOrderDate) : '';
                const dateB = b.lastOrderDate ? String(b.lastOrderDate) : '';
                
                if (dateA && dateB) {
                    return dateB.localeCompare(dateA);
                }
                if (dateA) return -1;
                if (dateB) return 1;
                // Se não houver datas, ordenar por total de orders
                return b.totalOrders - a.totalOrders;
            });

        // 8. Produtos Entregues ordenados por quantidade
        const deliveredOrders = allOrders.filter(order => order.status === "delivered");
        
        const deliveredProductMap = new Map<number, {
            productName: string;
            totalQuantity: number;
            unit: string;
            orderCount: number;
        }>();

        deliveredOrders.forEach(order => {
            const productId = order.productId;
            const orderData = order as any;
            const productName = orderData.product?.name || `Produto ${productId}`;
            const unit = order.unit.toString();

            if (!deliveredProductMap.has(productId)) {
                deliveredProductMap.set(productId, {
                    productName,
                    totalQuantity: 0,
                    unit,
                    orderCount: 0
                });
            }

            const productData = deliveredProductMap.get(productId)!;
            productData.totalQuantity += order.quantity;
            productData.orderCount += 1;
        });

        const deliveredProducts = Array.from(deliveredProductMap.entries())
            .map(([productId, data]) => ({
                productId,
                productName: data.productName,
                totalQuantity: data.totalQuantity,
                unit: data.unit,
                orderCount: data.orderCount
            }))
            .sort((a, b) => b.totalQuantity - a.totalQuantity);

        // Estatísticas de entrega
        const deliveredOrdersCount = deliveredOrders.length;
        const deliveryRate = totalOrders > 0 
            ? (deliveredOrdersCount / totalOrders) * 100 
            : 0;
        
        // Calcular média por unidade (não misturar unidades diferentes)
        const quantityByUnitMap = new Map<string, { total: number; count: number }>();
        deliveredOrders.forEach(order => {
            const unit = order.unit.toString();
            if (!quantityByUnitMap.has(unit)) {
                quantityByUnitMap.set(unit, { total: 0, count: 0 });
            }
            const unitData = quantityByUnitMap.get(unit)!;
            unitData.total += order.quantity;
            unitData.count += 1;
        });
        
        const averageQuantityByUnit = Array.from(quantityByUnitMap.entries())
            .map(([unit, data]) => ({
                unit,
                averageQuantity: data.count > 0 ? data.total / data.count : 0
            }))
            .sort((a, b) => b.averageQuantity - a.averageQuantity);
        
        const uniqueProductsDelivered = deliveredProductMap.size;

        return {
            totalProducers,
            totalApplications,
            approvalRate: Math.round(approvalRate * 100) / 100, // 2 casas decimais
            producersByStatus,
            topProducers,
            topProducts,
            ordersByCanteen,
            totalOrders,
            deliveredProducts,
            deliveryStats: {
                deliveryRate: Math.round(deliveryRate * 100) / 100,
                averageQuantityByUnit,
                uniqueProductsDelivered
            }
        };
    }
}

