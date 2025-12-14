import Progress from "../models/Progress.js";

// Get user progress
export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });
    if (!progress) return res.status(404).json({ message: "No progress found" });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user progress
export const updateProgress = async (req, res) => {
  try {
    const { subject, data } = req.body; // e.g., { subject: "math", data: { lesson1: true } }
    let progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      progress = new Progress({ user: req.user.id });
    }

    progress[subject] = { ...progress[subject], ...data };
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
