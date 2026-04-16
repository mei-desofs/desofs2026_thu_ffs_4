import { FarmerProduct } from "../Model/FarmerProducts";

export class FarmerProductService {

  async createFarmerProducts(
    userId: number,   // ← novo parâmetro
    applicationId: number,
    farmerProducts: { week: number; products: { productId: number; quantity: number; unit: string }[] }[]
  ) {
    
    for (const weekData of farmerProducts) {
      for (const p of weekData.products) {
        await FarmerProduct.create({
          userId,              // ← agora incluído
          applicationId,
          productId: p.productId,
          week: weekData.week,
          quantity: p.quantity,
          unit: p.unit,
        });
      }
    }

    return FarmerProduct.findAll({ where: { applicationId } });
  }

  async listFarmerProducts() {
    return FarmerProduct.findAll();
  }

  async getByApplication(applicationId: number) {
    return FarmerProduct.findAll({ where: { applicationId } });
  }

  async updateFarmerProducts(
    userId: number, 
    applicationId: number,
    farmerProducts: { week: number; products: { productId: number; quantity: number; unit: string }[] }[]
  ) {
    // Primeiro, remover os produtos existentes para a aplicação
    await FarmerProduct.destroy({ where: { applicationId } });  
    // Depois, criar os novos produtos propostos
    for (const weekData of farmerProducts) {
      for (const p of weekData.products) {
        await FarmerProduct.create({
          userId, // Include userId
          applicationId,
          productId: p.productId,
          week: weekData.week,
          quantity: p.quantity,
          unit: p.unit,
        });
      }
    }
  }
}
