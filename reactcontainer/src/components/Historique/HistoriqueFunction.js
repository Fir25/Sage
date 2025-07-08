import React from 'react'
import logoutfunction from '../authentification/logoutfunction'


const HistoriqueFunction = (previous,neww,idemploye,idpersonne,valeursolde_ajoute,commentaire) => {
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
    const hist={previous,neww,idemploye,idpersonne,valeursolde_ajoute,commentaire}
    if(commentaire==''){
      commentaire='pas de commentaire'
     }
        fetch(url+'historiquecreate/'+previous +'/'+ neww +'/'+idemploye+'/'+idpersonne+'/'+valeursolde_ajoute+"/"+commentaire, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization:token
       
          },
          body: JSON.stringify(hist)
        }).then(() => {
    
     
            
            
      
        }
    
        ).catch((e) => {

       /**   if ( e.response.status=== 401) {
              logoutfunction(e.response.status)
            } */
      })
      }
      export default HistoriqueFunction;