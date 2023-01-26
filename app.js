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
const nodemailer = require("nodemailer");

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

// node Mailer
app.post("/sendMail", async (req, res) => {
  try {
    console.log(req.body);
    async function main() {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASS_MAIL,
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"${req.body.nombre}"  <${req.body.mail}>`, // sender address
        to: `info@corralonbianchi.com.ar, ${req.body.mail} `, // list of receivers
        subject: "Formulario de Contacto: " + req.body.nombre, // Subject line
        text: req.body.consulta, // plain text body
        html: `<h1>Formulario de Contacto</h1> 
        <br/>
        <h3> Gracias por contactarte con nosotros </h3> 
        <p> A la brevedad nos pondremos en contacto</p>
        <h4> Nombre: ${req.body.nombre} </h3>  
        <h4> Telefono: ${req.body.telefono}</h3>  
        <h4> Mail: ${req.body.mail} </h3> 
        <h4> Consulta:</h3> <span> ${req.body.consulta}</span>   
        `, // html body
      });

      console.log("Message sent: from: " + req.body.mail);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch(console.error);
    return res.redirect("/");
  } catch (error) {
    console.log("ups", error);
  }
});

module.exports = app;
