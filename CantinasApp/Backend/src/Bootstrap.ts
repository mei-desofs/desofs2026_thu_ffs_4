import { Ingredient } from './Model/Ingredient';
import { Recipe } from './Model/Recipe';
import { Dish } from './Model/Dish';
import { Meal } from './Model/Meal';
import { Menu } from './Model/Menu';
import { Batch } from './Model/Batch';
import { Stock } from './Model/Stock';
import { Product } from "./Model/Product";
import { Information } from './Model/Information';
import { AverageReservation } from './Model/AverageReservation';
import { Unit, UnitEnum } from './Model/Unit';
import { Allergen } from './Model/Allergen';
import { DishType } from './Model/DishType';
import { MealType } from './Model/MealType';
import { MenuType } from './Model/MenuType';
import { NutritionType } from './Model/NutritionType';
import { ProductType } from './Model/ProductType';
import { User } from './Model/User';
import { Institution } from './Model/Institution';
import { Canteen } from './Model/Canteen';
import { Refeitorio } from './Model/Refeitorio';
import { CanteenRefeitorio } from './Model/CanteenRefeitorio';
import bcrypt from "bcrypt";

export default async function bootstrap() {
    // Definir mealsToInsert no início para estar acessível em todo o bootstrap
    const mealsToInsert = [
        // PRATOS DE CARNE
        {
            mealTypeId: 1,
            name: "Frango Assado",
            date: new Date(2025, 11, 22),
            dishId: 1
        },
        {
            mealTypeId: 1,
            name: "Carne de Vaca Estufada",
            date: new Date(2025, 11, 23),
            dishId: 2
        },
        {
            mealTypeId: 1,
            name: "Peru Grelhado",
            date: new Date(2025, 11, 24),
            dishId: 3
        },
        {
            mealTypeId: 1,
            name: "Carne de Porco",
            date: new Date(2025, 11, 25),
            dishId: 4
        },
        {
            mealTypeId: 1,
            name: "Pato Salteado",
            date: new Date(2025, 11, 26),
            dishId: 5
        },
        // PRATOS DE PEIXE
        {
            mealTypeId: 1,
            name: "Bacalhau à Brás",
            date: new Date(2025, 11, 22),
            dishId: 6
        },
        {
            mealTypeId: 1,
            name: "Salmão no Forno",
            date: new Date(2025, 11, 23),
            dishId: 7
        },
        {
            mealTypeId: 1,
            name: "Arroz de Atum",
            date: new Date(2025, 11, 24),
            dishId: 8
        },
        {
            mealTypeId: 1,
            name: "Filetes de Dourada",
            date: new Date(2025, 11, 25),
            dishId: 9
        },
        {
            mealTypeId: 1,
            name: "Lulas Estufadas",
            date: new Date(2025, 11, 26),
            dishId: 10
        },
        // PRATOS VEGETARIANOS
        {
            mealTypeId: 1,
            name: "Massa",
            date: new Date(2025, 11, 22),
            dishId: 11
        },
        {
            mealTypeId: 1,
            name: "Grão-de-bico",
            date: new Date(2025, 11, 23),
            dishId: 12
        },
        {
            mealTypeId: 1,
            name: "Feijoada Vegetariana",
            date: new Date(2025, 11, 24),
            dishId: 13
        },
        {
            mealTypeId: 1,
            name: "Salada",
            date: new Date(2025, 11, 25),
            dishId: 14
        },
        {
            mealTypeId: 1,
            name: "Sopa",
            date: new Date(2025, 11, 26),
            dishId: 15
        }
    ];

    try {
        // --- PRODUCT TYPES (devem ser criados ANTES dos products) ---
        const productTypesToInsert = [
            { name: "Fruta" },
            { name: "Vegetal" },
            { name: "Laticínios" },
            { name: "Carne" },
            { name: "Peixe" },
            { name: "Cereal" },
        ];

        for (const productType of productTypesToInsert) {
            const exists = await ProductType.findOne({ where: { name: productType.name } });
            if (!exists) {
                await ProductType.create(productType);
            }
        }
        console.log("✅ Product Types seeded");

        // --- PRODUCTS ---
            const productsToInsert = [
            {
                name: "Maçã",
                typeId: 1,
                nutrition: [
                { typeId: 1, percentage: 1 },
                { typeId: 2, percentage: 14 }
                ],
                allergens: []
            },
            {
                name: "Ovo",
                typeId: 3,
                nutrition: [
                { typeId: 1, percentage: 13 },
                { typeId: 3, percentage: 11 }
                ],
                allergens: [3]
            },
            {
                name: "Leite",
                typeId: 3,
                nutrition: [
                { typeId: 1, percentage: 3 },
                { typeId: 2, percentage: 5 },
                { typeId: 3, percentage: 1 }
                ],
                allergens: [1]
            },
            {
                name: "Banana",
                typeId: 1,
                nutrition: [
                { typeId: 1, percentage: 1 },
                { typeId: 2, percentage: 23 },
                { typeId: 4, percentage: 89 }
                ],
                allergens: []
            },
            {
                name: "Cenoura",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 1 },
                { typeId: 2, percentage: 10 },
                { typeId: 4, percentage: 41 }
                ],
                allergens: []
            },
            {
                name: "Frango",
                typeId: 4,
                nutrition: [
                { typeId: 1, percentage: 27 },
                { typeId: 3, percentage: 3 },
                { typeId: 4, percentage: 25 }
                ],
                allergens: []
            },
            {
                name: "Carne de Vaca",
                typeId: 4,
                nutrition: [
                { typeId: 1, percentage: 26 },
                { typeId: 3, percentage: 15 },
                { typeId: 4, percentage: 30 }
                ],
                allergens: []
            },
            {
                name: "Pera",
                typeId: 1,
                nutrition: [
                { typeId: 1, percentage: 0.3 },
                { typeId: 2, percentage: 14 },
                { typeId: 4, percentage: 52 }
                ],
                allergens: []
            },
            {
                name: "Curgete",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 1.2 },
                { typeId: 2, percentage: 3 },
                { typeId: 4, percentage: 17 }
                ],
                allergens: []
            },
            {
                name: "Brócolos",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 2.8 },
                { typeId: 2, percentage: 7 },
                { typeId: 4, percentage: 34 }
                ],
                allergens: []
            },
            {
                name: "Batata",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 2 },
                { typeId: 2, percentage: 17 },
                { typeId: 4, percentage: 77 }
                ],
                allergens: []
            },
            {
                name: "Tomate",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 0.9 },
                { typeId: 2, percentage: 3.9 },
                { typeId: 4, percentage: 18 }
                ],
                allergens: []
            },
            {
                name: "Carne de Porco",
                typeId: 4,
                nutrition: [
                { typeId: 1, percentage: 25 },
                { typeId: 3, percentage: 20 },
                { typeId: 4, percentage: 30 }
                ],
                allergens: []
            },
            {
                name: "Salmão",
                typeId: 5,
                nutrition: [
                { typeId: 1, percentage: 20 },
                { typeId: 3, percentage: 13 },
                { typeId: 4, percentage: 10 }
                ],
                allergens: [7]
            },
            {
                name: "Atum",
                typeId: 5,
                nutrition: [
                { typeId: 1, percentage: 23 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 20 }
                ],
                allergens: [7]
            },
            {
                name: "Arroz",
                typeId: 6,
                nutrition: [
                { typeId: 1, percentage: 2.4 },
                { typeId: 2, percentage: 28 },
                { typeId: 4, percentage: 10 }
                ],
                allergens: []
            },
            {
                name: "Peru",
                typeId: 4,
                nutrition: [
                { typeId: 1, percentage: 29 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 17 }
                ],
                allergens: []
            },
            {
                name: "Pato",
                typeId: 4,
                nutrition: [
                { typeId: 1, percentage: 29 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 17 }
                ],
                allergens: []
            },
            {
                name: "Bacalhau",
                typeId: 5,
                nutrition: [
                { typeId: 1, percentage: 23 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 20 }
                ],
                allergens: [7]
            },
            {
                name: "Dourada",
                typeId: 5,
                nutrition: [
                { typeId: 1, percentage: 23 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 20 }
                ],
                allergens: [7]
            },
            {
                name: "Lulas",
                typeId: 5,
                nutrition: [
                { typeId: 1, percentage: 23 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 20 }
                ],
                allergens: [7]
            },
            {
                name: "Feijão",
                typeId: 6,
                nutrition: [
                { typeId: 1, percentage: 21 },
                { typeId: 2, percentage: 62 },
                { typeId: 3, percentage: 1 },
                { typeId: 4, percentage: 30 }
                ],
                allergens: []
            },
            {
                name: "Massa",
                typeId: 6,
                nutrition: [
                { typeId: 1, percentage: 13 },
                { typeId: 2, percentage: 75 },
                { typeId: 3, percentage: 1.5 },
                { typeId: 4, percentage: 10 }
                ],
                allergens: [2]
            },
            {
                name: "Grão de bico",
                typeId: 6,
                nutrition: [
                { typeId: 1, percentage: 13 },
                { typeId: 2, percentage: 75 },
                { typeId: 3, percentage: 1.5 },
                { typeId: 4, percentage: 10 }
                ],
                allergens: [2]
            },
            {
                name: "Alface",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 1.4 },
                { typeId: 2, percentage: 2.9 },
                { typeId: 4, percentage: 15 }
                ],
                allergens: []
            },
            {
                name: "Cebola",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 1.1 },
                { typeId: 2, percentage: 9 },
                { typeId: 4, percentage: 40 }
                ],
                allergens: []
            },
            {
                name: "Abóbora",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 1 },
                { typeId: 2, percentage: 7 },
                { typeId: 4, percentage: 26 }
                ],
                allergens: []
            },
            {
                name: "Azeite",
                typeId: 6,
                nutrition: [
                { typeId: 3, percentage: 5 },
                { typeId: 4, percentage: 5 }
                ],
                allergens: []
            },
            {
                name: "Alho",
                typeId: 2,
                nutrition: [
                { typeId: 1, percentage: 6.4 },
                { typeId: 2, percentage: 33 },
                { typeId: 4, percentage: 11 }
                ],
                allergens: []
            }
            ];


        for (const product of productsToInsert) {
            const exists = await Product.findOne({
                where: { name: product.name }
            });

            if (!exists) {
                await Product.create(product);
            }
        }

        console.log('Products seeded');


        //make this until dishId 60
        const average_reservationsToInsert: {
            dishId: number;
            typeOfMealId: 1 | 2;
            canteenId: number;
            avgReservations: number;
             }[] = [
            { dishId: 1, typeOfMealId: 1, canteenId: 1, avgReservations: 50 },
            { dishId: 1, typeOfMealId: 2, canteenId: 1, avgReservations: 20 },
            { dishId: 2, typeOfMealId: 1, canteenId: 1, avgReservations: 40 },
            { dishId: 2, typeOfMealId: 2, canteenId: 1, avgReservations: 15 },
            { dishId: 3, typeOfMealId: 1, canteenId: 1, avgReservations: 60 },
            { dishId: 3, typeOfMealId: 2, canteenId: 1, avgReservations: 25 },
            { dishId: 4, typeOfMealId: 1, canteenId: 1, avgReservations: 30 },
            { dishId: 4, typeOfMealId: 2, canteenId: 1, avgReservations: 10 },
            { dishId: 5, typeOfMealId: 1, canteenId: 1, avgReservations: 45 },
            { dishId: 5, typeOfMealId: 2, canteenId: 1, avgReservations: 18 },
            { dishId: 6, typeOfMealId: 1, canteenId: 1, avgReservations: 55 },
            { dishId: 6, typeOfMealId: 2, canteenId: 1, avgReservations: 22 },
            { dishId: 7, typeOfMealId: 1, canteenId: 1, avgReservations: 38 },
            { dishId: 7, typeOfMealId: 2, canteenId: 1, avgReservations: 14 },
            { dishId: 8, typeOfMealId: 1, canteenId: 1, avgReservations: 420 },
            { dishId: 8, typeOfMealId: 2, canteenId: 1, avgReservations: 300 },
            { dishId: 9, typeOfMealId: 1, canteenId: 1, avgReservations: 42 },
            { dishId: 9, typeOfMealId: 2, canteenId: 1, avgReservations: 16 },
            { dishId:10, typeOfMealId :1, canteenId: 1, avgReservations :48},
            { dishId :10 ,typeOfMealId :2 ,canteenId: 1, avgReservations :19},
            { dishId :11 ,typeOfMealId :1 ,canteenId: 1, avgReservations :52},
            { dishId :11 ,typeOfMealId :2 ,canteenId: 1, avgReservations :20},
            { dishId :12 ,typeOfMealId :1 ,canteenId: 1, avgReservations :35},
            { dishId :12 ,typeOfMealId :2 ,canteenId: 1, avgReservations :13},
            { dishId :13 ,typeOfMealId :1 ,canteenId: 1, avgReservations :40},
            { dishId :13 ,typeOfMealId :2 ,canteenId: 1, avgReservations :17},
            { dishId :14 ,typeOfMealId :1 ,canteenId: 1, avgReservations :60},
            { dishId :14 ,typeOfMealId :2 ,canteenId: 1, avgReservations :25},
            { dishId :15 ,typeOfMealId :1 ,canteenId: 1, avgReservations :28},
            { dishId :15 ,typeOfMealId :2 ,canteenId: 1, avgReservations :12},
            { dishId :16 ,typeOfMealId :1 ,canteenId: 1, avgReservations :32},
            { dishId :16 ,typeOfMealId :2 ,canteenId: 1, avgReservations :14},
            { dishId :17 ,typeOfMealId :1 ,canteenId: 1, avgReservations :45},
            { dishId :17 ,typeOfMealId :2 ,canteenId: 1, avgReservations :18},
            { dishId :18 ,typeOfMealId :1 ,canteenId: 1, avgReservations :50},
            { dishId :18 ,typeOfMealId :2 ,canteenId: 1, avgReservations :20},
            { dishId :19 ,typeOfMealId :1 ,canteenId: 1, avgReservations :38},
            { dishId :19 ,typeOfMealId :2 ,canteenId: 1, avgReservations :15},
            { dishId :20 ,typeOfMealId :1 ,canteenId: 1, avgReservations :42},
            { dishId :20 ,typeOfMealId :2 ,canteenId: 1, avgReservations :16},
            { dishId: 21, typeOfMealId: 1, canteenId: 1, avgReservations: 55 },
            { dishId: 21, typeOfMealId: 2, canteenId: 1, avgReservations: 22 },
            { dishId: 22, typeOfMealId: 1, canteenId: 1, avgReservations: 30 },
            { dishId: 22, typeOfMealId: 2, canteenId: 1, avgReservations: 10 },
            { dishId: 23, typeOfMealId: 1, canteenId: 1, avgReservations: 40 },
            { dishId: 23, typeOfMealId: 2, canteenId: 1, avgReservations: 17 },
            { dishId: 24, typeOfMealId: 1, canteenId: 1, avgReservations: 60 },
            { dishId: 24, typeOfMealId: 2, canteenId: 1, avgReservations: 30 },
            { dishId: 25, typeOfMealId: 1, canteenId: 1, avgReservations: 35 },
            { dishId: 25, typeOfMealId: 2, canteenId: 1, avgReservations: 13 },
            { dishId: 26, typeOfMealId: 1, canteenId: 1, avgReservations: 45 },
            { dishId: 26, typeOfMealId: 2, canteenId: 1, avgReservations: 18 },
            { dishId: 27, typeOfMealId: 1, canteenId: 1, avgReservations: 50 },
            { dishId: 27, typeOfMealId: 2, canteenId: 1, avgReservations: 20 },
            { dishId: 28, typeOfMealId: 1, canteenId: 1, avgReservations: 35 },
            { dishId: 28, typeOfMealId: 2, canteenId: 1, avgReservations: 15 },
            { dishId: 29, typeOfMealId: 1, canteenId: 1, avgReservations: 40 },
            { dishId: 29, typeOfMealId: 2, canteenId: 1, avgReservations: 17 },
            { dishId: 30, typeOfMealId: 1, canteenId: 1, avgReservations: 55 },
            { dishId: 30, typeOfMealId: 2, canteenId: 1, avgReservations: 22 },
            { dishId: 31, typeOfMealId: 1, canteenId: 1, avgReservations: 30 },
            { dishId: 31, typeOfMealId: 2, canteenId: 1, avgReservations: 10 },
            { dishId: 32, typeOfMealId: 1, canteenId: 1, avgReservations: 40 },
            { dishId: 32, typeOfMealId: 2, canteenId: 1, avgReservations: 17 },
            { dishId :33 ,typeOfMealId :1 ,canteenId: 1, avgReservations :60},
            { dishId :33 ,typeOfMealId :2 ,canteenId: 1, avgReservations :30},
            { dishId :34 ,typeOfMealId :1 ,canteenId: 1, avgReservations :45},
            { dishId :34 ,typeOfMealId :2 ,canteenId: 1, avgReservations :18},
            { dishId :35 ,typeOfMealId :1 ,canteenId: 1, avgReservations :50},
            { dishId :35 ,typeOfMealId :2 ,canteenId: 1, avgReservations :20},
            { dishId :36 ,typeOfMealId :1 ,canteenId: 1, avgReservations :48},
            { dishId :36 ,typeOfMealId :2 ,canteenId: 1, avgReservations :19},
            { dishId :37 ,typeOfMealId :1 ,canteenId: 1, avgReservations :55},
            { dishId :37 ,typeOfMealId :2 ,canteenId: 1, avgReservations :22},
            { dishId :38 ,typeOfMealId :1 ,canteenId: 1, avgReservations :33},
            { dishId :38 ,typeOfMealId :2 ,canteenId: 1, avgReservations :12},
            { dishId :39 ,typeOfMealId :1 ,canteenId: 1, avgReservations :42},
            { dishId :39 ,typeOfMealId :2 ,canteenId: 1, avgReservations :16},
            { dishId :40 ,typeOfMealId :1 ,canteenId: 1, avgReservations :50},
            { dishId :40 ,typeOfMealId :2 ,canteenId: 1, avgReservations :20},
            { dishId :41 ,typeOfMealId :1 ,canteenId: 1, avgReservations :35},
            { dishId :41 ,typeOfMealId :2 ,canteenId: 1, avgReservations :15},
            { dishId :42 ,typeOfMealId :1 ,canteenId: 1, avgReservations :40},
            { dishId :42 ,typeOfMealId :2 ,canteenId: 1, avgReservations :17},
            { dishId :43 ,typeOfMealId :1 ,canteenId: 1, avgReservations :55},
            { dishId :43 ,typeOfMealId :2 ,canteenId: 1, avgReservations :22},
            { dishId :44 ,typeOfMealId :1 ,canteenId: 1, avgReservations :30},
            { dishId :44 ,typeOfMealId :2 ,canteenId: 1, avgReservations :10},
            { dishId :45 ,typeOfMealId :1 ,canteenId: 1, avgReservations :40},
            { dishId :45 ,typeOfMealId :2 ,canteenId: 1, avgReservations :17},
            { dishId: 46, typeOfMealId: 1, canteenId: 1, avgReservations: 60 },
            { dishId: 46, typeOfMealId: 2, canteenId: 1, avgReservations: 30 },
            { dishId: 47, typeOfMealId: 1, canteenId: 1, avgReservations: 45 },
            { dishId: 47, typeOfMealId: 2, canteenId: 1, avgReservations: 18 },
            { dishId: 48, typeOfMealId: 1, canteenId: 1, avgReservations: 50 },
            { dishId: 48, typeOfMealId: 2, canteenId: 1, avgReservations: 20 },
            { dishId: 49, typeOfMealId: 1, canteenId: 1, avgReservations: 48 },
            { dishId: 49, typeOfMealId: 2, canteenId: 1, avgReservations: 19 },
            { dishId: 50, typeOfMealId: 1, canteenId: 1, avgReservations: 55 },
            { dishId: 50, typeOfMealId: 2, canteenId: 1, avgReservations: 22 },
            { dishId: 51, typeOfMealId: 1, canteenId: 1, avgReservations: 33 },
            { dishId: 51, typeOfMealId: 2, canteenId: 1, avgReservations: 12 },
            { dishId: 52, typeOfMealId: 1, canteenId: 1, avgReservations: 42 },
            { dishId: 52, typeOfMealId: 2, canteenId: 1, avgReservations: 16 },
            { dishId: 53, typeOfMealId: 1, canteenId: 1, avgReservations: 50 },
            { dishId: 53, typeOfMealId: 2, canteenId: 1,  avgReservations: 20 },
            { dishId: 54, typeOfMealId: 1, canteenId: 1,  avgReservations: 35 },
            { dishId: 54, typeOfMealId: 2, canteenId: 1,  avgReservations: 15 },
            { dishId: 55, typeOfMealId: 1, canteenId: 1,  avgReservations: 40 },
            { dishId: 55, typeOfMealId: 2, canteenId: 1,  avgReservations: 17 },
            { dishId: 56, typeOfMealId: 1, canteenId: 1,  avgReservations: 55 },
            { dishId: 56, typeOfMealId: 2, canteenId: 1,  avgReservations: 22 },
            { dishId: 57, typeOfMealId: 1, canteenId: 1,  avgReservations: 30 },
            { dishId: 57, typeOfMealId: 2, canteenId: 1,  avgReservations: 10 },
            { dishId: 58, typeOfMealId: 1, canteenId: 1,  avgReservations: 40 },
            { dishId: 58, typeOfMealId: 2, canteenId: 1,  avgReservations: 17 },
            { dishId: 59, typeOfMealId: 1, canteenId: 1,  avgReservations: 60 },
            { dishId: 59, typeOfMealId: 2, canteenId: 1,  avgReservations: 30 },
            { dishId: 60, typeOfMealId: 1, canteenId: 1,  avgReservations: 45 },
            { dishId: 60, typeOfMealId: 2, canteenId: 1,  avgReservations: 18 },
            { dishId: 1, typeOfMealId: 1, canteenId: 2, avgReservations: 50 },
            { dishId: 1, typeOfMealId: 2, canteenId: 2, avgReservations: 20 },
            { dishId: 2, typeOfMealId: 1, canteenId: 2, avgReservations: 40 },
            { dishId: 2, typeOfMealId: 2, canteenId: 2, avgReservations: 15 },
            { dishId: 3, typeOfMealId: 1, canteenId: 2, avgReservations: 60 },
            { dishId: 3, typeOfMealId: 2, canteenId: 2, avgReservations: 25 },
            { dishId: 4, typeOfMealId: 1, canteenId: 2, avgReservations: 30 },
            { dishId: 4, typeOfMealId: 2, canteenId: 2, avgReservations: 10 },
            { dishId: 5, typeOfMealId: 1, canteenId: 2, avgReservations: 45 },
            { dishId: 5, typeOfMealId: 2, canteenId: 2, avgReservations: 18 },
            { dishId: 6, typeOfMealId: 1, canteenId: 2, avgReservations: 55 },
            { dishId: 6, typeOfMealId: 2, canteenId: 2, avgReservations: 22 },
            { dishId: 7, typeOfMealId: 1, canteenId: 2, avgReservations: 38 },
            { dishId: 7, typeOfMealId: 2, canteenId: 2, avgReservations: 14 },
            { dishId: 8, typeOfMealId: 1, canteenId: 2, avgReservations: 420 },
            { dishId: 8, typeOfMealId: 2, canteenId: 2, avgReservations: 300 },
            { dishId: 9, typeOfMealId: 1, canteenId: 2, avgReservations: 42 },
            { dishId: 9, typeOfMealId: 2, canteenId: 2, avgReservations: 16 },
            { dishId:10, typeOfMealId :1, canteenId: 2, avgReservations :48},
            { dishId :10 ,typeOfMealId :2 ,canteenId: 2, avgReservations :19},
            { dishId :11 ,typeOfMealId :1 ,canteenId: 2, avgReservations :52},
            { dishId :11 ,typeOfMealId :2 ,canteenId: 2, avgReservations :20},
            { dishId :12 ,typeOfMealId :1 ,canteenId: 2, avgReservations :35},
            { dishId :12 ,typeOfMealId :2 ,canteenId: 2, avgReservations :13},
            { dishId :13 ,typeOfMealId :1 ,canteenId: 2, avgReservations :40},
            { dishId :13 ,typeOfMealId :2 ,canteenId: 2, avgReservations :17},
            { dishId :14 ,typeOfMealId :1 ,canteenId: 2, avgReservations :60},
            { dishId :14 ,typeOfMealId :2 ,canteenId: 2, avgReservations :25},
            { dishId :15 ,typeOfMealId :1 ,canteenId: 2, avgReservations :28},
            { dishId :15 ,typeOfMealId :2 ,canteenId: 2, avgReservations :12},
            { dishId :16 ,typeOfMealId :1 ,canteenId: 2, avgReservations :32},
            { dishId :16 ,typeOfMealId :2 ,canteenId: 2, avgReservations :14},
            { dishId :17 ,typeOfMealId :1 ,canteenId: 2, avgReservations :45},
            { dishId :17 ,typeOfMealId :2 ,canteenId: 2, avgReservations :18},
            { dishId :18 ,typeOfMealId :1 ,canteenId: 2, avgReservations :50},
            { dishId :18 ,typeOfMealId :2 ,canteenId: 2, avgReservations :20},
            { dishId :19 ,typeOfMealId :1 ,canteenId: 2, avgReservations :38},
            { dishId :19 ,typeOfMealId :2 ,canteenId: 2, avgReservations :15},
            { dishId :20 ,typeOfMealId :1 ,canteenId: 2, avgReservations :42},
            { dishId :20 ,typeOfMealId :2 ,canteenId: 2, avgReservations :16},
            { dishId: 21, typeOfMealId: 1, canteenId: 2, avgReservations: 55 },
            { dishId: 21, typeOfMealId: 2, canteenId: 2, avgReservations: 22 },
            { dishId: 22, typeOfMealId: 1, canteenId: 2, avgReservations: 30 },
            { dishId: 22, typeOfMealId: 2, canteenId: 2, avgReservations: 10 },
            { dishId: 23, typeOfMealId: 1, canteenId: 2, avgReservations: 40 },
            { dishId: 23, typeOfMealId: 2, canteenId: 2, avgReservations: 17 },
            { dishId: 24, typeOfMealId: 1, canteenId: 2, avgReservations: 60 },
            { dishId: 24, typeOfMealId: 2, canteenId: 2, avgReservations: 30 },
            { dishId: 25, typeOfMealId: 1, canteenId: 2, avgReservations: 35 },
            { dishId: 25, typeOfMealId: 2, canteenId: 2, avgReservations: 13 },
            { dishId: 26, typeOfMealId: 1, canteenId: 2, avgReservations: 45 },
            { dishId: 26, typeOfMealId: 2, canteenId: 2, avgReservations: 18 },
            { dishId: 27, typeOfMealId: 1, canteenId: 2, avgReservations: 50 },
            { dishId: 27, typeOfMealId: 2, canteenId: 2, avgReservations: 20 },
            { dishId: 28, typeOfMealId: 1, canteenId: 2, avgReservations: 35 },
            { dishId: 28, typeOfMealId: 2, canteenId: 2, avgReservations: 15 },
            { dishId: 29, typeOfMealId: 1, canteenId: 2, avgReservations: 40 },
            { dishId: 29, typeOfMealId: 2, canteenId: 2, avgReservations: 17 },
            { dishId: 30, typeOfMealId: 1, canteenId: 2, avgReservations: 55 },
            { dishId: 30, typeOfMealId: 2, canteenId: 2, avgReservations: 22 },
            { dishId: 31, typeOfMealId: 1, canteenId: 2, avgReservations: 30 },
            { dishId: 31, typeOfMealId: 2, canteenId: 2, avgReservations: 10 },
            { dishId: 32, typeOfMealId: 1, canteenId: 2, avgReservations: 40 },
            { dishId: 32, typeOfMealId: 2, canteenId: 2, avgReservations: 17 },
            { dishId :33 ,typeOfMealId :1 ,canteenId: 2, avgReservations :60},
            { dishId :33 ,typeOfMealId :2 ,canteenId: 2, avgReservations :30},
            { dishId :34 ,typeOfMealId :1 ,canteenId: 2, avgReservations :45},
            { dishId :34 ,typeOfMealId :2 ,canteenId: 2, avgReservations :18},
            { dishId :35 ,typeOfMealId :1 ,canteenId: 2, avgReservations :50},
            { dishId :35 ,typeOfMealId :2 ,canteenId: 2, avgReservations :20},
            { dishId :36 ,typeOfMealId :1 ,canteenId: 2, avgReservations :48},
            { dishId :36 ,typeOfMealId :2 ,canteenId: 2, avgReservations :19},
            { dishId :37 ,typeOfMealId :1 ,canteenId: 2, avgReservations :55},
            { dishId :37 ,typeOfMealId :2 ,canteenId: 2, avgReservations :22},
            { dishId :38 ,typeOfMealId :1 ,canteenId: 2, avgReservations :33},
            { dishId :38 ,typeOfMealId :2 ,canteenId: 2, avgReservations :12},
            { dishId :39 ,typeOfMealId :1 ,canteenId: 2, avgReservations :42},
            { dishId :39 ,typeOfMealId :2 ,canteenId: 2, avgReservations :16},
            { dishId :40 ,typeOfMealId :1 ,canteenId: 2, avgReservations :50},
            { dishId :40 ,typeOfMealId :2 ,canteenId: 2, avgReservations :20},
            { dishId :41 ,typeOfMealId :1 ,canteenId: 2, avgReservations :35},
            { dishId :41 ,typeOfMealId :2 ,canteenId: 2, avgReservations :15},
            { dishId :42 ,typeOfMealId :1 ,canteenId: 2, avgReservations :40},
            { dishId :42 ,typeOfMealId :2 ,canteenId: 2, avgReservations :17},
            { dishId :43 ,typeOfMealId :1 ,canteenId: 2, avgReservations :55},
            { dishId :43 ,typeOfMealId :2 ,canteenId: 2, avgReservations :22},
            { dishId :44 ,typeOfMealId :1 ,canteenId: 2, avgReservations :30},
            { dishId :44 ,typeOfMealId :2 ,canteenId: 2, avgReservations :10},
            { dishId :45 ,typeOfMealId :1 ,canteenId: 2, avgReservations :40},
            { dishId :45 ,typeOfMealId :2 ,canteenId: 2, avgReservations :17},
            { dishId: 46, typeOfMealId: 1, canteenId: 2, avgReservations: 60 },
            { dishId: 46, typeOfMealId: 2, canteenId: 2, avgReservations: 30 },
            { dishId: 47, typeOfMealId: 1, canteenId: 2, avgReservations: 45 },
            { dishId: 47, typeOfMealId: 2, canteenId: 2, avgReservations: 18 },
            { dishId: 48, typeOfMealId: 1, canteenId: 2, avgReservations: 50 },
            { dishId: 48, typeOfMealId: 2, canteenId: 2, avgReservations: 20 },
            { dishId: 49, typeOfMealId: 1, canteenId: 2, avgReservations: 48 },
            { dishId: 49, typeOfMealId: 2, canteenId: 2, avgReservations: 19 },
            { dishId: 50, typeOfMealId: 1, canteenId: 2, avgReservations: 55 },
            { dishId: 50, typeOfMealId: 2, canteenId: 2, avgReservations: 22 },
            { dishId: 51, typeOfMealId: 1, canteenId: 2, avgReservations: 33 },
            { dishId: 51, typeOfMealId: 2, canteenId: 2, avgReservations: 12 },
            { dishId: 52, typeOfMealId: 1, canteenId: 2, avgReservations: 42 },
            { dishId: 52, typeOfMealId: 2, canteenId: 2, avgReservations: 16 },
            { dishId: 53, typeOfMealId: 1, canteenId: 2, avgReservations: 50 },
            { dishId: 53, typeOfMealId: 2, canteenId: 2,  avgReservations: 20 },
            { dishId: 54, typeOfMealId: 1, canteenId: 2,  avgReservations: 35 },
            { dishId: 54, typeOfMealId: 2, canteenId: 2,  avgReservations: 15 },
            { dishId: 55, typeOfMealId: 1, canteenId: 2,  avgReservations: 40 },
            { dishId: 55, typeOfMealId: 2, canteenId: 2,  avgReservations: 17 },
            { dishId: 56, typeOfMealId: 1, canteenId: 2,  avgReservations: 55 },
            { dishId: 56, typeOfMealId: 2, canteenId: 2,  avgReservations: 22 },
            { dishId: 57, typeOfMealId: 1, canteenId: 2,  avgReservations: 30 },
            { dishId: 57, typeOfMealId: 2, canteenId: 2,  avgReservations: 10 },
            { dishId: 58, typeOfMealId: 1, canteenId: 2,  avgReservations: 40 },
            { dishId: 58, typeOfMealId: 2, canteenId: 2,  avgReservations: 17 },
            { dishId: 59, typeOfMealId: 1, canteenId: 2,  avgReservations: 60 },
            { dishId: 59, typeOfMealId: 2, canteenId: 2,  avgReservations: 30 },
            { dishId: 60, typeOfMealId: 1, canteenId: 2,  avgReservations: 45 },
            { dishId: 60, typeOfMealId: 2, canteenId: 2,  avgReservations: 18 },
        ];

        for (const avgRes of average_reservationsToInsert) {
            const exists = await AverageReservation.findOne({
                where: { dishId: avgRes.dishId, typeOfMealId: avgRes.typeOfMealId, canteenId: avgRes.canteenId }
            });
            if (!exists) {
                await AverageReservation.create(avgRes);
            }
        }
        console.log('Average Reservations seeded');

        const informationToInsert = [ 
            { avgClientsLunch: 350, avgClientsDinner: 100 }
        ];

        for (const info of informationToInsert) {
            const exists = await Information.findOne();
            if (!exists) {
                await Information.create(info);
            }
        }

        const ingredientsToInsert = [
            // PRATOS DE CARNE

            // 1) Frango Assado com Batata e Cenoura
            { productId: 6, quantity: 200, unitId: 2 }, // Frango 200 g  id 1
            { productId: 11, quantity: 150, unitId: 2 }, // Batata 150 g id 2
            { productId: 5, quantity: 80, unitId: 2 }, // Cenoura 80 g id 3
            { productId: 27, quantity: 40, unitId: 2 }, // Cebola 40 g id 4

            // 2) Carne de Vaca Estufada com Tomate e Curgete
            { productId: 7, quantity: 180, unitId: 2 }, // Carne de Vaca 180 g  id 5
            { productId: 12, quantity: 120, unitId: 2 }, // Tomate 120 g id 6
            { productId: 9, quantity: 100, unitId: 2 }, // Curgete 100 g id 7
            { productId: 27, quantity: 50, unitId: 2 }, // Cebola 50 g id 8

            // 3) Peru Grelhado com Arroz e Brócolos
            { productId: 17, quantity: 180, unitId: 2 }, // Peru 180 g id 9
            { productId: 16, quantity: 80, unitId: 2 }, // Arroz 80 g id 10
            { productId: 10, quantity: 100, unitId: 2 }, // Brócolos 100 g id 11

            // 4) Carne de Porco com Abóbora e Cebola
            { productId: 13, quantity: 180, unitId: 2 }, // Carne de Porco 180 g id 12
            { productId: 28, quantity: 120, unitId: 2 }, // Abóbora 120 g id 13
            { productId: 27, quantity: 50, unitId: 2 }, // Cebola 50 g id 8

            // 5) Pato Salteado com Maçã e Batata
            { productId: 18, quantity: 180, unitId: 2 }, // Pato 180 g id 14
            { productId: 1, quantity: 1, unitId: 5 }, // Maçã 1 unidade id 15
            { productId: 11, quantity: 150, unitId: 2 }, // Batata 150 g id 2
            { productId: 27, quantity: 40, unitId: 2 }, // Cebola 40 g id 4

            // PRATOS DE PEIXE

            // 1) Bacalhau à Brás
            { productId: 19, quantity: 150, unitId: 2 }, // Bacalhau 150 g id 16
            { productId: 11, quantity: 150, unitId: 2 }, // Batata 150 g id 2
            { productId: 2, quantity: 2, unitId: 5 }, // Ovo 2 unidades id 17
            { productId: 27, quantity: 50, unitId: 2 }, // Cebola 50 g id 4

            // 2) Salmão no Forno com Tomate e Alface
            { productId: 14, quantity: 180, unitId: 2 }, // Salmão 180 g id 18
            { productId: 12, quantity: 120, unitId: 2 }, // Tomate 120 g id 6
            { productId: 26, quantity: 50, unitId: 2 }, // Alface 50 g id 19

            // 3) Arroz de Atum
            { productId: 15, quantity: 120, unitId: 2 }, // Atum 120 g id 20
            { productId: 16, quantity: 80, unitId: 2 }, // Arroz 80 g id 10
            { productId: 27, quantity: 50, unitId: 2 }, // Cebola 50 g id 8
            { productId: 12, quantity: 80, unitId: 2 }, // Tomate 80 g id 21

            // 4) Filetes de Dourada com Puré de Abóbora
            { productId: 20, quantity: 160, unitId: 2 }, // Dourada 160 g id 22
            { productId: 28, quantity: 150, unitId: 2 }, // Abóbora 150 g id 23
            { productId: 11, quantity: 120, unitId: 2 }, // Batata 120 g id 24
            { productId: 3, quantity: 100, unitId: 4 }, // Leite 100 mL id 25

            // 5) Lulas Estufadas com Cenoura e Cebola
            { productId: 21, quantity: 180, unitId: 2 }, // Lulas 180 g id 26
            { productId: 5, quantity: 90, unitId: 2 }, // Cenoura 90 g id 27
            { productId: 27, quantity: 60, unitId: 2 }, // Cebola 60 g id 28
            { productId: 12, quantity: 80, unitId: 2 }, // Tomate 80 g id 21

            // PRATOS VEGETARIANOS

            // 1) Massa com Tomate, Brócolos e Cenoura
            { productId: 23, quantity: 100, unitId: 2 }, // Massa 100 g  id 29
            { productId: 12, quantity: 120, unitId: 2 }, // Tomate 120 g id 6
            { productId: 10, quantity: 100, unitId: 2 }, // Brócolos 100 g id 11
            { productId: 5, quantity: 80, unitId: 2 }, // Cenoura 80 g id 3

            // 2) Grão-de-bico com Abóbora e Cebola
            { productId: 24, quantity: 150, unitId: 2 }, // Grão-de-bico 150 g id 30
            { productId: 28, quantity: 150, unitId: 2 }, // Abóbora 150 g  id 23
            { productId: 27, quantity: 50, unitId: 2 }, // Cebola 50 g id 8

            // 3) Feijoada Vegetariana
            { productId: 22, quantity: 180, unitId: 2 }, // Feijão 180 g id 31
            { productId: 5, quantity: 80, unitId: 2 }, // Cenoura 80 g id 3
            { productId: 12, quantity: 100, unitId: 2 }, // Tomate 100 g id 32
            { productId: 27, quantity: 60, unitId: 2 }, // Cebola 60 g id 28
            { productId: 28, quantity: 100, unitId: 2 }, // Abóbora 100 g id 33

            // 4) Salada de Alface com Pera, Maçã e Curgete
            { productId: 26, quantity: 60, unitId: 2 }, // Alface 60 g  id 34
            { productId: 8, quantity: 1, unitId: 5 }, // Pera 1 unidade id 35
            { productId: 1, quantity: 1, unitId: 5 }, // Maçã 1 unidade id 15
            { productId: 9, quantity: 80, unitId: 2 }, // Curgete 80 g  id 36

            // 5) Sopa de Tomate com Cebola e Batata
            { productId: 12, quantity: 160, unitId: 2 }, // Tomate 160 g id 37
            { productId: 27, quantity: 60, unitId: 2 }, // Cebola 60 g  id 28
            { productId: 11, quantity: 100, unitId: 2 }, // Batata 100 g id 38
        ];

        for (const ingredient of ingredientsToInsert) {
            const exists = await Ingredient.findOne({
                where: {
                    productId: ingredient.productId,
                    quantity: ingredient.quantity,
                    unitId: ingredient.unitId
                }
            });

            if (!exists) {
                await Ingredient.create(ingredient);
            }
        }

        console.log('Ingredients seeded');

        const recipesToInsert = [
            // --- PRATOS DE CARNE ---
            {
                ingredients: [1, 2, 3, 4], // Frango Assado com Batata e Cenoura
                description: "Tempere o frango com sal, pimenta e azeite. Asse no forno junto com batata e cenoura cortadas em pedaços até dourar. Sirva quente."
            },
            {
                ingredients: [5, 6, 7, 8], // Carne de Vaca Estufada com Tomate e Curgete
                description: "Refogue a cebola e a carne de vaca até dourar. Adicione tomate e curgete picados, cozinhe em lume brando até a carne ficar tenra."
            },
            {
                ingredients: [9, 10, 11], // Peru Grelhado com Arroz e Brócolos
                description: "Grelhe o peru temperado com sal e pimenta. Cozinhe o arroz e os brócolos em água a ferver. Sirva o peru com o arroz e os brócolos."
            },
            {
                ingredients: [12, 13, 8], // Carne de Porco com Abóbora e Cebola
                description: "Refogue a cebola, adicione a carne de porco e cozinhe até dourar. Acrescente a abóbora em cubos e cozinhe até ficar macia."
            },
            {
                ingredients: [14, 15, 2], // Pato Salteado com Maçã e Batata
                description: "Salteie o pato em azeite até dourar. Adicione maçã e batata em cubos e cozinhe até a batata ficar macia. Sirva quente."
            },

            // --- PRATOS DE PEIXE ---
            {
                ingredients: [16, 24, 17, 8], // Bacalhau à Brás
                description: "Desfie o bacalhau e refogue com cebola e batata palha. Junte os ovos batidos e cozinhe até firmar. Sirva quente."
            },
            {
                ingredients: [18, 6, 19], // Salmão no Forno com Tomate e Alface
                description: "Coloque o salmão temperado num tabuleiro, adicione tomate fatiado e asse até ficar cozido. Sirva com alface fresca."
            },
            {
                ingredients: [20, 10, 7, 21], // Arroz de Atum
                description: "Refogue cebola e tomate, adicione arroz e atum. Cozinhe até o arroz absorver a água e ficar macio."
            },
            {
                ingredients: [22, 23, 24, 25], // Filetes de Dourada com Puré de Abóbora
                description: "Grelhe os filetes de dourada temperados. Cozinhe a abóbora e batata, bata com leite até formar puré. Sirva junto com o peixe."
            },
            {
                ingredients: [26, 5, 28, 21], // Lulas Estufadas com Cenoura e Cebola
                description: "Refogue cebola e cenoura, adicione as lulas e cozinhe em lume brando com tomate até ficarem macias."
            },

            // --- PRATOS VEGETARIANOS ---
            {
                ingredients: [29, 6, 5, 3], // Massa com Tomate, Brócolos e Cenoura
                description: "Cozinhe a massa. Salteie os legumes até ficarem macios. Misture com a massa cozida e sirva quente."
            },
            {
                ingredients: [30, 31, 8], // Grão-de-bico com Abóbora e Cebola
                description: "Refogue a cebola, adicione o grão-de-bico e a abóbora em cubos. Cozinhe até a abóbora ficar macia. Tempere a gosto."
            },
            {
                ingredients: [32, 5, 33, 28, 28], // Feijoada Vegetariana
                description: "Refogue cebola, adicione feijão, tomate, cenoura e abóbora. Cozinhe até os legumes ficarem macios e sirva."
            },
            {
                ingredients: [34, 35, 15, 36], // Salada de Alface com Pera, Maçã e Curgete
                description: "Misture alface, pera, maçã e curgete cortados em tiras. Tempere a gosto e sirva fria."
            },
            {
                ingredients: [37, 28, 38], // Sopa de Tomate com Cebola e Batata
                description: "Refogue cebola e tomate, adicione batata e cozinhe até os legumes ficarem macios. Triture para formar uma sopa cremosa e sirva."
            }
        ];

        for (const recipe of recipesToInsert) {
            const exists = await Recipe.findOne({
                where: {
                    description: recipe.description
                }
            });

            if (!exists) {
                await Recipe.create(recipe);
            }
        }

        console.log('Recipes seeded')

       const dishesToInsert = [
    // PRATOS DE CARNE
    {
        dishTypeId: 1,
        name: "Frango Assado com Batata e Cenoura",
        recipeId: 1,
        mainProductsId: [6, 11] // Frango, Batata
    },
    {
        dishTypeId: 1,
        name: "Carne de Vaca Estufada com Tomate e Curgete",
        recipeId: 2,
        mainProductsId: [7, 12] // Carne de Vaca, Tomate
    },
    {
        dishTypeId: 1,
        name: "Peru Grelhado com Arroz e Brócolos",
        recipeId: 3,
        mainProductsId: [17, 16] // Peru, Arroz
    },
    {
        dishTypeId: 1,
        name: "Carne de Porco com Abóbora e Cebola",
        recipeId: 4,
        mainProductsId: [13, 27] // Carne de Porco, Abóbora
    },
    {
        dishTypeId: 1,
        name: "Pato Salteado com Maçã e Batata",
        recipeId: 5,
        mainProductsId: [18, 11] // Pato, Batata
    },

    // PRATOS DE PEIXE
    {
        dishTypeId: 2,
        name: "Bacalhau à Brás",
        recipeId: 6,
        mainProductsId: [19, 11] // Bacalhau, Batata
    },
    {
        dishTypeId: 2,
        name: "Salmão no Forno com Tomate e Alface",
        recipeId: 7,
        mainProductsId: [14, 12] // Salmão, Tomate
    },
    {
        dishTypeId: 2,
        name: "Arroz de Atum",
        recipeId: 8,
        mainProductsId: [15, 16] // Atum, Arroz
    },
    {
        dishTypeId: 2,
        name: "Filetes de Dourada com Puré de Abóbora",
        recipeId: 9,
        mainProductsId: [20, 27] // Dourada, Abóbora
    },
    {
        dishTypeId: 2,
        name: "Lulas Estufadas com Cenoura e Cebola",
        recipeId: 10,
        mainProductsId: [21, 5] // Lulas, Cenoura
    },

    // PRATOS VEGETARIANOS
    {
        dishTypeId: 3,
        name: "Massa com Tomate, Brócolos e Cenoura",
        recipeId: 11,
        mainProductsId: [23, 12] // Massa, Tomate
    },
    {
        dishTypeId: 3,
        name: "Grão-de-bico com Abóbora e Cebola",
        recipeId: 12,
        mainProductsId: [24, 27] // Grão de bico, Abóbora
    },
    {
        dishTypeId: 3,
        name: "Feijoada Vegetariana",
        recipeId: 13,
        mainProductsId: [22, 24] // Feijão, Grão de bico
    },
    {
        dishTypeId: 3,
        name: "Salada de Alface com Pera, Maçã e Curgete",
        recipeId: 14,
        mainProductsId: [25, 8] // Alface, Pera
    },
    {
        dishTypeId: 3,
        name: "Sopa de Tomate com Cebola e Batata",
        recipeId: 15,
        mainProductsId: [12, 26] // Tomate, Cebola
    }
];


        for (const dish of dishesToInsert) {
            const exists = await Dish.findOne({
                where: {
                    dishTypeId: dish.dishTypeId,
                    name: dish.name,
                    recipeId: dish.recipeId
                }
            });

            if (!exists) {
                await Dish.create(dish);
            }
        }

        console.log('Dishes seeded');

        // mealsToInsert já está definido no início da função
        // As meals serão criadas depois das instituições/cantinas/refeitórios

       /* const menusToInsert = [
            {
                menuTypeId: 1,
                initialDate: new Date(2025, 11, 22),
                finalDate: new Date(2025, 11, 26),
                meals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                status: "published"
            }
        ];

        for (const menu of menusToInsert) {
            // Evita duplicar menus em reinícios: valida apenas pelas datas e tipo
            const exists = await Menu.findOne({
                where: {
                    menuTypeId: menu.menuTypeId,
                    initialDate: menu.initialDate,
                    finalDate: menu.finalDate,
                }
            });

            if (!exists) {
                await Menu.create(menu);
            }
        }

        console.log('Menus seeded');*/

        
        const batchesToInsert = [
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 1,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 2,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 3,
                quantity: 10,
                unitId: 3,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 4,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 5,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 6,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 7,
                quantity: 10,
                unitId: 1,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 8,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 9,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 10,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 11,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 12,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 13,
                quantity: 10,
                unitId: 1,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 14,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 15,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 16,
                quantity: 10,
                unitId: 1,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 17,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 18,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 19,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 20,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 21,
                quantity: 30,
                unitId: 5,
                bio: false
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 22,
                quantity: 10,
                unitId: 1,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 23,
                quantity: 10,
                unitId: 1,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 24,
                quantity: 10,
                unitId: 1,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 26,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 27,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 28,
                quantity: 30,
                unitId: 5,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 29,
                quantity: 10,
                unitId: 3,
                bio: true
            },
            {
                expirationDate: new Date(2026, 1, 1),
                productId: 30,
                quantity: 30,
                unitId: 5,
                bio: true
            }
        ];

        for (const batch of batchesToInsert) {
            const exists = await Batch.findOne({
                where: {
                    expirationDate: batch.expirationDate,
                    productId: batch.productId,
                    quantity: batch.quantity,
                    unitId: batch.unitId,
                    bio: batch.bio
                }
            });

            if (!exists) {
                await Batch.create(batch);
            }
        }

        console.log('Batches seeded');

        const stocksToInsert = [
            {
                updatedDate: new Date(2025, 12, 10),
                minimumCapacity: 1000,
                maximumCapacity: 20,
                currentQuantity: 100,
                batches: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            }
        ];

        for (const stock of stocksToInsert) {
            await Stock.create(stock);
        }

        console.log('Stocks seeded');


    const additionalProductsToInsert = [
  // Produtos bio adicionais
  { name: "Couve Portuguesa", typeId: 2, nutrition: [{ typeId: 1, percentage: 2.8 }, { typeId: 2, percentage: 4 }, { typeId: 4, percentage: 25 }], allergens: [] },
  { name: "Espinafres", typeId: 2, nutrition: [{ typeId: 1, percentage: 2.9 }, { typeId: 2, percentage: 3.6 }, { typeId: 4, percentage: 23 }], allergens: [] },
  { name: "Couve-flor", typeId: 2, nutrition: [{ typeId: 1, percentage: 1.9 }, { typeId: 2, percentage: 5 }, { typeId: 4, percentage: 25 }], allergens: [] },
  { name: "Ervilhas", typeId: 2, nutrition: [{ typeId: 1, percentage: 5 }, { typeId: 2, percentage: 14 }, { typeId: 4, percentage: 81 }], allergens: [] },
  { name: "Pimento", typeId: 2, nutrition: [{ typeId: 1, percentage: 0.9 }, { typeId: 2, percentage: 4.6 }, { typeId: 4, percentage: 20 }], allergens: [] },
  { name: "Cogumelos", typeId: 2, nutrition: [{ typeId: 1, percentage: 3.1 }, { typeId: 2, percentage: 3.3 }, { typeId: 4, percentage: 22 }], allergens: [] },
  { name: "Milho", typeId: 2, nutrition: [{ typeId: 1, percentage: 3.3 }, { typeId: 2, percentage: 19 }, { typeId: 4, percentage: 86 }], allergens: [] },
  { name: "Beringela", typeId: 2, nutrition: [{ typeId: 1, percentage: 1 }, { typeId: 2, percentage: 6 }, { typeId: 4, percentage: 25 }], allergens: [] },
  { name: "Açorda de Marisco", typeId: 5, nutrition: [{ typeId: 1, percentage: 18 }, { typeId: 2, percentage: 15 }, { typeId: 4, percentage: 200 }], allergens: [7] },
  { name: "Camarão", typeId: 5, nutrition: [{ typeId: 1, percentage: 20 }, { typeId: 3, percentage: 1 }, { typeId: 4, percentage: 90 }], allergens: [7] },
  { name: "Amêijoas", typeId: 5, nutrition: [{ typeId: 1, percentage: 12 }, { typeId: 2, percentage: 2 }, { typeId: 4, percentage: 50 }], allergens: [7] },
  { name: "Quinoa", typeId: 6, nutrition: [{ typeId: 1, percentage: 14 }, { typeId: 2, percentage: 64 }, { typeId: 4, percentage: 120 }], allergens: [] },
  { name: "Cuscuz", typeId: 6, nutrition: [{ typeId: 1, percentage: 13 }, { typeId: 2, percentage: 77 }, { typeId: 4, percentage: 112 }], allergens: [] },
  { name: "Tremoços", typeId: 6, nutrition: [{ typeId: 1, percentage: 36 }, { typeId: 2, percentage: 40 }, { typeId: 4, percentage: 371 }], allergens: [2] },
  { name: "Tofu", typeId: 6, nutrition: [{ typeId: 1, percentage: 8 }, { typeId: 3, percentage: 5 }, { typeId: 4, percentage: 70 }], allergens: [] },
  { name: "Seitan", typeId: 6, nutrition: [{ typeId: 1, percentage: 25 }, { typeId: 2, percentage: 10 }, { typeId: 4, percentage: 120 }], allergens: [2] },
  { name: "Coelho", typeId: 4, nutrition: [{ typeId: 1, percentage: 21 }, { typeId: 3, percentage: 8 }, { typeId: 4, percentage: 173 }], allergens: [] },
  { name: "Faisão", typeId: 4, nutrition: [{ typeId: 1, percentage: 24 }, { typeId: 3, percentage: 7 }, { typeId: 4, percentage: 181 }], allergens: [] },
  { name: "Codorniz", typeId: 4, nutrition: [{ typeId: 1, percentage: 25 }, { typeId: 3, percentage: 12 }, { typeId: 4, percentage: 192 }], allergens: [] },
  { name: "Cordeiro", typeId: 4, nutrition: [{ typeId: 1, percentage: 25 }, { typeId: 3, percentage: 20 }, { typeId: 4, percentage: 294 }], allergens: [] },
  { name: "Vitela", typeId: 4, nutrition: [{ typeId: 1, percentage: 20 }, { typeId: 3, percentage: 5 }, { typeId: 4, percentage: 172 }], allergens: [] },
  { name: "Iogurte Natural", typeId: 3, nutrition: [{ typeId: 1, percentage: 3.5 }, { typeId: 2, percentage: 4 }, { typeId: 3, percentage: 1 }, { typeId: 4, percentage: 61 }], allergens: [1] },
  { name: "Queijo Flamengo", typeId: 3, nutrition: [{ typeId: 1, percentage: 26 }, { typeId: 3, percentage: 20 }, { typeId: 4, percentage: 350 }], allergens: [1] },
  { name: "Ricotta", typeId: 3, nutrition: [{ typeId: 1, percentage: 11 }, { typeId: 3, percentage: 13 }, { typeId: 4, percentage: 174 }], allergens: [1] },
  { name: "Manteiga", typeId: 6, nutrition: [{ typeId: 3, percentage: 81 }, { typeId: 4, percentage: 717 }], allergens: [1] },
  { name: "Açafrão", typeId: 6, nutrition: [{ typeId: 1, percentage: 11 }, { typeId: 2, percentage: 65 }, { typeId: 3, percentage: 10 }, { typeId: 4, percentage: 390 }], allergens: [] },
  { name: "Sementes de Abóbora", typeId: 6, nutrition: [{ typeId: 1, percentage: 30 }, { typeId: 3, percentage: 49 }, { typeId: 4, percentage: 559 }], allergens: [] },
  { name: "Nozes", typeId: 6, nutrition: [{ typeId: 1, percentage: 15 }, { typeId: 3, percentage: 65 }, { typeId: 4, percentage: 654 }], allergens: [5] },
  { name: "Amêndoas", typeId: 6, nutrition: [{ typeId: 1, percentage: 21 }, { typeId: 3, percentage: 50 }, { typeId: 4, percentage: 579 }], allergens: [5] }
];

    // Inserir produtos adicionais
    for (const product of additionalProductsToInsert) {
    const exists = await Product.findOne({ where: { name: product.name } });
    if (!exists) {
        await Product.create(product);
    }
    }
    console.log('Additional products seeded');

        const additionalIngredientsToInsert = [
        // Ingredientes para pratos de carne adicionais
        { productId: 30, quantity: 180, unitId: 2 }, // Couve Portuguesa id 39
        { productId: 31, quantity: 100, unitId: 2 }, // Espinafres id 40
        { productId: 32, quantity: 120, unitId: 2 }, // Couve-flor id 41
        { productId: 33, quantity: 80, unitId: 2 }, // Ervilhas id 42
        { productId: 34, quantity: 100, unitId: 2 }, // Pimento id 43
        { productId: 35, quantity: 150, unitId: 2 }, // Cogumelos id 44
        { productId: 36, quantity: 100, unitId: 2 }, // Milho id 45
        { productId: 37, quantity: 120, unitId: 2 }, // Beringela id 46
        { productId: 40, quantity: 150, unitId: 2 }, // Quinoa id 47
        { productId: 41, quantity: 80, unitId: 2 }, // Cuscuz id 48
        { productId: 42, quantity: 100, unitId: 2 }, // Tremoços id 49
        { productId: 43, quantity: 150, unitId: 2 }, // Tofu id 50
        { productId: 44, quantity: 200, unitId: 2 }, // Seitan id 51
        { productId: 45, quantity: 180, unitId: 2 }, // Coelho id 52
        { productId: 46, quantity: 160, unitId: 2 }, // Faisão id 53
        { productId: 47, quantity: 140, unitId: 2 }, // Codorniz id 54
        { productId: 48, quantity: 200, unitId: 2 }, // Cordeiro id 55
        { productId: 49, quantity: 180, unitId: 2 }, // Vitela id 56
        { productId: 50, quantity: 125, unitId: 4 }, // Iogurte Natural id 57
        { productId: 51, quantity: 50, unitId: 2 }, // Queijo Flamengo id 58
        { productId: 52, quantity: 100, unitId: 2 }, // Ricotta id 59
        { productId: 53, quantity: 20, unitId: 2 }, // Manteiga id 60
        { productId: 54, quantity: 5, unitId: 2 }, // Açafrão id 61
        { productId: 55, quantity: 20, unitId: 2 }, // Sementes de Abóbora id 62
        { productId: 56, quantity: 30, unitId: 2 }, // Nozes id 63
        { productId: 57, quantity: 25, unitId: 2 }  // Amêndoas id 64
        ];

    // Inserir ingredientes adicionais (começando do ID 39 em diante)
    for (const ingredient of additionalIngredientsToInsert) {
    const exists = await Ingredient.findOne({
        where: {
        productId: ingredient.productId,
        quantity: ingredient.quantity,
        unitId: ingredient.unitId
        }
    });
    if (!exists) {
        await Ingredient.create(ingredient);
    }
    }
    console.log('Additional ingredients seeded');

   const additionalRecipesToInsert = [
  // PRATOS DE CARNE ADICIONAIS (16-25) -> IDs 47-61
  {
    ingredients: [52, 47, 44], // Coelho Estufado com Quinoa e Cogumelos id 16
    description: "Estufe o coelho com ervas aromáticas. Cozinhe a quinoa e salteie cogumelos. Sirva tudo juntos."
  },
  {
    ingredients: [53, 48, 40], // Faisão com Cuscuz e Espinafres id 17
    description: "Grelhe o faisão temperado. Prepare o cuscuz e refogue os espinafres. Monte no prato."
  },
  {
    ingredients: [54, 42, 3], // Codorniz Assada com Ervilhas e Cenoura id 18
    description: "Asse as codornizes no forno. Cozinhe ervilhas e cenoura em azeite. Sirva com molho do assado."
  },
  {
    ingredients: [55, 2, 57], // Cordeiro no Forno com Batata Doce (usando Batata normal) id 19
    description: "Tempere o cordeiro com alecrim e alho. Asse com batata até dourar. Sirva com iogurte natural."
  },
  {
    ingredients: [56, 41, 59], // Vitela Grelhada com Puré de Couve-flor id 20
    description: "Grelhe a vitela. Cozinhe couve-flor e bata com queijo ricotta até obter um puré cremoso."
  },
  {
    ingredients: [12, 61, 45], // Carne de Porco com Açafrão e Milho id 21
    description: "Marine a carne de porco com açafrão. Grelhe e sirva com milho cozido e sementes de abóbora."
  },
  {
    ingredients: [1, 64, 10], // Frango com Amêndoas e Arroz id 22
    description: "Salteie frango com amêndoas laminadas. Sirva com arroz basmati e brócolos salteados."
  },
  {
    ingredients: [5, 39, 40], // Carne de Vaca com Couve Portuguesa e Espinafres id 23
    description: "Cozinhe a carne de vaca com couve portuguesa e espinafres em estufado lento até ficar tenra."
  },
  {
    ingredients: [9, 41, 42], // Peru com Couve-flor e Ervilhas id 24
    description: "Grelhe peitos de peru. Sirva com couve-flor gratinada e ervilhas refogadas."
  },
  {
    ingredients: [14, 43, 8], // Pato com Pimento e Cebola id 25
    description: "Confite pato e sirva com pimentos coloridos salteados e cebola roxa."
  },
  // Mais 5 pratos de carne para completar 25
  {
    ingredients: [1, 45, 10], // Frango com Milho e Arroz id 26
    description: "Grelhe frango e sirva com milho doce e arroz basmati."
  },
  {
    ingredients: [5, 8, 57], // Carne de Vaca ao Molho de Cebola id 27
    description: "Estufe carne de vaca com cebola e sirva com iogurte natural e batata."
  },
  {
    ingredients: [9, 15, 2], // Peru com Maçã e Batata id 28
    description: "Asse peru com rodelas de maçã e sirva com batata assada."
  },
  {
    ingredients: [12, 26, 2], // Porco à Alentejana (com lulas e batata) id 29
    description: "Salteie carne de porco com lulas e sirva com batata frita."
  },
  {
    ingredients: [1, 5, 39], // Cozido à Portuguesa (simplificado) - usando Couve Portuguesa id 30
    description: "Cozinhe frango, carne de vaca e porco com batata, cenoura e couve."
  },
  
  // PRATOS DE PEIXE ADICIONAIS (16-25) -> IDs 62-76
  {
    ingredients: [16, 46, 6], // Bacalhau com Beringela e Tomate id 31
    description: "Asse bacalhau com rodelas de beringela e tomate cherry. Regue com azeite e orégãos."
  },
  {
    ingredients: [18, 44, 40], // Salmão com Cogumelos e Espinafres id 32
    description: "Grelhe salmão e sirva com cogumelos salteados e espinafres frescos."
  },
  {
    ingredients: [20, 47, 4], // Atum com Quinoa e Banana (substituindo abacate) id 33
    description: "Grelhe atum raro. Sirva com quinoa e banana temperada com limão."
  },
  {
    ingredients: [22, 49, 40], // Dourada com Tremoços e Espinafres id 34
    description: "Asse dourada no forno. Sirva com tremoços cozidos e espinafres salteados."
  },
  {
    ingredients: [26, 50, 43], // Lulas com Tofu e Pimentos id 35
    description: "Salteie lulas com tofu e pimentos variados. Tempere com molho de soja e gengibre."
  },
  {
    ingredients: [39, 48, 43], // Camarão Grelhado com Cuscuz e Pimento id 36
    description: "Grelhe camarões temperados com alho. Sirva com cuscuz e pimentos grelhados."
  },
  {
    ingredients: [40, 8, 29], // Amêijoas à Bulhão Pato id 37
    description: "Cozinhe amêijoas com alho, coentros e vinho branco. Sirva com pão caseiro."
  },
  {
    ingredients: [16, 30, 40], // Bacalhau com Grão e Espinafres id 38
    description: "Cozinhe bacalhau desfiado com grão-de-bico e espinafres. Sirva com azeite."
  },
  {
    ingredients: [18, 47, 57], // Salmão com Quinoa e Iogurte id 39
    description: "Asse salmão e sirva com quinoa cozida e molho de iogurte com endro."
  },
  {
    ingredients: [26, 46, 43], // Lulas Recheadas com Pimento id 40
    description: "Recheie lulas com pimento e cebola picados. Asse no forno com molho de tomate."
  },
  // Mais 5 pratos de peixe para completar 25
  {
    ingredients: [26, 2, 29], // Polvo à Lagareiro (com batata e alho) - usando Lulas id 41
    description: "Asse polvo com batata e muito alho. Regue com azeite."
  },
  {
    ingredients: [18, 6, 2], // Sardinhas Assadas (substituindo por salmão) id 42
    description: "Asse salmão no forno com tomate e sirva com batata cozida."
  },
  {
    ingredients: [22, 3, 8], // Pescada Cozida (substituindo por dourada) id 43
    description: "Cozinhe dourada com cenoura e cebola. Sirva com legumes."
  },
  {
    ingredients: [16, 20, 18], // Caldeirada de Peixe id 44
    description: "Cozinhe bacalhau, atum e salmão com batata e tomate."
  },
  {
    ingredients: [22, 44, 6], // Peixe Espada Preto (substituindo por dourada) id 45
    description: "Grelhe dourada e sirva com cogumelos e tomate cherry."
  },
  
  // PRATOS VEGETARIANOS ADICIONAIS (16-25) -> IDs 77-91
  {
    ingredients: [47, 3, 43], // Quinoa com Cenoura e Pimento id 46
    description: "Cozinhe quinoa e salteie com cenoura e pimento. Tempere com ervas frescas."
  },
  {
    ingredients: [48, 50, 43], // Cuscuz com Tofu e Pimentos id 47
    description: "Prepare cuscuz e sirva com tofu grelhado e pimentos assados."
  },
  {
    ingredients: [49, 31, 34], // Tremoços com Salada de Feijão id 48
    description: "Misture tremoços com feijão, cebola roxa e salsa. Tempere com vinagrete."
  },
  {
    ingredients: [50, 11, 47], // Tofu Grelhado com Arroz Integral id 49
    description: "Marine tofu e grelhe. Sirva com arroz integral e brócolos no vapor."
  },
  {
    ingredients: [51, 8, 3], // Seitan Estufado com Cebola e Cenoura id 50
    description: "Estufe seitan com cebola, cenoura e molho de soja. Sirva com arroz basmati."
  },
  {
    ingredients: [39, 30, 2], // Sopa de Couve com Grão id 51
    description: "Cozinhe couve portuguesa com grão-de-bico. Triture para obter sopa cremosa."
  },
  {
    ingredients: [40, 41, 58], // Espinafres com Gratinado de Couve-flor id 52
    description: "Refogue espinafres e cubra com couve-flor. Gratine no forno com queijo."
  },
  {
    ingredients: [46, 7, 6], // Ratatouille Provençal id 53
    description: "Cozinhe beringela, curgete, pimento e tomate em camadas. Asse no forno."
  },
  {
    ingredients: [44, 58, 29], // Cogumelos Recheados com Queijo id 54
    description: "Recheie cogumelos com queijo e alho. Asse até derreter o queijo."
  },
  {
    ingredients: [47, 63, 43], // Salada de Quinoa com Nozes e Pimento id 55
    description: "Misture quinoa cozida com nozes, passas e pimento. Tempere com limão."
  },
  // Mais 5 pratos vegetarianos para completar 25
  {
    ingredients: [29, 40, 41], // Lasanha de Vegetais id 56
    description: "Faça camadas de massa, espinafres e couve-flor com molho bechamel."
  },
  {
    ingredients: [30, 2, 58], // Hambúrguer de Grão id 57
    description: "Moa grão com batata e forme hambúrgueres. Grelhe e sirva com queijo."
  },
  {
    ingredients: [50, 2, 41], // Empadão de Tofu id 58
    description: "Faça recheio de tofu com legumes e cubra com puré de batata."
  },
  {
    ingredients: [31, 45, 61], // Curry de Feijão com Milho id 59
    description: "Cozinhe feijão com milho e curry em pó. Sirva com arroz."
  },
  {
    ingredients: [29, 44, 58], // Pizza Vegetariana id 60
    description: "Massa com tomate, cogumelos e queijo flamengo gratinado."
  }
];

for (const recipe of additionalRecipesToInsert) {
  const exists = await Recipe.findOne({ where: { description: recipe.description } });
  if (!exists) {
    await Recipe.create(recipe);
  }
}
console.log('Additional recipes seeded'); 

// Vou corrigir baseando-me nas receitas que me deu
const aditionalDishes = [
  // PRATOS DE CARNE ADICIONAIS (IDs 16-30) - CORRIGIDO
  {dishTypeId: 1, name: "Coelho Estufado com Quinoa e Cogumelos", recipeId: 16, mainProductsId: [46, 41, 35] }, // Coelho (46), Quinoa (41), Cogumelos (35)
  {dishTypeId: 1, name: "Faisão com Cuscuz e Espinafres", recipeId: 17, mainProductsId: [47, 42, 31] }, // Faisão (47), Cuscuz (42), Espinafres (31)
  {dishTypeId: 1, name: "Codorniz Assada com Ervilhas e Cenoura", recipeId: 18, mainProductsId: [48, 33, 5] }, // Codorniz (48), Ervilhas (33), Cenoura (5)
  {dishTypeId: 1, name: "Cordeiro no Forno com Batata", recipeId: 19, mainProductsId: [49, 11, 51] }, // Cordeiro (49), Batata (11), Iogurte (51)
  {dishTypeId: 1, name: "Vitela com Puré de Couve-flor", recipeId: 20, mainProductsId: [50, 32, 53] }, // Vitela (50), Couve-flor (32), Ricotta (53)
  {dishTypeId: 1, name: "Carne de Porco com Açafrão e Milho", recipeId: 21, mainProductsId: [13, 55, 36] }, // Porco (13), Açafrão (55), Milho (36)
  {dishTypeId: 1, name: "Frango com Amêndoas", recipeId: 22, mainProductsId: [6, 58, 16] }, // Frango (6), Amêndoas (58), Arroz (16)
  {dishTypeId: 1, name: "Carne de Vaca com Couve Portuguesa", recipeId: 23, mainProductsId: [7, 30, 31] }, // Vaca (7), Couve Portuguesa (30), Espinafres (31)
  {dishTypeId: 1, name: "Peru com Couve-flor e Ervilhas", recipeId: 24, mainProductsId: [17, 32, 33] }, // Peru (17), Couve-flor (32), Ervilhas (33)
  {dishTypeId: 1, name: "Pato com Pimento e Cebola", recipeId: 25, mainProductsId: [18, 34, 27] }, // Pato (18), Pimento (34), Cebola (27)
  {dishTypeId: 1, name: "Frango com Milho e Arroz", recipeId: 26, mainProductsId: [6, 36, 16] }, // Frango (6), Milho (36), Arroz (16)
  {dishTypeId: 1, name: "Carne de Vaca ao Molho de Cebola", recipeId: 27, mainProductsId: [7, 27, 51] }, // Vaca (7), Cebola (27), Iogurte (51)
  {dishTypeId: 1, name: "Peru com Maçã e Batata", recipeId: 28, mainProductsId: [17, 1, 11] }, // Peru (17), Maçã (1), Batata (11)
  {dishTypeId: 1, name: "Porco à Alentejana", recipeId: 29, mainProductsId: [13, 21, 11] }, // Porco (13), Lulas (21), Batata (11)
  {dishTypeId: 1, name: "Cozido à Portuguesa", recipeId: 30, mainProductsId: [6, 7, 30] }, // Frango (6), Vaca (7), Couve (30)

  // PRATOS DE PEIXE ADICIONAIS (IDs 16-30) - CORRIGIDO
  {dishTypeId: 2, name: "Bacalhau com Beringela", recipeId: 31, mainProductsId: [19, 37, 12] }, // Bacalhau (19), Beringela (37), Tomate (12)
  {dishTypeId: 2, name: "Salmão com Cogumelos e Espinafres", recipeId: 32, mainProductsId: [14, 35, 31] }, // Salmão (14), Cogumelos (35), Espinafres (31)
  {dishTypeId: 2, name: "Atum com Quinoa e Banana", recipeId: 33, mainProductsId: [15, 41, 4] }, // Atum (15), Quinoa (41), Banana (4)
  {dishTypeId: 2, name: "Dourada com Tremoços e Espinafres", recipeId: 34, mainProductsId: [20, 43, 31] }, // Dourada (20), Tremoços (43), Espinafres (31)
  {dishTypeId: 2, name: "Lulas com Tofu e Pimentos", recipeId: 35, mainProductsId: [21, 44, 34] }, // Lulas (21), Tofu (44), Pimento (34)
  {dishTypeId: 2, name: "Camarão Grelhado com Cuscuz e Pimento", recipeId: 36, mainProductsId: [39, 42, 34] }, // Camarão (39), Cuscuz (42), Pimento (34)
  {dishTypeId: 2, name: "Amêijoas à Bulhão Pato", recipeId: 37, mainProductsId: [40, 27, 29] }, // Amêijoas (40), Cebola (27), Alho (29)
  {dishTypeId: 2, name: "Bacalhau com Grão e Espinafres", recipeId: 38, mainProductsId: [19, 24, 31] }, // Bacalhau (19), Grão (24), Espinafres (31)
  {dishTypeId: 2, name: "Salmão com Quinoa e Iogurte", recipeId: 39, mainProductsId: [14, 41, 51] }, // Salmão (14), Quinoa (41), Iogurte (51)
  {dishTypeId: 2, name: "Lulas Recheadas com Pimento", recipeId: 40, mainProductsId: [21, 37, 34] }, // Lulas (21), Beringela (37), Pimento (34)
  {dishTypeId: 2, name: "Polvo à Lagareiro", recipeId: 41, mainProductsId: [21, 11, 29] }, // Lulas (21), Batata (11), Alho (29)
  {dishTypeId: 2, name: "Sardinhas Assadas", recipeId: 42, mainProductsId: [14, 12, 11] }, // Salmão (14), Tomate (12), Batata (11)
  {dishTypeId: 2, name: "Pescada Cozida", recipeId: 43, mainProductsId: [20, 5, 27] }, // Dourada (20), Cenoura (5), Cebola (27)
  {dishTypeId: 2, name: "Caldeirada de Peixe", recipeId: 44, mainProductsId: [19, 15, 14] }, // Bacalhau (19), Atum (15), Salmão (14)
  {dishTypeId: 2, name: "Peixe Espada com Cogumelos", recipeId: 45, mainProductsId: [20, 35, 12] }, // Dourada (20), Cogumelos (35), Tomate (12)

  // PRATOS VEGETARIANOS ADICIONAIS (IDs 16-30) - CORRIGIDO
  {dishTypeId: 3, name: "Quinoa com Cenoura e Pimento", recipeId: 46, mainProductsId: [41, 5, 34] }, // Quinoa (41), Cenoura (5), Pimento (34)
  {dishTypeId: 3, name: "Cuscuz com Tofu e Pimentos", recipeId: 47, mainProductsId: [42, 44, 34] }, // Cuscuz (42), Tofu (44), Pimento (34)
  {dishTypeId: 3, name: "Salada de Tremoços com Feijão", recipeId: 48, mainProductsId: [43, 22, 26] }, // Tremoços (43), Feijão (22), Alface (26)
  {dishTypeId: 3, name: "Tofu Grelhado com Brócolos", recipeId: 49, mainProductsId: [44, 10, 41] }, // Tofu (44), Brócolos (10), Quinoa (41)
  {dishTypeId: 3, name: "Seitan Estufado com Cebola e Cenoura", recipeId: 50, mainProductsId: [45, 27, 5] }, // Seitan (45), Cebola (27), Cenoura (5)
  {dishTypeId: 3, name: "Sopa de Couve com Grão", recipeId: 51, mainProductsId: [30, 24, 11] }, // Couve (30), Grão (24), Batata (11)
  {dishTypeId: 3, name: "Espinafres Gratinados", recipeId: 52, mainProductsId: [31, 32, 52] }, // Espinafres (31), Couve-flor (32), Queijo (52)
  {dishTypeId: 3, name: "Ratatouille", recipeId: 53, mainProductsId: [37, 9, 12] }, // Beringela (37), Curgete (9), Tomate (12)
  {dishTypeId: 3, name: "Cogumelos Recheados", recipeId: 54, mainProductsId: [35, 52, 29] }, // Cogumelos (35), Queijo (52), Alho (29)
  {dishTypeId: 3, name: "Salada de Quinoa com Nozes", recipeId: 55, mainProductsId: [41, 57, 34] }, // Quinoa (41), Nozes (57), Pimento (34)
  {dishTypeId: 3, name: "Lasanha de Vegetais", recipeId: 56, mainProductsId: [23, 31, 32] }, // Massa (23), Espinafres (31), Couve-flor (32)
  {dishTypeId: 3, name: "Hambúrguer de Grão", recipeId: 57, mainProductsId: [24, 11, 52] }, // Grão (24), Batata (11), Queijo (52)
  {dishTypeId: 3, name: "Empadão de Tofu", recipeId: 58, mainProductsId: [44, 11, 32] }, // Tofu (44), Batata (11), Couve-flor (32)
  {dishTypeId: 3, name: "Curry de Feijão com Milho", recipeId: 59, mainProductsId: [22, 36, 55] }, // Feijão (22), Milho (36), Açafrão (55)
  {dishTypeId: 3, name: "Pizza Vegetariana", recipeId: 60, mainProductsId: [23, 35, 52] } // Massa (23), Cogumelos (35), Queijo (52)
];

// Atualizar os dishes no banco de dados
 for (const dish of aditionalDishes) {
            const exists = await Dish.findOne({
                where: {
                    dishTypeId: dish.dishTypeId,
                    name: dish.name,
                    recipeId: dish.recipeId
                }
            });

            if (!exists) {
                await Dish.create(dish);
            }
        }

        console.log('Dishes seeded');

        // --- MEALS (criar logo após os dishes, mas só se as cantinas/refeitórios existirem) ---
        // Nota: As meals serão criadas depois das instituições/cantinas/refeitórios
        // (ver código mais abaixo)

    } catch (error) {
        console.error('Error in bootstrap:', error);
    }

    const unitsToInsert = [
    { id: 1, name: "kg" as UnitEnum },
    { name: "g" as UnitEnum },
    { name: "L" as UnitEnum },
    { name: "mL" as UnitEnum },
    { name: "unit" as UnitEnum },
    { name: "box" as UnitEnum },
    ];

        for (const unit of unitsToInsert) {
        const exists = await Unit.findOne({ where: { name: unit.name } });
        if (!exists) {
            await Unit.create({ ...unit, name: unit.name as UnitEnum });
        }
        }
        console.log("Units seeded");

    const allergensToInsert = [
        { name: "Lactose" },
        { name: "Glúten" },
        { name: "Ovo" },
        { name: "Amendoim" },
        { name: "Frutos secos" },
        { name: "Soja" },
        { name: "Peixe" },
        { name: "Sésamo" },
        { name: "Proteína do leite" },
        ];

        for (const allergen of allergensToInsert) {
        const exists = await Allergen.findOne({ where: { name: allergen.name } });
        if (!exists) {
            await Allergen.create(allergen);
        }
        }
        console.log("Allergens seeded");

    const dishTypesToInsert = [
        { name: "Meat" },
        { name: "Fish" },
        { name: "Vegetarian" },
        ];

        for (const type of dishTypesToInsert) {
        const exists = await DishType.findOne({ where: { name: type.name } });
        if (!exists) {
            await DishType.create(type);
        }
        }
        console.log("Dish Types seeded");

        const mealTypesToInsert = [
            { name: "Lunch" },
            { name: "Dinner" },
            ];

            for (const mealType of mealTypesToInsert) {
            const exists = await MealType.findOne({ where: { name: mealType.name } });
            if (!exists) {
                await MealType.create(mealType);
            }
            }
            console.log("Meal Types seeded");

            const menuTypesToInsert = [
                { name: "Menu 5 dias" },
                { name: "Menu 7 dias" },
                ];

                for (const menuType of menuTypesToInsert) {
                const exists = await MenuType.findOne({ where: { name: menuType.name } });
                if (!exists) {
                    await MenuType.create(menuType);
                }
                }
                console.log("Menu Types seeded");

    const nutritionTypesToInsert = [
        { name: "Proteína" },
        { name: "Carboidratos" },
        { name: "Gordura" },
        { name: "Calorias" },
        ];

        for (const nutrition of nutritionTypesToInsert) {
        const exists = await NutritionType.findOne({ where: { name: nutrition.name } });
        if (!exists) {
            await NutritionType.create(nutrition);
        }
        }
        console.log("Nutrition Types seeded");

        const productTypesToInsert = [
        { name: "Fruta" },
        { name: "Vegetal" },
        { name: "Laticínios" },
        { name: "Carne" },
        { name: "Peixe" },
        { name: "Cereal" },
        ];

        for (const productType of productTypesToInsert) {
        const exists = await ProductType.findOne({ where: { name: productType.name } });
        if (!exists) {
            await ProductType.create(productType);
        }
        }
        console.log("Product Types seeded");

        const hashedPassword = await bcrypt.hash("123456", 10);

const usersToInsert = [
  { name: "NetworkManager", email: "net@email.com", role: "NetworkManager" },
  { name: "Student", email: "stu@email.com", role: "Student" },
  { name: "Nutritionist", email: "nutri@email.com", role: "Nutritionist" },
  { name: "Nutritionist2", email: "nutri2@email.com", role: "Nutritionist" },
  { name: "RefectoryManager", email: "rm@email.com", role: "RefectoryManager" },
  { name: "RefectoryManager2", email: "rm2@email.com", role: "RefectoryManager" },
  { name: "RefectoryManager3", email: "rm3@email.com", role: "RefectoryManager" },
  { name: "Visitor", email: "visitor@email.com", role: "Visitor" },
  { name: "Visitor2", email: "visitor2@email.com", role: "Visitor" },
  { name: "Student2", email: "stu2@email.com", role: "Student" },
  { name: "NursingHome", email: "nh1@email.com", role: "NursingHome" },
  { name: "RefectoryStaff", email: "rstaff@email.com", role: "RefectoryStaff" },
  { name: "NursingHome2", email: "nh2@email.com", role: "NursingHome" },
  { name: "Visitor6", email: "visitor6@email.com", role: "Visitor" },
  { name: "Visitor3", email: "visitor3@email.com", role: "Visitor" },
  { name: "Visitor7", email: "visitor7@email.com", role: "Visitor" },
  { name: "Visitor4", email: "visitor4@email.com", role: "Visitor" },
  { name: "Visitor8", email: "visitor8@email.com", role: "Visitor" },
  { name: "Visitor5", email: "visitor5@email.com", role: "Visitor" },
  { name: "StockManager", email: "sm@email.com", role: "StockManager" },
  { name: "Visitor9", email: "visitor9@email.com", role: "Visitor" },
  { name: "Visitor10", email: "visitor10@email.com", role: "Visitor" },
  { name: "Visitor11", email: "visitor11@email.com", role: "Visitor" },
  { name: "Visitor12", email: "visitor12@email.com", role: "Visitor" },
  { name: "Visitor13", email: "visitor13@email.com", role: "Visitor" },
  { name: "Visitor14", email: "visitor14@email.com", role: "Visitor" },
  { name: "CanteenManager", email: "cm@email.com", role: "CanteenManager" },
];
    for (const user of usersToInsert) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (!exists) {
        await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        status: "enabled", // Add the required status property
        role: user.role as "Supplier" | "NetworkManager" | "Student" | "Nutritionist" | "Visitor" | "NursingHome" | "RefectoryStaff" | "StockManager" | "CanteenManager" | "RefectoryManager"
        });
    }
    }

    // Adicionar RefectoryStaff com password "12345"
    const hashedPassword12345 = await bcrypt.hash("12345", 10);
    const refectoryStaff2Exists = await User.findOne({ where: { email: "rstaff2@email.com" } });
    if (!refectoryStaff2Exists) {
        await User.create({
            name: "RefectoryStaff2",
            email: "rstaff2@email.com",
            password: hashedPassword12345,
            status: "enabled",
            role: "RefectoryStaff"
        });
        console.log("✅ RefectoryStaff2 criado com password 12345");
    }

    // Adicionar RefectoryStaff3 com password "123456"
    const hashedPassword123456 = await bcrypt.hash("123456", 10);
    const refectoryStaff3Exists = await User.findOne({ where: { email: "rstaff3@email.com" } });
    if (!refectoryStaff3Exists) {
        await User.create({
            name: "RefectoryStaff3",
            email: "rstaff3@email.com",
            password: hashedPassword123456,
            status: "enabled",
            role: "RefectoryStaff"
        });
        console.log("✅ RefectoryStaff3 criado com password 123456");
    }

    // Adicionar CanteenManager com password "123456" e canteenId 1
    const canteenManagerExists = await User.findOne({ where: { email: "cm@email.com" } });
    if (!canteenManagerExists) {
        await User.create({
            name: "canteenmanager",
            email: "cm@email.com",
            password: hashedPassword123456,
            status: "enabled",
            role: "CanteenManager",
            canteenId: 1
        });
        console.log("✅ CanteenManager criado com password 123456 e canteenId 1");
    } else {
        // Se já existe, atualizar para ter canteenId 1
        if (!canteenManagerExists.canteenId) {
            canteenManagerExists.canteenId = 1;
            canteenManagerExists.password = hashedPassword123456;
            canteenManagerExists.name = "canteenmanager";
            await canteenManagerExists.save();
            console.log("✅ CanteenManager atualizado com password 123456 e canteenId 1");
        }
    }

    console.log("Users seeded");

    // --- INSTITUTIONS, CANTEENS E REFEITORIOS ---
    console.log("Creating Institutions, Canteens and Refeitorios...");

    try {

    // Buscar MenuTypes (assumindo que já foram criados)
    const menuType5Dias = await MenuType.findOne({ where: { name: "Menu 5 dias" } });
    const menuType7Dias = await MenuType.findOne({ where: { name: "Menu 7 dias" } });
    
    if (!menuType5Dias || !menuType7Dias) {
        console.log("⚠️ MenuTypes não encontrados. Certifica-te de que foram criados primeiro.");
    } else {
        // 1. Criar Instituição 1 - Escola
        let institution1 = await Institution.findOne({ where: { name: "Escola Primária Central de Cinfães" } });
        if (!institution1) {
            institution1 = await Institution.create({
                name: "Escola Primária Central de Cinfães",
                idmenutype: menuType5Dias.id,
                location: "Rua da Escola, 123",
                freguesia: "Souselo",
                municipio: "Cinfães"
            });
            console.log("✅ Instituição 1 criada (Escola)");
        }

        // 2. Criar Instituição 2 - Lar 1
        let institution2 = await Institution.findOne({ where: { name: "Lar de Idosos São João de Cinfães" } });
        if (!institution2) {
            institution2 = await Institution.create({
                name: "Lar de Idosos São João de Cinfães",
                idmenutype: menuType7Dias.id,
                location: "Avenida da Paz, 45",
                freguesia: "Tarouquela",
                municipio: "Cinfães"
            });
            console.log("✅ Instituição 2 criada (Lar 1)");
        }

        // 3. Criar Instituição 3 - Lar 2
        let institution3 = await Institution.findOne({ where: { name: "Lar de Idosos Santa Maria de Cinfães" } });
        if (!institution3) {
            institution3 = await Institution.create({
                name: "Lar de Idosos Santa Maria de Cinfães",
                idmenutype: menuType7Dias.id,
                location: "Rua da Esperança, 78",
                freguesia: "Oliveira do Douro",
                municipio: "Cinfães"
            });
            console.log("✅ Instituição 3 criada (Lar 2)");
        }

        // 4. Criar Cantina na Escola
        let canteen1 = await Canteen.findOne({ where: { name: "Cantina da Escola Central de Cinfães" } });
        if (!canteen1 && institution1) {
            canteen1 = await Canteen.create({
                name: "Cantina da Escola Central de Cinfães",
                institutionId: institution1.id,
                idmenutype: menuType5Dias.id,
                location: "Rua da Escola, 123",
                freguesia: "Souselo",
                municipio: "Cinfães"
            });
            console.log("✅ Cantina criada na Escola");
        }

        // 5. Criar Refeitório na Escola
        let refeitorio1 = await Refeitorio.findOne({ where: { name: "Refeitório da Escola Central de Cinfães" } });
        if (!refeitorio1 && institution1) {
            refeitorio1 = await Refeitorio.create({
                name: "Refeitório da Escola Central de Cinfães",
                institutionId: institution1.id,
                location: "Rua da Escola, 123",
                freguesia: "Souselo",
                municipio: "Cinfães"
            });
            console.log("✅ Refeitório criado na Escola");
        }

        // 6. Criar Cantina no Lar 1
        let canteen2 = await Canteen.findOne({ where: { name: "Cantina do Lar São João de Cinfães" } });
        if (!canteen2 && institution2) {
            canteen2 = await Canteen.create({
                name: "Cantina do Lar São João de Cinfães",
                institutionId: institution2.id,
                idmenutype: menuType7Dias.id,
                location: "Avenida da Paz, 45",
                freguesia: "Tarouquela",
                municipio: "Cinfães"
            });
            console.log("✅ Cantina criada no Lar 1");
        }

        // 7. Criar Refeitório no Lar 1
        let refeitorio2 = await Refeitorio.findOne({ where: { name: "Refeitório do Lar São João de Cinfães" } });
        if (!refeitorio2 && institution2) {
            refeitorio2 = await Refeitorio.create({
                name: "Refeitório do Lar São João de Cinfães",
                institutionId: institution2.id,
                location: "Avenida da Paz, 45",
                freguesia: "Tarouquela",
                municipio: "Cinfães"
            });
            console.log("✅ Refeitório criado no Lar 1");
        }

        // 8. Criar Refeitório no Lar 2
        let refeitorio3 = await Refeitorio.findOne({ where: { name: "Refeitório do Lar Santa Maria de Cinfães" } });
        if (!refeitorio3 && institution3) {
            refeitorio3 = await Refeitorio.create({
                name: "Refeitório do Lar Santa Maria de Cinfães",
                institutionId: institution3.id,
                location: "Rua da Esperança, 78",
                freguesia: "Oliveira do Douro",
                municipio: "Cinfães"
            });
            console.log("✅ Refeitório criado no Lar 2");
        }

        // 9. Associar Primeira Cantina (Escola) com Refeitório da Escola e Lar 2
        if (canteen1 && refeitorio1 && refeitorio3) {
            const refeitorioIds = [refeitorio1.id, refeitorio3.id];
            
            for (const refeitorioId of refeitorioIds) {
                const existing = await CanteenRefeitorio.findOne({
                    where: { canteenId: canteen1.id, refeitorioId: refeitorioId }
                });
                if (!existing) {
                    await CanteenRefeitorio.create({
                        canteenId: canteen1.id,
                        refeitorioId: refeitorioId
                    });
                }
            }
            console.log("✅ Cantina da Escola associada com Refeitório da Escola e Lar 2");
        }

        // 10. Associar Cantina do Lar 1 com Refeitório do Lar 1
        if (canteen2 && refeitorio2) {
            const existing = await CanteenRefeitorio.findOne({
                where: { canteenId: canteen2.id, refeitorioId: refeitorio2.id }
            });
            if (!existing) {
                await CanteenRefeitorio.create({
                    canteenId: canteen2.id,
                    refeitorioId: refeitorio2.id
                });
                console.log("✅ Cantina do Lar 1 associada com Refeitório do Lar 1");
            }
        }

        console.log("✅ Institutions, Canteens e Refeitorios seeded");

        // Associar RefectoryStaff e RefectoryManager aos refeitórios
        const refeitorio1ForUsers = await Refeitorio.findOne({ where: { name: "Refeitório da Escola Central de Cinfães" } });
        const refeitorio2ForUsers = await Refeitorio.findOne({ where: { name: "Refeitório do Lar São João de Cinfães" } });

        // Associar RefectoryStaff ao primeiro refeitório
        if (refeitorio1ForUsers) {
            const refectoryStaff = await User.findOne({ where: { email: "rstaff@email.com" } });
            if (refectoryStaff && !refectoryStaff.refeitorioId) {
                refectoryStaff.refeitorioId = refeitorio1ForUsers.id;
                await refectoryStaff.save();
                console.log("✅ RefectoryStaff associado ao Refeitório da Escola");
            }
            
            const rstaff2 = await User.findOne({ where: { email: "rstaff2@email.com" } });
            if (rstaff2 && !rstaff2.refeitorioId) {
                rstaff2.refeitorioId = refeitorio1ForUsers.id;
                await rstaff2.save();
                console.log("✅ RefectoryStaff2 associado ao Refeitório da Escola (ID 1)");
            }

            const rstaff3 = await User.findOne({ where: { email: "rstaff3@email.com" } });
            if (rstaff3 && !rstaff3.refeitorioId) {
                rstaff3.refeitorioId = refeitorio1ForUsers.id;
                await rstaff3.save();
                console.log("✅ RefectoryStaff3 associado ao Refeitório da Escola (ID 1)");
            }
        }

        // Associar RefectoryManager ao segundo refeitório
        if (refeitorio2ForUsers) {
            const refectoryManager = await User.findOne({ where: { email: "rm@email.com" } });
            if (refectoryManager && !refectoryManager.refeitorioId) {
                refectoryManager.refeitorioId = refeitorio2ForUsers.id;
                await refectoryManager.save();
                console.log("✅ RefectoryManager associado ao Refeitório do Lar 1");
            }
        }

        // Associar RefectoryManager3 ao primeiro refeitório
        if (refeitorio1ForUsers) {
            const refectoryManager3 = await User.findOne({ where: { email: "rm3@email.com" } });
            if (refectoryManager3 && !refectoryManager3.refeitorioId) {
                refectoryManager3.refeitorioId = refeitorio1ForUsers.id;
                await refectoryManager3.save();
                console.log("✅ RefectoryManager3 associado ao Refeitório da Escola (ID 1)");
            }
        }

        // Associar Nutritionist ao primeiro refeitório (ID 1)
        if (refeitorio1ForUsers) {
            const nutritionist = await User.findOne({ where: { email: "nutri@email.com" } });
            if (nutritionist && !nutritionist.refeitorioId) {
                nutritionist.refeitorioId = refeitorio1ForUsers.id;
                await nutritionist.save();
                console.log("✅ Nutritionist associado ao Refeitório da Escola (ID 1)");
            }
        }

        // Associar Nutritionist2 ao segundo refeitório (ID 2)
        if (refeitorio2ForUsers) {
            const nutritionist2 = await User.findOne({ where: { email: "nutri2@email.com" } });
            if (nutritionist2 && !nutritionist2.refeitorioId) {
                nutritionist2.refeitorioId = refeitorio2ForUsers.id;
                await nutritionist2.save();
                console.log("✅ Nutritionist2 associado ao Refeitório do Lar 1 (ID 2)");
            }
        }

        // Associar CanteenManager ao canteenId 1
        const canteen1ForUsers = await Canteen.findOne({ where: { id: 1 } });
        if (canteen1ForUsers) {
            const canteenManager = await User.findOne({ where: { email: "cm@email.com" } });
            if (canteenManager && canteenManager.role === "CanteenManager") {
                if (!canteenManager.canteenId || canteenManager.canteenId !== 1) {
                    canteenManager.canteenId = 1;
                    await canteenManager.save();
                    console.log("✅ CanteenManager associado ao canteenId 1");
                }
            }
        }

        // --- MEALS (após criar instituições/cantinas/refeitórios e dishes) ---
        // Buscar cantina e refeitório da escola para associar às meals
        const canteen1ForMeals = await Canteen.findOne({ where: { name: "Cantina da Escola Central de Cinfães" } });
        const refeitorio1ForMeals = await Refeitorio.findOne({ where: { name: "Refeitório da Escola Central de Cinfães" } });

        if (canteen1ForMeals && refeitorio1ForMeals) {
            // Mapear meals para os dishes corretos pelos nomes (exatamente como estavam)
            const dishNameMap: { [key: string]: string } = {
                "Frango Assado": "Frango Assado com Batata e Cenoura",
                "Carne de Vaca Estufada": "Carne de Vaca Estufada com Tomate e Curgete",
                "Peru Grelhado": "Peru Grelhado com Arroz e Brócolos",
                "Carne de Porco": "Carne de Porco com Abóbora e Cebola",
                "Pato Salteado": "Pato Salteado com Maçã e Batata",
                "Bacalhau à Brás": "Bacalhau à Brás",
                "Salmão no Forno": "Salmão no Forno com Tomate e Alface",
                "Arroz de Atum": "Arroz de Atum",
                "Filetes de Dourada": "Filetes de Dourada com Puré de Abóbora",
                "Lulas Estufadas": "Lulas Estufadas com Cenoura e Cebola",
                "Massa": "Massa com Tomate, Brócolos e Cenoura",
                "Grão-de-bico": "Grão-de-bico com Abóbora e Cebola",
                "Feijoada Vegetariana": "Feijoada Vegetariana",
                "Salada": "Salada de Alface com Pera, Maçã e Curgete",
                "Sopa": "Sopa de Tomate com Cebola e Batata"
            };

            for (const meal of mealsToInsert) {
                // Buscar o dish pelo nome correto
                const dishName = dishNameMap[meal.name];
                if (!dishName) {
                    console.log(`⚠️ Nome de dish não mapeado para a meal "${meal.name}". A meal não foi criada.`);
                    continue;
                }

                // Buscar o dish pelo nome exato
                const dish = await Dish.findOne({ where: { name: dishName } });
                
                if (!dish) {
                    console.log(`⚠️ Dish "${dishName}" não encontrado. A meal "${meal.name}" não foi criada.`);
                    continue;
                }

                const exists = await Meal.findOne({
                    where: {
                        mealTypeId: meal.mealTypeId,
                        name: meal.name,
                        date: meal.date,
                        dishId: dish.id
                    }
                });

                if (!exists) {
                    await Meal.create({
                        mealTypeId: meal.mealTypeId,
                        name: meal.name,
                        date: meal.date,
                        dishId: dish.id,
                        canteenId: canteen1ForMeals.id,
                        refeitorioId: refeitorio1ForMeals.id
                    });
                }
            }
            console.log('✅ Meals seeded com canteenId e refeitorioId');
        } else {
            console.log('⚠️ Cantina ou Refeitório não encontrados. Meals não foram criadas.');
        }
        }
    } catch (error) {
        console.error('Error creating institutions/canteens/refeitorios/meals:', error);
    }

};