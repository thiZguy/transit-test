import React, { Component } from 'react';
import SearchField from 'react-search-field';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GoogleMapReact from 'google-map-react';

import '../css/app.css';
import '../css/tabs.css';

// CLAVE: AIzaSyD91ubThsz5ZvUNqZhkhl2_vHkL7miQ6xo
const AnyReactComponent = ({ text }) => <div style={{ borderWidth: '0px 0px 1px 0px',
borderColor: '#545a5a'}}>{text}</div>;


const defaultStations = [
  {text: "Gallo verde", lat: -33.456, long: -70.674211 },
  {text: "Gral. Rafael Urdaneta", lat: -33.459, long: -70.674211 },
  {text: "La bandera", lat: -33.453, long: -70.674211 }
]

class App extends Component {
  static defaultProps = {
    center: {
      lat: -33.44,
      lng: -70.669266
    },
    zoom: 11
  };

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
        stations.map((element, i) => {
          const isFound = element.text.toLowerCase().includes(searchedValue.toLowerCase());
          return (
            searchedValue === '' || isFound ?
              <div key={i} className="row station-list-element">
                <span>{element.text}</span>
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
          <div className="four columns flexbox-style">
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
              <Tabs
                onSelect={(index) => this.changeTab(index)}
                selectedTabClassName="selected-tab"
                // selectedTabPanelClassName="selected-tab-panel"
              >
                <TabList>
                  <Tab>Recorridos</Tab>
                  <Tab>Favoritos</Tab>
                </TabList>
                <TabPanel>
                  {this.renderStations(stations,searchedValue)}
                </TabPanel>
                <TabPanel>
                  {this.renderStations(stations,searchedValue)}
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="eight columns flexbox-style">
            <div className="row">
              <div style={{ height: '250px', width: '500px' }}>
                <GoogleMapReact
                  bootstrapURLKeys={{ key: 'AIzaSyD91ubThsz5ZvUNqZhkhl2_vHkL7miQ6xo' }}
                  defaultCenter={this.props.center}
                  defaultZoom={this.props.zoom}
                >
                  <AnyReactComponent
                    lat={-33.455548}
                    lng={-70.630209}
                    text="AAAAAAAAAAA"
                  />
                </GoogleMapReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
