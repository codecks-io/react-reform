import React from 'react'
import {Router, Route, browserHistory, applyRouterMiddleware} from 'react-router'
import App from './App'
import P404 from 'pages/404'
import {useScroll} from 'react-router-scroll'

export default function(isServerRender, routeList) {
  const AppWithRoutes = (props) => <App allRoutes={routeList} isServerRender={isServerRender} {...props}/>
  return (
    <Router history={browserHistory} render={
      applyRouterMiddleware(useScroll((prevRouterProps, {location}) => (
        prevRouterProps && location.pathname !== prevRouterProps.location.pathname
      )))
    }>
      <Route component={AppWithRoutes}>
        {routeList.map(({path, comp: Comp, isAsync}) => {
          const props = {path, key: path}
          if (isAsync) {
            props.getComponent = (location, cb) => Comp((RealComp) => cb(null, isServerRender ? (props) => <RealComp isServerRender {...props}/> : RealComp))
          } else {
            props.component = isServerRender ? (props) => <Comp isServerRender {...props}/> : Comp
          }
          return <Route {...props}/>
        })}
        <Route path="*" component={P404}/>
      </Route>
    </Router>
  )
}
