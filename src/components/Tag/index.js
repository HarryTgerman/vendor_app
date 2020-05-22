import React, { useState } from 'react'
import { Tag } from 'antd';
import Plus from '../../components/icons/Plus';
import WhiteCheckmark from '../icons/WhiteCheckmark';

export default function CustomeTag(props) {

    const { CheckableTag } = Tag;

   const [ checked, setChecked ] = useState(false)

   const handleChange = checked => {
        setChecked(checked);
        const newArray = props.tagArray.map(i => {if(i.text === props.text){ i.value = checked} return i})
        return  props.callback(newArray)
    };

    const icon = (state) => {
    return  !state ? <Plus /> : <WhiteCheckmark/>
    } 

    return (
        <CheckableTag className="customTag" {...props} checked={checked} onChange={handleChange}>{icon(checked)}{props.text}</CheckableTag>
    )
}
