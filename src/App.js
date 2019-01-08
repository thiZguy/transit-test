import React, { Component } from 'react';
import SearchField from 'react-search-field';
import './App.css';

//Prueba
const testArray = 
[
  "Gallo verde",
  "Gral. Rafael Urdaneta",
  "La bandera"
];

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       searchedValue: ''
    }
  }
  
  onChange = (value) => {
    this.setState({searchedValue: value});
  }

  render() {
    return (
      <div className="App">
        {/* HEADER */}
        <div className="header">
          
        </div>
        <div className="row body-content">
          <div className="four columns">
            <div className="row">
              <div className="twelve columns">
                <h3>NOMBRE DE LA RUTA</h3>
              </div>
            </div>
            <div className="row">
              <div className="twelve columns">
              <div className="padded align-center">
                <SearchField 
                    placeholder='Search item'
                    onChange={this.onChange}
                  />
              </div>
              </div>
            </div>
            <div className="row">
              {/* Elements container */}
              <div className="twelve columns">
                {/* Array map() */}
                {
                  testArray.map((val, i)=>{
                    const isFound = val.toLowerCase().includes(this.state.searchedValue.toLowerCase());
                    return (
                      this.state.searchedValue==='' || isFound ?
                      <div key={i} className="row station-list-element">
                        <div className="eight columns">
                          <span>{val}</span>
                        </div>
                      </div>
                      :
                      <div key={i}></div>
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div className="eight columns">
            <span>8</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
