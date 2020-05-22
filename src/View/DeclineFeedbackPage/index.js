import React, { useState } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { Layout, Row, Col, Button, Input, Form, message, Empty } from "antd";
import Tag from '../../components/Tag';
import Rate from '../../components/Rate';
import { gutter } from '../../components/constants';
import AbgelehntIcon from "../../components/icons/Abgelehnt";
import Like from "../../components/icons/Like";

export default function DeclineFeedBackPage(props) {

    const { matchId } = props.match.params;
    const [textareaValue, setTextareaValue] = useState('');
    const [showSuccuess, setShowSuccuess] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [rate, setRate] = useState(0);
    const [showRated, setShowRated] = useState(false);



    const { TextArea } = Input;

    const { Content, Footer } = Layout;

    const { CheckableTag } = Tag;

    const [tagArray, setTagArray] = useState([
        { text: 'Zu teuer', value: false }, { text: 'Zu wenig Nutzer', value: false },
        { text: 'Branche passt nicht', value: false }, { text: 'Wir haben keine Kapazitäten', value: false },
        { text: 'Unpassende Anforderungen', value: false }])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonLoading(true);
        setShowSuccuess(true)
        let newArray = [...tagArray.filter(i => i.value === true).map(i => i.text) ];
        if (textareaValue) {
            newArray = [ ...newArray, textareaValue]
        }
        const body = {
            feedback: {qualitativeFeedback: newArray, quantitativeFeedback: -1 }
        };

        const res = await axios.put(
            `${config.backendUrl}/match-feedback/${matchId}`,
            body
        ).then(res => {
            message.success("Das Feedback wurde erfolgreich gesendet");
            setButtonLoading(false)
            setShowSuccuess(true)
        })
    }

    const handleRate = async (value) => {
        const hide = message.loading('Feedback wird gespeichert...', 0)
        setRate(value)
        let newArray = [...tagArray.filter(i => i.value === true).map(i => i.text) ];
        if (textareaValue) {
            newArray = [ ...newArray, textareaValue]
        }
        const body = {
            feedback: {qualitativeFeedback: newArray, quantitativeFeedback: value }
        };

        const res = await axios.put(
            `${config.backendUrl}/match-feedback/${matchId}`,
            body
        ).then(res => {
            setTimeout(hide, 1);
            message.success("Das Feedback wurde erfolgreich gesendet");
            setShowRated(true)
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
            <Content className="declineFeedbackPage" >
                <div className="header" >
                    {showSuccuess ?
                        <React.Fragment>
                            {showRated ? (
                                <React.Fragment>
                                    <Row type="flex" justify="center" gutter={gutter}>
                                        <Col sm={16} xs={20}>
                                            <Like />
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="center" gutter={gutter}>
                                        <Col sm={16} xs={20}>
                                            <h1 style={{ maxWidth: "776px" }}>Vielen Dank, dass Sie sich die Zeit für Feedback genommen haben!</h1>
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="center" gutter={gutter}>
                                        <Col sm={16} xs={20} style={{ marginTop: "32px" }}>
                                            <Button type="primary" className="button-primary" onClick={() => window.location.href = 'https://mysoftwarescout.de'}>Seite verlassen</Button>
                                        </Col>
                                    </Row>
                                </React.Fragment>
                            ) : (
                                    <React.Fragment>
                                        <Row type="flex" justify="center" gutter={gutter}>
                                            <Col sm={16} xs={20}>
                                                <AbgelehntIcon />
                                            </Col>
                                        </Row>
                                        <Row type="flex" justify="center" gutter={gutter}>
                                            <Col sm={16} xs={20}>
                                                <h1 style={{ maxWidth: "776px" }}>Danke für Ihre Rückmeldung.
                                                    Wie wahrscheinlich ist es, dass Sie MySoftwareScout
                                        weiterempfehlen?</h1>
                                            </Col>
                                        </Row>
                                        <Row type="flex" justify="center" gutter={gutter}>
                                            <Col sm={16} xs={24}>
                                                <Rate count={10} setRate={(value) => handleRate(value)} />
                                            </Col>
                                        </Row>

                                    </React.Fragment>
                                )}

                        </React.Fragment>
                        :
                        <React.Fragment >
                            <AbgelehntIcon />
                            <Row type="flex" justify="center" gutter={gutter}>
                                <Col span={16}>
                                    <h1>Der Interessent wurde erfolgreich abgelehnt.</h1>
                                </Col>
                            </Row>
                            <Row type="flex" justify="center" gutter={gutter}>
                                <Col span={16}>
                                    <p className="subline">Wir wollen uns verbessern und Ihnen in der Zukunft nur passende Interessenten anbieten. Geben Sie uns daher bitte kurz Rückmeldung, warum der Interessent nicht interessant für Sie war.</p>
                                </Col>
                            </Row>

                            <Row type="flex" justify="center" gutter={gutter}>
                                <Col sm={16} xs={24} >
                                    {tagArray.map(i => (<Tag tagArray={tagArray} callback={(newArray) => setTagArray(newArray)} style={{ marginBottom: "24px", cursor: "pointer" }} text={i.text} />))}
                                </Col>

                            </Row>
                            <Row type="flex" justify="center" gutter={gutter}>
                                <Col sm={16} xs={20}>
                                    <Form className="form" onSubmit={handleSubmit}>
                                        <Form.Item label="Weitere Gründe bzw. Anmerkungen">
                                            <TextArea className="textarea" placeholder="Gründe eintragen" value={textareaValue} onChange={e => setTextareaValue(e.target.value)} />
                                        </Form.Item>
                                        <Form.Item style={{ float: "right" }} >
                                            <Button loading={buttonLoading} type="primary" disabled={!tagArray.find(i => i.value === true)} htmlType="submit" className="button-submit-primary">
                                                Absenden
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        </React.Fragment>}
                </div>
            </Content>
            <Footer>
                <div className="footerContainer">
                    <div className="footer">
                        <div>
                            <a  className="footerLink" href="https://mysoftwarescout.de/impressum/">
                                Impressum
                            </a>
                            &nbsp;
                            <a  className="footerLink" href="https://mysoftwarescout.de/datenschutzerklaerung/">
                                Datenschutzerklärung
                            </a>
                            &nbsp;
                            <Link className="footerLink"  to="/nutzungsbedingungen">Nutzungsbedingungen</Link>
                        </div>

                    </div>
                </div>
            </Footer>
        </Layout>

    )
}
