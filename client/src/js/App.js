/**
 * @author Santiago Montero
 * @github https://github.com/thiZguy
 */

import React, { Component } from 'react';
import SearchField from 'react-search-field';
import GoogleMapReact from 'google-map-react';
import { FaBus } from 'react-icons/fa';

/* CSS */
import '../css/app.css';
import '../css/tabs.css';

/* RELATIVE COMPONENTS IMPORTS */
import Shapes from './ui/Shapes';
import Marker from './ui/Marker';
import LoadingSpinner from './ui/LoadingSpinner';
import TabComponent from './ui/TabComponent';

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
       isLoadingRoutes: true,
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

  addFavorite = (value, index) => {
    const { favorites, routes } = this.state;
    if (!favorites || favorites.some(e => e._id !== value._id)) {
      let auxRoute = routes;
      auxRoute[index].isFavorite = true;
      this.setState({ routes: auxRoute })
      const toStore = JSON.stringify(favorites ? [...favorites, value] : [value])
      localStorage.setItem('favorites', toStore);
      this.getFavorites();
    }
  };

  deleteFavorites = () => {
    localStorage.removeItem('favorites');
    this.getFavorites();
  }

  newSearchval = (searchText) => {
    this.setState({searchedValue: searchText});
  }

  changeTab = (value) => {
    this.setState({ activeTab: value, shape: [] });
  }

  selectRoute = (route) => {
    if(this.state.selectedRoute===route) {
      this.setState({ selectedRoute: null, shape: [] });
    } else {
      this.setState({ selectedRoute: route, shapeColor: '#' +route.route_color },
        () => {
          this.getRouteShape(route.route_id);
        }
      );
    }
  }
   
/**
 * ---------------------------------------
*/

  /* BACKEND FETCH METHODS */

  getKey =  async () => {
    fetch('/api/retrieveKey').then(
      async res => {
        const response = await res.json();
        this.gApiKey = response.GoogleMapsAPIKey;
        this.setState({ isLoadingMap: false });
      }
    ).catch(
      error => {
        console.log(error);
      }
    );
  }

  getRoutes =  async () => {
    fetch('/api/getRoutes').then(
      async res => {
        const response = await res.json();
        this.setState({ routes: response.routes, isLoadingRoutes: false });
      }
    ).catch(
      error => {
        console.log(error);
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
      state: {
        selectedRoute,
        favorites,
        routes,
        searchedValue,
        isLoadingMap,
        mapLoaded,
        shape,
        map,
        maps,
        shapeColor,
        isLoadingRoutes
      },
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
                <h3>{'Transit!'} <FaBus /></h3>
              </div>
              <div className="row">
                <span className="signature">{'An app done by Santiago Montero'}</span>
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
              <TabComponent
                isLoading={isLoadingRoutes}
                routes={routes}
                searchedValue={searchedValue}
                selectedRoute={selectedRoute}
                favorites={favorites}
                changeTab={this.changeTab}
                selectRoute={this.selectRoute}
                addFavorite={this.addFavorite}
                deleteFavorites={this.deleteFavorites}
              />
            </div>
          </div>
          <div className="six columns">
            <div className="padded row">
            {
              !isLoadingMap &&
                <div className="map-container">
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: gApiKey }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={
                      ({ map, maps }) => { this.setState({ map: map, maps: maps, mapLoaded: true }) }
                    }
                  >
                    {
                      shape.length>0 && selectedRoute && 
                      <Marker
                        lat={shape[0].shape_pt_lat}
                        lng={shape[0].shape_pt_lon}
                      />
                    }
                    {
                      shape.length>0 && selectedRoute && 
                      <Marker
                        lat={shape[shape.length-1].shape_pt_lat}
                        lng={shape[shape.length-1].shape_pt_lon}
                      />
                    }
                  </GoogleMapReact>
                  { 
                    mapLoaded && shape.length > 0 && selectedRoute &&
                    <Shapes
                      shape={shape}
                      map={map}
                      maps={maps}
                      shapeColor={shapeColor}
                    />
                  }
                </div> 
            }
            {
              isLoadingMap &&
              <LoadingSpinner/>
            }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
