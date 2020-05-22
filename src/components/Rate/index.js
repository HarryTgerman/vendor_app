import React from 'react'
import { Row, Col, Button } from 'antd';
import { gutter } from '../constants';


export default function Rate(props) {

    const rateHandler = (value) => {
       return props.setRate(value)
    }

    const rednerRate = (count) => {
        return Array(count).fill().map((_, i) => <button key={i} value={i+1} onClick={(i) => rateHandler(i.target.value)} className="mss-rate-button">{i+1}</button>)
    }

    return (
        <div className="mss-rate">
            <Row type="flex" justify="center" gutter={gutter}><Col sm={16} xs={22}>
                <div className="inlineFLex" style={{justifyContent: "space-between"}}>
                    <p>Sehr unwahrscheinlich</p><p>Sehr wahrscheinlich</p>
                </div></Col></Row>
            <Row type="flex" justify="center" gutter={gutter}>
                <Col sm={16} xs={22}>
                    <div className="inlineFLex" style={{justifyContent: "space-between"}}>
                        {rednerRate(props.count)}
                    </div>
                </Col></Row>
        </div>
    )
}
