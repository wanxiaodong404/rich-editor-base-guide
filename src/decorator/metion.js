/*
 * @Author: wanxiaodong
 * @Date: 2020-04-08 17:00:20
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-04-17 16:59:01
 * @Description: 
 */
import SelectionUtils from '../utils/selection-util.js';
const decorators = [
    {
        strategy: function(str = ''){
            return str.substr(-1) === '@' && str.substr(-2) !== '/@'
        },
        command(content) {
            let data = window.prompt('请输入你要@的人名')
            if (data) {
                return [
                    {
                        command: 'delete'
                    },
                    {
                        command: 'insertHTML',
                        params: `<span class="mention" contentEditable='false' onClick='alert("${data}")'>@${data}</span>&nbsp;`
                    },
                    {
                        command: 'delete'
                    }
                ]
            } else {
                return {}
            }
            
        }
    },
    {
        strategy: function(str = ''){
            console.log(str.substr(-1))
            return str.substr(-1) === '#' && str.substr(-2) !== '/#'
        },
        command(content) {
            return [
                {
                    command: 'delete'
                },
                {
                    command: 'insertHTML',
                    params: `<span style='color:blue;' contentEditable='false'>#</span>&nbsp;`
                },
                {
                    command: 'delete'
                }
            ]
        }
    },
    {
        strategy: function(str = ''){
            console.log(str.substr(-1))
            return str.substr(-1) === '狗' && str.substr(-2) !== '/狗'
        },
        command(content) {
            return [
                {
                    command: 'delete'
                },
                {
                    command: 'insertHTML',
                    params: `🐶&nbsp;`
                },
                {
                    command: 'delete'
                }
            ]
        }
    }
]
export default decorators