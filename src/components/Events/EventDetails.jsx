import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {

  let {id} = useParams()
  const navigate = useNavigate()

  const {data, isPending, isError, error} = useQuery({
    queryKey: ['event', {id: id}],
    queryFn: ({signal}) => fetchEvent({id, signal})
  })

  const {mutate} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['event']})
      navigate('/events')
    }
  })

  function handleDelete() {
    mutate({id})
  }

  let content;

  if(isPending) {
    content = (
      <div id='event-details-content' className='center'>
        <p>Fetching event data...</p>
      </div>
    )
  }

  if(isError) {
    content = (
      <div id='event-details-content' className='center'>
        <ErrorBlock title='Failed to load event' message={error.info?.message || 'Failed to fetch event data, PLease try again later.'}/>
      </div>
    )
  }

  if(data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-us', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
