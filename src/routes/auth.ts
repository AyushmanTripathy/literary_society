import { Router } from "express";
import { decode, encode } from "jwt-simple";
import { AUTH_KEY } from "../libs/secrets";
import User from "../models/User";

const router = Router();
const state = process.env.OAUTH_STATE;

router.use((req, res, next) => {
  if (req.headers.cookie) {
    try {
      const details = decode(req.headers.cookie.replace("auth=", ""), AUTH_KEY);
      res.locals = { isLoggedIn: true, details };
    } catch (e) {
      res.clearCookie("auth");
    }
  }
  next();
});

router.use("/auth/login", (req, res) => {
  res.redirect(
    `https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&response_type=code&state=${state}&redirect_uri=${process.env.ORIGIN}/auth/callback/google&client_id=${process.env.CLIENT_ID}`
  );
});

router.use("/auth/callback/google", async (req, res) => {
  try {
    const code = req.query.code;

    const grant = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: `${process.env.ORIGIN}/auth/callback/google`,
      }),
    });
    const { id_token, expires_in } = await grant.json();
    const infoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );
    const info = await infoResponse.json();

    if (info.aud != process.env.CLIENT_ID) {
      res.status(400).redirect("/");
      return;
    }

    let user = await User.findOne({ mail: info.email });
    if (!user) {
      user = new User({
        name: info.name,
        mail: info.email,
        picture: info.picture,
      });
      await user.save();
    }
    const authToken = encode(
      {
        id: user.id,
        email: info.email,
        picture: info.picture,
        name: info.name,
      },
      AUTH_KEY
    );

    res.cookie("auth", authToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60000,
    });

    res.redirect("/");
  } catch (e) {
    res.status(400).redirect("/");
    return;
  }
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

export default router;
