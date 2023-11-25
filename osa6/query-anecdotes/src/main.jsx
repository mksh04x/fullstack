import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationContextProvider } from './notificationContext';
import App from './App';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root'));

root.render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>
)
