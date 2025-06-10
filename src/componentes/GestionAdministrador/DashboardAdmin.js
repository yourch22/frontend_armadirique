import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../App.css'
import GestionProducto from './GestionProducto';

function DashboardAdmin(){
    return (
        <Router>
            <Navbar />
            <div className='flex'>
                <Sidebar/>
                
            </div>
        </Router>
    )
}
export default DashboardAdmin;