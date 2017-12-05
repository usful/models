function register() {}

import Models from 'models';

//intrinsic roles
const roles = ['System', 'Admin', 'Anonymous', 'Owner'];

//platform roles

//dynamic roles

Models.addType(
  'Person',
  {
    _id: String,
    name: String,
    count: Number,
    secret: String
  },
  {
    create: ['Anonymous'],
    read: ['System', 'Anonymous', 'Owner'],
    update: [''],
    delete: ['']
  }
);

Models.types.Person.createFragment('Simple', {
  _id: true,
  name: true
});

const Person = Models.types.Person.proxy;

const PersonValidator = Models.types.Person.validator;
PersonValidator.validate({
  name: 'Poop'
});

const PersonDatabase = Models.types.Person.database;
PersonDatabase.get('123');
PersonDatabase.find({something: true});
PersonDatabase.delete('123');
PersonDatabase.update('123', {});
PersonDatabase.create({... data});

const PersonRemote = Models.types.Person.remote;

const PersonRemote = Models.types.Person.remote;

const SimplePerson = Models.types.Person.fragments.Simple.proxy;

const bob = new Person({
  name: 'bob'
});

const
//Type
//Pattern
//Structure
//Fragment
