/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 11:22:58
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-04-17 16:32:54
 * @Description: 
 */
export default {
    name: 'selectionUtils',
    _selection: null,
    _range: null,
    getSelection () {
        return this._selection || (this._selection = document.getSelection())
    },
    getRange() {
        return this._range = this.getSelection().getRangeAt(0)
    },
    replace(range) {
        this.getSelection().removeAllRanges();
        this.getSelection().addRange(range)
    },
    focus() {
        if (this._range) {
            console.log(this._range)
            this._range.isCollapsed = true;
            this.replace(this._range)
        }
    },
    matchLastChar() {
        let selection = this.getSelection();
        let char = '';
        if (selection.isCollapsed && selection.focusNode && selection.focusOffset > 0) {
            char = selection.focusNode.data || ''
        }
        return char
    }
    
}