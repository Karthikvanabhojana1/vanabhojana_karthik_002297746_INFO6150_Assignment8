
const Users = require('../login');
const bcrypt = require('bcrypt');


module.exports = (app) => {

  app.post('/user/create', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const regName = /^[A-Za-z\s']{3,12}$/.test(name);
      const regExEmail = /^[\w-\.]+@northeastern.edu$/.test(email);
      let regexpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password);;
      const existingUser = await Users.findOne({ email }); //duplicate

      if (email == '') {
        return res.status(400).json({ message: 'Email is empty' });
      }
      else if (name == '') {
        return res.status(400).json({ message: 'Name is empty' });
      }
      else if (password == '') {
        return res.status(400).json({ message: 'Please enter password is empty' });
      }
      else if (!regExEmail) {
        return res.status(400).json({ message: 'Please Enter correct Email Id' });

      }
      else if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }


      else if (!regName) {
        return res.status(400).json({ message: 'Please Enter correct Name' });
      }
      else if (!regexpass) {
        return res.status(400).json({ message: 'Please Enter Valid password' });

      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds); //hash

      const newUser = new Users({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();

      res.status(201).json(savedUser);
    } catch (error) {
      console.error('Saving failed:', error);
      res.status(500).json({ message: 'Error when adding user please try again' });
    }
  }
  );
  app.get('/user/getAll', async (req, res) => {
    const users = await Users.find({}, { name: 1, email: 1, password: 1 });

    res.json(users);
  });
  app.delete('/user/delete', async (req, res) => {
    const email = req.body.email;
    const result = await Users.deleteOne({ email });
    console.log(result); //log for result
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No user found with this mail id' });
    }

    res.json({ message: 'User deleted successfully' });
  });

  app.put('/user/edit', async (req, res) => {
    try {
      const { name, password } = req.body;
      const email = req.body.email;
      const regName = /^[A-Za-z\s']{3,12}$/.test(name);
      let regexpass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password);;

      const user = await Users.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      else if (name == '') {
        return res.status(400).json({ message: 'Name is empty' });
      }
      else if (password == '') {
        return res.status(400).json({ message: 'Please enter password is empty' });
      }
      else if (!regName) {
        return res.status(400).json({ message: 'Please Enter correct Name' });
      }
      else if (!regexpass) {
        return res.status(400).json({ message: 'Please Enter Valid password' });

      }

      user.name = name;
      user.password = await bcrypt.hash(password, 10);
      await user.save();

      res.json({ message: 'User details updated successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid Name or password' });
    }
  });
}
