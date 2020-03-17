/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 11:22:58
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-03-17 16:21:54
 * @Description: 
 */
export default {
    name: 'selectionUtils',
    _selection: null,
    getSelection () {
        return this._selection || (this._selection = document.getSelection())
    },
    getRange() {
        return this.getSelection().getRangeAt(0)
    },
    replace(range) {
        this.getSelection().removeAllRanges();
        this.getSelection().addRange(range)
    }
    
}