import ReactDOM from 'react-dom'
import getRoutes from './routes'

const appEl = window.document.getElementById('app')

// eslint-disable-next-line
ReactDOM.render(getRoutes(false, require('routes!pages/Home')), appEl)
