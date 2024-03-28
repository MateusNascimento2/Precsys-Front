import React, {useState, useEffect} from 'react';
import CPFLoginComponent from '../components/CPFLoginComponent';
import bgImage from '../../public/assets/background-precsys.jpg';
import bgBlack from '../../public/assets/bg-precsys-black.png';

function Login() {
  const [backgroundImage, setBackgroundImage] = useState(bgImage);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      setBackgroundImage(bgBlack);
    } else {
      setBackgroundImage(bgImage);
    }
  }, []);

  return (
    <section className="bg-cover h-[calc(100vh)] flex flex-col items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <CPFLoginComponent />
    </section>
  )
}

export default Login;