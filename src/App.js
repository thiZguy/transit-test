import React, { Component } from 'react';
import './App.css';

// Empezare a configurar el repositorio git con esto
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       
    }
  }
  
  render() {
    return (
      <div className="App body-content row">
        <div className="four columns">
          <span>2</span>
          <span>2</span>
        </div>
        <div className="eight columns">
          <span>8</span>
        </div>
      </div>
    );
  }
}

export default App;
