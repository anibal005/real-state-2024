import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation }  from 'swiper/modules';
import { useSelector } from 'react-redux'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import 'swiper/css/bundle';
import Contact from '../components/Contact';

export default function Listing() {

    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const {currentUser} = useSelector(state=> state.user)
    const params = useParams();

    useEffect(() => {
      try {
        setLoading(true)
        const fetchListing = async()=> {
          const res = await fetch(`/api/listing/get/${params.listingId}`);
          const data = await res.json();
          if(data.success === false) {
              setError(true);
              setLoading(false)
              return
          }
          setListing(data)
          setLoading(false)
          setError(false)
        }
        fetchListing();
      } catch (error) {
        setError(true);
        setLoading(false)
      }  
    }, [params.listingId])
    
  return (
    <main>
      {loading && <p className='text-center my-7'>Cargando...</p>}
      {error && <p className='text-center my-7'>Alo salio mal!.</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url)=> (
              <SwiperSlide key={url}>
                <div className='h-[550px]' 
                  style={{ 
                    background: `url(${url}) center no-repeat`, backgroundSize: 'cover'
                  }}
                >

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copiado!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - Bs.{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / mes'}
            </p>
            <p className='flex items-center mt-3 gap-2 text-slate-600  text-md'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'Alquiler' : 'Venta'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  Bs. {+listing.regularPrice - +listing.discountPrice} descuento
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>
                Descripción - {' '}
              </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg'/>
                {listing.bedrooms > 1 ? `${listing.bedrooms} camas` 
                : `${listing.bedrooms} cama`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg'/>
                {listing.bathrooms > 1 ? `${listing.bathrooms} baños` 
                : `${listing.bathrooms} baño`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg'/>
                {listing.parkin ? 'Con Garaje' : 'Sin Garaje'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg'/>
                {listing.furnished ? 'Amoblado' : 'No amoblado'}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button onClick={()=> setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                Contactate con el Propietario
              </button>
            )}
            {contact && 
              <Contact listing={listing}/>
            }
          </div>
        </div>
      )}
    </main>
  )
}
