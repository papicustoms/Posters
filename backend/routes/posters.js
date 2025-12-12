const express = require("express");
const Poster = require("../models/Poster");
const auth = require("../middleware/auth");

const router = express.Router();


// 🟢 CRÉER UN POSTER
router.post("/", auth, async (req, res) => {
  const { imageUrl, caption } = req.body;

  try {
    const newPoster = await Poster.create({
      author: req.user._id,
      imageUrl,
      caption,
    });

    res.status(201).json(newPoster);
  } catch (error) {
    res.status(500).json({ message: "Erreur création poster", error });
  }
});


// 🔵 FEED (tous les posters)
router.get("/", auth, async (req, res) => {
  try {
    const posters = await Poster.find()
      .populate("author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posters);
  } catch (error) {
    res.status(500).json({ message: "Erreur feed", error });
  }
});


// ❤️ LIKE / UNLIKE
router.post("/:id/like", auth, async (req, res) => {
  try {
    const poster = await Poster.findById(req.params.id);

    if (!poster)
      return res.status(404).json({ message: "Poster introuvable" });

    const alreadyLiked = poster.likes.includes(req.user._id);

    if (alreadyLiked) {
      poster.likes = poster.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      poster.likes.push(req.user._id);
    }

    await poster.save();
    res.json(poster);
  } catch (error) {
    res.status(500).json({ message: "Erreur like", error });
  }
});


// 💬 COMMENTER
router.post("/:id/comment", auth, async (req, res) => {
  const { text } = req.body;

  try {
    const poster = await Poster.findById(req.params.id);
    if (!poster)
      return res.status(404).json({ message: "Poster introuvable" });

    poster.comments.push({
      user: req.user._id,
      text,
    });

    await poster.save();
    res.json(poster);
  } catch (error) {
    res.status(500).json({ message: "Erreur commentaire", error });
  }
});

module.exports = router;
