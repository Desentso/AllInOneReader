const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const async = require("async");

const app = express();

app.set('port', (process.env.PORT || 5000))
app.listen(app.get('port'), () => {
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
		case "All In One":
			getAllData(resp);
			break;
		case "Reddit":
			getRedditData(resp);
			break;
		case "Hacker News":
			getHackerNewsData(resp);
			break;
		case "Medium":
			getMediumData(resp);
			break;
		case "Product Hunt":
			getProductHuntData(resp);
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

		console.log(data.length, "sended data");
		resp.setHeader('Content-Type', 'application/json');
		resp.send(JSON.stringify(data));
	}
};

const getAllData = respToClient => {
	sendGetDataResp([], respToClient);
};

const getRedditData = respToClient => {

	const allData = [];

	axios.get("https://www.reddit.com/r/programming/.json").then(resp => resp.data)
	.then(data => {
		for (let i = 0; i < data.data.children.length; i++){
			const post = data.data.children[i].data;
			allData.push({"url": post.url, "id": post.id, "title": post.title, "timestamp": post.created_utc, "author": post.author, "numComments": post.num_comments, "commentsUrl": "https://www.reddit.com/r/programming/comments/" + post.id, "score": post.score, "sitePostId": post.id, "source": "Reddit"});
		}

		sendGetDataResp(allData, respToClient);
	})
	.catch(err => {console.log(err); sendGetDataResp([], respToClient);});
};

const getHackerNewsData = respToClient => {

	const allData = [];

	axios.get("https://hacker-news.firebaseio.com/v0/topstories.json").then(resp => resp.data)
	.then(data => {

		//Fetch only the top 25 posts
		let top25Ids = data.slice(0,25);
		//console.log(top25Ids);
		async.each(top25Ids, (id, callback) => {

			axios.get("https://hacker-news.firebaseio.com/v0/item/" + id + ".json").then(resp => resp.data)
			.then(data => {
				//console.log(data);
				allData.push({"url": data.url, id: id, "title": data.title, "timestamp": data.time, "author": data.by, "numComments": data.descendants, "commentsUrl": "https://news.ycombinator.com/item?id=" + id, "score": data.score, "sitePostId": data.id, "source": "Hacker News"});
				callback(null);
			})
			.catch(err => {});
		}, () => {
			console.log(allData.length);
			sendGetDataResp(allData, respToClient);
		});
	})
	.catch(err => { console.log(err); sendGetDataResp([], respToClient) });
};

/*const getMediumData = respToClient => {
	sendGetDataResp([{"url": "data.url", id: "id", "title": "Medium", "timestamp": "data.time", "author":" data.by", "numComments": "0", "commentsUrl": "https://news.ycombinator.com/item?id=" + "id", "score": 0, "sitePostId": 0, "source": "Medium"},
		{"url": "data.url", id: "id", "title": "Medium", "timestamp": "data.time", "author":" data.by", "numComments": "0", "commentsUrl": "https://news.ycombinator.com/item?id=" + "id", "score": 0, "sitePostId": 0, "source": "Medium"}], respToClient);
};*/	

const getProductHuntData = respToClient => {
	
	const apikey = "4ffc58a37cf8b7c48800f415d3402e693507036dddccc4e701bac3f64531c11e"
	
	const allData = [];
	axios.get("https://api.producthunt.com/v1/posts?access_token=" + apikey).then(resp => resp.data)
	.then(data => {
		for (let i = 0; i < data.posts.length; i++){
			const post = data.posts[i];
			allData.push({"url": post.redirect_url, "id": post.id, "title": post.name + " - " + post.tagline, "timestamp": post.created_at, "author": post.user.username, "numComments": post.comments_count, "commentsUrl": post.discussion_url, "score": post.votes_count, "sitePostId": post.id, "source": "Product Hunt"});
		}
		sendGetDataResp(allData, respToClient);
	})
	.catch(err => { console.log(err); sendGetDataResp([], respToClient) });
};