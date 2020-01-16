/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 10:29:19
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-01-16 17:17:40
 * @Description:  顶部工具栏
 */

import React,{ Component } from "react"
import {colorStyleMap, ColorPicker} from './color.jsx'


export default class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.clickHandle = this.clickHandle.bind(this)
        this.state = {
            buttons: [
                {
                    text: 'BOLD',
                    command: 'BOLD',
                    draftCommand: 'BOLD',
                },
                {
                    text: 'ITALIC',
                    command: 'ITALIC',
                    draftCommand: 'ITALIC',
                },
                {
                    text: 'H1',
                    command: 'H1',
                    draftCommand: 'header-one',
                },
                {
                    text: 'H2',
                    command: 'H2',
                    draftCommand: 'header-two',
                },
                {
                    text: 'H3',
                    command: 'H3',
                    draftCommand: 'header-three',
                },
                {
                    text: 'LINK',
                    command: 'createLink',
                    draftCommand: 'LINK',
                },
                {
                    text: 'COLOR',
                    command: 'foreColor',
                    draftCommand: 'COLOR',
                },
            ],
            showPicker: false
        }
        this.colorPicker = this.colorPicker.bind(this)
        this.colorPickerClose = this.colorPickerClose.bind(this)
    }
    render() {
        return <div className="tool-bar">
            {this.state.buttons.map((item, index) => {
                return <button className='button-item' key={index} onMouseDown={(e) => {this.clickHandle(item, e)}}>{item.text}</button>
            })}
            {this.state.showPicker && <ColorPicker pickerHandle={this.colorPicker} closeHandle={this.colorPickerClose}/>}
        </div>
    }
    clickHandle(data, e) {
        this.setState({
            clickCache: data
        })
        if (['createLink', 'foreColor'].indexOf(data.command) >= 0 && !data.params) {
            data = Object.create(data)
            if (['foreColor'].indexOf(data.command) >= 0) {
                return this.setState({
                    showPicker: true
                })
            } else {
                data.params = window.prompt('输入内容')
            }
            if (data.params) {
                this.clickHandle(data, e)
            }
        } else {
            this.props.execCommand &&  this.props.execCommand(data)
        }
        e && e.stopPropagation();
        e && e.preventDefault();
    }
    colorPickerClose() {
        this.setState({
            showPicker: false
        })
    }
    colorPicker(name, color) {
        this.setState({
            showPicker: false
        })
        this.clickHandle(Object.assign({params: {name, color}}, this.state.clickCache))
    }
}