"use strict"
import React from 'react'
import { pureRender }  from '../utils';
import Router from 'react-router'
import { Link } from 'react-router';
import Actions from '../actions';


function RoleAllows(roles = [], menu){
    let rules = {
        "admin": {
            "users": true,
            "roles": true,
            "documents": true
        },
        "registered": {
            "documents": true
        }
    }
    for(let role of roles){
        if(role.active && rules[role.name] && rules[role.name][menu]){
            return true;
        }
    }
}

/** Can't be pure, because router Links use context to show active */
export default class Header extends React.Component {
    users(){
        if(this.props.userInfo && RoleAllows(this.props.userInfo.roles, 'users' )){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to="/users">Users
                </Link>
            </li>;
        }
    }
    roles(){
        if(this.props.userInfo && RoleAllows(this.props.userInfo.roles, 'roles' )){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to="/roles">Roles
                </Link>
            </li>;
        }
    }
    documents(){
        if(this.props.userInfo && RoleAllows(this.props.userInfo.roles, 'documents' )){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to="/documents">Documents
                </Link>
            </li>;
        }
    }
    showMenus(){
        return   <ul className="nav navbar-nav">
            { this.users() }
            { this.roles() }
            { this.documents() }
        </ul>
    }

    showAccount(){
        if(this.props.userInfo){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to={"/user/edit/"+this.props.userInfo.id}>{this.props.userInfo.username}
                </Link>
            </li>;
        }
    }

    showLogin(){
        if(!this.props.loggedIn){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to={"/login"}>Login</Link>
            </li>;
        }
    }

    showSignUp(){
        if(!this.props.loggedIn){
            return <li className="nav-item">
                <Link activeClassName="active" className="nav-link" to={"/signup"}>Sign Up</Link>
            </li>;
        }
    }

    showLogout(){
        return  this.props.loggedIn ? <li className="nav-item"><a className="nav-link" href="/logout">Log out</a></li> : null;
    }

    render() {
        return  <nav className="navbar-dark bg-inverse navbar-static-top  navbar navbar-default">
            <div className="container">
                <a className="navbar-brand" href="#">Title</a>
                {this.showMenus() }
                <ul className="nav navbar-nav pull-right">
                { this.showAccount() }
                { this.showLogout() }
                { this.showLogin() }
                { this.showSignUp() }
                </ul>
                </div>
            </nav>

    }
}

