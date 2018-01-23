class View extends React.Component {
	constructor(props){
		super(props);
	}

	render(){

		let elems = [];
		const data = this.props.view;
		for (let i = 0; i < data.length; i++){
			elems.push(<a className="postLink" href={data[i].url}><div className="post"><div className="top"><p className="postTitle">{data[i].title}</p></div><div className="bot"><p className="postBotP">{data[i].source} by {data[i].author} {data[i].score}pts <a href={data[i].commentsUrl}>{data[i].numComments} comments</a></p></div></div></a>);
		};

		return (
			<div className="View">{elems}</div>
		);
	}
};

class List extends React.Component {
	constructor(props){
		super(props);
		this.props.setViewState("All In One");
	}

	getValue = (e) => {
		console.log(e.target.innerText);
		this.props.setViewState(e.target.innerText);
	}

	render(){

		let elems = [];
		for(let i = 0; i < this.props.sources.length; i++){
			elems.push(<li className="listItem" onClick={this.getValue}>{this.props.sources[i]}</li>);
		};

		return (
			<ul className="List">
				{elems}
			</ul>
		);
	}
};

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			view: ""
		};
	}

	setViewState = data => {
		//this.setState({view: data});
		console.log("DATA", data);

		if (data === "All In One"){
			let allData = [];
			for(let i = 0; i < this.props.sources.length; i++){

				const source = this.props.sources[i];
				if (source == "All In One"){
					continue;
				}

				fetch("/getData/" + source).then((resp) => {return resp.json()})
				.then((data) => {
					//console.log(data);

					/*for (let i = 0; i < data.length; i+=2){

						newArr[i] = data[i];
						newArr[i + 1] = allData[i];//"";
						newArr[i + 2] = data[i + 1];
						newArr[i + 3] = allData[i + 1];//"";
						newArr[i + 4] = data[i + 2];
						newArr[i + 5] = allData[i + 2];
					}*/

					let newArr = [];

					allData.push(data);

					for (let i = 0; i < data.length; i++){
						for (let arr = 0; arr < allData.length; arr++){
							newArr.push(allData[arr][i]);
						}
					}

					console.log("newArr", newArr);
					newArr = newArr.filter(item => {return (item != (undefined || null))})
					console.log("after filter", newArr);

					this.setState({view: newArr});
				})
				.catch((err) => {
					console.log(err);
					//this.setState({view: "error"});
				});
			}

			//this.setState({view: allData});
		} else {
		
			fetch("/getData/" + data).then((resp) => {return resp.json()})
			.then((data) => {
				console.log(data);
				this.setState({view: data});
			})
			.catch((err) => {
				console.log(err);
				this.setState({view: "error"});
			});
		}

	}

	render() {
		return (
			<div style={{height: "7280px"}}>
				<List setViewState={this.setViewState} sources={this.props.sources}/>
				<View view={this.state.view} />
			</div>
		);
	}
};


var sources = ["All In One", "Reddit", "Hacker News", "Product Hunt"];
ReactDOM.render(
	<App sources = {sources}/>,
	document.getElementById("app")
);