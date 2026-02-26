import  { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const Alerts = () => {
  const { alerts } = useContext(AppContext);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className='alerts-container'>
      {alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

 export default Alerts;