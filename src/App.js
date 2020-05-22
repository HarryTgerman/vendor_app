import React from "react";
import 'antd/dist/antd.css';
import "./App.scss";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import TermsOfUse from './components/TermsOfUse'
// import Vendorpage from "./components/Vendorpage";
import Navbar from "./components/Navbar";
import AcceptPage from "./View/AcceptPage"
import AcceptFeedbackPage from "./View/AcceptFeedbackPage";
import DeclinePage from "./View/DeclinePage"
import DeclineFeedbackPage from "./View/DeclineFeedbackPage";
import MatchAccepted from "./components/MatchReaction/Accepted";
import leadInfoPage from './View/LeadInfoPage';



function App() {
  return (
    <div className="App">
      <header className="App-header" />
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={MatchAccepted} />
          <Route exact path="/nutzungsbedingungen" component={TermsOfUse} />
          <Route path="/leadinfo/:matchId" component={(props) => <Redirect to={`/accept-match/${props.match.params.matchId}`} />} />
          {/* <Route path="/leadinfo/:matchId" component={leadInfoPage} /> */}
          {/* <Route path="/:matchId" component={AcceptPage} /> */}
          {/* <Route exact path="/decline-match/:matchId" component={Vendorpage} /> */}
          <Route path="/accept-match/:matchId" component={AcceptPage} />
          <Route path="/accept-match-feedback/:matchId" component={AcceptFeedbackPage} />
          <Route path="/decline-match/:matchId" component={DeclinePage} />
          <Route path="/decline-match-feedback/:matchId" component={DeclineFeedbackPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
