import React from 'react';
import './App.css';
import {Paper, List, Container} from "@material-ui/core";
import Todo from './Todo'
import AddTodo from './AddTodo'
import { call } from "./service/ApiService";


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          items: [ ],      //item을 items배열로 사용
      };
    }

    componentDidMount() {
        call("/todo", "GET", null).then((response) =>
            this.setState({ items: response.data })
        );
    }

    add = (item) => {
        call("/todo", "POST", item).then((response) =>
            this.setState({items: response.data})
        );
    };

    delete = (item) => {
        call("/todo", "DELETE", item).then((response) =>
            this.setState({items:response.data})
        );
    };

    update = (item) => {
        call("/todo", "PUT", item).then((response) =>
            this.setState({items: response.data})
        );
    };

    render() {
      //자바스크립트가 제공하는 map 함수로 배열을 반복하여 <투두... />컴포넌트 생성
        var todoItems = this.state.items.length > 0 && (
            <Paper style={{ margin: 16 }}>
                <List>
                    {this.state.items.map((item, idx) => (
                    <Todo
                        item={item}
                        key={item.id}
                        delete={this.delete}
                        update={this.update}
                    />
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

