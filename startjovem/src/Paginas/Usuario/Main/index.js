import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

export default class Main extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            usuario: []
        }
    }

    componentDidMount() {
        fetch('http://localhost:3003/sistema/usuarios')
            .then(usuario =>
                usuario.json().then(usuario => this.setState({ usuario }))
            )
    }

    render() {
        const { usuario } = this.state;

        return usuario.map((usuario, index) => (
            <div className="usuario-lis">
                <div key={index}>
                    <h5>{usuario.nome}</h5>
                    <article>
                        <strong>{usuario.salario}</strong>
                        <p><Link to= '/usuario/${usuario.id'>Detalhes</Link></p>
                        <br />
                    </article>
                </div>
            </div>
        ))
    }

}