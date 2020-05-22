import React, { useState, useEffect, createRef } from "react";
import { Link } from "react-router-dom";
import { Layout, Row, Col,  Button,Empty } from "antd";

import { gutter } from '../constants';
import Hourglass from "../icons/Hourglass";

export default function MatchAccepted(props) {

    const { Content, Footer } = Layout;


    // if (!props.match.params.matchId) {
    //     return <Empty  style={{marginTop: "56px"}} description={
    //         <span>
    //           <p className="subline"> Es wurden keine Matches unter dieser URL identifiziert, falls Sie noch Fragen haben bitte melden Sie sich unter <a href="mailto:partner@mysoftwarescout.de">partner@mysoftwarescout.de</a></p>     
    //         </span>
    //       }/>
    // }

    return (
        <Layout className="layout">
            <Content className="declineFeedbackPage" >
                <div className="header" >
                    <Row type="flex" justify="center" gutter={gutter}>
                        <Col sm={16} xs={20}>
                            <Hourglass />
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" gutter={gutter}>
                        <Col sm={16} xs={20}>
                            <h1 style={{ maxWidth: "776px" }}>Es wurde bereits ein Termin mit diesem
                            Lead angefragt</h1>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" gutter={gutter}>
                        <Col sm={16} xs={20}>
                        <p className="subline"> Falls Sie Fragen haben, melden Sie Sich gerne direkt unter partner@mysoftwarescout.de</p>                           
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" gutter={gutter}>
                        <Col sm={16} xs={20} style={{ marginTop: "32px" }}>
                            <Button type="primary" className="button-primary" onClick={() => window.location.href = 'https://mysoftwarescout.de'}>Seite verlassen</Button>
                        </Col>
                    </Row>
                </div>
            </Content>
            <Footer>
                <div className="footerContainer">
                    <div className="wrapper">
                        <div className="footer">
                            <div>
                                <a href="https://mysoftwarescout.de/datenschutzerklaerung">
                                    Datenschutzerklärung
                    </a>
                                &nbsp;
                    <Link to="/nutzungsbedingungen">Nutzungsbedingungen</Link>
                            </div>

                        </div>
                    </div>
                </div>
            </Footer>
        </Layout>
    )
}
