import { Canteen } from "../Model/Canteen";
import { CanteenRefeitorio } from "../Model/CanteenRefeitorio";
import { Refeitorio } from "../Model/Refeitorio";
import { MenuType } from "../Model/MenuType";

export class CanteenService {
  static async createCanteen(data: {
    name: string;
    institutionId?: number;
    idmenutype: number;
    location: string;
    freguesia?: string;
    municipio?: string;
  }) {
    // Validar se o MenuType existe
    const menuType = await MenuType.findByPk(data.idmenutype);
    if (!menuType) {
      throw new Error("MENU_TYPE_NOT_FOUND");
    }

    const canteen = await Canteen.create(data);
    return canteen;
  }

  static async getAllCanteens() {
    return await Canteen.findAll({
      include: [
        { model: Refeitorio, as: "refeitorios", through: { attributes: [] } },
        {
          model: MenuType,
          as: "menuType",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  static async getCanteenById(id: number) {
    const canteen = await Canteen.findByPk(id, {
      include: [
        { model: Refeitorio, as: "refeitorios", through: { attributes: [] } },
        {
          model: MenuType,
          as: "menuType",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!canteen) {
      throw new Error("CANTEEN_NOT_FOUND");
    }
    return canteen;
  }

  static async associateRefeitorio(canteenId: number, refeitorioId: number) {
    // Verificar se a cantina existe
    const canteen = await Canteen.findByPk(canteenId);
    if (!canteen) {
      throw new Error("CANTEEN_NOT_FOUND");
    }

    // Verificar se o refeitório existe
    const refeitorio = await Refeitorio.findByPk(refeitorioId);
    if (!refeitorio) {
      throw new Error("REFEITORIO_NOT_FOUND");
    }

    // Verificar se já existe a associação
    const existing = await CanteenRefeitorio.findOne({
      where: { canteenId, refeitorioId },
    });

    if (existing) {
      throw new Error("ASSOCIATION_ALREADY_EXISTS");
    }

    // Criar a associação
    await CanteenRefeitorio.create({ canteenId, refeitorioId });

    return { message: "Associação criada com sucesso." };
  }

  static async associateMultipleRefeitorios(canteenId: number, refeitorioIds: number[]) {
    // Verificar se a cantina existe
    const canteen = await Canteen.findByPk(canteenId);
    if (!canteen) {
      throw new Error("CANTEEN_NOT_FOUND");
    }

    if (!Array.isArray(refeitorioIds) || refeitorioIds.length === 0) {
      throw new Error("INVALID_REFEITORIO_IDS");
    }

    const results = {
      created: [] as number[],
      alreadyExists: [] as number[],
      notFound: [] as number[],
    };

    // Verificar e criar associações
    for (const refeitorioId of refeitorioIds) {
      // Verificar se o refeitório existe
      const refeitorio = await Refeitorio.findByPk(refeitorioId);
      if (!refeitorio) {
        results.notFound.push(refeitorioId);
        continue;
      }

      // Verificar se já existe a associação
      const existing = await CanteenRefeitorio.findOne({
        where: { canteenId, refeitorioId },
      });

      if (existing) {
        results.alreadyExists.push(refeitorioId);
        continue;
      }

      // Criar a associação
      await CanteenRefeitorio.create({ canteenId, refeitorioId });
      results.created.push(refeitorioId);
    }

    return {
      message: `Associações processadas. ${results.created.length} criadas, ${results.alreadyExists.length} já existiam, ${results.notFound.length} não encontrados.`,
      results,
    };
  }

  static async getCanteenRefeitorios(canteenId: number) {
    const canteen = await Canteen.findByPk(canteenId);

    if (!canteen) {
      throw new Error("CANTEEN_NOT_FOUND");
    }

    // Buscar refeitórios associados através da tabela de associação
    const canteenWithRefeitorios = await Canteen.findByPk(canteenId, {
      include: [
        {
          model: Refeitorio,
          as: "refeitorios",
          attributes: ["id", "name"],
          through: { attributes: [] }
        }
      ]
    });

    // Acessar refeitorios usando type assertion ou verificar se existe
    const refeitorios = (canteenWithRefeitorios as any)?.refeitorios || [];
    return refeitorios;
  }
}


