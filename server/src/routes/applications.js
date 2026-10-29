import { Router } from "express";
import Application from "../models/Application.js";
import { internships } from "../data/internships.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { studentName, email, rollNumber, internshipId } = req.body;

    if (!studentName || !email || !rollNumber || !internshipId) {
      return res.status(400).json({ message: "Please complete all application fields." });
    }

    const internship = internships.find((item) => item.id === internshipId);
    if (!internship) {
      return res.status(400).json({ message: "Please choose a valid internship." });
    }

    const application = await Application.create({
      studentName,
      email,
      rollNumber,
      internshipId,
      internshipTitle: internship.title
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ count: applications.length, applications });
  } catch (error) {
    next(error);
  }
});

export default router;
