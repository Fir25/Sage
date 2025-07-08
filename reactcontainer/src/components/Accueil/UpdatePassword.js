import React, { useState } from "react"
import { useSelector } from "react-redux";
function UpdatePassword(){
  const url=process.env.React_App_URL;
  const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduser=test['id']
    var email=test['email']
    var matricule=test['matricule']
    var user_name=test['user_name']
    
  }
    const [password,setPassword]=useState('')
    const [newpassword,setnewPassword]=useState('')

    const is_active=true
 function UpdatePass() {

  if(password!=newpassword){
    alert('Les mots de passe ne sont pas identiques!')
  }else{
   
    let userList = { password,email,matricule,user_name,is_active,newpassword}
        
    
    fetch(url+'user/' +iduser , {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',

        Authorization: token
      },
      body: JSON.stringify(userList),

    })   .then(res => {
     
      if (!res.ok) {
          throw new Error(); // Will take you to the `catch` below
      }
      return res.json();
  })
  .then((userList)=>{
 
  })
  .catch(err => {
  
   /** if ( err.response.status=== 401) {
      logoutfunction(err.response.status)
    } */
  });
  }
      }
     
    return(
<div>



<div className="modal fade" id={`p${iduser}`}  role="dialog" aria-labelledby={`#p${iduser}`} aria-hidden="true">
<div className="modal-dialog modal-dialog-centered" role="document">
<div className="modal-content">
<div className="modal-header">
  <h5 className="modal-title" id="exampleModalLabel">Modifier votre mot de passe</h5>
  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div className="modal-body">
<form>
<div className="form-group">
<input className="form-control" placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
</div>
<div className="form-group">
<input className="form-control" placeholder="Confirmation de mot de passe" type="password" value={newpassword} onChange={(e) => setnewPassword(e.target.value)} />
</div>
<div className="modal-footer">
  <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
  <button className="btn btn-primary"  onClick={UpdatePass} >Valider</button>
</div>

</form>
</div>

</div>
</div>
</div>

</div>
    )
}
export default UpdatePassword;