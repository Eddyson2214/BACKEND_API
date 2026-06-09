import express from "express";
import mongoose from 'mongoose';
import authRouter from "./routes/auth.js";
import bannerRouter from './routes/banner.js'
import categoryRooter from "./routes/category.js";
import subcategoryRouter from "./routes/sub_category.js";
import productRouter from "./routes/product.js";
import productReviewRouter from "./routes/product_review.js";
import cors from "cors";
import vendorRouter from "./routes/vendor.js";
import OrderRouter from "./routes/order.js";
const PORT =process.env.PORT || 3000;

// MongoDB
const DB = "mongodb+srv://backend_ecom:projectecom3424@cluster0.y0rtyzk.mongodb.net/?appName=Cluster0";

mongoose.connect(DB).then(() => {
    console.log('DB connected');
});

const app = express();

// 🔥 Ces middlewares doivent venir AVANT les routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// 🔥 Ensuite on charge les routes
app.use(authRouter);
app.use(bannerRouter)
app.use(categoryRooter)
app.use(subcategoryRouter)
app.use(productRouter)
app.use(productReviewRouter)
app.use(vendorRouter)
app.use(OrderRouter)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`App is listening on port ${PORT}`);
});
