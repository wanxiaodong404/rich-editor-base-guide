
import React, {Component} from 'react'
import ReactDom from 'react-dom'

class FocusBlock extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <h1>原生</h1>
    }
    componentDidMount() {
        window.onload = () => {
        this.setState({
            selection: window.getSelection()
        })
        document.addEventListener('selectionchange', () => {
            console.log(this.state.selection, this.state.selection.getRangeAt(0))
        })
        }
    }
}
ReactDom.render(<FocusBlock />, document.querySelector('.print-container'))

