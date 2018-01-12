class View extends React.Component {
	render(){
		return (
			<div></div>
		);
	}
};

class List extends React.Component {
	setViewState(e){
		console.log(e);
	}
	render(){
		return (
			<ul>
				<li>All In One</li>
				<li onClick={this.props.setViewState()}>Reddit</li>
				<li>Hacker News</li>
				<li>Medium</li>
				<li>Product Hunt</li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
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

	setViewState (data) {
		this.setState({view: data});
	}

	render() {
		return (
			<div>
				<List setViewState={this.setViewState} />
				<View view={this.state.view} />
			</div>
		);
	}
};

ReactDOM.render(
	<App />,
	document.getElementById("app")
);