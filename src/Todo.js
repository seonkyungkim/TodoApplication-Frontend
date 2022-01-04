import React from "react";
import {ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

class Todo extends React.Component{

    constructor(props) {
        super(props);       //props 오브젝트 초기화
        this.state={ item: props.item, readOnly: true };  //this.state를 item변수와 props.item으로 초기화한다.
        this.delete=props.delete;
        this.update=props.update;   //update를 this.update에 할당
    }

    deleteEventHandler = () => {
        this.delete(this.state.item)
    };

    offReadOnlyMode = () => {
        console.log("Event!", this.state.readOnly)
        this.setState({ readOnly: false }, () => {
            console.log("ReadOnly? ", this.state.readOnly)
        });
    };

    enterKeyEventHandler = (e) => {
        if (e.key === "Enter") {
            this.setState({readOnly: true});
            this.update(this.state.item);   //엔터를 누르면 저장
        }
    };

    //사용자가 입력할 때마다 item의 내용을 새 값으로 변경해준다.
    editEventHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({item: thisItem});
    };

    //체크박스의 상태 done을 true와 false로 스위치처럼 바꿔준다.
    checkboxEventHandler = (e) => {
        const thisItem = this.state.item;
        thisItem.done = !thisItem.done;
        this.setState({item: thisItem});
        this.update(this.state.item);   //체크박스가 변경되면 저장
    };

    render() {
        const item = this.state.item;
        return (
            <ListItem>
                <Checkbox checked={item.done} disableRipple />
                <ListItemText>
                    <InputBase
                        inputProps={{
                            "arial-label" : "naked",
                            readOnly: this.state.readOnly,
                        }}
                        onClick={this.offReadOnlyMode}  //클릭하면 ReadOnly모드를 끄는 함수 실행.
                        onKeyPress={this.enterKeyEventHandler}  //엔터를 누르면 다시 ReadOnly 모드가 켜지는 함수 실행.
                        onChange={this.editEventHandler}    //키보드입력이 들어오면 item의 내용을 업데이트하는 함수 실행
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

                {/*checkbox 이벤트 핸들러를 체크박스 컴포넌트의 onChange에 연결해준 것이다.*/}
                <Checkbox checked={item.done} onChange={this.checkboxEventHandler}/>
            </ListItem>
        );
    }
}

export default Todo;