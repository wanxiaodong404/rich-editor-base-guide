import React from 'react'
import ReactDom from 'react-dom'
import ToolBar from './components/tool-bar.jsx'
import RichUtils from './utils/rich-util-native'
import SelectionUtils from './utils/selection-util'
import './assets/style/app.less'

import mentions from './decorator/metion.js'



window.React = React
window.ReactDom = ReactDom
class EditorContainer extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this)
        this.toggleStyle = this.toggleStyle.bind(this)
        this.showCommandHandle = this.showCommandHandle.bind(this)
        let selection = SelectionUtils.getSelection();
        this.state = {
            selection,
            showCommand: false
        }
        document.addEventListener('selectionchange', () => {
            this.onChange(selection)
        })
    }
    render() {
        return (<div>
            <h3 text-align='center' onClick={this.showCommandHandle}>execCommand 实现编辑器 ｜ <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand" target='_blank'>command 文档</a></h3>
            <ToolBar execCommand={this.toggleStyle} selection={this.state.selection} showCommand={this.state.showCommand}/>
            <div ref='editor' className='editor-box' contentEditable='true' data-placeholder='请输入内容'></div>
        </div>)
    }
    /**
     * 数据变化监控
     * @param {*} selection 
     */
    onChange(selection) {
    //    console.log(selection, selection.getRangeAt(0))
        this.watchUpdate(selection)
    }
    /**
     * 切换样式
     */
    toggleStyle(data) {
        let BlockStyle = [
            'H1',
            'H2',
            'H3',
            'H4',
            'H5',
        ]
        if (BlockStyle.indexOf(data.command) >= 0) {
            /** 块级命令处理 */
            RichUtils.toggleBlockStyle('formatBlock', data.command)
        } else {
            /** 行内命令处理 */
            if (data.command === 'foreColor') {
                // 颜色处理
                RichUtils.toggleInlineStyle(data.command, data.params.color)
            } else {
                // 其他命令
                RichUtils.toggleInlineStyle(data.command, data.params)
            }
        }
    }
    showCommandHandle() {
        this.setState({
            showCommand: true
        })
    }
    watchUpdate(selection) {
        let lastChar = SelectionUtils.matchLastChar();
        mentions.forEach(item => {
            if (item.strategy(lastChar)) {
                let command = item.command(lastChar);
                if (command instanceof Array) {
                    command.forEach(_command => {
                        this.toggleStyle(_command)
                    })
                } else {
                    this.toggleStyle(item.command(lastChar))
                }
                item.callback && item.callback()
            }
        })
    }
}

ReactDom.render(
    <EditorContainer/>,
    document.querySelector('#container')
)