class View extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>{this.props.view}</div>
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
			elems.push(<li onClick={this.getValue}>{this.props.sources[i]}</li>);
		};

		return (
			<ul>
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
		
		fetch("/getData/" + data)
		.then((data) => {
			this.setState({view: data});
		})
		.catch((err) => {
			this.setState({view: "error"});
		});

	}

	render() {
		return (
			<div>
				<List setViewState={this.setViewState} sources={this.props.sources}/>
				<View view={this.state.view} />
			</div>
		);
	}
};


var sources = ["Reddit", "Hacker News", "Medium", "Product Hunt"];
ReactDOM.render(
	<App sources = {sources}/>,
	document.getElementById("app")
);