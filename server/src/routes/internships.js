import { Router } from "express";
import { internships } from "../data/internships.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ internships });
});

router.get("/:id", (req, res) => {
  const internship = internships.find((item) => item.id === req.params.id);
  if (!internship) {
    return res.status(404).json({ message: "Internship not found." });
  }
  return res.json({ internship });
});

export default router;
