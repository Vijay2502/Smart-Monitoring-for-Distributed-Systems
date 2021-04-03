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
            <p>A Project by Akshit Ahuja, Ayushman Mittal, Chaitanya Naik & Vijay Ghanshani</p>
            <p>San Jose State University - MS Software Engineering</p>
            <p>Under the guidance of Prof. Younghee Park</p>

          </footer>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
