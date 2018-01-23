class View extends React.Component {
	constructor(props){
		super(props);
	}

	render(){

		let elems = [];
		const data = this.props.view;
		for (let i = 0; i < data.length; i++){
			elems.push(<a className="postLink" href={data[i].url}><div className="post"><div className="top"><p className="postTitle">{data[i].title}</p></div><div className="bot"><p className="postBotP">{data[i].source} by {data[i].author} {data[i].score}pts <a href={data[i].commentsUrl} className="commentsLink">{data[i].numComments} comments</a></p></div></div></a>);
		};

		return (
			<div className="View">{elems}</div>
		);
	}
};

class List extends React.Component {
	constructor(props){
		super(props);
		//Set the view to "All In One" on first page load
		this.props.setViewState("All In One");
	}

	getValue = e => {
		this.props.setViewState(e.target.innerText);
	}

	render(){

		const elems = [];
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

	//Called from the List component from the user clicks a item on the list
	setViewState = data => {

		//If all in one is selected, fetch all the sources from server
		if (data === "All In One"){
			const allData = [];
			for(let i = 0; i < this.props.sources.length; i++){

				const source = this.props.sources[i];
				if (source == "All In One"){
					continue;
				}

				fetch("/getData/" + source).then((resp) => resp.json())
				.then((data) => {

					let newArr = [];

					allData.push(data);

					//Combines the data so that they are evenly spaced e.g 1,2,3,1,2,3 and not 1,1,2,2,3,3
					for (let i = 0; i < data.length; i++){
						for (let arr = 0; arr < allData.length; arr++){
							newArr.push(allData[arr][i]);
						}
					}

					//Removes any empty/faulty items
					newArr = newArr.filter(item => (item != (undefined || null)))

					this.setState({view: newArr});
				})
				.catch((err) => {
					console.log(err);
					this.setState({view: {"title": "An error occurred", "url": "#", "id": "", "timestamp": "", "author": "", "numComments": "", "commentsUrl": "#", "score": "", "sitePostId": "", "source": ""}});
				});
			}

		} else {
		
			fetch("/getData/" + data).then((resp) => resp.json())
			.then((data) => {
				
				this.setState({view: data});
			})
			.catch((err) => {
				console.log(err);
				this.setState({view: {"title": "An error occurred", "url": "#", "id": "", "timestamp": "", "author": "", "numComments": "", "commentsUrl": "#", "score": "", "sitePostId": "", "source": ""}});
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


const sources = ["All In One", "Reddit", "Hacker News", "Product Hunt"];
ReactDOM.render(
	<App sources = {sources}/>,
	document.getElementById("app")
);