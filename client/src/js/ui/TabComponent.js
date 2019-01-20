import React, { PureComponent } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaStar, FaTrashAlt } from 'react-icons/fa';

import LoadingSpinner from './LoadingSpinner';

export default class TabComponent extends PureComponent {

  renderRoutes = (routes, searchedValue, selectedRoute, selectRoute, addFavorite) => {
    if (routes)
      return (
        <div className="scrollable-container">
          {
            routes.map((route, i) => {
              const isFound = route.route_long_name.toLowerCase().includes(searchedValue.toLowerCase());
              return (
                searchedValue === '' || isFound ?
                  <div
                    key={i}
                    onClick={()=>selectRoute(route)}
                    className={
                      `row
                      ${
                        selectedRoute !== route ?
                        'station-list-element' :
                        'station-list-element-selected'
                      }`
                    }
                  >
                    <div className="six columns">
                      <span>{route.route_long_name}</span>
                    </div>
                    <div className="pull-right two columns">
                      <FaStar onClick={() => addFavorite(route, i)} className={!route.isFavorite ? `favorite-icon` : `favorite-icon-colored`} />
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

  renderFavs = (favs, searchedValue, deleteFavorites) => {
    if (favs)
      return (
        <div className="scrollable-container">
          {
            favs.map((element, i) => {
              const isFound = element.route_long_name.toLowerCase().includes(searchedValue.toLowerCase());
              return (
                searchedValue === '' || isFound ?
                  <div key={i} className="row station-list-element">
                    <span>{element.route_long_name}</span>
                  </div>
                  :
                  <div key={i}></div>
              );
            })
          }
          {
            <div className="row align-center">
              <FaTrashAlt onClick={() => deleteFavorites()} className="favorite-delete-icon" />
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

  render() {
    const {
      isLoading,
      routes,
      searchedValue,
      selectedRoute,
      favorites,
      changeTab,
      selectRoute,
      addFavorite,
      deleteFavorites,
    } = this.props;
    return (
      <Tabs
        onSelect={(index) => changeTab(index)}
        selectedTabClassName="selected-tab"
      // selectedTabPanelClassName="selected-tab-panel"
      >
        <TabList>
          <Tab>{'Recorridos'}</Tab>
          <Tab>{'Favoritos'}</Tab>
        </TabList>
        <TabPanel>
          {
            !isLoading &&
            this.renderRoutes(
              routes,
              searchedValue,
              selectedRoute,
              selectRoute,
              addFavorite
            )
          }
          { isLoading && <LoadingSpinner /> }
        </TabPanel>
        <TabPanel>
          {this.renderFavs(favorites, searchedValue, deleteFavorites) }
        </TabPanel>
      </Tabs>
    )
  }
}
