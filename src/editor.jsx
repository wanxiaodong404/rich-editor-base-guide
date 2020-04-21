import React from 'react'
import ReactDom from 'react-dom'
import {stateToMarkdown} from 'draft-js-export-markdown'
import draft,{Editor, convertToRaw, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil, Modifier, CompositeDecorator} from 'draft-js'
import ToolBar from './components/tool-bar.jsx'
import { Link, findLinkEntities, MentionItem, findMentionEntities } from './components/link.jsx'
import {colorStyleMap} from './components/color.jsx'
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
            {
                strategy: findMentionEntities,
                component: MentionItem,
            }
        ]);
        let selection = window.getSelection()
        this.state = {
            editorState: EditorState.createEmpty(decorator),
            selection
        }
        this.onChange = this.onChange.bind(this)
        this.handleKeyCommand = this.handleKeyCommand.bind(this)
        this.toggleStyle = this.toggleStyle.bind(this)
        this.toggleLinkStyle = this.toggleLinkStyle.bind(this)
    }
    render() {
        return (<div>
            <h3 text-align='center'>draft.js 实现编辑器</h3>
            <ToolBar execCommand={this.toggleStyle} selection={this.state.selection}/>
            <Editor 
            customStyleMap={colorStyleMap}
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
        let data = this.watchUpdate(editorState);
        let changeData = {editorState};
        this.setState(data ? Object.assign(changeData, data) : changeData);
        // console.log(editorState.getCurrentInlineStyle(),convertToRaw(editorState.getCurrentContent()))
    }
    watchUpdate(editorState) {
        console.log(editorState, editorState.getCurrentContent())
        // let content = window.prompt('请输入你要@的人')
        let content = ''
        content && this.createMention(content)
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
     * 切换样式
     */
    toggleStyle(data) {
        let command = data.draftCommand.toUpperCase();
        let inlineStyle = ['BOLD', 'ITALIC', 'LINK', 'COLOR']
        let method = ['UNDO', 'REDO'];
        // 判定当前选择是否含有inlineStyle
        // inlineStyle.forEach(item => {
        //     console.log(this.state.editorState.getCurrentInlineStyle(), this.state.editorState.getCurrentInlineStyle().has(item), item)
        // })
        if (inlineStyle.indexOf(command) >= 0) {
            if (command === 'LINK') {
                this.toggleLinkStyle(data.params)
            } else if (command === 'COLOR') {
                this.toggleColorStyle(data.params.name)
            } else {
                this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, command, data.params))
            }
        } else if (method.indexOf(command) >= 0) {
            let eidtorState = EditorState[data.draftCommand](this.state.editorState)
            this.onChange(eidtorState)
        } else {
            this.onChange(RichUtils.toggleBlockType(this.state.editorState, command.toLowerCase()))
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
        let editorState = EditorState.set(this.state.editorState, {
            currentContent: contentStateWidthEntity
        })
        editorState = RichUtils.toggleInlineStyle(editorState, 'LINK')
        this.setState({
            editorState: RichUtils.toggleLink(
                editorState,
                editorState.getSelection(),
                entityKey
            )
        })

    }
    createMention(content) {
        const contentState = this.state.editorState.getCurrentContent();
        if (content) {
            const contentStateWidthEntity = contentState.createEntity('MENTION', 'IMMUTABLE', {
                content
            })
            const entityKey = contentStateWidthEntity.getLastCreatedEntityKey();
            let editorState = EditorState.set(this.state.editorState, {
                currentContent: contentStateWidthEntity
            })
            // editorState = RichUtils.toggleInlineStyle(editorState, 'LINK')
            return {
                editorState: RichUtils.toggleLink(
                    editorState,
                    editorState.getSelection(),
                    entityKey
                )
            }
        } else {
            return {}
        }

    }
    /**
     * 切换颜色
     * @param {*} color 
     */
    toggleColorStyle(toggledColor) {
            const {editorState} = this.state;
            const selection = editorState.getSelection();

            // Let's just allow one color at a time. Turn off all active colors.
            const nextContentState = Object.keys(colorStyleMap)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color)
            }, editorState.getCurrentContent());

            let nextEditorState = EditorState.push(
                editorState,
                nextContentState,
                'change-inline-style'
            );

            const currentStyle = editorState.getCurrentInlineStyle();

            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce((state, color) => {
                    return RichUtils.toggleInlineStyle(state, color);
                }, nextEditorState);
            }

            // If the color is being toggled on, apply it.
            if (!currentStyle.has(toggledColor)) {
                nextEditorState = RichUtils.toggleInlineStyle(
                    nextEditorState,
                    toggledColor
                );
            }

            this.onChange(nextEditorState);
    }
    componentDidMount() {
        console.log(draft)
    }
}

ReactDom.render(
    <EditorContainer/>,
    document.querySelector('#container')
)