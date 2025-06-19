import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/routes.tsx'
import { ToastProvider } from './ui/ToastProvider'

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </Provider>
)
