import React from "react"
import useFetch from "../useFetch";
import { useSelector } from "react-redux";
const EmployesPartis = () => {
  const url=process.env.React_App_URL;
  const userinfo =useSelector(state => state.userinfo);
  const test=userinfo[0]
  if(Object.keys(userinfo).length !=0){ 
    var iduserinfo=test['id']
 
    

    
  }
    const { data: users = [], isloading, error } = useFetch(url+"UsersOfChef/" + iduserinfo)
    return (  
        <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div className="card shadow">


              <div className="table-responsive">
                <table className="table table-bordered display">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Matricule</th>

                      <th scope="col">User Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Motif</th>
               
                      

                    </tr>
                  </thead>
                  <tbody>


                    {users=="in exception"|| users.length==0?"":users.filter(x=>x.is_active==false).map(user =>
                      <tr key={user.id}>
                        <td>{user.matricule}</td>
                        <td>{user.user_name}</td>
                        <td>{user.roles}</td>
                        <td>    {user.motifparti}</td>
                   {/**     <td>    <img src={user.image} className="imagepetit" /></td> */}
                  

                     
                      </tr>
                    )}
               
                  </tbody>
                </table>
              </div>


           

            </div>

          </div></div></div>
    );
}
 
export default EmployesPartis;