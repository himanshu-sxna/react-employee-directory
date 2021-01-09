import React from "react";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
    root: {
      width:"100%",
      textAlign: "center",
      height: 100
    }
  });
function Header (){

    const classes = useStyles();

    return(
        <div className={classes.root}>
            <h1>Employee Directory</h1>
            <p>Click on a column heading to filter each column or use the search box to narrow your results.</p>
        </div>
    )

}

export default Header;