import React, { useState, useEffect, createRef } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import Moment from 'react-moment';
import 'moment/locale/de';

import { Layout, Row, Col, Card, Steps, Skeleton, Button, Icon, Avatar, Empty } from "antd";

import { gutter } from '../../components/constants';
import { imagePath } from "../../utils/assetUtils";
import Leadinfo from "../../components/icons/Leadinfo";


export default function LeadInfoPage(props) {
    const { matchId } = props.match.params;
    const [isLoading, setIsLoading] = useState(true);

    const [leadinfo, setLeadinfo] = useState({
        leadHistory: [],
    })


    useEffect(() => {
        fetch(`${config.backendUrl}/match-leadinfo/${matchId}`)
            .then(response => response.json())
            .then(data => {
                setLeadinfo(data);
                setIsLoading(false)
            });
    }, [matchId]);

    const renderCardTitle = () => (
        <div className="cardTitle" >
            <Row type="flex" align="middle">
                <Col md={12}>
                    <Row type="flex">
                        <Col md={24} className="leftsidewapper">
                            <p className="key-title">Leadnummer:</p>
                            <p className="value">{leadinfo.leadNumber}</p>
                        </Col>
                    </Row>
                    { leadinfo.leadDataReciving && <>
                    <Row type="flex" justify="start" style={{ marginTop: "24px" }}>
                        <Col md={24} className="leftsidewapper">
                        
                            <p className="key-title">Voraussichtliche Zustellung Kontaktdaten:</p>
                            <p className="value"><Moment locale="de" format="DD. MMMM YYYY" date={leadinfo.leadDataReciving} /></p>
                            
                        
                        </Col>
                    </Row>
                    </>}
                </Col>
                <Col md={12} xs={0}>
                    <Button href={`mailto:partner@mysoftwarescout.de?subject=Support Anfrage Lead ${leadinfo.leadNumber}`} className="button-primary" icon='mail' type="primary" >Rückfrage stellen</Button>
                </Col>
            </Row>
        </div>
    )

    const resultpresentationSubline = (event) => (
        <div>
        <p className="subline">Ein Software-Experte von MySoftwareScout präsentiert dem Lead Ihre Lösung.</p>
        {leadinfo.leadDataReciving && <>
           { !event.data.happend && <p className="secondSubline">Geplantes Datum der Ergebnispräsentation:</p> }
           <p><Moment locale="de" format="DD. MMMM YYYY, HH:mm" date={!event.data.happend ? event.data.date : event.timestamp} /> Uhr</p>
           </>
           }
           { !leadinfo.leadDataReciving && event.timestamp && <>
           <p><Moment locale="de" format="DD. MMMM YYYY, HH:mm" date={ event.timestamp} /> Uhr</p>
           </>
           }
        </div>
    )

    const resultpresentationHeader = (event) => (
        <div>
         <p>{event.message}</p>
        </div>
    )

    const { Content, Footer } = Layout;
    const { Step } = Steps;

    return (
        <Layout className="layout">
            <Content className="leadinfoPage" >
                <Row type="flex" justify="center" className="header" gutter={gutter}>
                    <Col span={20} xs={24}>
                        <Leadinfo />
                        <h1>Status des angefragten Leads</h1>
                        <p className="subline">Auf dieser Seite sehen Sie jederzeit den aktuellen Status der Vermittlung Ihres angefragten Leads.</p>
                    </Col>
                </Row>
                <Row type="flex" justify="center" gutter={gutter} >
                    <Col sm={18} md={18} lg={16} xs={20} xl={12} className="infoCard" type="flex" justify="center">

                        <Card title={renderCardTitle()}>
                            {isLoading ? <Skeleton loading={isLoading} active /> :
                                <Steps direction="vertical" current={leadinfo.leadHistory.length-1}>
                                    {
                                        leadinfo.leadHistory.map(e => {

                                            if(e.key === 'resultpresentation') return <Step status="finish" title={resultpresentationHeader(e)} description={resultpresentationSubline(e)} />
                                            else if(e.key === 'vendorEvent'){
                                                return (<Step status="finish" className="vendorEvent" title={e.message} description={<><Moment locale="de" format="DD. MMMM YYYY, HH:mm" date={e.timestamp} /> Uhr</>} 
                                                   icon={<Icon type="info" height={16} width={16} style={{fontSize: "16px"}} />}
                                                />)
                                            }
                                            else if(e.key === 'mailsend') return <Step status="finish" 
                                            icon={<Icon style={{fontSize: "16px"}}  type="check" />} title={'Kontaktdaten per E-Mail an Sie versandt'} 
                                             description={<><p className="subline">Der Kunde erwartet Ihre Kontaktaufnahme.</p><Moment locale="de" format="DD. MMMM YYYY, HH:mm" date={e.timestamp} /> Uhr</>} />
                                            return <Step status="finish" title={e.message} description={<><Moment locale="de" format="DD. MMMM YYYY, HH:mm" date={e.timestamp} /> Uhr</>} />
                                        })
                                    }
                                    {
                                        !leadinfo.leadHistory.find(i => i.key === 'mailsend') && <Step icon={<Icon style={{fontSize: "16px"}}  type="check" />} title={'Kontaktdaten per E-Mail an Sie versandt (ausstehend)'}  description={<p className="subline">Der Kunde erwartet Ihre Kontaktaufnahme.</p>} />
                                    }
                                    {/*                                   
                                    <Step title="In Progress" description="This is a description." />
                                    <Step title="Waiting" description="This is a description." /> */}
                                </Steps>


                            }
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col sm={18} md={18} lg={16} xs={20} xl={12} className="infoCard" type="flex" justify="center">
                        <div className="hintSection">
                            <p>Wichtig! Der Kunde wird Ihnen nur in Rechnung gestellt, wenn Sie die Kontaktdaten von uns erhalten haben. </p>
                        </div>
                    </Col>
                </Row>
            </Content>
            <Footer>
                <div className="footerContainer">
                    <div className="footer">
                        <div>
                            <a className="footerLink" href="https://mysoftwarescout.de/impressum/">
                                Impressum
                            </a>
                            &nbsp;
                            <a className="footerLink" href="https://mysoftwarescout.de/datenschutzerklaerung/">
                                Datenschutzerklärung
                            </a>
                            &nbsp;
                            <Link className="footerLink" to="/nutzungsbedingungen">Nutzungsbedingungen</Link>
                        </div>

                    </div>
                </div>
            </Footer>
        </Layout>
    )
}
