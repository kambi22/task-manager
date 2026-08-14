import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { auditLogService } from "../services/audit-log.service";
import type { CreateUserInput, AddUsersToTeamInput } from "../schemas/user.schema";
import type { UpdateUserData } from "../models/user.model";

/**
 * GET /api/users
 * List all users with optional filtering.
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const isTeamMemberQuery = req.query.isTeamMember;
    let isTeamMember: boolean | undefined = undefined;

    if (isTeamMemberQuery === "true") {
      isTeamMember = true;
    } else if (isTeamMemberQuery === "false") {
      isTeamMember = false;
    }

    const users = await userService.getAllUsers(
      isTeamMember !== undefined ? { isTeamMember } : undefined
    );

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users
 * Create a new user.
 */
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = req.body as CreateUserInput;
    const user = await userService.createUser(data);

    // Log user creation
    await auditLogService.logEvent({
      userId: (req as any).user.userId,
      action: "USER_CREATE",
      resource: "User",
      resourceId: user.id,
      details: { name: user.name, email: user.email, role: user.role },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const data = req.body as UpdateUserData;
    const user = await userService.updateUser(id, data);

    // Log user update
    await auditLogService.logEvent({
      userId: (req as any).user.userId,
      action: "USER_UPDATE",
      resource: "User",
      resourceId: user.id,
      details: { updatedFields: Object.keys(data), email: user.email, role: user.role, isTeamMember: user.isTeamMember },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/users/add-to-team
 * Bulk add users to the team.
 */
export async function addUsersToTeam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userIds } = req.body as AddUsersToTeamInput;
    await userService.addUsersToTeam(userIds);

    // Log bulk team addition
    await auditLogService.logEvent({
      userId: (req as any).user.userId,
      action: "USER_BULK_ADD_TO_TEAM",
      resource: "User",
      details: { count: userIds.length, userIds },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Users added to team successfully",
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await userService.deleteUser(id);

    // Log user deletion
    await auditLogService.logEvent({
      userId: (req as any).user.userId,
      action: "USER_DELETE",
      resource: "User",
      resourceId: id,
      details: { name: result.name, email: result.email },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

