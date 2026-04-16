import { Notification } from "../Model/Notification";

export class NotificationService {
    static async create(userId: number, title: string, body: string) {
        return await Notification.create({
            userId,
            title,
            body,
            status: "sent",
        });
    }

    static async markAsSeen(notificationId: number) {
        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            throw new Error("Notification not found");
        }

        if (notification.status === "seen") {
            return notification;
        }

        notification.status = "seen";
        await notification.save();

        return notification;
    }

    static async getByUserId(userId: number, status?: "sent" | "seen") {
        return await Notification.findAll({
            where: {
                userId,
                ...(status && { status }),
            },
            order: [["createdAt", "DESC"]],
        });
    }
}
