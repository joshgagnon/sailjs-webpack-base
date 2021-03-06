"use strict";
import React from 'react';
import {requestResource, deleteResource} from '../actions';
import { pureRender } from '../utils';
import { connect } from 'react-redux';
import ButtonInput from './forms/buttonInput';
import AuthenticatedComponent from  './authenticated';

@connect(state => state.resources.roles)
@AuthenticatedComponent
@pureRender
export default class Users extends React.Component {

    componentDidMount(){
        this.props.dispatch(requestResource('roles'));
    }

    componentDidUpdate(){
        this.props.dispatch(requestResource('roles'));
    }

    submit(id, e) {
        e.preventDefault();
        this.props.dispatch(deleteResource('/role/'+id));
    }

    render() {
        let fields = ['id', 'name', 'createdAt', 'updatedAt'];
        return <table className="table">
        <thead><tr>{ fields.map(f => <th key={f}>{f}</th>) }<th></th></tr></thead>
        <tbody>
        {this.props.data ? this.props.data.map(
            (row, i) => <tr key={i}>
                { fields.map(f => <td key={f}>{row[f]}</td>) }
                <td><a href="#" type='button' value='Delete' onClick={this.submit.bind(this, row.id)}  >Delete</a></td>
            </tr>)

        : null}
        </tbody>
        </table>
    }
}

