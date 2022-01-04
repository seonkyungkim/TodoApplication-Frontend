import React from 'react';
import './App.css';
import {Paper, List, Container} from "@material-ui/core";
import Todo from './Todo'
import AddTodo from './AddTodo'

class App extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          items: [       //item을 items배열로 사용
              {id: 0, title: "Hello World 1", done: true},
              {id: 1, title: "Hello World 2", done: false},
          ],
      };
  }

    add = (item) => {
      const thisItems = this.state.items;
      item.id = "ID-" + thisItems.length;   //key를 위한 id 추가
      item.done = false;        //done 초기화
      thisItems.push(item);     //리스트에 아이템 추가
      this.setState({items: thisItems});    //업데이트는 반드시 this.setState로 해야 함
      console.log("items: ", this.state.items);
    }

    delete = (item) => {
      const thisItems = this.state.items;
      console.log("Before Update Items: ", this.state.items)
      const newItems = thisItems.filter(e => e.id !== item.id);
      this.setState({items: newItems}, () => {
          //디버깅 콜백
          console.log("Update Items: ", this.state.items)
      });
    }

  render() {
      //자바스크립트가 제공하는 map 함수로 배열을 반복하여 <투두... />컴포넌트 생성
      var todoItems = this.state.items.length > 0 && (
          <Paper style={{ margin: 16 }}>
              <List>
                  {this.state.items.map((item, idx) => (
                    <Todo item={item} key={item.id} delete={this.delete}/>
                  ))}
              </List>
          </Paper>
      );

      return (      //생성된 컴포넌트 리턴
          <div className="App">
              <Container maxWidth="md">
                  <AddTodo add={this.add}/>
                  <div className="TodoList">{todoItems}</div>
              </Container>
          </div>
      );
  }
}

export default App;
//App이라는 컴포넌트를 다른 컴포넌트에서 사용할 수 있다. 컴포넌트는 자바스크립트 함수나 클래스 형태로 생성할 수 있다.

