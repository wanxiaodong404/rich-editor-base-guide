import React, {Component} from 'react'


export default class PropsRender extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        let selection = this.props.selection;
        let range = (selection && selection.rangeCount) ? selection.getRangeAt(0) : null;
        let selectionKeys = ['anchorNode', 'anchorOffset', 'focusNode', 'focusOffset', 'isCollapsed', 'type'];
        let rangeKeys = ['collapsed', 'commonAncestorContainer', 'startContainer', 'startOffset', 'endContainer', 'endOffset'];
        return <div className="container">
            {selection && <div className="debug-container">
                <section>
                    <h3>Selection 属性</h3>
                    <div className="inner-box">
                        {selectionKeys.map(item => {
                            return <PropsItem key={item} k={item} object={selection}/>
                        })}
                    </div>
                </section>
                <section>
                    <h3>Range 属性</h3>
                    <div className="inner-box">
                        {rangeKeys.map(item => {
                            return <PropsItem key={item} k={item} object={range}/>
                        })}
                    </div>
                </section>
            </div>}
        </div>
    }
}


class PropsItem extends Component {
    render() {
        let k = this.props.k;
        let object = this.props.object;
        let item = object  && object[k]
    return <p onMouseOver={() => {this.hoverHandle(this)}} key={k}>{k}:=>{item instanceof Node ? <a className='link'>{item.nodeName}</a> : (item + '')}</p>
    }
    hoverHandle(e) {
        let item  = this.props.object && this.props.object[this.props.k]
        if (item instanceof Node) {
            let className = 'debug'
            let debugDom = document.querySelectorAll(`.${className}`)
            if (debugDom) {
                debugDom.forEach(item => {
                    item.classList.remove(className)
                })
            }
            let dom = this.findDom(item);
            dom.classList.add(className)
        }
    }
    findDom(node) {
        if (node.tagName) {
            return node
        } else {
            return this.findDom(node.parentElement)
        }
    }
}