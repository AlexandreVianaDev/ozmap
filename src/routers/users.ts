import * as app from "express";
import { UserModel } from "../models/models";
import STATUS from "../constants/status";

const userRouters = app.Router();

userRouters.get("/user", async (req, res) => {
  const { page, limit } = req.query;

  const [users, total] = await Promise.all([
    UserModel.find().lean(),
    UserModel.count(),
  ]);

  return res.json({
    rows: users,
    page,
    limit,
    total,
  });
});

userRouters.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Region not found" });
  }

  return user;
});

userRouters.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { update } = req.body;

  const user = await UserModel.findOne({ _id: id }).lean();

  if (!user) {
    res.status(STATUS.DEFAULT_ERROR).json({ message: "Region not found" });
  }

  user.name = update.name;

  await user.save();

  return res.sendStatus(201);
});

export default userRouters;
