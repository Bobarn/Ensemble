import EventForm from '../EventForm/EventForm.jsx';

export default function CreateEventPage() {
  const event = {
    price: '',
    name: '',
    private: '',
    type: '',
    image: '',
    startDate: '',
    endDate: '',
    description: ''
  };

  return (
    <EventForm
      event={event}
      formType="Create Event"
    />
  );
}
