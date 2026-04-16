import { Unit } from '../Model/Unit'

export class UnitService {

    async getUnitById(id: number) {
        const unit = await Unit.findByPk(id);
        if (!unit) throw new Error("UNIT_NOT_FOUND");
        return unit;
    }
}