/**
 * @author Santiago Montero
 * @github https://github.com/thiZguy
 */

import React, { Component } from 'react';
import SearchField from 'react-search-field';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import GoogleMapReact from 'google-map-react';
import { FaStar, FaBus, FaTrashAlt } from 'react-icons/fa';
import '../css/app.css';
import '../css/tabs.css';

import Polyline from './ui/Polyline';
// import Marker from './ui/Marker';

/* REPLACED BY MARKER */
// const AnyReactComponent = ({ text }) => <div
// style={{ borderWidth: '0px 0px 1px 0px', borderColor: '#545a5a', borderRadius: '100%'}}>
// {text}
// </div>;

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
       routes: [],
       favorites: null,
       activeTab: 0,
       isLoadingMap: true,
       selectedRoute: null,
       shape: []
    }
    this.gApiKey = '';
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
    this.getKey();
    this.getRoutes();
  }

/**
 * ---------------------------------------
*/

  /* FRONTEND CODE METHODS */

  getFavorites = () => {
    const cachedFavs = JSON.parse(localStorage.getItem('favorites'));
    if(cachedFavs) {
      this.setState({ favorites: cachedFavs });
    } else {
      this.setState({ favorites: null });
    }
  };

  addFavorite = (value) => {
    const toStore = JSON.stringify(this.state.favorites ? [...this.state.favorites, value] : [value])
    localStorage.setItem('favorites', toStore);
    this.getFavorites();
  };

  deleteFavorites = () => {
    localStorage.removeItem('favorites');
    this.getFavorites();
  }

  newSearchval = (searchText) => {
    this.setState({searchedValue: searchText});
  }

  changeTab = (value) => {
    this.setState({ activeTab: value });
  }

  selectRoute = (route) => {
    if(this.state.selectedRoute===route) {
      this.setState({ selectedRoute: null, shape: null });
    } else {
      this.setState({ selectedRoute: route },
        () => {
          this.getRouteShape(route.route_id);
        }
      );
    }
  }

  renderRoutes = (routes, searchedValue) => {
    const { selectedRoute } = this.state;
    if(routes)
      return (
        <div className="scrollable-container">
        {
          routes.map((route, i) => {
            const isFound = route.route_long_name.toLowerCase().includes(searchedValue.toLowerCase());
            return (
              searchedValue === '' || isFound ?
                <div key={i} onClick={() => this.selectRoute(route)} className={`row ${selectedRoute !== route ? 'station-list-element' : 'station-list-element-selected'}`}>
                  <div className="six columns">
                    <span>{route.route_long_name}</span>
                  </div>
                  <div className="pull-right two columns">
                    <FaStar onClick={() => this.addFavorite(route)} className="favorite-icon"/>
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
        <div className="scrollable-container">
        {
          favs.map((element, i) => {
            const isFound = element.route_long_name.toLowerCase().includes(searchedValue.toLowerCase());
            return (
              searchedValue === '' || isFound ?
                <div key={i} className="row station-list-element" onClick={() => this.addFavorite(element)}>
                  <span>{element.route_long_name}</span>
                </div>
                :
                <div key={i}></div>
            );
          })
        }
        {
          <div className="row align-center">
              <FaTrashAlt onClick={() => this.deleteFavorites()} className="favorite-delete-icon" />
          </div>
        }
      </div>
      );
    else
        return (
        <div>
            <h3>{'No favorites found'}</h3>
        </div>
        );
  }
   
/**
 * ---------------------------------------
*/

/* Backend fetch METHODS */

getKey =  async () => {
  fetch('/api/retrieveKey').then(
    async res => {
      const response = await res.json();
      this.gApiKey = response.GoogleMapsAPIKey;
      this.setState({ isLoadingMap: false });
    }
  ).catch(
    error => {
      // console.err(error);
    }
  );
}

getRoutes =  async () => {
  fetch('/api/getRoutes').then(
    async res => {
      const response = await res.json();
      this.setState({ routes: response.routes });
    }
  ).catch(
    error => {
      // console.err(error);
    }
  );
}

getRouteShape =  async (routeId) => {
  fetch('/api/getShapeIdByRouteId', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routeId,
    }),
  }).then(
    async res => {
      const response = await res.json();
      // console.log('Shape got: ', response.shape);
      this.setState({ shape: response.shape });
    }
  ).catch(
    error => {
      console.log(error);
    }
  );
}

/**
 * ---------------------------------------
*/
  render() {
    const {
      state: { selectedRoute, favorites, routes, searchedValue, isLoadingMap, mapLoaded, shape, map, maps },
      newSearchval,
      gApiKey
    } = this;
    return (
      <div className="App">
        {/* HEADER */}
        <div className="header">
          <div className="row">
            <div className="eleven columns">
              <div className="row">
                <h3>Transit! <FaBus /></h3>
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
                  {this.renderRoutes(routes,searchedValue)}
                </TabPanel>
                <TabPanel>
                  {this.renderFavs(favorites,searchedValue)}
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="six columns">
            <div className="padded row">
            {
              !isLoadingMap &&
                <div style={{ height: '250px', width: '-webkit-fill-available', minWidth: '250px' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: gApiKey }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => { this.setState({ map: map, maps: maps, mapLoaded: true }) }}
                  >
                    {/* <Marker
                      lat={-33.455548}
                      lng={-70.630209}
                      text="AAAAAAAAAAA"
                    /> */}
                  </GoogleMapReact>
                  { 
                    mapLoaded && shape && 
                    shape.map((element, i) => {
                      const origin = {
                        lat: element.shape_pt_lat,
                        lng: element.shape_pt_lon
                      };
                      const dest = {
                        lat: shape[i + 1] ? shape[i + 1].shape_pt_lat : origin.lat,
                        lng: shape[i + 1] ? shape[i + 1].shape_pt_lon : origin.lng
                      };
                      return (
                        <Polyline
                          key={i}
                          map={map}
                          maps={maps}
                          origin={origin}
                          destination={dest}
                          color={selectedRoute.route_color}
                        />
                      );
                    })
                  }
                </div> 
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
