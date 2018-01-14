const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const async = require("async");

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
			data = getRedditData(resp);
			break;
		case "Hacker News":
			data = getHackerNewsData(resp);
			break;
		case "Medium":
			data = getMediumData(resp);
			break;
		case "Product Hunt":
			data = getProductHuntData(resp);
			break;
		default:
			sendGetDataResp(data, resp);
	};

});

const sendGetDataResp = (data, resp) => {
	if (data == []) {
		resp.setHeader('Content-Type', 'application/json');
		resp.sendStatus(400);
	} else {
		console.log("sended data");
		console.log(data.length, "sended data");
		resp.setHeader('Content-Type', 'application/json');
		resp.send(JSON.stringify(data));
	}
};

const getRedditData = (respToClient) => {

	return
};

const getHackerNewsData = (respToClient) => {

	var allData = [];

	axios.get("https://hacker-news.firebaseio.com/v0/topstories.json").then(resp => {return resp.data;})
	.then(data => {

		//Fetch only the top 25 posts
		let top25Ids = data.slice(0,25);
		//console.log(top25Ids);
		async.each(top25Ids, (id, callback) => {

			axios.get("https://hacker-news.firebaseio.com/v0/item/" + id + ".json").then(resp => {return resp.data})
			.then(data => {
				//console.log(data);
				allData.push({"url": data.url, "id": id, "title": data.title, "timestamp": data.time, "author": data.by, "comments": data.descendants , "score": data.score, "sitePostId": data.id, "source": "Hacker News"});
				callback(null);
			})
			.catch(err => {});
		}, () => {
			console.log(allData.length);
			sendGetDataResp(allData, respToClient);
			//return allData;
		});
	})
	.catch(err => {console.log(err); return [];});
	//return [];
};

const getMediumData = (respToClient) => {
	return
};	

const getProductHuntData = (respToClient) => {
	return
};