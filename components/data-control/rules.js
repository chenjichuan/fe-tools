export default {
  text: [
    {required: true, message: 'This cannot be empty', trigger: 'blur'}
  ],

  select: [
    {required: true, message: 'Please choose', trigger: 'change'}
  ],

  textarea: [
    {required: true, message: 'Please enter something', trigger: 'blur'},
    {type: 'string', min: 10, message: 'Introduce no less than 10 words', trigger: 'blur'}
  ]
}
