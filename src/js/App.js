import React, { Component } from 'react';
import SearchField from 'react-search-field';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../css/app.css';
import '../css/tabs.css';

const defaultStations = [
  "Gallo verde",
  "Gral. Rafael Urdaneta",
  "La bandera"
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
       searchedValue: '',
       stations: defaultStations
    }
  }

  searchFavs = async () => { };

  newSearchval = (value) => {
    this.setState({searchedValue: value});
  }

  changeTab = (value) => {
    console.log('obtained: ', value);
    if(value===0)
      this.setState({stations: defaultStations});
    else if(value===1)
      this.setState({ stations: [] });
  }

  renderStations = (stations, searchedValue) => 
   <div>
      {
        stations.map((val, i) => {
          const isFound = val.toLowerCase().includes(searchedValue.toLowerCase());
          return (
            searchedValue === '' || isFound ?
              <div key={i} className="row station-list-element">
                <span>{val}</span>
              </div>
              :
              <div key={i}></div>
          );
        })
      }
   </div>;

  render() {
    const {
      state: { stations, searchedValue },
      newSearchval
    } = this;
    return (
      <div className="App">
        {/* HEADER */}
        <div className="header">

        </div>
        <div className="row body-content">
          <div className="four columns">
            <div className="row">
              <h3>NOMBRE DE LA RUTA</h3>
            </div>
            <div className="row">
              <div className="padded align-center">
                <SearchField
                    placeholder='Buscar ruta...'
                    onChange={newSearchval}
                    classNames="shadow"
                  />
              </div>
            </div>
            <div className="row padded">
              <Tabs onSelect={(index) => this.changeTab(index)}>
                <TabList>
                  <Tab>Recorridos</Tab>
                  <Tab>Favoritos</Tab>
                </TabList>
                <TabPanel>
                  {() => this.renderStations(stations,searchedValue)}
                </TabPanel>
                <TabPanel>
                  {() => this.renderStations(stations,searchedValue)}
                </TabPanel>
              </Tabs>
            </div>
            <div className="row">
              {/* stations container */}
              {
                stations.map((val, i)=>{
                  const isFound = val.toLowerCase().includes(searchedValue.toLowerCase());
                  return (
                    searchedValue==='' || isFound ?
                    <div key={i} className="row station-list-element">
                      <span>{val}</span>
                    </div>
                    :
                    <div key={i}></div>
                  );
                })
              }
            </div>
          </div>
          <div className="eight columns flexbox-style">
            <div className="row">
              <h3>8</h3>
            </div>      
          </div>
        </div>
      </div>
    );
  }
}

export default App;
