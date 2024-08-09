import React from "react";

import placeholder from "../../public/assets/placeholder-perfil.png";

function ProfileImage({userImage}) {
  return(
    <img className='w-full h-full rounded' src={userImage ? `${userImage}` : placeholder} alt="Imagem de Perfil do Usuário" />
  )
}

export default ProfileImage;