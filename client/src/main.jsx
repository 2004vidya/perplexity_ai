
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './app/index.css'

import App from './app/App.jsx'
import {store} from './app/app.store'
import {Provider} from 'react-redux'

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
    <App/>
    </Provider>

)
