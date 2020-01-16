import React from 'react'
import ReactDom from 'react-dom'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil, Modifier, CompositeDecorator} from 'draft-js'
import ToolBar from './components/tool-bar.jsx'
import './assets/style/app.less'



window.React = React
window.ReactDom = ReactDom
class EditorContainer extends React.Component {
    constructor() {
        super();
        const decorator = new CompositeDecorator([
            {
              strategy: findLinkEntities,
              component: Link,
            },
          ]);

        this.state = {
            editorState: EditorState.createEmpty(decorator)
        }
        this.onChange = this.onChange.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)
        this.toggleStyle = this.toggleStyle.bind(this)
        this.toggleLinkStyle = this.toggleLinkStyle.bind(this)
    }
    render() {
        return (<div>
        <h3 text-align='center'>draft.js 实现编辑器</h3>
        <ToolBar execCommand={this.toggleStyle} />
        <Editor 
        onChange={this.onChange} 
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={this.myKeyBindingFn}
        placeholder='type your content'
        editorState={this.state.editorState} />
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
     * 执行富文本命令方法
     * @param {*} command 
     */
    handleKeyCommand(command) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
        if (newState) {
            this.onChange(newState)
            return 'handled'
        }
        return 'no-handled'
    }
    /**
     * 绑定默认按键检测
     * @param {*} e 
     */
    myKeyBindingFn(e) {
        return getDefaultKeyBinding(e)
    }
    /**
     * 切换加粗样式
     */
    toggleStyle(data) {
        let command = data.command.toUpperCase();
        let inlineStyle = ['BOLD', 'ITALIC', 'CREATELINK']
        let BlockStyle = {
            'H1': 'header-one',
            'H2': 'header-two',
            'H3': 'header-three',
            'H4': 'header-four',
            'H5': 'header-five',
        }
        if (inlineStyle.indexOf(command) >= 0) {
            if (command === 'CREATELINK') {
                this.toggleLinkStyle(data.params)
            } else {
                this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, command))
            }
        } else {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, BlockStyle[command]))
        }
    }
    /**
     *  添加链接状态
     * @param {*} url 
     */
    toggleLinkStyle(url) {
        const contentState = this.state.editorState.getCurrentContent();
        const contentStateWidthEntity = contentState.createEntity('LINK', 'MUTABLE', {
            url
        })
        const entityKey = contentStateWidthEntity.getLastCreatedEntityKey();
        const editorState = EditorState.set(this.state.editorState, {
            currentContent: contentStateWidthEntity
        })
        console.log(contentStateWidthEntity)

        this.setState({
            editorState: RichUtils.toggleLink(
                editorState,
                editorState.getSelection(),
                entityKey
            )
        })

    }
}

/**
 * 链接相关的
 * @param {*} contentBlock 
 * @param {*} callback 
 * @param {*} contentState 
 */
function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }

  const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url}>
        {props.children}
      </a>
    );
  };




ReactDom.render(
    <EditorContainer/>,
    document.querySelector('#container')
)