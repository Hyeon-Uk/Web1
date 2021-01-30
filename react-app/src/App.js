import React, { Component } from 'react';
import TOC from "./Component/TOC.js";
import ReadContent from "./Component/ReadContent.js";
import CreateContent from "./Component/CreateContent.js";
import UpdateContent from "./Component/UpdateContent.js";
import Subject from "./Component/Subject.js";
import Control from "./Component/Control";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.max_content_id=3;
    this.state={
      mode:"welcome",
      selected:0,
      welcome:{title:"Welcome",desc:"Hello, React!!"},
      subject:{title:"WEB" , sub:"World Wide Web!"},
      contents:[
        {id:1, title:"HTML", desc:"HTML is ..."},
        {id:2, title:"CSS", desc:"CSS is ..."},
        {id:3, title:"JavaScript", desc:"JavaScript is ..."}
      ]
    };
  }
  getReadContent(){
    for(var i=0;i<this.state.contents.length;i++){
      var data=this.state.contents[i]
      if(data.id===this.state.selected){
        return data;
      }
    }
  }
  getContent(){
    var _title,_desc,_article;
    if(this.state.mode==="welcome"){
      _title=this.state.welcome.title;
      _desc=this.state.welcome.desc;
      _article=<ReadContent title={_title} description={_desc}></ReadContent>;
    }
    else if(this.state.mode === "read"){
      var _content=this.getReadContent();
      _article=<ReadContent title={_content.title} description={_content.desc}></ReadContent>;
    }
    else if(this.state.mode==='create'){
      _article=<CreateContent onSubmit={function(_title,_desc){
      this.max_content_id++;
        var arr=this.state.contents.concat({id:this.max_content_id,title:_title,desc:_desc});
        this.setState({
          contents:arr,
          mode:"read",
          selected:this.max_content_id
        })
      }.bind(this) }></CreateContent>
    } 
    else if(this.state.mode==="update"){
      _content=this.getReadContent();
      _article=<UpdateContent onSubmit={
        function(_id,_title,_desc){
        var arr=Array.from(this.state.contents);
        for(var i=0;i<arr.length;i++){
          if(_id===arr[i].id){
            arr[i]={id:_id,title:_title,desc:_desc};
            break;
          }
        }
        this.setState({
          contents:arr,
          mode:"read"
        })
      }.bind(this) }
      data={_content}
      ></UpdateContent>
    }
    return _article;
  }
  render() {
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
        <TOC data={this.state.contents} 
        onChangePage={function(id){
          this.setState({mode:"read",selected:Number(id)});
        }.bind(this)}></TOC>
        <Control onChangeMode={
          function(_mode){
            if(_mode==="delete"){
              if(window.confirm("really?")){
                var arr=Array.from(this.state.contents);
                for(var i=0;i<arr.length;i++){
                  if(arr[i].id===this.state.selected){
                    arr.splice(i,1);
                    break;
                  }
                }
              }
              this.setState({
                mode:"welcome",
                contents:arr,
                selected:0
              });
              alert("done!");
            }
            else{
            this.setState({
              mode:_mode
            });
          }
        }.bind(this)}></Control>
        {this.getContent()}
      </div>
    );
  }
}

export default App;
