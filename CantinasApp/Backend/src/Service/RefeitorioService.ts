import { Refeitorio } from "../Model/Refeitorio";

export class RefeitorioService {
  static async createRefeitorio(data: {
    name: string;
    institutionId?: number;
    location: string;
    freguesia?: string;
    municipio?: string;
  }) {
    const refeitorio = await Refeitorio.create(data);
    return refeitorio;
  }

  static async getAllRefeitorios() {
    return await Refeitorio.findAll();
  }

  static async getRefeitorioById(id: number) {
    const refeitorio = await Refeitorio.findByPk(id);
    if (!refeitorio) {
      throw new Error("REFEITORIO_NOT_FOUND");
    }
    return refeitorio;
  }
}

