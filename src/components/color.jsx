/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 16:40:01
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-01-16 17:17:35
 * @Description: 
 */
import React,{Component} from 'react'
export const colorStyleMap = {
    red: {
        color: 'rgba(255, 0, 0, 1.0)',
    },
    orange: {
        color: 'rgba(255, 127, 0, 1.0)',
    },
    yellow: {
        color: 'rgba(180, 180, 0, 1.0)',
    },
    green: {
        color: 'rgba(0, 180, 0, 1.0)',
    },
    blue: {
        color: 'rgba(0, 0, 255, 1.0)',
    },
    indigo: {
        color: 'rgba(75, 0, 130, 1.0)',
    },
    violet: {
        color: 'rgba(127, 0, 255, 1.0)',
    },
};
export class ColorPicker extends Component {
    constructor() {
        super(...arguments)
        this.clickHandle = (name, color, e) => {
            this.props.pickerHandle && this.props.pickerHandle(name, color)
            this.props.closeHandle && this.props.closeHandle()
            e.stopPropagation();
            e.preventDefault();
        }
    }
    render() {
        return <div className="color-picker">
            <div className="mask"></div>
            <div className="picker-box">
                {Object.keys(colorStyleMap).map((item, index) => {
                    return <span className="color-item" onClick={(e) => {
                        this.clickHandle(item, colorStyleMap[item].color, e)
                    }} key={index} style={{background: colorStyleMap[item].color}}></span>
                })}
            </div>
        </div>
    }
}