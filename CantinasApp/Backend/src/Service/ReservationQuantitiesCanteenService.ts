import { ReservationQuantitiesCanteen } from "../Model/ReservationQuantitiesCanteen";
import { Dish } from "../Model/Dish";
import { Refeitorio } from "../Model/Refeitorio";
import { Canteen } from "../Model/Canteen";
import { Recipe } from "../Model/Recipe";
import { Ingredient } from "../Model/Ingredient";
import { Product } from "../Model/Product";
import { Unit } from "../Model/Unit";
import { DishType } from "../Model/DishType";

// Interface para tipar o resultado do findAll com includes
interface ReservationQuantitiesCanteenWithDish extends ReservationQuantitiesCanteen {
    dish?: Dish & {
        dishType?: DishType;
    };
}

export class ReservationQuantitiesCanteenService {
    async getCanteenProductionStatistics(canteenId: number, filters?: {
        date?: string;
        dateRangeStart?: string;
        dateRangeEnd?: string;
        dishId?: number;
        refeitorioId?: number;
        dishTypeId?: number; // Filtrar por tipo de prato (Carne, Peixe, Vegetariano)
        period?: string; // "day", "week", "month", "year"
        dayOfWeek?: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
    }) {
        const { Op } = require("sequelize");
        
        const whereClause: any = {
            canteenId: canteenId
        };

        // Filtro por período
        if (filters?.period) {
            if (filters.period === "day" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                const month = filterDate.getUTCMonth();
                const day = filterDate.getUTCDate();
                
                const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfDay, endOfDay]
                };
            } else if (filters.period === "week" && filters?.dateRangeStart && filters?.dateRangeEnd) {
                const startDate = new Date(filters.dateRangeStart);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(filters.dateRangeEnd);
                endDate.setHours(23, 59, 59, 999);
                
                whereClause.date = {
                    [Op.between]: [startDate, endDate]
                };
            } else if (filters.period === "month" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                const month = filterDate.getUTCMonth();
                
                const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
                const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfMonth, endOfMonth]
                };
            } else if (filters.period === "year" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                
                const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
                const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfYear, endOfYear]
                };
            }
        } else if (filters?.date && !filters?.period) {
            // Filtro por data específica (sem período)
            const filterDate = new Date(filters.date);
            const year = filterDate.getUTCFullYear();
            const month = filterDate.getUTCMonth();
            const day = filterDate.getUTCDate();
            
            const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
            
            whereClause.date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        // Filtro por intervalo de datas (sem período)
        if (filters?.dateRangeStart && filters?.dateRangeEnd && !filters?.period) {
            const startDate = new Date(filters.dateRangeStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filters.dateRangeEnd);
            endDate.setHours(23, 59, 59, 999);
            
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        // Filtro por dia da semana (dentro de um intervalo de datas)
        if (filters?.dayOfWeek !== undefined && filters?.dateRangeStart && filters?.dateRangeEnd) {
            // Este filtro será aplicado após buscar os registos, filtrando por dia da semana
            // Por enquanto, vamos buscar todos os registos do intervalo e filtrar depois
        }

        // Filtro por prato
        if (filters?.dishId) {
            whereClause.dishId = filters.dishId;
        }

        // Filtro por refeitório
        if (filters?.refeitorioId) {
            whereClause.refeitorioId = filters.refeitorioId;
        }

        let records = await ReservationQuantitiesCanteen.findAll({
            where: whereClause,
            include: [
                { 
                    model: Dish, 
                    as: "dish", 
                    attributes: ["id", "name", "dishTypeId"],
                    include: [
                        { 
                            model: DishType, 
                            as: "dishType", 
                            attributes: ["id", "name"],
                            required: false
                        }
                    ],
                    where: filters?.dishTypeId ? { dishTypeId: filters.dishTypeId } : undefined,
                    required: filters?.dishTypeId ? true : false
                },
                { model: Refeitorio, as: "refeitorio", attributes: ["id", "name"] },
                { model: Canteen, as: "canteen", attributes: ["id", "name"] }
            ],
            order: [["date", "DESC"], ["dishId", "ASC"]]
        }) as ReservationQuantitiesCanteenWithDish[];

        // Filtro por dia da semana (aplicado após buscar os registos)
        if (filters?.dayOfWeek !== undefined && filters?.dateRangeStart && filters?.dateRangeEnd) {
            records = records.filter(record => {
                const recordDate = new Date(record.date);
                const dayOfWeek = recordDate.getDay(); // 0=Domingo, 1=Segunda, ..., 6=Sábado
                return dayOfWeek === filters.dayOfWeek;
            });
        }

        // Calcular totais
        const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0);

        return {
            records,
            totalQuantity,
            totalRecords: records.length
        };
    }

    /**
     * Calcula as quantidades de ingredientes produzidos baseado nas quantidades de pratos
     * Multiplica: ingredient.quantity × reservation_quantities_canteen.quantity
     * Agrupa por: dishTypeId, productId, unitId
     */
    async getCanteenIngredientsStatistics(canteenId: number, filters?: {
        date?: string;
        dateRangeStart?: string;
        dateRangeEnd?: string;
        dishId?: number;
        refeitorioId?: number;
        dishTypeId?: number; // Filtrar por tipo de prato (Carne, Peixe, Vegetariano)
        period?: string; // "day", "week", "month", "year"
        dayOfWeek?: number; // 0=Domingo, 1=Segunda, ..., 6=Sábado
    }) {
        const { Op } = require("sequelize");
        
        // Primeiro, buscar os registos de produção (mesma lógica do método anterior)
        const whereClause: any = {
            canteenId: canteenId
        };

        // Aplicar os mesmos filtros de data do método anterior
        if (filters?.period) {
            if (filters.period === "day" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                const month = filterDate.getUTCMonth();
                const day = filterDate.getUTCDate();
                
                const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
                const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfDay, endOfDay]
                };
            } else if (filters.period === "week" && filters?.dateRangeStart && filters?.dateRangeEnd) {
                const startDate = new Date(filters.dateRangeStart);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(filters.dateRangeEnd);
                endDate.setHours(23, 59, 59, 999);
                
                whereClause.date = {
                    [Op.between]: [startDate, endDate]
                };
            } else if (filters.period === "month" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                const month = filterDate.getUTCMonth();
                
                const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
                const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfMonth, endOfMonth]
                };
            } else if (filters.period === "year" && filters?.date) {
                const filterDate = new Date(filters.date);
                const year = filterDate.getUTCFullYear();
                
                const startOfYear = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
                const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
                
                whereClause.date = {
                    [Op.between]: [startOfYear, endOfYear]
                };
            }
        } else if (filters?.date && !filters?.period) {
            const filterDate = new Date(filters.date);
            const year = filterDate.getUTCFullYear();
            const month = filterDate.getUTCMonth();
            const day = filterDate.getUTCDate();
            
            const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
            const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
            
            whereClause.date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        if (filters?.dateRangeStart && filters?.dateRangeEnd && !filters?.period) {
            const startDate = new Date(filters.dateRangeStart);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filters.dateRangeEnd);
            endDate.setHours(23, 59, 59, 999);
            
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        if (filters?.dishId) {
            whereClause.dishId = filters.dishId;
        }

        if (filters?.refeitorioId) {
            whereClause.refeitorioId = filters.refeitorioId;
        }

        // Buscar registos de produção com Dish incluído (precisamos do recipeId e dishTypeId)
        let records = await ReservationQuantitiesCanteen.findAll({
            where: whereClause,
            include: [
                { 
                    model: Dish, 
                    as: "dish", 
                    attributes: ["id", "name", "recipeId", "dishTypeId"],
                    include: [
                        { 
                            model: DishType, 
                            as: "dishType", 
                            attributes: ["id", "name"],
                            required: false
                        }
                    ],
                    required: true
                }
            ],
            order: [["date", "DESC"], ["dishId", "ASC"]]
        }) as ReservationQuantitiesCanteenWithDish[];

        // Filtro por dia da semana
        if (filters?.dayOfWeek !== undefined && filters?.dateRangeStart && filters?.dateRangeEnd) {
            records = records.filter(record => {
                const recordDate = new Date(record.date);
                const dayOfWeek = recordDate.getDay();
                return dayOfWeek === filters.dayOfWeek;
            });
        }

        // Agora calcular as quantidades de ingredientes
        // Map para agrupar por: dishTypeId + productId + unitId
        const ingredientsMap = new Map<string, {
            dishTypeId: number;
            dishTypeName: string;
            productId: number;
            productName: string;
            unitId: number;
            unitName: string;
            totalQuantity: number;
        }>();

        // Buscar todos os ingredientes de uma vez (para otimizar)
        const allIngredientIds = new Set<number>();
        const allRecipeIds = new Set<number>();

        for (const record of records) {
            const dish = record.dish;
            if (dish && dish.recipeId) {
                allRecipeIds.add(dish.recipeId);
            }
        }

        // Buscar todas as receitas necessárias
        const recipes = await Recipe.findAll({
            where: {
                id: { [Op.in]: Array.from(allRecipeIds) }
            }
        });

        const recipeMap = new Map(recipes.map(r => [r.id, r]));

        // Coletar todos os IDs de ingredientes
        for (const recipe of recipes) {
            if (Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach((ingId: number) => allIngredientIds.add(ingId));
            }
        }

        // Buscar todos os ingredientes de uma vez
        const ingredients = await Ingredient.findAll({
            where: {
                id: { [Op.in]: Array.from(allIngredientIds) }
            },
            include: [
                { model: Product, as: "product", attributes: ["id", "name"] },
                { model: Unit, as: "unit", attributes: ["id", "name"] }
            ]
        });

        const ingredientMap = new Map(ingredients.map(ing => [ing.id, ing]));

        // Processar cada registo de produção
        for (const record of records) {
            const dish = record.dish;
            if (!dish || !dish.recipeId) continue;

            // Filtrar por dishTypeId se especificado
            if (filters?.dishTypeId && dish.dishTypeId !== filters.dishTypeId) {
                continue;
            }

            const recipe = recipeMap.get(dish.recipeId);
            if (!recipe || !Array.isArray(recipe.ingredients)) continue;

            const dishType = dish.dishType;
            const dishTypeId = dish.dishTypeId;
            const dishTypeName = dishType?.name || `Tipo ${dishTypeId}`;

            // Para cada ingrediente na receita
            for (const ingredientId of recipe.ingredients) {
                const ingredient = ingredientMap.get(ingredientId);
                if (!ingredient) continue;

                const product = (ingredient as any).product;
                const unit = (ingredient as any).unit;

                if (!product || !unit) continue;

                // Calcular quantidade total: ingredient.quantity × reservation_quantities_canteen.quantity
                const totalQuantityForThisRecord = ingredient.quantity * record.quantity;

                // Chave para agrupar: dishTypeId + productId + unitId
                const key = `${dishTypeId}_${ingredient.productId}_${ingredient.unitId}`;

                if (ingredientsMap.has(key)) {
                    // Somar à quantidade existente
                    const existing = ingredientsMap.get(key)!;
                    existing.totalQuantity += totalQuantityForThisRecord;
                } else {
                    // Criar nova entrada
                    ingredientsMap.set(key, {
                        dishTypeId: dishTypeId,
                        dishTypeName: dishTypeName,
                        productId: ingredient.productId,
                        productName: product.name,
                        unitId: ingredient.unitId,
                        unitName: unit.name,
                        totalQuantity: totalQuantityForThisRecord
                    });
                }
            }
        }

        // Converter map para array e agrupar por dishTypeId
        const ingredientsArray = Array.from(ingredientsMap.values());

        // Agrupar por dishTypeId
        const byDishType = new Map<number, {
            dishTypeId: number;
            dishTypeName: string;
            totalDishes: number;
            ingredients: typeof ingredientsArray;
        }>();

        // Primeiro, calcular total de pratos por tipo
        const dishesByType = new Map<number, number>();
        for (const record of records) {
            const dish = record.dish;
            if (!dish) continue;
            if (filters?.dishTypeId && dish.dishTypeId !== filters.dishTypeId) continue;
            
            const currentTotal = dishesByType.get(dish.dishTypeId) || 0;
            dishesByType.set(dish.dishTypeId, currentTotal + record.quantity);
        }

        // Agrupar ingredientes por tipo de prato
        for (const ingredient of ingredientsArray) {
            if (!byDishType.has(ingredient.dishTypeId)) {
                const foundRecord = records.find(r => {
                    const dish = r.dish;
                    return dish && dish.dishTypeId === ingredient.dishTypeId;
                });
                const dishType = foundRecord?.dish?.dishType;

                byDishType.set(ingredient.dishTypeId, {
                    dishTypeId: ingredient.dishTypeId,
                    dishTypeName: ingredient.dishTypeName,
                    totalDishes: dishesByType.get(ingredient.dishTypeId) || 0,
                    ingredients: []
                });
            }

            byDishType.get(ingredient.dishTypeId)!.ingredients.push(ingredient);
        }

        return {
            byDishType: Array.from(byDishType.values()),
            totalIngredients: ingredientsArray,
            summary: {
                totalDishTypes: byDishType.size,
                totalProducts: new Set(ingredientsArray.map(i => i.productId)).size,
                totalQuantity: ingredientsArray.reduce((sum, ing) => sum + ing.totalQuantity, 0)
            }
        };
    }
}

