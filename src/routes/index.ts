import { Router } from "express";
import authRouter from "./auth";
import Post from "../models/Post";
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

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) throw "not found";
    res.render("user", {
      user,
      posts: await Post.find({ authorId: id })
    })
  } catch(e) {
    handleError(res, e);
  }
});

router.get("/posts/add", (req, res) => {
  if (res.locals.isLoggedIn) res.render("posts/add");
  else res.redirect("/");
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
      likes: 0,
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
