import GroupForm from '../GroupForm/GroupForm.jsx';

export default function CreateAGroupPage() {
  const group = {
    location: '',
    name: '',
    about: '',
    private: '',
    type: '',
    image: ''
  };

  return (
    <GroupForm
      group={group}
      formType="Create Group"
    />
  );
}
