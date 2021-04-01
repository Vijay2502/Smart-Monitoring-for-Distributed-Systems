import {
  BrowserRouter, Route, Switch
} from "react-router-dom";
import './App.css';
import ErrorBoundary from "./Components/ErrorBoundary";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import './Styles/common.scss';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ErrorBoundary>
          <Navbar></Navbar>
          <section className="main-wrapper">
            <Switch>
              <Route path="/">
                <Home></Home>
              </Route>
            </Switch>
          </section>


          <footer className="footer">
            <p>A Project by Akshit, Ayushman, Chaitanya & Vijay</p>
          </footer>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
