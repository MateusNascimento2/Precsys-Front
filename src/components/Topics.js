import React from 'react';

function Topics({icone, texto}) {
  return (
    <div className="shadow-sm flex items-center justify-start gap-2 px-4 py-2 border-gray-200 border rounded bg-gray-50 lg:gap-4 lg:pl-4">
      <span className="rounded-[999px] border-gray-200 border p-2">{icone}</span>
      <span className="font-[600] text-[15px] lg:text-[16px]">{texto}</span>
    </div>
  )
}

export default Topics;