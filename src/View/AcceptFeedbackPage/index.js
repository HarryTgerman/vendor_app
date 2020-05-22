import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { Layout, Row, Col, Button, message, Empty } from "antd";
import Rate from '../../components/Rate';

import { gutter } from '../../components/constants';
import AngenommenIcon from "../../components/icons/Angenommen";
export default function AcceptFeedbackPage(props) {

    const { matchId } = props.match.params;
    const [showSuccuess, setShowSuccuess] = useState(false);
    const [rate, setRate] = useState(0);

    const { Content, Footer } = Layout;

    const handleRate = async (value) => {
        const hide = message.loading('Feedback wird gespeichert...', 0)
        setRate(value)
        const body = {
            feedback: {quantitativeFeedback: value, qualitativeFeedback: [] }, 
        };

        const res = await axios.put(
            `${config.backendUrl}/match-feedback/${matchId}`,
            body
        ).then(res => {
            setTimeout(hide, 1);
            message.success("Feedback wurde erfolgreich gesendet");
            setShowSuccuess(true)
        })
    }

    if (!props.match.params.matchId) {
        return <Empty  style={{marginTop: "56px"}} description={
            <span>
              <p className="subline"> Es wurden keine Matches unter dieser URL identifiziert, falls Sie noch Fragen haben bitte melden Sie sich unter <a href="mailto:partner@mysoftwarescout.de">partner@mysoftwarescout.de</a></p>     
            </span>
          }/>
    }

    return (
        <Layout className="layout">
            <Content className="acceptFeedbackPage" >
                <Row type="flex" justify="center" className="header" gutter={gutter}>
                    <Col span={20} >
                        {showSuccuess ?
                            <React.Fragment>
                                <AngenommenIcon />
                                <Row type="flex" justify="center" gutter={gutter}>
                                    <Col span={12}>
                                        <h1 style={{ maxWidth: "776px" }}>Der Kontakt zum Interessenten wurde erfolgreich angefragt</h1>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" gutter={gutter}>
                                    <Col span={16}>
                                        <p className="subline">Wir empfehlen dem Interessenten nun Ihre Lösung in unserer Ergebnispräsentation. Sie erhalten direkt danach Rückmeldung von uns.</p>
                                    </Col>
                                </Row>
                                <Button type="primary" className="button-primary" onClick={() => window.location.href = 'https://mysoftwarescout.de'}>Seite verlassen</Button>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <AngenommenIcon />
                                <Row type="flex" justify="center" gutter={gutter}>
                                    <Col span={18}>
                                        <h1>Der Kontakt zum Interessenten wurde erfolgreich angefragt</h1>
                                        <p className="subheadlineSuccess">Wir empfehlen dem Interessenten nun Ihre Lösung in unserer Ergebnispräsentation. Sie erhalten direkt danach Rückmeldung von uns.</p>
                                    </Col>
                                </Row>
        
                                <Row type="flex" justify="center" gutter={gutter}>
                                    <Col span={12}>
                                        <p className="subline">Wie wahrscheinlich ist es, dass Sie MySoftwareScout weiterempfehlen?</p>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" gutter={gutter}>
                                    <Col span={24}>
                                        <Rate count={10} setRate={(value) => handleRate(value)} />
                                    </Col>
                                </Row>

                            </React.Fragment>}

                    </Col>
                </Row>

            </Content>
            <Footer>
                <div className="footerContainer">
                    <div className="footer">
                        <div>
                            <a className="footerLink"  href="https://mysoftwarescout.de/datenschutzerklaerung">
                                Datenschutzerklärung
                    </a>
                            &nbsp;
                    <Link  className="footerLink" to="/nutzungsbedingungen">Nutzungsbedingungen</Link>
                        </div>

                    </div>
                </div>
            </Footer>
        </Layout>

    )
}
