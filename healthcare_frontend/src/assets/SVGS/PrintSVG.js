const PrintSVG = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
        width='24px'
        height='24px'
        viewBox='0 0 24 24'
        version='1.1'
      >
        <g stroke='none' strokeWidth={1} fill='none' fillRule='evenodd'>
          <rect x={0} y={0} width={24} height={24} />
          <path
            d='M16,17 L16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 L8,17 L5,17 C3.8954305,17 3,16.1045695 3,15 L3,8 C3,6.8954305 3.8954305,6 5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,15 C21,16.1045695 20.1045695,17 19,17 L16,17 Z M17.5,11 C18.3284271,11 19,10.3284271 19,9.5 C19,8.67157288 18.3284271,8 17.5,8 C16.6715729,8 16,8.67157288 16,9.5 C16,10.3284271 16.6715729,11 17.5,11 Z M10,14 L10,20 L14,20 L14,14 L10,14 Z'
            fill='#000000'
          />
          <rect
            fill='#000000'
            opacity='0.3'
            x={8}
            y={2}
            width={8}
            height={2}
            rx={1}
          />
        </g>
      </svg>
    )
  }
  export default PrintSVG;