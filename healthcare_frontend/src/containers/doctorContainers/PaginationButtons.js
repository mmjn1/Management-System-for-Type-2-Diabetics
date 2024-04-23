
import React from 'react'

function PaginationButtons({ totalPages, currentPage, setCurrentPage }) {
  const pageButtons = []

  for (let i = 1; i <= totalPages; i++) {
    pageButtons.push(
      <button
        key={i}
        style={{
          height: '2.25rem',
          width: '2.25rem',
          padding: '.5rem',
          alignItems: 'center',
          display: 'flex',
        }}
        className={`btn btn-icon datatable-pager-link datatable-pager-link-first  
                   ${currentPage === i ? 'btn-icon btn-success' : ''}`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>,
    )
  }

  return (
    <ul className='datatable-pager-nav my-2 mb-sm-0'>
      <li>
        <button
          title='First'
          className='btn datatable-pager-link datatable-pager-link-first'
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <i className='fas fa-backward icon-sm' />
        </button>
      </li>
      <li>
        <button
          title='Previous'
          className='btn datatable-pager-link datatable-pager-link-prev'
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className='fas fa-chevron-left icon-sm' />
        </button>
      </li>
      {pageButtons}
      <li>
        <button
          className='ml-1 btn datatable-pager-link datatable-pager-link-next'
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className='fas fa-chevron-right icon-sm' />
        </button>
      </li>
      <li>
        <button
          className='btn datatable-pager-link datatable-pager-link-last btn'
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <i className='fas fa-forward icon-sm' />
        </button>
      </li>
    </ul>
  )
}

export default PaginationButtons
