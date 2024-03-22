import React from 'react';

function TextBox({title, text}) {
  return (
    <div className='flex flex-col gap-1 md:w-[320px]'>
      <p className='text-[#666666] text-[14px]'>{title}</p>
      <p className='font-medium text-[15px]'>{text}</p>
    </div>
  )
}

export default TextBox;