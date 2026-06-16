import { Request, Response } from "express";
import { NotificationService } from "../Service/NotificationService";

type AuthenticatedUser = {
  id: number;
  role: string;
};

const getAuthenticatedUser = (req: Request): AuthenticatedUser | undefined =>
  (req as Request & { user?: AuthenticatedUser }).user;

export class NotificationController {
  static async create(req: Request, res: Response) {
    try {
      const { userId, title, body } = req.body;
      const authenticatedUser = getAuthenticatedUser(req);

      if (!authenticatedUser || authenticatedUser.role !== "NetworkManager") {
        return res.status(403).json({
          message: "Sem permissão para criar notificações.",
        });
      }

      if (!userId || !title || !body) {
        return res.status(400).json({
          message: "userId, title and body are required",
        });
      }

      const notification = await NotificationService.create(
        userId,
        title,
        body,
      );

      return res.status(201).json(notification);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error creating notification",
      });
    }
  }

  // DELETE → marcar como vista
  static async markAsSeen(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const authenticatedUser = getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).json({ message: "Não autenticado." });
      }

      const notification = await NotificationService.markAsSeen(
        Number(id),
        authenticatedUser.id,
        authenticatedUser.role,
      );

      return res.status(200).json(notification);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message || "Notification not found",
      });
    }
  }

  static async getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { status } = req.query;
      const authenticatedUser = getAuthenticatedUser(req);

      if (!authenticatedUser) {
        return res.status(401).json({ message: "Não autenticado." });
      }

      const requestedUserId = Number(userId);
      const canAccessAnyUser = authenticatedUser.role === "NetworkManager";

      if (!canAccessAnyUser && authenticatedUser.id !== requestedUserId) {
        return res.status(403).json({
          message: "Sem permissão para aceder a estas notificações.",
        });
      }

      const notifications = await NotificationService.getByUserId(
        requestedUserId,
        status as "sent" | "seen" | undefined,
      );

      return res.status(200).json(notifications);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message || "Error fetching notifications",
      });
    }
  }
}
