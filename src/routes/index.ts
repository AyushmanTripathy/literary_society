import { Router } from "express";
import authRouter from "./auth";
import Post, { categories, moods } from "../models/Post";
import { handleError } from "../libs/errors";
import User from "../models/User";

const router = Router();

router.use(authRouter);

router.get("/", async (req, res) => {
  try {
    res.render("index", {
      posts: await Post.find().sort({ createdAt: -1 }).limit(10),
    });
  } catch (e) {
    handleError(res, e);
  }
});

router.get("/filter", async (req, res) => {
  try {
    const filters: { [key: string]: object } = {};
    if (req.query.mood)
      filters["mood"] = { $in: String(req.query.mood).split(",") };
    if (req.query.category)
      filters["category"] = { $in: String(req.query.category).split(",") };

    res.render("index", {
      posts: await Post.find(filters).sort({ createdAt: -1 }).limit(10),
    });
  } catch (e) {
    handleError(res, e);
  }
});

router.get("/filter/select", async (req, res) => {
  res.render("filter", { categories, moods });
});

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) throw "not found";
    res.render("user", {
      user,
      posts: await Post.find({ authorId: id }),
    });
  } catch (e) {
    handleError(res, e);
  }
});

router.get("/posts/add", (req, res) => {
  if (res.locals.isLoggedIn)
    res.render("posts/add", {
      moods,
      categories,
    });
  else res.redirect("/");
});

router.post("/posts/:id/dislike", async (req, res) => {
  if (!res.locals.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: { id: res.locals.details.id } },
    });

    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(400);
  }
});

router.post("/posts/:id/like", async (req, res) => {
  if (!res.locals.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  try {
    await Post.findOneAndUpdate(
      { _id: req.params.id, "likes.id": { $ne: res.locals.details.id } },
      {
        $push: {
          likes: {
            id: res.locals.details.id,
            name: res.locals.details.name,
            picture: res.locals.details.picture,
          },
        },
      }
    );

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.post("/posts/add", async (req, res) => {
  if (!res.locals.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      by: req.body.by,
      likes: [],
      category: req.body.category,
      mood: req.body.mood,
      createdAt: Date.now(),
      authorId: res.locals.details.id,
      author: {
        name: res.locals.details.name,
        picture: res.locals.details.picture,
      },
    });
    await post.save();
    res.redirect("/");
  } catch (e) {
    handleError(res, e);
  }
});

export default router;
