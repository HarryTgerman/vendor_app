import React, { useState, useEffect, createRef } from "react";
import { Link } from "react-router-dom";
import { imagePath } from "../../utils/assetUtils";
import useWindowDimensions from "../hooks/Dimensions";
import config from "../../config";
import axios from "axios";

const getFunnelAnswer = (funnel, question) => {
  const item = funnel.find(item => item.question === question);
  if (item) {
    return item.answer;
  }
  return undefined;
};

export default function VendorPage(props) {
  const [match, setMatch] = useState({
    lead: {
      industry: "",
      customerType: "",
      numberOfEmployees: "",
      funnel: []
    },
    vendor: {
      name: "Muster-CRM-Anbieter:"
    },
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
    }
  });
  const [isOpen, setOpen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModel, setModel] = useState(0);
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(0);
  const [successCTA, setSuccessCTA] = useState(false);
  const [consentValidation, setConsentValidation] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showBanner, toggleBanner] = useState(false);
  const { width } = useWindowDimensions();
  const { accordance, leadCreatedAt, lead, vendor, prices } = match;
  const {
    lead: { funnel }
  } = match;
  const { matchId } = props.match.params;

  //   const q = [
  //     "WELCHES_MODELL",
  //     "WELCHE_ANBINDUNGEN_BENOETIGT",
  //     "WAS_SOLL_CRM_UNBEDINGT_BEINHALTEN",
  //     "MOMENTANER_ANBIETER",
  //     "MEHRSPRACHIGKEIT",
  //     "NUTZERANZAHL_CRM",
  //     "GEPLANTE_EINFUEHRUNG"
  //   ];

  useEffect(() => {
    fetch(`${config.backendUrl}/matches/${matchId}`)
      .then(response => response.json())
      .then(data => {
        console.log("FETCHED MATCH", data);
        setMatch(data);
        setIsLoading(false)
      });
  }, [matchId]);

  const modelTrustbadge = () => {
    return (
      <React.Fragment>
        <p className="p5">
          Jetzt anfragen und Termin mit kaufbereitem Entscheider sichern, der
          aktiv nach Ihrer CRM-Lösung sucht.
        </p>
        <div className="trustbadges">
          <img src={imagePath("proven-expert-bewertungssiegel-1.png")} />
          <img src={imagePath("group-3-copy.png")} />
        </div>
      </React.Fragment>
    );
  };

  const mobileArrow = index => {
    return width <= 415 ? (
      index === activeModel ? (
        <img
          style={{
            height: "12px",
            width: "auto",
            marginRight: "10px",
            transform: "rotate(180deg)"
          }}
          src={imagePath("arrowMobile.png")}
        />
      ) : (
        <img
          style={{ height: "12px", width: "auto", marginRight: "10px" }}
          src={imagePath("arrowMobile.png")}
        />
      )
    ) : null;
  };

  async function successCallToAction() {
    setSuccessCTA(true);
    await acceptAppointment(selectedModel);
  }

  const ref = createRef();

  const handleScroll = () =>
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  const acceptAppointment = async selection => {
    let choice = "";
    switch (selection) {
      case 1:
        choice = "low";
        break;
      case 2:
        choice = "middle";
        break;
      case 3:
        choice = "high";
        break;
      default:
        choice = "error";
        break;
    }

    const body = {
      accepted: choice
    };

    const res = await axios.put(
      `${config.backendUrl}/matches/${matchId}`,
      body
    );
  };

  if (!props.match.params.matchId) {
    return <h1>No match in url</h1>;
  }

  if (match.accepted) {
    return <h2><br></br>Es wurde bereits ein Termin mit diesem Lead angefragt. <br></br> Wenden Sie Sich bei Fragen direkt an partner@mysoftwarecout.de</h2>;
  }


  if (isLoading) {
    return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>;
  }
 const { additionalInfo } = lead;
  return (
    <React.Fragment>
      <div
        id="myModal"
        className='modalContainer'

        style={{ display: toggleModal ? "flex" : "none" }}
      >
        <div className={successCTA ? 'modelbackground modal' : 'modal'}>
          <img
            src={imagePath("closeModal.png")}
            className="closeModal"
            onClick={() => setToggleModal(false)}
          />

          <p className="p1">Terminanfrage</p>
         
          {successCTA
            ?  <React.Fragment><h4 className="successCTA">Sie haben erfolgreich eine Terminanfrage gestellt!</h4><p className="successCTA">Als Bestätigung, haben wir Ihnen eine Email gesendet.</p></React.Fragment>
            :  <h4 >Bestätigen Sie Ihre Terminanfrage</h4>
          }

          {successCTA ? (
            <React.Fragment>
            <h5>Die nächsten Schritte:</h5>
            <div className="steps">
              <div className="step">
                <b>1. Kontaktaufnahme mit Lead</b>
                <p>Wir beraten den Lead unabhängig und finden für Sie heraus ob es ein passender Kunde für Sie ist.</p>
              </div>
              <div className="step">
                <b>2. Terminvereinbarung</b>
                <p>Ist der Lead passend für Sie, vereinbaren wir basierend auf Ihrem Kalendar einen Termin.</p>
              </div>
              <div className="step">
                <b>3. Rückmeldung</b>
                <p>Sobald alles von beiden Seite geklärt wurde, bekommen Sie die Kontaktdaten von uns zugeschickt.</p>
              </div>
            </div>
            <div className="infoBox">
              <h4><img src={imagePath("achtung.png")} alt="Achtung"/>Wichtige Information:</h4>
              <p>Da wir viel Wert darauf legen das unsere Kunde und Sie als Partner zufrieden sind, zahlen Sie erst, wenn der der Termin mit dem Kunden zustande kam.</p>
            </div>
            <button
                   onClick={() => setToggleModal(false)}
                  >
               Fenster schließen
              </button>
              <div className="secureServers">
                <img src={imagePath("lock.png")} />
                <p>Sichere Server in Deutschland</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="licenses">
                Gefragte CRM-Nutzer Anzahl:{" "}
                <span>{getFunnelAnswer(funnel, "NUTZERANZAHL_CRM")}</span>
              </div>
              <div className="infoSection">
                <div className="infoRow">
                  {width <= 415 ? (
                    <React.Fragment>
                      <h5>Kundeninformationen:</h5>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Unternehmensname:</p>
                        <a>
                          <span>“Geblured”</span>GmbH
                        </a>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Ihr Ansprechpartner: </p>
                        <a>
                          Herr:<span>“Geblured”</span>
                        </a>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>E-Mail:</p>
                        <span>“Geblured”</span>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Direkte Durchwah:</p>
                        <span>“Geblured”</span>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Branche:</p>
                        <a>{lead.industry}</a>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Kundengruppe:</p>
                        <a>{lead.customerType}</a>
                      </div>
                      <div className="textColumn">
                        <div>
                          <img src={imagePath("greencheckmark.png")} />
                        </div>
                        <p>Mitarbeiteranzahl: </p>
                        <a>{lead.numberOfEmployees}</a>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <h5>
                        Wir kontaktieren den Kunden, qualifizieren Ihn für Ihre
                        Lösung und vereinbaren für Sie einen Termin.{" "}
                      </h5>
                      <p className="p1Row1">
                        Bestätigen Sie die Datenschutzerklärung und die
                        Nutzungsbedingungen.
                      </p>
                    </React.Fragment>
                  )}

                  <div className="checkbox">
                    <input
                      className={consentValidation ? "error" : ""}
                      type="checkbox"
                      id="consent1"
                      required
                      onChange={e => setConsent(e.target.value)}
                    />
                    <p>
                      Mit dem Absenden dieser Anfrage, erkläre ich mich mit der{" "}
                      <a
                        className="datenschutzerklärung"
                        target="_blank"
                        href="https://mysoftwarescout.de/datenschutzerklaerung"
                      >
                        Datenschutzerklärung
                      </a>{" "}
                      und den Nutzungsbedingungen von MySoftwareScout
                      einverstanden.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      consent
                        ? successCallToAction()
                        : setConsentValidation(true)
                    }
                  >
                    Termin anfragen
                  </button>
                  <div className="secureServers">
                    <img src={imagePath("lock.png")} />
                    <p>Sichere Server in Deutschland</p>
                  </div>
                  <div className="trustbadges">
                    <img src={imagePath("group-3-copy.png")} />
                    <img
                      src={imagePath("proven-expert-bewertungssiegel-1.png")}
                    />
                    <img src={imagePath("dsgvo.png")} />
                  </div>
                </div>
                <div className="divider" />
                <div
                  className="infoRow"
                  style={{ display: width <= 415 ? "none" : "block" }}
                >
                  <h5>Kundeninformationen:</h5>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Unternehmensname:</p>
                    <a>
                      <span>“Geblured”</span>GmbH
                    </a>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Ihr Ansprechpartner: </p>
                    <a>
                      Herr:<span>“Geblured”</span>
                    </a>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>E-Mail:</p>
                    <span>“Geblured”</span>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Direkte Durchwah:</p>
                    <span>“Geblured”</span>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Branche:</p>
                    <a>{lead.industry}</a>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Kundengruppe:</p>
                    <a>{lead.customerType}</a>
                  </div>
                  <div className="textColumn">
                    <div>
                      <img src={imagePath("greencheckmark.png")} />
                    </div>
                    <p>Mitarbeiteranzahl: </p>
                    <a>{lead.numberOfEmployees}</a>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="headerSectionContainer">
        <div className="wrapper">
          <div className="row">
            <div className="col-xs-12 col-md-6  headerContent">
              <h1>Neue Vertriebschance für {vendor.name}</h1>
              {width > 415 ? null : (
                <div className="headerMobileImage">
                  <img alt="Logo" src={imagePath("headerImage.png")} />
                </div>
              )}
              <h2>{accordance+ ' % Übereinstimmung'}</h2>
              <p className="subtext">
                Überdurchschnittlich hohe Übereinstimmung mit Ihrem
                Kundenprofil.
              </p>
              <div className="headerBadge">
                <span>Relevanz sehr hoch</span>
                <p>Anfrage vor {leadCreatedAt} Minuten</p>
              </div>
              <div className="trustbadges">
                <img src={imagePath("group-3-copy.png")} />
                <img src={imagePath("widget-recommendation-465-0.png")} />
                <img src={imagePath("dsgvo.png")} />
              </div>
            </div>
            {width > 415 ? (
              <div className="col-md-6 headerImage">
                <img alt="Logo" src={imagePath("headerImage.png")} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="relevantInfomationSectionContainer">
        <div className="wrapper">
          <div className="infoSection">
            <h3>
              Relevante Informationen
              <span />
            </h3>
            <div className="row infoSectionRow">
              <div className="leadData">
                <h4>
                  Interessent: <span />
                </h4>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("building-1.png")} />
                  </div>
                  <p>
                    Unternehmensname:
                    <a>
                      <span>“Geblured”</span> GmbH
                    </a>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("single-neutral-question.png")} />
                  </div>
                  <p>
                    Ihr Ansprechpartner:
                    <a>
                      {" "}
                      Herr:<span>“Geblured”</span>
                    </a>{" "}
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("envelope.png")} />
                  </div>
                  <p>
                    <a>E-Mail:<span>“Geblured”</span></a>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("ic-call-24-px.png")} />
                  </div>
                  <p>
                  <a>Direkte Durchwah: <span>“Geblured”</span></a>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("business-crossroad.png")} />
                  </div>
                  <p>
                    Branche: <span>{lead.industry}</span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("deal.png")} />
                  </div>
                  <p>
                    Kundengruppe: <span>{lead.customerType}</span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("multiple-users.png")} />
                  </div>
                  <p>
                    Mitarbeiteranzahl: <span>{lead.numberOfEmployees}</span>
                  </p>
                </div>
                {
                  additionalInfo ? (
                    <React.Fragment>
                      {additionalInfo.zip ? ( 
                      <div className="textColumn" > <div> </div>
                        <p>  Postleitzahl Hauptsitz: <span>{additionalInfo.zip}</span> </p>
                      </div>) : null}
                      {additionalInfo.acquisitionIntention ? ( 
                        <div className="textColumn" > <div> </div>
                        <p> Wofür wird das CRM angeschafft: <span>{additionalInfo.acquisitionIntention}</span> </p>
                      </div>): null}
                      {additionalInfo.acquisitionIntention ? ( 
                        <div className="textColumn"> <div> </div>
                        <p> Aktuelle Lösung: <span>{additionalInfo.currentSolution.map(i => i + ', ')}</span> </p>
                      </div>): null }
                      {additionalInfo.dataImport ? ( 
                        <div className="textColumn"> <div> </div>
                        <p>  Datenimport gewünscht: <span>{additionalInfo.dataImport ? 'Ja' : 'Nein'}</span> </p>
                      </div>): null }               
                    </React.Fragment>
                  ) : null
                }
               
              </div>
              <div className="divider" />
              <div className="leadNeeds">
                <h4>Anforderungen:</h4>
                <div className="licenses">
                  Gefragte CRM-Nutzer Anzahl:{" "}
                  <span>{getFunnelAnswer(funnel, "NUTZERANZAHL_CRM")}</span>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("strategy-split.png")} />
                  </div>
                  <p>
                    Aktuelle CRM-Lösung:{" "}
                    <span>{getFunnelAnswer(funnel, "MOMENTANER_ANBIETER")}</span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("video-game-magic-wand.png")} />
                  </div>
                  <p>
                    Featurewunsch:{" "}
                    <span>
                      {getFunnelAnswer(
                        funnel,
                        "WAS_SOLL_CRM_UNBEDINGT_BEINHALTEN"
                      )}
                    </span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("hierarchy.png")} />
                  </div>
                  <p>
                    Anbindungswünsche:{" "}
                    <span>
                      {getFunnelAnswer(funnel, "WELCHE_ANBINDUNGEN_BENOETIGT")}
                    </span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("rechnung.png")} />
                  </div>
                  <p>
                    Modell: <span>{getFunnelAnswer(funnel, "WELCHES_MODELL")}</span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("chat-translate.png")} />
                  </div>
                  <p>
                    Mehrsprachigkeit:{" "}
                    <span>{getFunnelAnswer(funnel, "MEHRSPRACHIGKEIT")}</span>
                  </p>
                </div>
                <div className="textColumn">
                  <div>
                    <img src={imagePath("calendar-3.png")} />
                  </div>
                  <p>
                    Wann ist die Einführung geplant:{" "}
                    <span>{getFunnelAnswer(funnel, "GEPLANTE_EINFUEHRUNG")}</span>
                  </p>
                </div>
                {
                  additionalInfo ? (
                    <React.Fragment>
                      {additionalInfo.description ? ( 
                        <div className="textColumn"> <div> </div>
                        <p>  Beschreibung der Tätigkeit: <span>{additionalInfo.description}</span> </p>
                      </div>): null }
                      {additionalInfo.intention ? ( 
                        <div className="textColumn"> <div> </div>
                        <p>   Intention der Anfrage: <span>{additionalInfo.intention}</span> </p>
                      </div>): null }
                      {additionalInfo.isCompany ? ( 
                        <div className="textColumn"> <div> </div>
                        <p>Kundenart:  <span>{additionalInfo.isCompany ? 'Geschäftskunde' : 'Privatkunde'}</span> </p>
                      </div>): null }
                      {additionalInfo.whichVendor ? ( 
                        <div className="textColumn"> 
                        <div></div>
                        <p> Welche Anbieter sollen Angebunden werden: <span>{additionalInfo.whichVendor}</span> </p>
                      </div>): null }                   
                    </React.Fragment>
                  ) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="selectModelSectionContainer">
        <div className="wrapper">
          <div className="selectModel">
            <h3>
              Haben Sie Interesse dieses Unternehmen als Ihren Kunden zu
              gewinnen?
              <span className="tooltip" />
            </h3>
            <p className="subline">
              Stellen Sie jetzt unverbindlich eine Terminanfrage! Wir
              kontaktieren das Unternehmen, qualifizieren es für Ihre Lösung und
              legen einen Termin mit Ihrem Vertriebsteam.
            </p>
            <div className="models" ref={ref}>
              <div className="model">
                <div className="selectedInfo" style={{ visibility: "none" }}>
                  <p>68 % der Unternehmen entscheiden sich für dieses Paket</p>
                </div>
                <div className="modelContainer" onClick={() => setModel(1)}>
                  <p className="p1">{mobileArrow(1)}Termin für:</p>
                  <p className="p2">€{prices.low.fixed}</p>
                  <p className="p3">
                    +{prices.low.reccuring}% des wiederkehrenden Umsatzes
                  </p>
                  <p className="p4" onClick={() => toggleBanner(true)}>
                    Ihre Vorteile
                  </p>
                  <div className="divider" />
                  {width <= 415
                    ? activeModel === 1
                      ? modelTrustbadge()
                      : null
                    : modelTrustbadge()}
                  <p className="p6">Sie zahlen noch nichts</p>
                  <button
                    onClick={() => {
                      setSelectedModel(1);
                      setToggleModal(true);
                    }}
                  >
                    Termin anfragen
                  </button>
                </div>
              </div>
              <div className="model">
                <div
                  className="selectedInfo"
                  style={{
                    marginTop: width <= 415 ? "48px" : "",
                    visibility: "visible"
                  }}
                >
                  <p>68 % der Unternehmen entscheiden sich für dieses Paket</p>
                </div>
                <div
                  className="modelContainer activeModel"
                  onClick={() => setModel(2)}
                >
                  <p className="p1">{mobileArrow(2)}Termin für:</p>
                  <p className="p2">€{prices.middle.fixed}</p>
                  <p className="p3">
                    +{prices.middle.reccuring}% des wiederkehrenden Umsatzes
                  </p>
                  <p className="p4" onClick={() => toggleBanner(true)}>
                    Ihre Vorteile
                  </p>
                  <div className="divider" />
                  {width <= 415
                    ? activeModel === 2
                      ? modelTrustbadge()
                      : null
                    : modelTrustbadge()}
                  <p className="p6">Sie zahlen noch nichts</p>
                  <button
                    onClick={() => {
                      setSelectedModel(2);
                      setToggleModal(true);
                    }}
                  >
                    Termin anfragen
                  </button>
                </div>
              </div>
              <div className="model">
                <div className="selectedInfo" style={{ visibility: "none" }}>
                  <p>68 % der Unternehmen entscheiden sich für dieses Paket</p>
                </div>
                <div className="modelContainer" onClick={() => setModel(3)}>
                  <p className="p1">{mobileArrow(3)}Termin für:</p>
                  <p className="p2">€{prices.high.fixed}</p>
                  <p className="p3">
                    +{prices.high.reccuring}% des wiederkehrenden Umsatzes
                  </p>
                  <p
                    className="p4"
                  >
                    Ihre Vorteile
                  </p>
                  <div className="divider" />
                  {width <= 415
                    ? activeModel === 3
                      ? modelTrustbadge()
                      : null
                    : modelTrustbadge()}
                  <p className="p6">Sie zahlen noch nichts</p>
                  <button   onClick={() => {
                      setSelectedModel(3);
                      setToggleModal(true);
                    }}>
                    Termin anfragen
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="benefitsBanner"
            style={{ display: showBanner ? "flex" : "none" }}
          >
            <img
              src={imagePath("closeBanner.png")}
              className="closeBanner"
              onClick={() => toggleBanner(false)}
            />
            <h5>Ihre Vorteile</h5>
            <div className="iconRows">
              <div className="iconRow">
                <img
                  src={imagePath("laptop-launch.png")}
                  className="closeModal"
                  onClick={() => setToggleModal(false)}
                />
                <p>Höhere Abschlussquote</p>
              </div>
              <div className="iconRow">
                <img
                  src={imagePath("performance-money-decrease.png")}
                  className="closeModal"
                  onClick={() => setToggleModal(false)}
                />
                <p>Niedrigere Vertriebskosten</p>
              </div>
              <div className="iconRow">
                <img
                  src={imagePath("performance-increase-1.png")}
                  className="closeModal"
                  onClick={() => setToggleModal(false)}
                />
                <p>Erhöhte Vertriebseffizienz</p>
              </div>
              <div className="iconRow">
                <img
                  src={imagePath("smiley-happy.png")}
                  className="closeModal"
                  onClick={() => setToggleModal(false)}
                />
                <p>Zufriedene Vertriebler</p>
              </div>
              <div className="iconRow">
                <img
                  src={imagePath("wedding-money-piggy.png")}
                  className="closeModal"
                  onClick={() => setToggleModal(false)}
                />
                <p>Mehr Umsatz</p>
              </div>
            </div>
          </div>
          <div className="checkmarks">
            <div className="checkmark">
              <img src={imagePath("greencheckmark.png")} />
              <b>Kein Risiko</b>
              <p>
                Sie zahlen erst, nachdem Sie und der Kunde den Termin
                wahrgenommen haben.
              </p>
            </div>
            <div className="checkmark">
              <img src={imagePath("greencheckmark.png")} />
              <b>Sehr Hoher ROI</b>
              <p>
                Unsere Termine haben eine durchschnittliche Abschlussrate von
                74%.
              </p>
            </div>
            <div className="checkmark">
              <img src={imagePath("greencheckmark.png")} />
              <b>Extreme niedriger Wettbewerb</b>
              <p>
                Wir vergebenen Termine an maximal zwei Anbieter. Das bedeutet
                für Sie eine extrem hohe Chance, den Kunden für sich zu
                gewinnen.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="stepSectionContainer">
        <div className="wrapper">
          <div className="stepSection">
            <img className="headerImg" src={imagePath("megaphone.png")} />
            <h2>
              Über 82% bessere Ergebnisse im Vergleich zum “herkömmlichen”
              Lead-Einkauf.
            </h2>
            <p className="subline">
              Bei uns bekommen Sie keinen Datensatz, der gleichzeitig an
              unzählige andere Konkurrenten verkauft wird. Bei uns bekommen Sie
              einen Termin mit einem vorqualifizieren Entscheider, der aktiv
              nach einer CRM-Lösung sucht und bereits Ihre Lösung als passend
              präsentiert bekommen hat.
            </p>
            <h3>So funktioniert es</h3>
            <div className={width > 415 ? null : "stepSectionMobileRow"}>
              <div className="stepImges">
                <img src={imagePath("step-1.png")} />{" "}
                <img src={imagePath("line-3.png")} className="imgLine" />{" "}
                <img src={imagePath("step-2.png")} />{" "}
                <img src={imagePath("line-3.png")} className="imgLine" />{" "}
                <img src={imagePath("step-3.png")} />
              </div>
              <div className="stepText">
                <p>
                  Sie fragen unverbindlich einen Termin an. Dafür zahlen Sie
                  nichts.
                </p>
                <p>
                  Wir kontaktieren den Kunden telefonisch für Sie und
                  qualifizieren Ihn für Ihre Lösung. Den Termin legen wir nach
                  Ihren Vorstellungen.
                </p>
                <p>
                  Erst nach einem erfolgreichen Termin zahlen Sie für unsere
                  Leistungen. Das bedeutet für Sie kein Risiko.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="questionSectionContainer">
        <div className="wrapper">
          <div className="questionSection">
            <h2>Häufig gestellte Fragen</h2>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 1 ? setOpen(0) : setOpen(1))}
              >
                <p>
                  Warum macht eine Beteiligung am wiederkehrenden Umsatz für
                  beide Seiten Sinn?
                </p>
                {isOpen === 1 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 1 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Unsere Beteiligung am wiederkehrende Umsatz incentiviert uns
                  Ihnen nur passende und hochqualitative Interessenten
                  vorzustellen. Wir sind gezwungen uns auf eine ausführliche
                  Beratung und Qualifizierung im Vorfeld zu konzentrieren. Bei
                  unseren günstigen Preisen pro Termin erwirtschaften wir nur
                  dann einen Gewinn wenn Sie einen Abschluss machen und wir am
                  wiederkehrenden Umsatz beteiligt sind. Die Interessen von
                  beiden Seiten sind so vereint.
                </p>
              </div>
            </div>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 2 ? setOpen(0) : setOpen(2))}
              >
                <p>
                  Was für Verpflichtungen gehe ich mit einer Terminanfrage ein?
                </p>
                {isOpen === 2 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 2 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Sollte aus einer Terminanfrage Ihrerseits, ein Termin mit
                  einem Kunden werden verpflichten Sie sich dazu den
                  Interessenten gleichwertig in Ihren Vertriebsprozess zu
                  behandeln und den Termin nach Möglichkeit wahrzunehmen.
                  Sollten der Termin erfolgreich stattgefunden haben und Sie mit
                  der Lead Qualität zufrieden sein bezahlen Sie die oben
                  aufgeführte Gebühr.
                </p>
              </div>
            </div>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 3 ? setOpen(0) : setOpen(3))}
              >
                <p>
                  Bekomme ich immer den Termin, wenn ich eine Anfrage stelle?
                </p>
                {isOpen === 3 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 3 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Nein, wenn wir im Gespräch mit dem Kunden merken dass Ihre
                  Lösung nicht passt dann vermitteln wir auch keinen Termin.
                  Unser gemeinsames Ziel ist Ihr erfolgreicher Abschluss. Das
                  bedeutet für uns eine gründliche Vorqualifizierung die
                  beinhaltet, dass der Kunde bereits ausdrücklich Interesse an
                  Ihrer Lösung bekundet. Ist dies nicht der Fall sehen wir davon
                  ab den Termin zu vermitteln.
                </p>
              </div>
            </div>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 4 ? setOpen(0) : setOpen(4))}
              >
                <p>
                  Wie entscheidet MySoftwareScout, welcher Anbieter den Termin
                  bekommt?
                </p>
                {isOpen === 4 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 4 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Bei uns siegt in der Regel Schnelligkeit. Sind Sie der Erste
                  der einen Termin anfragt bekommen Sie diesen in der Regel
                  auch. Sollte Ihre Lösung jedoch nicht optimal zum Kunden
                  passen oder der Kunde kein Interesse an Ihrer Lösung bekunden,
                  kann es sein, dass Sie auch mal leer ausgehen. Dies ist jedoch
                  in diesem Falle nur zu Ihrem Bestem. Sie sparen Sie nämlich
                  das Geld und investieren dieses nur in Termine die Ihnen auch
                  Mehrwert bieten.
                </p>
              </div>
            </div>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 5 ? setOpen(0) : setOpen(5))}
              >
                <p>Warum sind die Termine so günstig? </p>
                {isOpen === 5 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 5 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Wir können die Termine so günstig anbieten weil wir eine
                  Beteiligung am wiederkehrenden Umsatz anstreben. So sind Ihre
                  und unsere Interessen vereint. Beiden Seiten profitieren nur
                  dann, wenn es zum erfolgreichen Abschluss kommt. Eben deshalb
                  bieten wir Ihnen nur hochwertige Kontakte an, die explizit zu
                  Ihrem Angebot passen. Alle Kontakte die wir Ihnen vermitteln
                  haben telefonisch einem Termin mit Ihnen zugestimmt und Ihre
                  Lösung wurde bereits als die passende empfohlen.
                </p>
              </div>
            </div>
            <div className="question">
              <div
                className="questionHeader"
                onClick={() => (isOpen === 6 ? setOpen(0) : setOpen(6))}
              >
                <p>An wen kann ich mich bei weiteren Fragen wenden? </p>
                {isOpen === 6 ? (
                  <img
                    style={{ transform: "rotate(-180deg)" }}
                    src={imagePath("expandArrow.png")}
                  />
                ) : (
                  <img src={imagePath("expandArrow.png")} />
                )}
              </div>
              <div
                className={
                  isOpen === 6 ? "collapseText" : "collapseText collapsed"
                }
              >
                <p>
                  Wenn Sie eine Frage rund um den Lead-Kaufprozess haben
                  erreichen Sie uns telefonisch unter der: +49 157 359 948 40.
                  Sollten Sie Schriftverkehr bevorzugen wenden Sie sich gerne
                  per Mail an: partner@mysoftwarescout.de{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="scheduleDateSectionContainer">
        <div className="wrapper">
          <div className="scheduleDateSection">
            <h3>
              Termine mit Entscheidern, die Ihren Anruf erwarten, Ihre Lösung
              brauchen und kaufbereit
              <svg
                className="underlineSvg"
                xmlns="http://www.w3.org/2000/svg"
                width="159"
                height="5"
                viewBox="0 0 159 5"
              >
                <path
                  fill="#57D9A3"
                  fillRule="evenodd"
                  d="M0 3.128C27.733 1.146 54.066.106 79 .008c24.934-.098 51.6.734 80 2.496v1.872C133.733 2.602 107.066 1.77 79 1.88 50.934 1.99 24.6 3.03 0 5V3.128z"
                />
              </svg>{" "}
              sind.
            </h3>
            <button onClick={() => handleScroll()}>Termin anfragen</button>
          </div>
        </div>
      </div>
      <div className="footerContainer">
        <div className="wrapper">
          <div className="footer">
            <div className="footerCol">
              <img src={imagePath("Logo.png")} />
              <p>
                Durch kostenlosen und unabhängigen Software-Vergleich, helfen
                wir kleinen und mittleren Unternehmen, die passende Software zu
                finden. So erhalten diese die beste Lösung am Markt und sparen
                Zeit und Ressourcen bei der Suche{" "}
              </p>
              <div className="locationBanner">
                <img src={imagePath("locationPin.png")} />
                <p>Berlin, Deutschland</p>
              </div>
            </div>
            <div className="footerCol">
              <b>Rechtliches</b>
              <a href="https://mysoftwarescout.de/impressum">Impressum</a>
              <a href="https://mysoftwarescout.de/datenschutzerklaerung">
                Datenschutzerklärung
              </a>
              <Link to="/nutzungsbedingungen">Nutzungsbedingungen</Link>
              <a className="cta" onClick={() => handleScroll()}>
                Termin anfragen
              </a>
            </div>
            <div className="footerCol">
              <b>Soziale Netzwerke</b>
              <a>LinkedIn</a>
              <a href="mailto:office@mysoftwarescout.de" className="cta">
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
