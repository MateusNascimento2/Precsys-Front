import React from "react";

import placeholder from "../../public/assets/placeholder-perfil.jpg";

function ProfileImage({userImage}) {
  return(
    <img className='w-full rounded-lg' src={userImage ? `${userImage}` : placeholder} alt="Imagem de Perfil do Usuário" />
  )
}

export default ProfileImage;