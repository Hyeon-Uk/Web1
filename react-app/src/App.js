import React, { Component } from 'react';
import TOC from "./Component/TOP.js";
import Content from "./Component/Content.js";
import Subject from "./Component/Subject.js";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      mode:"read",
      welcome:{title:"Welcome",desc:"Hello, React!!"},
      subject:{title:"WEB" , sub:"World Wide Web!"},
      contents:[
        {id:1, title:"HTML", desc:"HTML is ..."},
        {id:2, title:"CSS", desc:"CSS is ..."},
        {id:3, title:"JavaScript", desc:"JavaScript is ..."}
      ]
    };
  }
  render() {
    var _title,_desc;
    if(this.state.mode==="welcome"){
      _title=this.state.welcome.title;
      _desc=this.state.welcome.desc;
    }
    else if(this.state.mode === "read"){
      _title=this.state.contents[0].title;
      _desc=this.state.contents[0].desc;
    }
    return (
      <div className="App">
        <Subject 
        title={this.state.subject.title} 
        sub={this.state.subject.sub}
        onChangePage={function(){
          this.setState({
            mode:"welcome"
          });
        }.bind(this)}
        ></Subject>
        <TOC data={this.state.contents}></TOC>
        <Content title={_title} description={_desc}></Content>
      </div>
    );
  }
}

export default App;
