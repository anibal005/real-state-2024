import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]) ;
  const [rentListings, setRentListings] = useState([]) 
  SwiperCore.use([Navigation]);
  
  useEffect(() => {
    const fetchOfferListings=async()=> {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async()=> {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async()=> {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])
  
  return (
    <div>
      {/* top */}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Encuentra tu siguiente lugar <span className='text-slate-500'>perfecto</span>
            <br />
            con facilidad
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Bolivian Estate es el mejor lugar para encontrar su próximo lugar perfecto para vivir.
            <br />
            Tenemos una amplia gama de propiedades para que usted elija
          </div>
          <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to={"/search"}>
            Empezemos ahora...
          </Link>
        </div>
      {/* swiper */}
        <Swiper navigation>
          {offerListings && offerListings.length > 0 &&
            offerListings.map((listing)=> (
              <SwiperSlide key={listing._id}>
                <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]' >
                  
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      {/* listing results por oferta, ventas y alquiler */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {offerListings && offerListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>
                  Ofertas recientes
                </h2>
                <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
                  Ver mas ofertas
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {offerListings.map((listing)=> (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>
                  Lugares en Alquiler
                </h2>
                <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                  Ver mas lugares en alquiler
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing)=> (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>
                  Lugares en Venta
                </h2>
                <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>
                  Ver mas lugares en venta
                </Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {saleListings.map((listing)=> (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
