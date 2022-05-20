fs = require("fs");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const app = express();

// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
// app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

router.post("/getmaps", async (req, res) => {
  console.log("request body: ", req.body);

  const data = await req.body;
  fs.writeFile(
    "location.txt",
    JSON.stringify(data.map_array),
    function (err) {
      if (err) {
        console.log(err);
      }
      console.log("wrote to location.txt");
    }
  );
});

app.use("/", router);

let port = 3000;
app.listen(port, () => console.log(`app listening on port ${port}!`));
