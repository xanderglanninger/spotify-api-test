const searchObj = require("./search");
const host = "localhost";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require("fs");

//This fucntion is used to replace all the allocated varibles within the index.html page
const replaceTemplate = (temp, value) => {
  let output = temp.replace(/{%ARTIST%}/g, value[0]);
  output = output.replace(/{%SONGNAME%}/g, value[1]);
  output = output.replace(/{%PREVIEWLINK%}/g, value[2]);
  output = output.replace(/{%ALBUM%}/g, value[3]);
  output = output.replace(/{%VISIBLE%}/g, "visible-true");
  return output;
};

//This fetches the html file
const tempSearchpage = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// This is used to import all static file. In our case this will be the css file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send(tempSearchpage);
});

app.post("/search", async (req, res) => {
  const searchQuery = req.body.searchQuery;
  try {
    //Receives an array containg the song details fetched from spotify
    const songDetails = await searchObj.getSongDetails(searchQuery);

    //Gets the newly replace index.html where all the variables have been filled with information
    const replacedIndex = replaceTemplate(tempSearchpage, songDetails);
    res.send(replacedIndex);
  } catch (error) {
    res.status(500).send("An error occurred: " + error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
