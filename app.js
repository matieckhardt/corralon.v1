const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const exphbs = require("express-handlebars");
const config = require("./config");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const appRoutes = require("./routes/app.routes");
const Carousel = require("./models/Carousel");
const IndexProd = require("./models/IndexProds");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const { info } = require("console");
const { index } = require("./controllers/client.controller");

app.set("PORT", config.PORT || 3000);
app.set("secret", config.SK);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partials: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");

app.use(
  session({
    secret: "asd",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// global
app.use((req, res, next) => {
  res.locals.logData = req.flash("logData");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/dist")));
app.use(express.static(path.join(__dirname, "public/plugins")));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/api", authRoutes);
app.use("/api", appRoutes);

// Ruta del index y carousel
app.get("/", async (req, res) => {
  try {
    const slide = await Carousel.find();
    const producto = await IndexProd.find();
    const datos = slide.map(({ HomeData }) => ({
      slideUrl: HomeData,
    }));
    const card = producto.map(({ DataProd, InfoProd }) => ({
      prodUrl: DataProd,
      prodInfo: InfoProd,
    }));
    res.render("index", {
      Slides: datos,
      Products: card,
      headContent: "Home",
      layout: false,
    });
  } catch (error) {
    console.log("ups", error);
  }
});

module.exports = app;
