import React from 'react'

function Button({
    children,
    type = 'button',
    textColor = 'text-white',
    bgColor = 'bg-blue-600',
    className = '',
    ...props
}) {

  return (
    //As per the user provide properties, it will change
    <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
        {children}
    </button>
  )
}

export default Button