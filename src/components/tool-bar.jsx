/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 10:29:19
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-03-17 17:20:03
 * @Description:  顶部工具栏
 */

import React,{ Component } from "react"
import RichUtils from '../utils/rich-util-native'
import SelectionUtils from '../utils/selection-util'
import {colorStyleMap, ColorPicker} from './color.jsx'


export default class ToolBar extends Component {
    constructor(props) {
        super(props);
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
                {
                    text: 'UNDO',
                    command: 'undo',
                    draftCommand: 'undo',
                },
                {
                    text: 'REDO',
                    command: 'redo',
                    draftCommand: 'redo',
                },
            ],
            showPicker: false,
            range: null,
            commandVal: '',
            commandParams: ''
        }
        /**事件函数绑定宿主对象 */
        this.clickHandle = this.clickHandle.bind(this)
        this.onCommandChange = this.onCommandChange.bind(this)
        this.onCommandParamsChange = this.onCommandParamsChange.bind(this)
        this.execCommand = this.execCommand.bind(this)
        this.saveRangeHandle = this.saveRangeHandle.bind(this)
        this.appendRangeHandle = this.appendRangeHandle.bind(this)
        this.colorPicker = this.colorPicker.bind(this)
        this.colorPickerClose = this.colorPickerClose.bind(this)
    }
    render() {
        return <div className="tool-bar">
            {this.state.buttons.map((item, index) => {
                return <button className='button-item' key={index} onMouseDown={(e) => {this.clickHandle(item, e)}}>{item.text}</button>
            })}
            {this.props.showCommand && <section className="command-block">
                    <button className="button-item" onMouseDown={this.saveRangeHandle}>保存当前range</button>    
                    <label><span>命令:</span><input vlue='' onChange={this.onCommandChange} /></label>
                    <label><span>参数:</span><input vlue='' onChange={this.onCommandParamsChange} /></label>
                    <button className={`button-item ${this.state.range ? '' : 'disabled'}`} onMouseDown={() => this.appendRangeHandle()}>还原range</button>
                    <button className="button-item" onMouseDown={this.execCommand}>执行</button>
                    <a href='https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand' className='button-item'>文档</a>
                </section>}
            {this.state.showPicker && <ColorPicker pickerHandle={this.colorPicker} closeHandle={this.colorPickerClose}/>}
        </div>
    }
    /**
     * 富文本菜单按钮事件
     * @param {*} data 
     * @param {*} e 
     */
    clickHandle(data, e) {
        this.setState({
            clickCache: data
        })
        if (['createLink', 'foreColor'].indexOf(data.command) >= 0 && data.params === undefined) {
            this.saveRangeHandle(e)
            let {startContainer} = SelectionUtils.getRange();
            data = Object.create(data)
            if (['foreColor'].indexOf(data.command) >= 0) {
                return this.setState({
                    showPicker: true
                })
            } else if (RichUtils.findInlineTag(startContainer) !== 'a') {
                data.params = window.prompt('输入内容')
            }
            data.params = data.params || ''
            this.clickHandle(data, e)
        } else {
            this.props.execCommand &&  this.props.execCommand(data)
        }
        e && e.stopPropagation();
        e && e.preventDefault();
    }
    /**
     * 颜色板弹窗处理
     */
    colorPickerClose() {
        this.setState({
            showPicker: false
        })
    }
    /**
     * 颜色选择
     * @param {*} name 
     * @param {*} color 
     */
    colorPicker(name, color) {
        this.colorPickerClose();
        this.appendRangeHandle();
        this.clickHandle(Object.assign({params: {name, color}}, this.state.clickCache))
    }
    /**
     * 暂存range
     * @param {*} e 
     */
    saveRangeHandle(e) {
        let range = SelectionUtils.getRange()
        this.setState({
            range: range
        })
        e.stopPropagation();
        e.preventDefault();
    }
    /**
     * 还原range
     * @param {*} range 
     */
    appendRangeHandle(range) {
        range = range || this.state.range;
        range && SelectionUtils.replace(range)
    }
    /**
     * 命令输入
     * @param {*} e 
     */
    onCommandChange(e) {
        this.setState({
            commandVal: e.target.value
        })
    }
    /**
     * 参数输入
     * @param {*} e 
     */
    onCommandParamsChange(e) {
        this.setState({
            commandParams: e.target.value
        })
    }
    /**
     * 执行命令
     * @param {*} e 
     */
    execCommand(e) {
        this.appendRangeHandle()
        RichUtils.exec(this.state.commandVal, false, this.state.commandParams)
        this.setState({
            range: null
        })
        e.stopPropagation();
        e.preventDefault();
    }
}