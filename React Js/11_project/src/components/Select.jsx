import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {

    const id = useId();

  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className=''></label>}
        <select
            {...props}
            id={id}
            ref={ref}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
        >
            {/* if options has values then use loop */}
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

//we can also write forwardRef like this instead of doing as we did in Input.jsx
export default React.forwardRef(Select)