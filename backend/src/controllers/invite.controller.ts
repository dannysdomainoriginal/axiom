import Invite from "@/models/Invite";
import { RequestHandler } from "express";

/* -------------------------------------------------------------------------- */
/*                             GET INVITATION CODE                            */
/* -------------------------------------------------------------------------- */
export const getInviteCode: RequestHandler = async (req, res) => {
  const invite = await Invite.createInvite({
    teamId: req.user.teamId,
    inviteAs: req.body.inviteAs,
  });

  return res.status(201).json({
    success: true,
    message: "Invite created successfully",
    data: invite.code,
  });
};
