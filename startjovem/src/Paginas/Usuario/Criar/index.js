import React, { Component } from 'react';
import {Navigate} from 'react-router-dom'
import './index.css'

class CriarUsuario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: {
                nome: "",
                salario: "",
                dataNascimento: "",
                ativo: "true"
            },
            redirect: false
        }
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Navigate to="/usuarios" />
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <fieldset>
                        <legend>Criar Usuário</legend>

                        <div className='usuario-insert'>

                            <label htmlFor='nome'>Nome</label>
                            <br />
                            <input type='text' id='nome' name='nome' placeholder='Digite seu nome'
                                minLength="3" maxLength="100" required value={this.state.usuario.nome} onChange={this.handleInputChange} />

                        </div>

                        <div className='usuario-insert'>

                            <label htmlFor='salario'>Salário</label>
                            <br />
                            <input type='text' id='salario' name='salario' placeholder='Digite seu salário'
                                min="1" max="999999" required value={this.state.usuario.salario} onChange={this.handleInputChange} />

                        </div>

                        <div className='usuario-insert'>

                            <label htmlFor='dataNascimento'>Data de Nascimento</label>
                            <br />
                            <input type='date' id='dataNascimento' name='dataNascimento' placeholder='Digite sua data de nascimento'
                                required value={this.state.usuario.dataNascimento} onChange={this.handleInputChange} />

                        </div>

                        <div className='usuario-insert'>

                            <label>
                                <input type='radio' name='ativo' value='true'
                                    required
                                    checked={this.state.usuario.ativo === "true"}
                                    onChange={this.handleInputChange}
                                />
                                Ativo
                            </label>

                            <label>
                                <input type='radio' name='ativo' value='false'
                                    checked={this.state.usuario.ativo === "false"}
                                    onChange={this.handleInputChange}
                                />
                                Inativo
                            </label>

                        </div>

                        <button type='submit'>Cadastrar</button>

                    </fieldset>

                </form>
            );
        }
    }

    handleInputChange = event => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState(prevState => ({
            usuario: {...prevState.usuario, [name]: value}
        }));

    }

    handleSubmit = event =>{
        fetch("http://localhost:3003/sistema/usuarios", {
            method: "POST",
            body: JSON.stringify(this.state.usuario),
            headers:{
                "Content-type": "application/json"
            }
        })
        .then(data =>{
            if(data.ok){
                this.setState({redirect: true})
            }
        })

        event.preventDefault();
    }

}

export default CriarUsuario;