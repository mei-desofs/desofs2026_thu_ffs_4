import { User } from "../Model/User";
import { Canteen } from "../Model/Canteen";
import { Refeitorio } from "../Model/Refeitorio";
import bcrypt from "bcrypt";
import { OrderService } from "./OrderService";
import { NeededProduct } from "../Model/NeededProduct";
import { generateOrdersFromNeededProducts } from "../utils/generateOrdersFromNeededProducts";

const SECRET_KEY = process.env.SECRET_KEY || "minha_chave_secreta";

export class UserService {
  // Criar novo utilizador
  static async createUser(name: string, email: string, password: string, role: "Supplier" | "NetworkManager" | "Nutritionist" | "Student" | "Visitor" | "NursingHome" | "RefectoryStaff"| "StockManager"| "CanteenManager" | "RefectoryManager", refeitorioId?: number, canteenId?: number) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, status: "enabled", refeitorioId, canteenId });
    return user;
  }

  // Verificar se email existe
  static async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  // Login
  static async login(email: string, password: string) {
    const user = await User.findOne({ 
      where: { email },
      include: [
        {
          model: Canteen,
          as: "canteen",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Refeitorio,
          as: "refeitorio",
          attributes: ["id", "name"],
          required: false,
        },
      ],
    });

    if (!user) throw new Error("Email inválido.");
    if ((user as any).status === "disabled") throw new Error("Conta desativada.");

    const validPassword = await bcrypt.compare(password, user.password as string);
    if (!validPassword) throw new Error("Senha incorreta.");

    // Retorna dados do user sem password, incluindo informações da cantina/refeitório
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user as any).role || "user",
      status: (user as any).status || "enabled",
      canteenId: (user as any).canteenId || null,
      refeitorioId: (user as any).refeitorioId || null,
      canteen: (user as any).canteen ? { id: (user as any).canteen.id, name: (user as any).canteen.name } : null,
      refeitorio: (user as any).refeitorio ? { id: (user as any).refeitorio.id, name: (user as any).refeitorio.name } : null,
    };
  }

  // Encontrar utilizador por ID
  static async findById(id: number) {
    return await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Excluir password dos resultados
    });
  }

  static async startQuarantine(id: number) {
    const user = await User.findByPk(id); 
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }
    user.status = "quarantine";
    await user.save();

    if(user.role === "Supplier") {
    // se o supplier tiver orders, cancelear e meter neededProducts como needed outra vez
    const orders = await OrderService.getByUserId(id);
    let needProductsIds = [];
    for(const order of orders) {
        await OrderService.updateStatus(order.id, "cancelled");
        needProductsIds.push(order.neededProductId);
    }

    for(const npId of needProductsIds) {
        const neededProduct = await NeededProduct.findByPk(npId);
        if(neededProduct) {
            neededProduct.status = "needed";
            await neededProduct.save();
        }
    }

    // gerar novas encomendas dos neededProducts atualizados para outros suppliers
    await generateOrdersFromNeededProducts();
    }

    return user;
  }

  static async endQuarantine(id: number) {
    const user = await User.findByPk(id); 
    if (!user) {
      throw new Error("Utilizador não encontrado.");
    }
    user.status = "enabled";
    await user.save();
    return user;
  }
}
