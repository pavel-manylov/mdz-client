import React from 'react';
import './App.css';
import {Redirect, Route, Switch} from "react-router-dom";
import {PostsIndex} from "./PostsIndex";
import {ShowPost} from "./ShowPost";
import {Container, Nav, Navbar} from 'react-bootstrap';

function App() {
    return (
        <Container fluid>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Тестовое задание Медузы (Клиент)</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/posts/">Все публикации</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/posts/:id">
                    <ShowPost/>
                </Route>
                <Route exact path="/posts">
                    <PostsIndex/>
                </Route>
                <Route path="/">
                    <Redirect to="/posts"/>
                </Route>
            </Switch>
        </Container>
    );
}

export default App;
