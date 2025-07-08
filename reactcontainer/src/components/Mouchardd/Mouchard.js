import React from 'react'
import logoutfunction from '../authentification/logoutfunction'


const Mouchard = (previous,neww,idemploye,idpersonne,objet) => {
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const url=process.env.React_App_URL;
    const mouch={previous,neww,idemploye,idpersonne,objet}
       
        fetch(url+'Mouchardcreate/'+previous +'/'+ neww +'/'+idemploye+'/'+idpersonne+'/'+objet, {
          method: 'POST',
          headers: {
          
            'Content-Type': 'application/json',
            Authorization:token
          },
          body: JSON.stringify(mouch)
        }).then(() => {
    
     
            
            
      
        }
    
        ).catch((e) => {

/**          if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            } */
      })
      }
      export default Mouchard;