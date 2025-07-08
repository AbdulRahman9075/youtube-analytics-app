import ReactDOM from 'react-dom/client';
import { UserProvider } from './hooks/userContext.js';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <App />
    </UserProvider>
    
);