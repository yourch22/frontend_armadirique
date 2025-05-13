import {Link} from 'react-router-dom'
const Sidebar  = () => {
    return(
        <div className="sidebar">
            <ul>
              <li>
                <Link className='text-light' to="/dashboardadmin">Inicio</Link>
              </li>
              <li>
                <Link className='text-light' to="/gusuarios">Usuarios</Link>
              </li>
              <li>
                <Link className='text-light' to="/gproductos">Productos</Link>
              </li>
            </ul>
        </div>
    )
}

export default Sidebar