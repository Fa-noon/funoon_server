//--------------------------------Register-----------------------------------
const register = async (req, res) => {
  try {
    const { ...userObj } = req.body;

    const newUser = new User(userObj);
    const savedUser = await newUser.save().catch((err) => {
      console.log('Error: ', err);
      res
        .status(500)
        .json({ error: 'Sorry, cannot register with wrong credentials' });
    });

    if (savedUser) {
      await emailVerification(savedUser);
      res.json({ message: 'success' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//-------------------------------Login---------------------------------------

const login = async (req, res) => {
  try {
    const { email } = req.body;
    const userWithEmail = await User.findOne({ where: { email } }).catch(
      (err) => {
        console.log('Error: ', err);
      }
    );
    //check if user is confirmed or not
    if (!userWithEmail.isConfirm) {
      return res
        .status(401)
        .json({ message: 'Please confirm your email to login' });
    }
    // generate token and send to client
    const token = jwt.sign({ id: userWithEmail.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    const user = {
      firstName: userWithEmail.firstName,
      lastName: userWithEmail.lastName,
      email: userWithEmail.email,
      role: userWithEmail.role,
      phone: userWithEmail.phone || '',
      address: userWithEmail.address || '',
    };
    return res.json({
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
//--------------------------Confirmation------------------------------
const confirmation = async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    await User.update({ isConfirm: true }, { where: { id } });
  } catch (e) {
    res.send('error');
  }

  return res.redirect('https://daraz-hunt-next.herokuapp.com/login');
};
//--------------------------Change Password----------------------------
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (user) {
      if (!user.password) {
        return res.status(500).send('Invalid email or password');
      }
      const isValidCredentials = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isValidCredentials) {
        return res.status(500).send('Invalid email or password');
      }
      //hash password before updating in database
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedPassword },
        { where: { id: req.user.id } }
      );
    }
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
//--------------------------Update User---------------------------------
const updateUser = async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log('Error: ', err);
    }
  );
  if (!userWithEmail) {
    return res.status(400).json({ message: 'Email not exists' });
  }
  if (req.user.id == userWithEmail.id) {
    const isUpdated = await User.update(
      { firstName, lastName, phone, address },
      { where: { id: req.user.id } }
    );
    if (!isUpdated) {
      req.status(400).json({ error: 'user not updated' });
    }
    res.status(200).json({ message: 'Success' });
  } else {
    res.status(401).json({ message: 'Permission Denied' });
  }
};
