import React, { Component } from 'react';
import SearchField from 'react-search-field';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GoogleMapReact from 'google-map-react';
import { FaStar, FaBus } from 'react-icons/fa';


import '../css/app.css';
import '../css/tabs.css';

// CLAVE: AIzaSyD91ubThsz5ZvUNqZhkhl2_vHkL7miQ6xo
const AnyReactComponent = ({ text }) => <div style={{ borderWidth: '0px 0px 1px 0px',
borderColor: '#545a5a'}}>{text}</div>;


const defaultStations = [
  { text: "Gallo verde", lat: -33.456, long: -70.674211 },
  { text: "Gral. Rafael Urdaneta", lat: -33.459, long: -70.674211 },
  { text: "La bandera", lat: -33.453, long: -70.674211 }
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
       stations: defaultStations,
       favorites: null,
       activeTab: 0,
    }

    /**COLOCO ESTO PARA AGILIZAR EL CICLO DE DESARROLLO Y
     * LOS FAVORITOS SE BORREN AL REFRESCAR LA PAG */
    if (window.performance) {
      if (performance.navigation.type === 1) {
        if (process.env.NODE_ENV !== 'production') {
          localStorage.removeItem('favorites');
        }
      }
    }
  }

  /* LYFECYCLE METHODS */
  componentDidMount = () => {
    this.getFavorites();
  }

/**
 * ---------------------------------------
*/

  /* OTHER METHODS */
  getFavorites = () => {
    const cachedFavs = JSON.parse(localStorage.getItem('favorites'));
    if(cachedFavs) {
      this.setState({ favorites: cachedFavs });
    }
   };

  addFavorite = (value) => {
    const toStore = JSON.stringify(this.state.favorites ? [...this.state.favorites, value] : [value])
    localStorage.setItem('favorites', toStore);
    this.getFavorites();
  };

  newSearchval = (searchText) => {
    this.setState({searchedValue: searchText});
  }

  changeTab = (value) => {
    this.setState({ activeTab: value });
  }

  onClickRoute = (element) => {
    this.addFavorite(element);
  }

  renderRoutes = (stations, searchedValue) => {
    if(stations)
      return (
      <div>
        {
          stations.map((element, i) => {
            const isFound = element.text.toLowerCase().includes(searchedValue.toLowerCase());
            return (
              searchedValue === '' || isFound ?
                <div key={i} className="row station-list-element">
                  <div className="six columns">
                    <span>{element.text}</span>
                  </div>
                  <div className="pull-right two columns">
                    <FaStar onClick={() => this.onClickRoute(element)} className="favorite-icon"/>
                  </div>
                </div>
                :
                <div key={i}></div>
            );
          })
        }
      </div>
      );
    else
        return (<div></div>);
  }

  renderFavs = (favs, searchedValue) => {
    if(favs)
      return (
      <div>
        {
          favs.map((element, i) => {
            const isFound = element.text.toLowerCase().includes(searchedValue.toLowerCase());
            return (
              searchedValue === '' || isFound ?
                <div key={i} className="row station-list-element" onClick={() => this.onClickRoute(element)}>
                  <span>{element.text}</span>
                </div>
                :
                <div key={i}></div>
            );
          })
        }
      </div>
      );
    else
        return (<div></div>);
  }
   
/**
 * ---------------------------------------
*/

  render() {
    const {
      state: { favorites, stations, searchedValue },
      newSearchval
    } = this;
    return (
      <div className="App">
        {/* HEADER */}
        <div className="header">
          <div className="row">
            <div className="eleven columns">
              <div className="row">
                <h3>Transit!</h3>
                <FaBus />
              </div>
            </div>
          </div>
        </div>
        <div className="body-content row">
          <div className="four columns">
            <div className="padded row">
              <h3>{searchedValue}</h3>
            </div>
            <div className="padded row">
              <div className="align-center">
                <SearchField
                    placeholder='Buscar ruta...'
                    onChange={newSearchval}
                    classNames="search-field shadow"
                />
              </div>
            </div>
            <div className="padded row">
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
                  {this.renderRoutes(stations,searchedValue)}
                </TabPanel>
                <TabPanel>
                  {this.renderFavs(favorites,searchedValue)}
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="columns">
            <div className="padded row">
              <div style={{ height: '250px', width: '-webkit-fill-available', minWidth: '400px' }}>
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
