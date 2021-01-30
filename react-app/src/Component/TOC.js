import React, { Component } from 'react';

class TOC extends Component{
  shouldComponentUpdate(newProps,newState){
    if(this.props.data===newProps.data){
      return false;
    }
    else{
      return true;
    }
  }
    render(){
        var data=this.props.data;
        var list=[];
        for(var i=0;i<data.length;i++){
        list.push(<li key={data[i].id}>
          <a href={"/content/"+data[i].id}
            onClick={function(id,e){
              e.preventDefault();
              this.props.onChangePage(id);
            }.bind(this,data[i].id)}
          >{data[i].title}</a>
          </li>);
        }

      return(
        <nav>
          <ul>
              {list}
          </ul>
      </nav>
      );
    }
  }

  export default TOC;
