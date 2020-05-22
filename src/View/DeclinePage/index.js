import React, { useState, useEffect, createRef } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { Layout, Row, Col, Card, Collapse, Button, Skeleton, Divider, message, Checkbox, Empty } from "antd";
import CashPaymentIcon from "../../components/icons/CashPayment";
import HumanResourcesEmployeeIcon from "../../components/icons/HumanResourcesEmployee";
import MonetizationApprove from "../../components/icons/MonetizationApprove";
import { gutter } from '../../components/constants';
import AbgelehntIcon from "../../components/icons/Abgelehnt";
import CircleBlueArrow from "../../components/icons/CircleBlueArrow";
import GreenCheckmark from "../../components/icons/GreenCheckmark";
import CircleBlueBoard from "../../components/icons/CircleBlueBoard";
import CircleBlueWizzard from "../../components/icons/CircleBlueWizzard";
import MatchAccepted from "../../components/MatchReaction/Accepted";
import MatchDeclined from "../../components/MatchReaction/Declined";

const getFunnelAnswer = (funnel, question) => {
    const item = funnel.find(item => item.question === question);
    if (item) {
        return item.answer;
    }
    return undefined;
};

export default function DeclinePage(props) {

    const [match, setMatch] = useState({
        lead: {
            industry: "",
            customerType: "",
            numberOfEmployees: "",
            funnel: [],
            numberOfSeats: 0,
            additionalInfo : {},

        },
        vendor: {
            name: "Muster-CRM-Anbieter:"
        },
        leadPrice: '0',
        prices: {
            low: {
                fixed: 0,
                recurring: 0
            },
            middle: {
                fixed: 0,
                recurring: 0
            },
            high: {
                fixed: 0,
                recurring: 0
            }
        },
        accepted: {
            timestamp: ''
        }
    });

    const { accordance, leadCreatedAt, lead, vendor, prices } = match;
    const {
        lead: { funnel, additionalInfo }
    } = match;
    const { matchId } = props.match.params;
    const [isLoading, setIsLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(0);
    const [successCTA, setSuccessCTA] = useState(false);
    const [consent, setConsent] = useState(false);
    const [consentValidation, setConsentValidation] = useState(false);



    useEffect(() => {
        fetch(`${config.backendUrl}/matches/${matchId}`)
            .then(response => response.json())
            .then(data => {
                setMatch(data);
                setIsLoading(false)
            });
    }, [matchId]);

    async function successCallToAction() {
        setSuccessCTA(true);
        await acceptAppointment(selectedModel);
    }


    const acceptAppointment = async selection => {
        setButtonLoading(true);
        const body = {
            accepted: {
                accepted: false
            },
        };

        const res = await axios.put(
            `${config.backendUrl}/matches/${matchId}`,
            body
        ).then(res => {
            message.success("Interessent erfolgreich abgelehnt");
            setButtonLoading(false)
            props.history.push(`/decline-match-feedback/${matchId}`)
        });
    };

    if (!props.match.params.matchId) {
        return <Empty style={{ marginTop: "56px" }} description={
            <span>
                <p className="subline"> Es wurden keine Matches unter dieser URL identifiziert, falls Sie Fragen haben bitte melden Sie sich unter <a href="mailto:partner@mysoftwarescout.de">partner@mysoftwarescout.de</a></p>
            </span>
        } />
    }


    if (match.accepted.accepted) {
        return <MatchAccepted />;
    }
    if(match.accepted.accepted === false){
        return <MatchDeclined />
    }


    // if (isLoading) {
    //     return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
    // }

    const { Content, Footer } = Layout;
    const { Panel } = Collapse;

    const collapseHeader = (text, icon) => (<div className="header">{icon()}<p style={{ fontSize: "1.25em" }}>{text}</p></div>)
    return (
        <Layout className="layout">
            <Content className="acceptPage" >
                <Row type="flex" justify="center" className="header" gutter={gutter}>
                    <Col span={20} xs={24}>
                        <AbgelehntIcon />
                        <h1>Bitte bestätigen Sie, dass Sie den Interessenten ablehnen möchten.</h1>
                        <p className="subline">Sie können mit nur einem Klick den Kontakt zum Interessenten anfordern. Sie zahlen nur bei erfolgreicher Kontaktaufnahme und haben so eine 100% Sicherheit. </p>
                        <Row type="flex" justify="center">
                            <Col span="24" className="inlineFLex mobileRowFlex">
                                <Row type="flex" justify="center">
                                    <Col span="24" xs={{ span: 24 }}>
                                        <div className="inlineFLex">
                                            <CashPaymentIcon />
                                            <p>Hohe Abschlussquote</p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center">
                                    <Col span="24" xs={{ span: 24 }}>
                                        <div className="inlineFLex">
                                            <HumanResourcesEmployeeIcon />
                                            <p>Wir empfehlen dem Kunden Ihre Lösung</p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center">
                                    <Col span="24" xs={{ span: 24 }}>
                                        <div className="inlineFLex">
                                            <MonetizationApprove />
                                            <p>Zahlung nur bei erfolgreicher Kontaktaufnahme</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="center" gutter={gutter} >
                    <Col sm={12} xs={20} className="infoCard" type="flex" justify="center">
                   
                        <Card>
                        { isLoading ? <Skeleton loading={isLoading} active /> : 
                         <React.Fragment>
                         <div className="leadNumber">
                                <p>Leadnummer: {lead.leadNumber}</p>
                            </div>
                            <div className="heading">
                                <CircleBlueArrow />
                                <p>Die wichtigsten Infos:</p>
                            </div>
                            { lead.numberOfSeats &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Nutzeranzahl: <span>&nbsp;{lead.numberOfSeats}</span>
                                </div>
                            }
                            {lead.numberOfEmployees &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Mitarbeiteranzahl: <span>&nbsp; {lead.numberOfEmployees}</span>
                                </div>
                            }
                            {
                                additionalInfo && additionalInfo.zip &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Postleitzahl: <span>&nbsp; {lead.additionalInfo.zip}</span>
                                </div>
                            }
                            {
                                lead.industry &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Branche: <span>&nbsp; {lead.industry}</span>
                                </div>
                            }

                            {
                                additionalInfo && additionalInfo.targetGroup &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Zielgruppe des Kunden:&nbsp; <span>&nbsp; {lead.additionalInfo.targetGroup.join(', ')}</span>
                                </div>
                            }
                            {
                                additionalInfo && additionalInfo.integrationTime &&
                                <div className="checkmarks">
                                    <GreenCheckmark />
                                    Einführungszeitpunkt: <span>&nbsp; {additionalInfo.integrationTime}</span>
                                </div>
                            }

                            <div className="confirm">
                               {match.leadPrice && <p className="price">{match.leadPrice}<sup><b>€ Netto</b></sup></p> }
                                {match.recurring && <p className="recurring">+{match.recurring * 100}% des wiederkehrenden Umsatzes</p> }
                                {/* <p className="discountedPrice">
                                    <b>Hinweis:</b> wenn es uns nicht möglich ist, direkt einen Termin mit Ihnen und dem Interessenten zu vereinbaren, 
                                    erhalten sie die Kontaktdaten des Interessenten, um sich direkt mit Ihm in Verbindung zu setzen. 
                                    Dabei reduziert sich der Preis auf <b>{(match.leadPrice / 2).toLocaleString("de-DE", {minimumFractionDigits: 0})}€</b>. 
                                </p> */}
                                {/* <Checkbox className="checkbox" onChange={e => setConsent(e.target.checked)}>
                                    <p>
                                        Mit Absenden des Formulars erkläre ich mich mit der Datenschutzerklärung&nbsp;
                                    <a
                                            className="datenschutzerklärung"
                                            target="_blank"
                                            href="https://mysoftwarescout.de/datenschutzerklaerung"
                                        > Datenschutzerklärung
                                    </a>&nbsp;und den Geschäftsbedingungen von MySoftwareScout einverstanden.
                                </p>
                                </Checkbox> */}

                                <div><Button loading={buttonLoading} type="primary" className="button-error"
                                    onClick={() =>
                                        successCallToAction()
                                            
                                    }>Interessent ablehnen</Button>
                                    <Link to={`/accept-match/${matchId}`} className="terminAnfragen" >Termin anfragen ></Link>
                                    <div className="secure">
                                    <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.75 7.125H12.1875V5.0625C12.1875 2.26656 9.92094 0 7.125 0C4.32906 0 2.0625 2.26656 2.0625 5.0625V7.125H1.5C0.671573 7.125 0 7.79657 0 8.625V16.5C0 17.3284 0.671573 18 1.5 18H12.75C13.5784 18 14.25 17.3284 14.25 16.5V8.625C14.25 7.79657 13.5784 7.125 12.75 7.125ZM7.125 13.875C6.29657 13.875 5.625 13.2034 5.625 12.375C5.625 11.5466 6.29657 10.875 7.125 10.875C7.95343 10.875 8.625 11.5466 8.625 12.375C8.625 13.2034 7.95343 13.875 7.125 13.875ZM9.9375 7.125C10.1446 7.125 10.3125 6.95711 10.3125 6.75V5.0625C10.3125 3.30209 8.88541 1.875 7.125 1.875C5.36459 1.875 3.9375 3.30209 3.9375 5.0625V6.75C3.9375 6.95711 4.10539 7.125 4.3125 7.125H9.9375Z" fill="#CBCED8"/>
                                    </svg>
                                    <p>Sie zahlen erst nach erfolgreicher Kontaktaufnahme mit dem Interessenten.</p>
                                    </div>
                                </div>
                            </div>
                            </React.Fragment>
                        }
                        </Card>

                        <Collapse expandIconPosition="right" >
                        <Panel header={collapseHeader("Infos zum Projekt", CircleBlueBoard)} key="1">
                                {isLoading ? <Skeleton loading={isLoading} active /> :
                                    <React.Fragment>
                                        {additionalInfo.budget && <p>Budgetrahmen:&nbsp;<span>{additionalInfo.budget}</span></p>}
                                        {additionalInfo.projectteam && <p>Projektteam vorhanden:&nbsp;<span>{additionalInfo.projectteam ? 'Ja' : 'Nein'}</span></p>}
                                        {additionalInfo.softwareInUse && <p>CRM-System vorhanden:&nbsp;<span>{additionalInfo.softwareInUse ? 'Ja' : 'Nein'}</span></p>}
                                        {additionalInfo.intention && 
                                            <React.Fragment>
                                                <p>Intention der Anfrage:</p>
                                                <span style={{ color: "#7E8091", textAlign: "left" }}>{additionalInfo.intention}</span>
                                            </React.Fragment>
                                        }
                                        {additionalInfo.currentSoftwareInUse && <p>Aktueller CRM-Anbieter:&nbsp;<span>{additionalInfo.currentSoftwareInUse}</span></p>}
                                        { additionalInfo.useCase.length ? <p>Anwendungsbereiche:&nbsp;<span>{additionalInfo.useCase.join(', ')} </span></p> : null}
                                        {additionalInfo.description &&
                                            <React.Fragment>
                                                <p>Beschreibung der Tätigkeit des Unternehmens:</p>
                                                <span style={{ color: "#7E8091", textAlign: "left" }}>{additionalInfo.description}</span>
                                            </React.Fragment>
                                        }
                                        { additionalInfo.currentSolution.length ? 
                                            <React.Fragment>
                                                <p>Aktuelle Lösung zur Strukturierung:</p>
                                                <span style={{ color: "#7E8091", textAlign: "left" }}>{additionalInfo.currentSolution.join(', ')}</span>
                                            </React.Fragment> : null}
                                        {additionalInfo.specialInfo &&
                                            <React.Fragment>
                                                <p>Besondere Anmerkung:</p>
                                                <span style={{ color: "#7E8091", textAlign: "left" }}>{additionalInfo.specialInfo}</span>
                                            </React.Fragment>
                                        }

                                    </React.Fragment>
                                }
                            </Panel>
                            <Panel header={collapseHeader("Anforderungen an das CRM-System", CircleBlueWizzard)} key="2">
                                {isLoading ? <Skeleton loading={isLoading} active /> :
                                    <React.Fragment>
                                        { additionalInfo.requiredFeatures.length ? <p>Benötigte Features:&nbsp;<span>{additionalInfo.requiredFeatures.join(', ')}</span></p> : null}
                                        { additionalInfo.optionalFeatures.length ? <p>Optionale Features:&nbsp;<span>{additionalInfo.optionalFeatures.join(', ')}</span></p> : null}
                                        { additionalInfo.requiredInterface.length ? <p>Benötigte Anbingungen:&nbsp;<span>{additionalInfo.requiredInterface.join(', ')}</span></p> : null}
                                        {additionalInfo.vendorsToIntegrate && <p>Anzubindene Anbieter:&nbsp;<span>{additionalInfo.vendorsToIntegrate}</span></p>}
                                        {additionalInfo.integrationPartner && <p>Technische Umsetzung der Anbindungen:&nbsp;<span>{additionalInfo.integrationPartner}</span></p>}
                                        {additionalInfo.multiLang && <p>Mehrsprachigkeit:&nbsp;<span>{additionalInfo.multiLang ? 'Wird benötigt' : 'Wird nicht benötigt'}</span></p>}
                                        {
                                            additionalInfo.dataImport && <p>Datenimport gewünscht:&nbsp;<span>{additionalInfo.dataImport ? 'Ja' : 'Nein'}</span></p>
                                        }
                                        {additionalInfo.hostingModel && <p>Modell:&nbsp;<span>{additionalInfo.hostingModel}</span></p>}
                                        {additionalInfo.hostingInGermany && <p>Hosting in Deutschland:&nbsp;<span>{additionalInfo.hostingInGermany ? 'Ja' : 'Nein'}</span></p>}
                                        {additionalInfo.paymentModel && <p>Zahlungsmodell:&nbsp;<span>{additionalInfo.paymentModel}</span></p>}

                                        {lead.extraInfo &&
                                            <React.Fragment>
                                                <p className="additional">Anmerkungen</p>
                                                <span style={{ color: "#7E8091", textAlign: "left" }}>{lead.extraInfo}</span>
                                            </React.Fragment>
                                        }

                                        <Divider />
                                        <Checkbox className="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}>
                                            <p>
                                                Mit Absenden des Formulars erkläre ich mich mit der&nbsp;
                                    <a
                                                    className="datenschutzerklärung"
                                                    target="_blank"
                                                    href="https://mysoftwarescout.de/datenschutzerklaerung"
                                                >
                                                    Datenschutzerklärung
                                    </a>&nbsp;
                                                                                                                und den <Link to="/nutzungsbedingungen">Nutzungsbedingungen</Link> von MySoftwareScout einverstanden.
                                </p>
                                        </Checkbox>
                                        <Button loading={buttonLoading} type="primary" className="button-secondary"
                                            onClick={() =>
                                                consent
                                                    ? successCallToAction()
                                                    : setConsentValidation(true)
                                            }>Kontakt anfordern</Button>
                                    </React.Fragment>
                                }
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
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
