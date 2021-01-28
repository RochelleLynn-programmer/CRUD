import "./App.css";
import Header from "./components/header/Header";
import { NewForm, Entries, Home, Entry } from "./components";
import { Route, Switch } from "react-router-dom";
import FullPageEntry from "./components/data/FullPageEntry";
function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" render={(props) => <Home {...props} />} />
        <Route exact path="/form" render={(props) => <NewForm {...props} />} />
        <Route exact path="/display" render={(props) => <Entries {...props} />} />
        <Route exact path="/entry" render={(props) => <Entry {...props} />} />
        <Route path="/entry/:id" render={(props) => <FullPageEntry {...props} />} />
      </Switch>
    </div>
  );
}

export default App;
