import React from 'react';
import {Route, Link, BrowserRouter, Routes} from 'react-router-dom';

function Header({ loggedIn , headerEmail}) {
    return (
        <header className="header">
            <img alt="Лого" className={"header__logo"} src={require('../images/Vector.svg').default} />
            <div className="header__auth">
                {loggedIn && <p className="header__auth-email">{headerEmail}</p>}
                <BrowserRouter>
                    <Routes>
                <Route path={"/sign-in"} element={<Link className="header__auth-button" to="/sign-up">Регистрация</Link>} />

                <Route path="/sign-up" element={<Link className="header__auth-button" to="/sign-in">Войти</Link>}/>

                <Route exact path="/" element={<Link className="header__auth-button header__auth-button_type_authorized" to="/sign-in" >Выйти</Link>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </header>
    )
}

export default Header;