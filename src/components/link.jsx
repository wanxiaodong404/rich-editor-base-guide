/*
 * @Author: wanxiaodong
 * @Date: 2020-01-16 15:33:37
 * @Last Modified by: wanxiaodong
 * @Last Modified time: 2020-01-16 15:37:20
 * @Description: 
 */
/**
 * 链接相关的
 * @param {*} contentBlock 
 * @param {*} callback 
 * @param {*} contentState 
 */
export function findLinkEntities(contentBlock, callback, contentState) {
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

export const Link = (props) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url}>
        {props.children}
        </a>
    );
};
  