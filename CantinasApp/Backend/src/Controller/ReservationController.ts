import { Request, Response } from "express";
import { ReservationService } from "../Service/ReservationService";

const service = new ReservationService();

type AuthenticatedUser = {
  id: number;
  role: string;
};

const getAuthenticatedUser = (req: Request): AuthenticatedUser | undefined =>
  (req as Request & { user?: AuthenticatedUser }).user;

const canManageReservations = (role: string) =>
  [
    "NetworkManager",
    "CanteenManager",
    "RefectoryManager",
    "StockManager",
  ].includes(role);

export class ReservationController {
  static async createReservation(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    const {
      status = "active",
      reservationDate = new Date(),
      quantity = 1,
      mealId,
      refeitorioId,
    } = req.body;

    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!mealId) {
      return res.status(400).json({ error: "mealId is required" });
    }

    try {
      // Se refeitorioId não for fornecido, buscar da meal
      let finalRefeitorioId = refeitorioId;
      if (!finalRefeitorioId) {
        const { Meal } = await import("../Model/Meal");
        const meal = await Meal.findByPk(mealId);
        if (!meal) {
          return res.status(404).json({ error: "Meal not found" });
        }
        if (!meal.refeitorioId) {
          return res
            .status(400)
            .json({ error: "Meal does not have a refeitorioId associated" });
        }
        finalRefeitorioId = meal.refeitorioId;
      }

      const reservation = await service.createReservation({
        status,
        reservationDate,
        quantity,
        mealId,
        userId: authenticatedUser.id,
        refeitorioId: finalRefeitorioId,
      });
      res.status(201).json(reservation);
    } catch (error: any) {
      if (error.message === "MEAL_NOT_FOUND")
        return res.status(404).json({ error: "Meal not found" });
      if (error.message === "USER_NOT_FOUND")
        return res.status(404).json({ error: "User not found" });
      if (error.message === "REFEITORIO_NOT_FOUND")
        return res.status(404).json({ error: "Refeitório not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async listReservations(req: Request, res: Response) {
    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const { userId, status, refeitorioId } = req.query;
    const requestedUserId = userId ? Number(userId) : undefined;
    const canSeeAll = canManageReservations(authenticatedUser.role);
    const reservations = await service.listReservations({
      userId: canSeeAll ? requestedUserId : authenticatedUser.id,
      status: status as string | undefined,
      refeitorioId: canSeeAll
        ? refeitorioId
          ? Number(refeitorioId)
          : undefined
        : undefined,
    });
    res.json(reservations);
  }

  static async cancelReservation(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const existingReservation = await service.getById(id);
      if (!existingReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      if (
        !canManageReservations(authenticatedUser.role) &&
        existingReservation.userId !== authenticatedUser.id
      ) {
        return res
          .status(403)
          .json({ error: "Sem permissão para aceder a esta reserva" });
      }

      const updatedReservation = await service.updateStatus(id, "canceled");
      res.json(updatedReservation);
    } catch (error: any) {
      if (error.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    if (!status) return res.status(400).json({ error: "Status is required" });

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const existingReservation = await service.getById(id);
      if (!existingReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      if (
        !canManageReservations(authenticatedUser.role) &&
        existingReservation.userId !== authenticatedUser.id
      ) {
        return res
          .status(403)
          .json({ error: "Sem permissão para aceder a esta reserva" });
      }

      const updatedReservation = await service.updateStatus(id, status);
      res.json(updatedReservation);
    } catch (error: any) {
      if (error.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async liftTickets(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { quantity } = req.body;

    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    if (!quantity || quantity < 1)
      return res
        .status(400)
        .json({ error: "Quantity is required and must be at least 1" });

    const authenticatedUser = getAuthenticatedUser(req);
    if (!authenticatedUser) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    try {
      const existingReservation = await service.getById(id);
      if (!existingReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      if (
        !canManageReservations(authenticatedUser.role) &&
        existingReservation.userId !== authenticatedUser.id
      ) {
        return res
          .status(403)
          .json({ error: "Sem permissão para aceder a esta reserva" });
      }

      const updatedReservation = await service.liftTickets(id, quantity);
      res.json(updatedReservation);
    } catch (error: any) {
      if (error.message === "RESERVATION_NOT_FOUND")
        return res.status(404).json({ error: "Reservation not found" });
      if (error.message === "RESERVATION_NOT_ACTIVE")
        return res.status(400).json({ error: "Reservation is not active" });
      if (error.message === "INVALID_QUANTITY")
        return res.status(400).json({ error: "Invalid quantity" });
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
