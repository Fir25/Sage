import React, { useState } from 'react'
import SvgIcon from '@mui/material/SvgIcon';
import { styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';
import ModifierChild from './ModifierChild'
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddDepByChild from './AddDepByChild' 
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 25, height: 25 }} {...props}>

            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {

    return (
        <div>
            <SvgIcon fontSize="inherit" style={{ width: 25, height: 25 }} {...props}>

                <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
            </SvgIcon>



        </div>



    );
}

function CloseSquare(props) {
    return (
        <SvgIcon
            className="close"
            fontSize="inherit"
            style={{ width: 24, height: 24 }}
            {...props}
        >

            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

const StyledTreeItem = styled((props) => (
    <TreeItem {...props} />
))(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.1,
           
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 20,
        paddingLeft: 18,
        marginTop : 10 ,
        
    },
    [`& .${treeItemClasses.label}`]: {
       
        marginTop : 10 ,
        marginBottom: 10 ,
        color: "black",
        position : "relative",
        
        
    },
    [`& .${treeItemClasses.content}`]: {
       
        marginLeft : 10 ,
        
        
    },

}));


const Tree = ({ data = [] }) => {
    return (
        <div>
            {data.map(tree => (
                <TreeNode node={tree} />
            ))}
        </div>
    )
}
const TreeNode = ({ node }) => {
    const url=process.env.React_App_URL;
    const token = localStorage.getItem('access_token') ? 'Bearer ' +localStorage.getItem('access_token') :null


 
    const userinfo =useSelector(state => state.userinfo);
    const test=userinfo[0]
    if(Object.keys(userinfo).length !=0){ 
      var view_dep_rh=test['view_dep_rh']
      var view_departements_edit=test['view_departements_edit']
      var view_departements_del=test['view_departements_del']
      
    }
    
    const [open, setOpen] = useState(false);
    const [departementIddelete, setdepartementIddelete] = useState(null)
    const handleClickOpen = () => {
        setOpen(true);


    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const useStyle = makeStyles({
        icon: {
            marginRight: 5,
            marginLeft: 5,
            color: '#5ac2df'





,

        },
        dialog: {

            boxShadow: 'none',
        }
    });
    const classes = useStyle()
 
    const DeleteDepartement = (id) => {

        fetch(url+'arbo/' + id, {
            method: 'DELETE',
            headers: {

                'Content-Type': 'application/json',
                Authorization:token
            
            },
        }).then(() => {
            setOpen(false);
            window.location.reload(false);
        }
        )


    }
    const[usersbydep,setUsersbydep]=useState([])
    const[load,setload]=useState(true)
   const selectemployesdep=(id)=>{
    fetch(url+"AffichageEmployesbyDepartement/"+id, {method: 'GET', 
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token,
    }}).then(res =>{
        if (!res.ok){
            throw Error("could not fetch the data for that resource")
        }
        return res.json();
    }).then(data =>{
        
       setUsersbydep(data)
    setload(false)
    }).catch((e) => {

       /** if ( e.response.status=== 401) {
            logoutfunction(e.response.status)
          } */
    })
   }


    return (
        <div className='row'>

            <TreeView
                aria-label="customized"
                defaultExpanded={['1']}
                defaultCollapseIcon={<MinusSquare />}
                defaultExpandIcon={<PlusSquare />}
                defaultEndIcon={<CloseSquare />}
                sx={{ flexGrow: 1, overflowY: 'visible' }}
            >
                <StyledTreeItem nodeId={node.id} label={node.nom} >{/** +"  *chef: " + node.nomchef+"   "+ node.prenomchef +"  *rh:  "+node.nomrh+"   "+ node.prenomrh */}
                    <Tree data={node.children} />
                </StyledTreeItem>



            </TreeView>
        


            <Dialog

                BackdropProps={{ invisible: true }}
                className={classes.dialog}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"supprimer un déparatement"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        êtes-vous sûr de vouloir supprimer ce déparatement ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>non</Button>
                    <Button onClick={() => { DeleteDepartement(departementIddelete) }}>
                        oui
                    </Button>
                </DialogActions>
            </Dialog>

            <div className="modal fade" id={`modalemployes${node.id}`}  role="dialog" aria-labelledby={`modalemployes${node.id}`} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel"></h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">  
          
          <div className=''>


          <div className="table-responsive"  style={{boxShadow :"  0 0 8px 0px" , borderRadius:"7px"}}>
       
       <table className="table table-bordered display">
         <thead className="thead-dark">
           <tr>
             
             <th scope="col">Employé </th>
             <th scope="col">Matricule </th>
             <th scope="col">Role </th>
             <th scope="col">Statut  </th>

           
           </tr>
         </thead>
         
       
         <tbody >
   
         {usersbydep.map(x=><tr>
           
           <td> {x.user_name +" "+x.last_name}</td>
           <td> {x.matricule}</td>
           <td>{x.role}</td>
                             
                              <td>{x.activite ? "Oui" : "Non"}</td>
          </tr>)}

       
   
  

            
        
         </tbody>


       </table>
     
     </div>
        
           </div>


          </div>

        </div>
      </div>
   

</div>

          </div>)
}

export default Tree; 