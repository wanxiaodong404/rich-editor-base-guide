import React from 'react'
import ReactDom from 'react-dom'
import ToolBar from './components/tool-bar.jsx'
import './assets/style/app.less'



window.React = React
window.ReactDom = ReactDom
class EditorContainer extends React.Component {
    constructor() {
        super();
        this.onChange = this.onChange.bind(this)
        this.toggleStyle = this.toggleStyle.bind(this)
    }
    render() {
        return (<div>
            <h3 text-align='center'>execCommand 实现编辑器</h3>
            <ToolBar execCommand={this.toggleStyle} />
            <div className='editor-box' contentEditable='true'></div>
        </div>)
    }
    /**
     * 数据变化监控
     * @param {*} editorState 
     */
    onChange(editorState) {
        this.setState({editorState})
    }
    /**
     * 切换加粗样式
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
            document.execCommand('formatBlock', false, data.command)
        } else {
            document.execCommand(data.command, false, data.params)
        }
    }
}

ReactDom.render(
    <EditorContainer/>,
    document.querySelector('#container')
)