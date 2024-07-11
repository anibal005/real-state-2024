import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStar, deleteUserSuccess, signOutUserFailure, signOutUserStar, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser, loading, error } = useSelector(state=> state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload=(file)=> {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  }

  const handleChange = (e)=> {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const handleSubmit=async(e)=> {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data)
      if(data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser=async()=> {
    try {
      dispatch(deleteUserStar());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error))
    }
  }
  const handleSignOut=async()=> {
    try {
      dispatch(signOutUserStar())
      const res = await fetch('/api/auth/signout')
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.error))
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Perfil
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*'/>
        <img 
          onClick={()=>fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt="profile" 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {fileUploadError ? 
            (<span className='text-red-700'>
              Error al subir la imagen (la imagen debe ser menos de 2mb)
            </span>) :
            filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>
                {`Subiendo ${filePerc}%`}
              </span>
            ): filePerc === 100 ? (
              <span className='text-green-700'>
                Imagen subida satisfactoriamente!
              </span>
            ) : ""
          }
        </p>
          <input type="text" placeholder='Nombre de usuario' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
          <input type="email" placeholder='Email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
          <input type="password" placeholder='Contraseña' defaultValue={currentUser.password} id='password' className='border p-3 rounded-lg' onChange={handleChange}/>
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80'>
            {loading ? 'Cargando' : 'Actualizar'}
          </button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
            Crear Listado
          </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>eliminar cuenta</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>cerrar sesión</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'Usuario actualizado corectamente!' : ''}</p>
    </div>
  )
}
