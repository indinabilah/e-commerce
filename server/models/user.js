const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {hashPassword} = require('../helpers/bcrypt')

const userSchema = new Schema({
  username: {
      type: String,
      required: [true, 'username cannot be empty']
  },
  email:{
      type: String,
      required: [true, 'email cannot be empty'],
      validate:[{ 
        validator: function(value){
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value)
        }, msg: 'invalid email !'
        },{
        // unique email
        validator: function(value) {
            return mongoose.model('User', userSchema)
            .findOne({ email: value })
            .then(data => { 
                if (data) return false 
            })
            .catch(err => {
                return err
            })
        }, msg: 'email is available !'
        }
    ]
  },
  password:{
      type: String,
      required: [true, 'password cannot be empty']
  },
  image:{
      type: String
  }
}, {timestamps: true});

userSchema.pre('save', function(next) {
    console.log(this)
    this.password = hashPassword(this.password)
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;
