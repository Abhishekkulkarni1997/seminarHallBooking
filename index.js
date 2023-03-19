import app from "./app.js";

app.listen("4000", () => {
  console.log(`https://localhost:4000`);
});

app.get("/", (req, res) => {
  res.send("server is running a home");
});
