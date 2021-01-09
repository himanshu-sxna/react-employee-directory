import React from "react";
import Container from "@material-ui/core/Container";
import Table from "./Table";
import Header from "./Header";


function Wrapper () {
    return(
        <Container maxWidth="lg">
            <Header></Header>
            <Table></Table>
        </Container>
    )
};

export default Wrapper;