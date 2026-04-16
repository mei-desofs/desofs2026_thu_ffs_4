import { Parish } from "../Model/Parish";
import { ApplicationService } from "../Service/ApplicationService";
import { UserService } from "../Service/UserService";

export class ParishService {

    async createParish(data: {
        name: string;
    }) {
        const parish = await this.getParishByName(data.name);
        if (parish) throw new Error("PARISH_ALREADY_EXISTS");

        return await Parish.create(data)
    }

    async listParishes() {
        return await Parish.findAll();
    }

    async getParishById(id: number) {
        const parish = await Parish.findByPk(id);
        if (!parish) throw new Error("PARISH_NOT_FOUND");
        return parish;
    }

    async getParishByName(name: string) {
        return Parish.findOne({ where: { name } });
    }

    async quarantineParish(id: number) {
        const applicationService = new ApplicationService();

        const parish = await Parish.findByPk(id);
        if (!parish) throw new Error("PARISH_NOT_FOUND");

        if (parish.quarantined === true) {
            throw new Error("PARISH_ALREADY_QUARANTINED");
        }

        parish.quarantined = true;
        await parish.save();

        const applications = await applicationService.listApplications();
        
        for (const application of applications) {
            if (application.status === "approved" && application.freguesia === parish.name) {
                await UserService.startQuarantine(application.userId);
            }
        }

        return parish;
    }

    async takeParishOfQuarantine(id: number) {
        const applicationService = new ApplicationService();
        
        const parish = await Parish.findByPk(id);
        if (!parish) throw new Error("PARISH_NOT_FOUND");

        if (parish.quarantined === false) {
            throw new Error("PARISH_ALREADY_NOT_QUARANTINED");
        }

        parish.quarantined = false;
        await parish.save();

        const applications = await applicationService.listApplications();
        
        for (const application of applications) {
            if (application.status === "approved" && application.freguesia === parish.name) {
                await UserService.endQuarantine(application.userId);
            }
        }

        return parish;
    }
}