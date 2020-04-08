
import React, {Component} from 'react'
import ReactDom from 'react-dom'

import './assets/style/app.less'
import PropsRender from './components/props-render.jsx'
class FocusBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: null
        }
    }
    render() {
        return <div className="container">
            <h1>焦点控制 <a href='#'>Selection</a> | <a href='#'>Range</a></h1>
            <PropsRender selection={this.state.selection}/>
        </div>
    }
    componentDidMount() {
        window.onload = () => {
            this.setState({
                selection: window.getSelection()
            })
            document.addEventListener('selectionchange', () => {
                console.log(this.state.selection, this.state.selection.getRangeAt(0))
                this.forceUpdate()
            })
        }
    }
}
ReactDom.render(<FocusBlock />, document.querySelector('.print-container'))

