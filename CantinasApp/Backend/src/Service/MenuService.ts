import { MenuType } from "../Model/MenuType";
import { Meal } from "../Model/Meal";
import { Menu } from "../Model/Menu";
import { Dish } from "../Model/Dish";
import { DishType } from "../Model/DishType";
import { Recipe } from "../Model/Recipe";
import { Ingredient } from "../Model/Ingredient";
import { Product } from "../Model/Product";
import { Allergen } from "../Model/Allergen";
import { NutritionType } from "../Model/NutritionType";
import { Unit } from "../Model/Unit";
import { Canteen } from "../Model/Canteen";
import { Op } from "sequelize";

export class MenuService {

    async createMenu(data: {
        menuTypeId: number;
        initialDate: Date;
        finalDate: Date;
        meals: number[];
        status: "published" | "aproved" | "pending";
        canteenId: number;
    }) {
        if (data.finalDate <= data.initialDate) throw new Error("FINAL_DATE_MUST_BE_GREATER_THAN_INITIAL_DATE");
        
        const menuType = await MenuType.findByPk(data.menuTypeId);
        if (!menuType) throw new Error("MENU_TYPE_NOT_FOUND");

        // Validar se a cantina existe
        const canteen = await Canteen.findByPk(data.canteenId);
        if (!canteen) throw new Error("CANTEEN_NOT_FOUND");

        for (const mId of data.meals) {
            const meal = await Meal.findByPk(mId);
            if (!meal) throw new Error("MEAL_NOT_FOUND");
            // Validar se a meal pertence à mesma cantina
            if (meal.canteenId !== data.canteenId) {
                throw new Error("MEAL_CANTEEN_MISMATCH");
            }
        }

        return await Menu.create(data);
    }

    async listMenus() {
        return await Menu.findAll();
    }

    async getMenuById(id: number) {
        const menu = await Menu.findByPk(id);
        if (!menu) throw new Error("MENU_NOT_FOUND");
        return menu;
    }

    // Returns current week menu with days -> meals and each meal contains allergens (names)
    // and nutrition entries with typeId, name and aggregated percentage.
    async getCurrentWeekMenuDetailed(menuTypeId?: number, weekOffset: number = 0) {
        // Calcular a data da semana baseada no offset
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Encontrar a segunda-feira da semana atual
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Segunda-feira
        const mondayOfCurrentWeek = new Date(today);
        mondayOfCurrentWeek.setDate(today.getDate() + diff);
        
        // Aplicar offset de semanas
        const targetMonday = new Date(mondayOfCurrentWeek);
        targetMonday.setDate(mondayOfCurrentWeek.getDate() + (weekOffset * 7));
        targetMonday.setHours(0, 0, 0, 0);
        
        const targetSunday = new Date(targetMonday);
        targetSunday.setDate(targetMonday.getDate() + 6);
        targetSunday.setHours(23, 59, 59, 999);
        
        // Construir filtro para encontrar menu que se sobrepõe com a semana
        const whereClause: any = {
            initialDate: {
                [Op.lte]: targetSunday,
            },
            finalDate: {
                [Op.gte]: targetMonday,
            }
        };
        
        if (menuTypeId !== undefined) {
            whereClause.menuTypeId = menuTypeId;
        }
        
        // Tentar encontrar menu que se sobrepõe com a semana
        let menu = await Menu.findOne({ 
            where: whereClause,
            order: [["initialDate", "DESC"]] 
        });
        
        // Se não encontrar menu para a semana específica, retornar erro
        if (!menu) {
            throw new Error("MENU_NOT_FOUND");
        }
        
        // Para nursing homes, usar o intervalo completo do menu
        // Para schools, usar segunda a domingo
        let mealDateStart: Date;
        let mealDateEnd: Date;
        
        if (menuTypeId === 2) {
            // Nursing Home: usar todo o intervalo do menu
            mealDateStart = new Date(menu.initialDate);
            mealDateStart.setHours(0, 0, 0, 0);
            mealDateEnd = new Date(menu.finalDate);
            mealDateEnd.setHours(23, 59, 59, 999);
        } else {
            // School: usar apenas segunda a domingo da semana calculada
            mealDateStart = targetMonday;
            mealDateEnd = targetSunday;
        }

        // parse meal ids (menu.meals can be JSON or array)
        let mealIds: number[] = [];
        if (Array.isArray(menu.meals)) {
            mealIds = menu.meals as unknown as number[];
        } else if (typeof menu.meals === 'string') {
            try {
                const parsed = JSON.parse(menu.meals);
                if (Array.isArray(parsed)) mealIds = parsed;
            } catch (e) {
                mealIds = [];
            }
        }

        // Filtrar refeições que estão dentro do intervalo calculado
        const mealDateFilter: any = {
            [Op.gte]: mealDateStart,
            [Op.lte]: mealDateEnd
        };
        
        // Para nursing homes, buscar todas as refeições dentro do intervalo que pertencem a menus com menuTypeId = 2
        // Para schools, usar apenas as refeições do array menu.meals
        let meals;
        if (menuTypeId === 2) {
            // Nursing Home: buscar todos os menus com menuTypeId = 2 que se sobrepõem com o intervalo
            // e depois buscar todas as refeições que estão nesses menus
            const nursingHomeMenus = await Menu.findAll({
                where: {
                    menuTypeId: 2,
                    initialDate: {
                        [Op.lte]: mealDateEnd,
                    },
                    finalDate: {
                        [Op.gte]: mealDateStart,
                    }
                }
            });
            
            // Coletar todos os mealIds de todos os menus de nursing home
            const allNursingHomeMealIds = new Set<number>();
            for (const nhMenu of nursingHomeMenus) {
                let nhMealIds: number[] = [];
                if (Array.isArray(nhMenu.meals)) {
                    nhMealIds = nhMenu.meals as unknown as number[];
                } else if (typeof nhMenu.meals === 'string') {
                    try {
                        const parsed = JSON.parse(nhMenu.meals);
                        if (Array.isArray(parsed)) nhMealIds = parsed;
                    } catch (e) {
                        nhMealIds = [];
                    }
                }
                nhMealIds.forEach(id => allNursingHomeMealIds.add(id));
            }
            
            // Buscar refeições que estão nos menus de nursing home e dentro do intervalo de datas
            meals = await Meal.findAll({ 
                where: { 
                    id: Array.from(allNursingHomeMealIds),
                    date: mealDateFilter
                }, 
                order: [["date", "ASC"]] 
            });
        } else {
            // School: usar apenas refeições do array menu.meals
            meals = await Meal.findAll({ 
                where: { 
                    id: mealIds.length > 0 ? mealIds : [-1],
                    date: mealDateFilter
                }, 
                order: [["date", "ASC"]] 
            });
        }

        // Se não houver refeições para a semana navegada, retornar erro
        if (meals.length === 0) {
            throw new Error("MENU_NOT_FOUND");
        }

        // batch fetch related data (dishes, recipes, ingredients, products)
        const dishIds = Array.from(new Set(meals.map(m => m.dishId)));
        const dishes = await Dish.findAll({ where: { id: dishIds } });
        const dishMap = new Map<number, any>();
        const dishTypeIds = new Set<number>();
        for (const d of dishes) {
            dishMap.set(d.id, d);
            if ((d as any).dishTypeId) dishTypeIds.add((d as any).dishTypeId);
        }

        const dishTypeMap = new Map<number, any>();
        if (dishTypeIds.size) {
            const dTypes = await DishType.findAll({ where: { id: Array.from(dishTypeIds) } });
            for (const dt of dTypes) dishTypeMap.set(dt.id, dt.name);
        }

        const recipeIds = Array.from(new Set(dishes.map((d: any) => d.recipeId).filter(Boolean)));
        const recipes = recipeIds.length ? await Recipe.findAll({ where: { id: recipeIds } }) : [];
        const recipeMap = new Map<number, any>();
        for (const r of recipes) recipeMap.set(r.id, r);

        // collect ingredient ids and later product ids
        const ingredientIds = new Set<number>();
        for (const r of recipes) {
            if (Array.isArray((r as any).ingredients)) {
                for (const ingId of (r as any).ingredients as number[]) ingredientIds.add(ingId);
            }
        }

        const ingredients = ingredientIds.size ? await Ingredient.findAll({ where: { id: Array.from(ingredientIds) } }) : [];
        const ingredientMap = new Map<number, any>();
        const productIds = new Set<number>();
        for (const ing of ingredients) {
            ingredientMap.set(ing.id, ing);
            if ((ing as any).productId) productIds.add((ing as any).productId);
        }

        const products = productIds.size ? await Product.findAll({ where: { id: Array.from(productIds) } }) : [];
        const productMap = new Map<number, any>();
        for (const p of products) productMap.set(p.id, p);

        // preload nutrition types map (capture name and optional unitId if present in DB)
        const nutritionTypes = await NutritionType.findAll();
        const nutritionTypeInfoById = new Map<number, { name: string; unitId?: number }>();
        for (const nt of nutritionTypes) {
            const rec: any = nt;
            const info: { name: string; unitId?: number } = { name: rec.name };
            if (typeof rec.unitId === 'number') info.unitId = rec.unitId;
            nutritionTypeInfoById.set(rec.id, info);
        }

    // collect all allergen ids (numeric) and raw allergen names from products and preload names
        const allergenIds = new Set<number>();
        const rawAllergenNames = new Set<string>();
        for (const p of products) {
            let raw = (p as any).allergens;
            // if stored as JSON string, try parse
            if (typeof raw === 'string') {
                try {
                    raw = JSON.parse(raw);
                } catch (e) {
                    // keep as string
                }
            }
            if (!raw) continue;
            if (Array.isArray(raw)) {
                for (const a of raw) {
                    if (typeof a === 'number') {
                        allergenIds.add(a);
                    } else if (typeof a === 'string') {
                        const num = Number(a);
                        if (!Number.isNaN(num)) allergenIds.add(num);
                        else rawAllergenNames.add(a);
                    } else if (a && typeof a === 'object') {
                        if (typeof a.id === 'number') allergenIds.add(a.id);
                        else if (typeof a.id === 'string' && !Number.isNaN(Number(a.id))) allergenIds.add(Number(a.id));
                        else if (a.name) rawAllergenNames.add(a.name);
                    }
                }
            }
        }
        const allergenMap = new Map<number, string>();
        if (allergenIds.size) {
            const allergens = await Allergen.findAll({ where: { id: Array.from(allergenIds) } });
            for (const a of allergens) allergenMap.set(a.id, a.name);
        }

        // preload units map to interpret ingredient quantities
        const units = await Unit.findAll();
        const unitById = new Map<number, string>();
        for (const u of units) unitById.set((u as any).id, (u as any).name);

        // build days structure
        const daysMap: Record<string, { date: Date; meals: any[] }> = {};
        for (const meal of meals) {
            const dish = dishMap.get(meal.dishId) as any;
            const recipe = dish ? recipeMap.get(dish.recipeId) : null;

            // gather allergens and aggregated nutrition
            const allergenNames = new Set<string>();
            const nutritionAgg = new Map<number, number>();

            if (recipe && Array.isArray((recipe as any).ingredients)) {
                for (const ingId of (recipe as any).ingredients as number[]) {
                    const ing = ingredientMap.get(ingId) as any;
                    if (!ing) continue;
                    const prod = productMap.get(ing.productId) as any;
                    if (!prod) continue;

                    // allergens
                            // normalize allergens field (could be JSON string, array of ids, strings or objects)
                            let rawAll = prod.allergens;
                            if (typeof rawAll === 'string') {
                                try { rawAll = JSON.parse(rawAll); } catch (e) { /* leave as string */ }
                            }
                            if (Array.isArray(rawAll)) {
                                for (const a of rawAll as any[]) {
                                    if (typeof a === 'number') {
                                        let aName = allergenMap.get(a);
                                        if (!aName) {
                                            const aRec = await Allergen.findByPk(a);
                                            if (aRec) {
                                                aName = aRec.name;
                                                allergenMap.set(aRec.id, aRec.name);
                                            }
                                        }
                                        if (aName) allergenNames.add(aName);
                                    } else if (typeof a === 'string') {
                                        const num = Number(a);
                                        if (!Number.isNaN(num)) {
                                            let aName = allergenMap.get(num);
                                            if (!aName) {
                                                const aRec = await Allergen.findByPk(num);
                                                if (aRec) {
                                                    aName = aRec.name;
                                                    allergenMap.set(aRec.id, aRec.name);
                                                }
                                            }
                                            if (aName) allergenNames.add(aName);
                                        } else {
                                            allergenNames.add(a);
                                        }
                                    } else if (a && typeof a === 'object') {
                                        if (a.name) allergenNames.add(a.name);
                                        else if (typeof a.id === 'number') {
                                            let aName = allergenMap.get(a.id);
                                            if (!aName) {
                                                const aRec = await Allergen.findByPk(a.id);
                                                if (aRec) {
                                                    aName = aRec.name;
                                                    allergenMap.set(aRec.id, aRec.name);
                                                }
                                            }
                                            if (aName) allergenNames.add(aName);
                                        } else if (typeof a.id === 'string' && !Number.isNaN(Number(a.id))) {
                                            const nid = Number(a.id);
                                            let aName = allergenMap.get(nid);
                                            if (!aName) {
                                                const aRec = await Allergen.findByPk(nid);
                                                if (aRec) {
                                                    aName = aRec.name;
                                                    allergenMap.set(aRec.id, aRec.name);
                                                }
                                            }
                                            if (aName) allergenNames.add(aName);
                                        }
                                    }
                                }
                            } else if (typeof rawAll === 'string') {
                                // single string allergen name
                                allergenNames.add(rawAll);
                            }

                    // nutrition entries
                    // Normalize nutrition field: may be JSON string or array with string numbers
                    let rawNut = prod.nutrition;
                    if (typeof rawNut === 'string') {
                        try { rawNut = JSON.parse(rawNut); } catch (e) { rawNut = null; }
                    }

                    // determine ingredient mass in grams (if possible)
                    let ingredientGrams: number | null = null;
                    const unitName = unitById.get(ing.unitId) || null;
                    if (unitName === 'g') {
                        ingredientGrams = Number(ing.quantity) || null;
                    } else if (unitName === 'kg') {
                        ingredientGrams = (Number(ing.quantity) || 0) * 1000;
                    } else if (unitName === 'mL' || unitName === 'L') {
                        // cannot reliably convert volume to mass without density; skip
                        ingredientGrams = null;
                    } else {
                        // unit is 'unit', 'box' or unknown - skip (no reliable conversion)
                        ingredientGrams = null;
                    }

                    if (Array.isArray(rawNut) && ingredientGrams && ingredientGrams > 0) {
                        for (const n of rawNut as any[]) {
                            let typeId: number | null = null;
                            if (typeof n?.typeId === 'number') typeId = n.typeId;
                            else if (typeof n?.typeId === 'string' && !Number.isNaN(Number(n.typeId))) typeId = Number(n.typeId);

                            const pct = typeof n?.percentage === 'number' ? n.percentage : (typeof n?.percentage === 'string' && !Number.isNaN(Number(n.percentage)) ? Number(n.percentage) : 0);
                            if (typeId !== null) {
                                // product percentages are per 100g
                                const gramsOfNutrient = (pct * ingredientGrams) / 100;
                                const current = nutritionAgg.get(typeId) || 0;
                                nutritionAgg.set(typeId, current + gramsOfNutrient);
                            }
                        }
                    }
                }
            }

            // compute total grams considered (from ingredients where conversion available)
            let totalGrams = 0;
            if (recipe && Array.isArray((recipe as any).ingredients)) {
                for (const ingId of (recipe as any).ingredients as number[]) {
                    const ing = ingredientMap.get(ingId) as any;
                    if (!ing) continue;
                    const unitName = unitById.get(ing.unitId) || null;
                    if (unitName === 'g') totalGrams += Number(ing.quantity) || 0;
                    else if (unitName === 'kg') totalGrams += (Number(ing.quantity) || 0) * 1000;
                }
            }

            const nutrition = [] as any[];
            for (const [typeId, totalGramsOfNutrient] of Array.from(nutritionAgg.entries())) {
                const info = nutritionTypeInfoById.get(typeId) || null;
                let name = info ? info.name : null;
                // try fallback lookup
                if (!name) {
                    const ntRec = await NutritionType.findByPk(typeId);
                    if (ntRec) {
                        name = (ntRec as any).name;
                        nutritionTypeInfoById.set(ntRec.id, { name: (ntRec as any).name, unitId: (ntRec as any).unitId });
                    }
                }

                const grams = totalGramsOfNutrient; // already summed in grams
                const unitIdForType = info?.unitId || (info === null ? undefined : info.unitId);
                const unitNameForType = unitIdForType ? unitById.get(unitIdForType) : null;

                // convert grams to the nutrition type unit if necessary
                let valueInUnit: number | null = null;
                if (unitNameForType === 'g' || unitNameForType === 'gram' || !unitNameForType) {
                    // default to grams
                    valueInUnit = grams;
                } else if (unitNameForType === 'kg') {
                    valueInUnit = grams / 1000;
                } else if (unitNameForType === 'mg') {
                    valueInUnit = grams * 1000;
                } else {
                    // unknown unit mapping: keep grams as fallback
                    valueInUnit = grams;
                }

                const percentageOfMeal = totalGrams > 0 ? (grams / totalGrams) * 100 : null;
                nutrition.push({ typeId, name, unitId: unitIdForType || null, unit: unitNameForType || 'g', value: Number((valueInUnit || 0).toFixed(2)), grams, percentageOfMeal });
            }

            const key = new Date(meal.date).toISOString().split('T')[0];
            if (!daysMap[key]) daysMap[key] = { date: new Date(meal.date), meals: [] };
            const mealEntry: any = {
                id: meal.id,
                name: meal.name,
                mealTypeId: meal.mealTypeId,
                dishId: meal.dishId,
                dishName: dish?.name || null,
                type: dish ? dishTypeMap.get(dish.dishTypeId) : null,
                allergens: Array.from(allergenNames),
                nutrition
            };

            // no debug payload by default

            daysMap[key].meals.push(mealEntry);
        }

        const days = Object.values(daysMap).sort((a, b) => a.date.getTime() - b.date.getTime());

        return { id: menu.id, initialDate: menu.initialDate, finalDate: menu.finalDate, days };
    }

    async updateMenuStatus(id: number, status: "published" | "aproved" | "pending") {
        const menu = await Menu.findByPk(id);
        if (!menu) throw new Error("MENU_NOT_FOUND");
        menu.status = status;
        await menu.save();
        return menu;
    }

    async getMenusByCanteen(canteenId: number) {
        const menus = await Menu.findAll({ where: { canteenId } });
        return menus;
    }
}