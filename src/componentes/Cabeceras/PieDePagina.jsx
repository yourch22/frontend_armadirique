import { GrTextAlignCenter } from "react-icons/gr"

function PieDePagina(){
    return(
        <div>
        <div style={{backgroundColor:'black',height:'300px',color:'white',display:'flex',padding:'10vh 5vh'}}>
                <div style={{
                    flex:4,
                    fontWeight: 700,
                    fontSize: '1.5rem',
                }}>
                    Armadirique

                </div>
                <div style={{flex:3}}>
                    <p><u>Términos y condiciones</u></p>
                    <p>Trabaja con nosotros</p>
                    <p>Libro de reclamaciones</p>

                </div>
                <div style={{flex:3}}>
                    <p><u>Contacto</u></p>
                    <p>Promociones</p>
                    <p>Resolución de problemas</p>
               </div>
                
                
            </div > 
            <div style={{backgroundColor:'black', justifyContent: "center",color:'white',display:'flex'}}>
                <p>Copyright © 2025 | CodeCraft </p></div>
            </div>
    )
}

export default PieDePagina