import { Institution } from "../Model/Institution";
import { MenuType } from "../Model/MenuType";

export class InstitutionService {
  static async createInstitution(data: {
    name: string;
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

    const institution = await Institution.create(data);
    return institution;
  }

  static async getAllInstitutions() {
    return await Institution.findAll({
      include: [
        {
          model: MenuType,
          as: "menuType",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  static async getInstitutionById(id: number) {
    const institution = await Institution.findByPk(id, {
      include: [
        {
          model: MenuType,
          as: "menuType",
          attributes: ["id", "name"],
        },
      ],
    });
    if (!institution) {
      throw new Error("INSTITUTION_NOT_FOUND");
    }
    return institution;
  }
}

