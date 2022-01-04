import React from "react";
import {ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

class Todo extends React.Component{

    constructor(props) {
        super(props);       //props 오브젝트 초기화
        this.state={item: props.item};  //this.state를 item변수와 props.item으로 초기화한다.
        this.delete=props.delete;
    }

    deleteEventHandler = () => {
        this.delete(this.state.item)
    }


    render() {
        const item = this.state.item;
        return (
            <ListItem>
                <Checkbox checked={item.done} disableRipple />
                <ListItemText>
                    <InputBase
                        inputProps={{"arial-label" : "naked"}}
                        type="text"
                        id={item.id}    //각 리스트를 구분하기 위해 id연결
                        name={item.id}  //두 아이템이 같은 title을 가진 경우 잘못 삭제될 위험이 있으므로
                        value={item.title}
                        multiline={true}
                        fullWidth={true}
                    />
                </ListItemText>

                <ListItemSecondaryAction>
                    <IconButton
                        aria-label="Delete Todo"
                        onClick={this.deleteEventHandler}>
                        <DeleteOutlined />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default Todo;