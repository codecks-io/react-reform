import ReactDOM from 'react-dom'
import getRoutes from './routes'
import 'reta.css'

const appEl = window.document.getElementById('app')

ReactDOM.render(getRoutes(false, require('routes!pages/Home')), appEl)
