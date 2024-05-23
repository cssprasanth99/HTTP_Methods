const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  console.log(data);
  res.json(data);
});

app.post("/post", (req, res) => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");

    const parseData = JSON.parse(data);

    parseData.push(req.body);

    fs.writeFileSync("./db.json", JSON.stringify(parseData, null, 2));

    res.status(200).send("Student data added successfully");
  } catch (error) {
    console.error("Error handling /post request:", error);
    res.status(500).send("An error occurred");
  }
});

app.patch("/update-even-status", (req, res) => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");

    let parseData = JSON.parse(data);

    // Update the status of todos with even IDs from false to true
    parseData = parseData.map((todo) => {
      if (todo.id % 2 === 0 && todo.status === "false") {
        return { ...todo, status: "true" };
      }
      return todo;
    });

    fs.writeFileSync("./db.json", JSON.stringify(parseData, null, 2));

    res.json({
      message: "Status of even ID todos updated successfully",
      todos: parseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.delete("/delete-true-status", (req, res) => {
  try {
    const data = fs.readFileSync("./db.json", "utf-8");

    let parseData = JSON.parse(data);

    // Filter out todos whose status is true
    parseData = parseData.filter((todo) => todo.status !== "true");

    fs.writeFileSync("./db.json", JSON.stringify(parseData, null, 2));

    res.json({
      message: "Todos with status true have been deleted successfully",
      todos: parseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
