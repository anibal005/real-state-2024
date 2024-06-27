import React from 'react'
import {Link} from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Registrarse
      </h1>
      <form className='flex flex-col gap-4 '>
        <input type="text" placeholder='nombre de usuario' className='border p-3 rounded-lg' id='userame'/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'/>
        <input type="password" placeholder='conttraseña' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          Registrarse
        </button>
        <div className='flex gap-2 mt-5'>
          <p>Tienes una cuenta?</p>
          <Link to="/sig-in">
            <span className='text-blue-700'>Iniciar Sesión</span>
          </Link>
        </div>
      </form>
    </div>
  )
}
