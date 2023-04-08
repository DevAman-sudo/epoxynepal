import React from 'react'

const SelectProduct = () => {
  return (
    <div>

            <div className='w-[90%] md:w-[80%] bg-pink flex mx-auto my-4 justify-evenly align-center px-4 py-8'>
                <div className='w-1/2 leading-6'>
                    <p className='text-center'>UP TO</p>
                    <h1 className='text-center text-4xl bolder'>30%<span className='text-sm mx-1'>OFF</span></h1>
                    <h3 className='text-center text-sm'>SELECT <br /> PRODUCT</h3>
                </div>
                <div className='w-[40%] h-auto my-auto'>
                    <img src="img/table.jpg" />
                </div>
            </div>

    </div>
  )
}

export default SelectProduct