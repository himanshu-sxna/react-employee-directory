import React, {useState, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import API from "../utils/API";
import Appbar from "./Appbar";
import Skeleton from "@material-ui/lab/Skeleton";


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    footer: {
        height: 150,
    }
  });

function EmployeeTable () {
   
    const [users, SetUsers] = useState([]);
    const [error, SetError] = useState("");
    const [loading, SetLoading] = useState(true)
    const [search, SetSearch] = useState(false);
    const [order, SetOrder] = useState();
    const [orderBy, SetOrderBy] = useState();
    const [filteredUsers, SetFilteredUsers] = useState([]);

    useEffect(()=> {

        API.getUsers()
        .then(res => {
            if (!res.data.results){
                SetError("Unable to fetch employees");
            }
            const employees = res.data.results;
            SetUsers(employees.map((employee)=>(
              {
                  id:employee.id.value,
                  name: `${employee.name.first} ${employee.name.last}`,
                  email: employee.email,
                  contact: employee.phone
              })));
            SetLoading(false);
            sortFn(users);
        });
      }, []);

    const classes = useStyles();

    const tableHeaders = [
      { id: "id", label: "ID" },
      { id: "name", label: "Name" },
      { id: "email", label: "Email" },
      { id: "contact", label: "Contact" },

    ]

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }
      
      function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
      }
    
    const handleSortRequest = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    SetOrder(isAsc ? 'desc' : 'asc');
    SetOrderBy(id);
     }

    const sortFn = (userList) => {
      return stableSort(userList, getComparator(order, orderBy))
      .map((user) => (
        <TableRow key = {user.id}>
            <TableCell align="right" component="th" scope="row">
                {user.id}
            </TableCell>
            <TableCell align="right">{user.name}</TableCell>
            <TableCell align="right">{user.email}</TableCell>
            <TableCell align="right">{user.contact}</TableCell>
        </TableRow>
      ))}

    useEffect(() => {
      sortFn(filteredUsers);
    },[filteredUsers])


    const handleSearchChange = value => {
    const filter = value;
    const filteredList = users.filter(item => {
      // merge data together, then see if user input is anywhere inside
      let values = Object.values(item)
        .join("")
        .toLowerCase();
        return values.indexOf(filter.toLowerCase()) !== -1;
      });
      SetFilteredUsers(filteredList);
      SetSearch(true);
    }


    return (
      <Paper>
          <Appbar handleSearchChange={handleSearchChange} ></Appbar>
          { loading ? <Skeleton variant = "text" height={800}></Skeleton> : 
            <TableContainer>
              <Table className={classes.table}>
                  <TableHead>
                      <TableRow>
                        {
                          tableHeaders.map((title) => (
                            <TableCell align="right" key={title.id}>
                              <TableSortLabel 
                              onClick = { () => {handleSortRequest(title.id)}}
                              direction = {orderBy === title.id ? order : "asc"}>
                                {title.label}
                              </TableSortLabel>
                            </TableCell>
                          ))
                        }
                      </TableRow> 
                  </TableHead>
                  <TableBody>
                      {search ? sortFn(filteredUsers) : sortFn(users)}
                  </TableBody>
                  <TableFooter className={classes.footer}></TableFooter>
              </Table>
            </TableContainer>
          } 
      </Paper> 
    );
}

export default EmployeeTable;