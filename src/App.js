import React from 'react';
import { HandBook } from "./components/HandBook";
import { HandBookCatalog } from "./components/HandBookCatalog";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {

  return (
      <Router>
        <Link to="/">На список Справочников</Link>
        <Switch>
            <Route
                path="/"
                exact
                component={HandBookCatalog}
            />
            <Route
                path="/api/handbook/:itemId"
                component={HandBook}
            />
        </Switch>
      </Router>
  );
}
