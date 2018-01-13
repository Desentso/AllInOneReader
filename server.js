const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");


const app = express();

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

app.use(express.static("public"));
app.use(bodyParser.json());

const sources = {"Reddit": "", "Hacker News": "", "Medium": "", "Product Hunt": ""};

app.get("/", (req, resp) => {

	resp.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/getData/:source", (req, resp) => {

	let data = [];
	const source = req.params.source;

	switch (source) {
		case "Reddit":
			data = getRedditData();
			break;
		case "Hacker News":
			data = getRedditData();
			break;
		case "Medium":
			data = getRedditData();
			break;
		case "Product Hunt":
			data = getRedditData();
			break;
	};

	if (data == []) {
		resp.setHeader('Content-Type', 'application/json');
		resp.sendStatus(400);
	} else {
		resp.setHeader('Content-Type', 'application/json');
		resp.send(JSON.stringify(data));
	}

});

const getRedditData = () => {

	return
};

const getHackerNewsData = () => {
	return
};

const getMediumData = () => {
	return
};	

const getProductHuntData = () => {
	return
};