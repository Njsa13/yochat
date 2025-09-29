import e from "express";
import cors from "cors";
import session from "express-session";

import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import passport from "./config/passport.js";

const app = e();
const PORT = process.env.BACKEND_PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(e.json({ limit: "50mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV != "development",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
