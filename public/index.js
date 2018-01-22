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

	setViewState = (data) => {
		//this.setState({view: data});
		console.log("DATA", data);
		
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

	render() {
		return (
			<div style={{height: "100%"}}>
				<List setViewState={this.setViewState} sources={this.props.sources}/>
				<View view={this.state.view} />
			</div>
		);
	}
};


var sources = ["All In One", "Reddit", "Hacker News", "Medium", "Product Hunt"];
ReactDOM.render(
	<App sources = {sources}/>,
	document.getElementById("app")
);