const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index")

app.use("/api/v1",mainRouter);

console.log("App is running");

app.listen(3001)

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const adminRouter = require("./routes/admin")
// const userRouter = require("./routes/user");

// // Middleware for parsing request bodies
// app.use(bodyParser.json());
// app.use("/admin", adminRouter)
// app.use("/user", userRouter)

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

