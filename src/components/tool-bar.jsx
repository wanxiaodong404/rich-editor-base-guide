/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 10:29:19
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-01-16 15:11:11
 * @Description:  顶部工具栏
 */

import React,{ Component } from "react"

export default class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.clickHandle = this.clickHandle.bind(this)
        this.state = {
            buttons: [
                {
                    text: 'BOLD',
                    command: 'BOLD'
                },
                {
                    text: 'ITALIC',
                    command: 'Italic'
                },
                {
                    text: 'H1',
                    command: 'H1'
                },
                {
                    text: 'H2',
                    command: 'H2'
                },
                {
                    text: 'H3',
                    command: 'H3'
                },
                {
                    text: 'H4',
                    command: 'H4'
                },
                {
                    text: 'LINK',
                    command: 'createLink'
                },
                {
                    text: 'COLOR',
                    command: 'createLink'
                },
            ]
        }
    }
    render() {
        return <div className="tool-bar">
            {this.state.buttons.map((item, index) => {
                return <button className='button-item' key={index} onMouseDown={(e) => {this.clickHandle(item, e)}}>{item.text}</button>
            })}
        </div>
    }
    clickHandle(data, e) {
        if (['createLink'].indexOf(data.command) >= 0 && !data.params) {
            data = Object.create(data)
            data.params = window.prompt('输入内容')
            if (data.params) {
                this.clickHandle(data, e)
            }
        } else {
            this.props.execCommand &&  this.props.execCommand(data)
        }
        e && e.stopPropagation();
        e && e.preventDefault();
    }
}