import React from "react";
import api from "../utils/Api";

import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import EditProfilePopup from "../components/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup";
import AddPlacePopup from "../components/AddPlacePopup";
import DeletePopup from "../components/DeletePopup";
import ImagePopup from "../components/ImagePopup";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import {Route, Navigate, Routes, BrowserRouter} from 'react-router-dom'
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import ProtectedElement from "./ProtectedRoute";


function App() {

  const [isEditProfilePopupOpen,setIsEditProfilePopupOpen] = React.useState(false)
  const [isEditAvatarPopupOpen,setIsEditAvatarPopupOpen ] = React.useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false)
  const [card, setCard] = React.useState(null)

  const [currentUser, setCurrentUser] = React.useState({})
  const [cards, setCards] = React.useState([])

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [headerEmail, setHeaderEmail] = React.useState('Что?');


  React.useEffect(() => {
    if(loggedIn) {
      Promise.all([api.getProfileInfo(), api.getInitialCards()]).then(([profileInfo, card]) => {
        setCurrentUser(profileInfo);
        setCards(card);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [loggedIn]);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setCard(false)
  }


   function handleEditAvatarClick() {
     setIsEditAvatarPopupOpen(true)
  }

   function handleEditProfileClick() {
     setIsEditProfilePopupOpen(true)
  }

   function handleAddPlaceClick() {
     setIsAddPlacePopupOpen(true)
  }

  function handleCardClick(card) {
    setCard(card)
  }

  function closeByClick(evt) {
    if (evt.target.classList.contains('popup')) {
      closeAllPopups();
    }
  }

  React.useEffect(() => {
    if (isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen) {
      function handleEsc(evt) {
        if (evt.key === 'Escape') {
          closeAllPopups();
        }
      }

      document.addEventListener('keydown', handleEsc);

      return () => {
        document.removeEventListener('keydown', handleEsc);
      }
    }
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen,]);

  function handleUpdateUser(data) {
    api.editProfileInfo(data).then((newUser) => {
      setCurrentUser(newUser);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    if (!isLiked) {
      api.clickLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      }).catch((err) => {
        console.error(err);
      });
    } else {
      api.removeLike(card._id).then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      }).catch((err) => {
        console.error(err);
      });
    }
  }

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleCardDelete(id) {
    api.deleteCard(id).then(() => {
      setCards((items) => items.filter((c) => c._id !== id._id && c));
    }).catch((err) => {
      console.error(err);
    });
  }

  function handleAvatarUpdate(data) {
    api.editProfileAvatar(data).then((newAvatar) => {
      setCurrentUser(newAvatar);
      closeAllPopups();
    }).catch((err) => {
      console.error(err);
    });
  }


  return (

      <CurrentUserContext.Provider value={currentUser}>
  <div className={"page"}>
    <Header loggedIn={loggedIn} headerEmail={headerEmail} />
    <BrowserRouter>
      <Routes>
      <Route path={'/sign-in'} element={<Login />}/>

      <Route path={'/sign-up'} element={<Register />}/>

      <Route path={'/'}
        element={
        <ProtectedRoute
            component={Main}
            cards = {cards}
            onEditProfile = {handleEditProfileClick}
            onAvatarPlace = {handleEditAvatarClick}
            onAddPlace = {handleAddPlaceClick}
            onCardClick = {handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}
        />
        }
      >
    </Route>
      </Routes>
    <Footer />

    <EditProfilePopup
        isOpen = {isEditProfilePopupOpen}
        onClose = {closeAllPopups}
        onCloseClick = {closeByClick}
        onSubmit = {handleUpdateUser}
    />

    <EditAvatarPopup
        isOpen = {isEditAvatarPopupOpen}
        onClose = {closeAllPopups}
        onCloseClick = {closeByClick}
        onSubmit = {handleAvatarUpdate}
    />

    <AddPlacePopup
        isOpen = {isAddPlacePopupOpen}
        onClose = {closeAllPopups}
        onCloseClick = {closeByClick}
        onSubmit = {handleAddPlaceSubmit}
    />

    <DeletePopup />

    <ImagePopup
      card = {card}
      onClose = {closeAllPopups}
      onCloseClick = {closeByClick}
    />
    </BrowserRouter>

  </div>
        </CurrentUserContext.Provider>

  );
}

export default App