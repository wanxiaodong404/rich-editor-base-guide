/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 11:23:16
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-04-08 17:33:59
 * @Description: 
 */
import SectionUtils from './selection-util.js'
export default {
    blockTag: ['p', 'div', 'selction', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    inlineTag: ['span', 'a', 'b', 'bold', 'italc', 'strong'],
    /**
     * 切换块级样式
     * @param {*} command 
     * @param {*} params 
     */
    toggleBlockStyle(command, params) {
        let range = SectionUtils.getRange();
        let {startContainer} = range;
        let tag = this.findBlockTag(startContainer)
        if (tag.toUpperCase() === params) {
            params = this.blockTag[0]
        }
        this.exec(command, false, params)
    },
    /**
     * 切换行内样式
     * @param {*} command 
     * @param {*} params 
     */
    toggleInlineStyle(command, params) {
        let range = document.getSelection().getRangeAt(0);
        let {startContainer} = range;
        let tag = this.findInlineTag(startContainer)
        if (command === 'createLink' && tag.toUpperCase() === 'A') {
            command = 'unlink'
        }
        this.exec(command, false, params)
    },
    /**
     * 向上查找块级内容
     * @param {*} dom 
     */
    findBlockTag(dom = {}) {
        let tagName = (dom.tagName || '').toLowerCase();
        if (this.blockTag.indexOf(tagName) >= 0) {
            return tagName
        } else {
            return this.findBlockTag(dom.parentElement)
        }
    },
    /**
     * 向上查找行内tag（大部分情况一般焦点获取到的节点都是text）
     * @param {*} dom 
     */
    findInlineTag(dom = {}) {
        let tagName = (dom.tagName || '').toLowerCase();
        if (this.inlineTag.indexOf(tagName) >= 0) {
            return tagName
        } else if (dom.parentElement) {
            return this.findInlineTag(dom.parentElement)
        }
        return ''
    },
    exec(command, state, params) {
        document.execCommand(command, state, params)
    }
}